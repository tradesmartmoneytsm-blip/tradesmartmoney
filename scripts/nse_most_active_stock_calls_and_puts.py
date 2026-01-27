#!/usr/bin/env python3

"""
NSE Data Collector (Python) for TradeSmart Money

Mirrors the user's working Python approach and runs in GitHub Actions:
- Establishes session by visiting oi-spurts to get cookies
- Uses browser-like headers
- Fetches Most Active Calls and Puts JSON endpoints
- Aggregates pChange by underlying symbol
- Stores top results to Supabase via REST

Environment variables required:
- NEXT_PUBLIC_SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- FORCE_RUN (optional: 'true' to override market hours)
"""

import os
import sys
import time
import json
import logging
from datetime import datetime, timedelta, timezone

import requests


NSE_BASE_URL = "https://www.nseindia.com"
COOKIE_SET_URL = f"{NSE_BASE_URL}/market-data/oi-spurts"
CALLS_API_URL = f"{NSE_BASE_URL}/api/snapshot-derivatives-equity?index=calls-stocks-val"
PUTS_API_URL = f"{NSE_BASE_URL}/api/snapshot-derivatives-equity?index=puts-stocks-val"


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%SZ",
)


def get_env(name: str, required: bool = True) -> str:
    value = os.environ.get(name)
    if required and not value:
        logging.error("Missing environment variable: %s", name)
        sys.exit(1)
    return value or ""


SUPABASE_URL = get_env("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = get_env("SUPABASE_SERVICE_ROLE_KEY")
FORCE_RUN = os.environ.get("FORCE_RUN", "false").lower() == "true"


def ist_now() -> datetime:
    # IST is UTC+5:30
    return datetime.utcnow().replace(tzinfo=timezone.utc) + timedelta(hours=5, minutes=30)


def is_market_hours() -> bool:
    if FORCE_RUN:
        logging.info("Force run enabled - skipping market hours check")
        return True

    now = ist_now()
    # Monday=0, Sunday=6
    is_weekday = now.weekday() <= 4
    minutes = now.hour * 60 + now.minute
    # 9:20 AM to 1:00 PM IST (as per original requirement)
    start = 9 * 60 + 20
    end = 13 * 60
    within = start <= minutes <= end
    logging.info("IST now: %s | Weekday: %s | Within market hours: %s", now.isoformat(), is_weekday, within)
    return is_weekday and within


def generate_headers() -> dict:
    return {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        # Avoid br in Actions to reduce brotli dependency risk
        "Accept-Encoding": "gzip, deflate",
        "Connection": "keep-alive",
        "Cache-Control": "no-cache",
        "DNT": "1",
    }


def establish_session(session: requests.Session) -> None:
    headers = generate_headers()
    # First hit human page to receive cookies
    resp = session.get(COOKIE_SET_URL, headers=headers, timeout=30)
    resp.raise_for_status()
    logging.info("NSE session cookies established (len=%s)", len(resp.headers.get("set-cookie", "")))


def fetch_json(session: requests.Session, url: str) -> dict:
    headers = generate_headers()
    resp = session.get(url, headers=headers, timeout=30)
    # requests handles gzip/deflate automatically
    if resp.status_code != 200:
        raise RuntimeError(f"HTTP {resp.status_code} for {url}")
    try:
        return resp.json()
    except Exception:
        # Try manual decode
        return json.loads(resp.text)


def aggregate_activity(data_obj: dict) -> list:
    if not data_obj or "OPTSTK" not in data_obj or "data" not in data_obj["OPTSTK"]:
        raise ValueError("Invalid data structure from NSE API")

    symbol_to_sum = {}
    rows = data_obj["OPTSTK"]["data"] or []
    for row in rows:
        symbol = row.get("underlying")
        p_change = row.get("pChange")
        if symbol is None or p_change is None:
            continue
        try:
            p = float(p_change)
        except Exception:
            try:
                p = float(str(p_change))
            except Exception:
                p = 0.0
        symbol_to_sum[symbol] = symbol_to_sum.get(symbol, 0.0) + p

    aggregated = [
        {"symbol": sym, "percentage_change": round(total, 2)}
        for sym, total in symbol_to_sum.items()
    ]
    aggregated.sort(key=lambda x: x["percentage_change"], reverse=True)
    return aggregated[:20]


def supabase_insert(table: str, rows: list) -> None:
    if not rows:
        logging.warning("No rows to insert for %s", table)
        return

    url = f"{SUPABASE_URL}/rest/v1/{table}"
    headers = {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
    }
    resp = requests.post(url, headers=headers, json=rows, timeout=30)
    if resp.status_code >= 300:
        logging.error("Supabase insert failed (%s): %s", resp.status_code, resp.text[:300])
        resp.raise_for_status()
    logging.info("Inserted %d rows into %s", len(rows), table)


def generate_session_id(prefix: str = "PY") -> str:
    now = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    return f"{prefix}_{now}"


def main() -> None:
    logging.info("Starting NSE data collection (Python)")

    if not is_market_hours():
        logging.info("Outside market hours - skipping run")
        return

    session_id = generate_session_id()
    session = requests.Session()

    # Set session cookies first
    establish_session(session)

    # Small politeness delay
    time.sleep(1.0)

    # Fetch calls & puts with simple retries
    calls_data_obj = None
    puts_data_obj = None
    for name, url in (("calls", CALLS_API_URL), ("puts", PUTS_API_URL)):
        for attempt in range(1, 4):
            try:
                logging.info("Fetching %s data (attempt %d)", name, attempt)
                data = fetch_json(session, url)
                if name == "calls":
                    calls_data_obj = data
                else:
                    puts_data_obj = data
                break
            except Exception as e:
                logging.warning("%s fetch failed: %s", name, e)
                if attempt == 3:
                    logging.error("All attempts failed for %s", name)
                else:
                    time.sleep(1.5 * attempt)

    # Aggregate
    calls_agg = []
    puts_agg = []
    try:
        if calls_data_obj:
            calls_agg = aggregate_activity(calls_data_obj)
    except Exception as e:
        logging.error("Aggregation failed for calls: %s", e)
    try:
        if puts_data_obj:
            puts_agg = aggregate_activity(puts_data_obj)
    except Exception as e:
        logging.error("Aggregation failed for puts: %s", e)

    # Prepare rows with session_id
    calls_rows = [
        {"symbol": r["symbol"], "percentage_change": r["percentage_change"], "session_id": session_id}
        for r in calls_agg
    ]
    puts_rows = [
        {"symbol": r["symbol"], "percentage_change": r["percentage_change"], "session_id": session_id}
        for r in puts_agg
    ]

    # Insert into Supabase
    try:
        supabase_insert("most_active_stock_calls", calls_rows)
    except Exception:
        pass
    try:
        supabase_insert("most_active_stock_puts", puts_rows)
    except Exception:
        pass

    logging.info(
        "Done. calls=%d, puts=%d, session_id=%s",
        len(calls_rows), len(puts_rows), session_id,
    )


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        logging.exception("Fatal error: %s", exc)
        sys.exit(1)


