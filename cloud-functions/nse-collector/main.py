import os
import json
import logging
from datetime import datetime, timedelta, timezone
from typing import Dict, List, Any

import requests
import functions_framework

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# NSE API Configuration
NSE_BASE_URL = "https://www.nseindia.com"
COOKIE_SET_URL = f"{NSE_BASE_URL}/market-data/oi-spurts"
CALLS_API_URL = f"{NSE_BASE_URL}/api/snapshot-derivatives-equity?index=calls-stocks-val"
PUTS_API_URL = f"{NSE_BASE_URL}/api/snapshot-derivatives-equity?index=puts-stocks-val"

# Supabase configuration
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")

def generate_headers() -> Dict[str, str]:
    """Generate browser-like headers"""
    return {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate",
        "Connection": "keep-alive",
        "Cache-Control": "no-cache",
        "DNT": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1"
    }

def is_market_hours() -> bool:
    """Check if current time is within Indian market hours"""
    # Convert UTC to IST (UTC + 5:30)
    now_utc = datetime.now(timezone.utc)
    now_ist = now_utc + timedelta(hours=5, minutes=30)
    
    # Check if weekday (Monday=0, Sunday=6)
    is_weekday = now_ist.weekday() < 5
    
    # Market hours: 9:20 AM to 1:00 PM IST
    current_minutes = now_ist.hour * 60 + now_ist.minute
    market_start = 9 * 60 + 20  # 9:20 AM
    market_end = 13 * 60        # 1:00 PM
    
    is_market_time = market_start <= current_minutes <= market_end
    
    logger.info(f"IST Time: {now_ist.isoformat()}, Weekday: {is_weekday}, Market Hours: {is_market_time}")
    
    return is_weekday and is_market_time

def establish_session(session: requests.Session) -> None:
    """Establish NSE session by visiting oi-spurts page"""
    headers = generate_headers()
    try:
        response = session.get(COOKIE_SET_URL, headers=headers, timeout=30)
        response.raise_for_status()
        logger.info("NSE session cookies established successfully")
    except Exception as e:
        logger.error(f"Failed to establish NSE session: {e}")
        raise

def fetch_nse_data(session: requests.Session, url: str, data_type: str) -> List[Dict[str, Any]]:
    """Fetch and process NSE data"""
    try:
        headers = generate_headers()
        response = session.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        data = response.json()
        
        if not data or "OPTSTK" not in data or "data" not in data["OPTSTK"]:
            logger.error(f"Invalid {data_type} data structure from NSE API")
            return []
        
        # Aggregate by underlying symbol
        symbol_totals = {}
        for item in data["OPTSTK"]["data"]:
            symbol = item.get("underlying")
            p_change = item.get("pChange")
            
            if symbol and p_change is not None:
                try:
                    change_value = float(p_change)
                    symbol_totals[symbol] = symbol_totals.get(symbol, 0.0) + change_value
                except (ValueError, TypeError):
                    continue
        
        # Convert to list and sort
        result = [
            {"symbol": symbol, "percentage_change": round(total, 2)}
            for symbol, total in symbol_totals.items()
        ]
        
        result.sort(key=lambda x: x["percentage_change"], reverse=True)
        logger.info(f"Successfully processed {len(result)} {data_type} records")
        
        return result[:10]  # Top 10
        
    except Exception as e:
        logger.error(f"Failed to fetch {data_type} data: {e}")
        return []

def store_in_supabase(table_name: str, data: List[Dict[str, Any]], session_id: str) -> bool:
    """Store data in Supabase"""
    if not data:
        logger.warning(f"No data to store in {table_name}")
        return False
    
    try:
        # Prepare data for insertion
        insert_data = [
            {
                "symbol": item["symbol"],
                "percentage_change": item["percentage_change"],
                "session_id": session_id,
                "timestamp": datetime.utcnow().isoformat()
            }
            for item in data
        ]
        
        # Insert into Supabase
        url = f"{SUPABASE_URL}/rest/v1/{table_name}"
        headers = {
            "apikey": SUPABASE_SERVICE_KEY,
            "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
        }
        
        response = requests.post(url, headers=headers, json=insert_data, timeout=30)
        response.raise_for_status()
        
        logger.info(f"Successfully stored {len(insert_data)} records in {table_name}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to store data in {table_name}: {e}")
        return False

@functions_framework.http
def collect_nse_data(request):
    """Google Cloud Function entry point"""
    
    # CORS headers for web requests
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST',
        'Access-Control-Allow-Headers': 'Content-Type',
    }
    
    # Handle preflight requests
    if request.method == 'OPTIONS':
        return ('', 204, headers)
    
    try:
        logger.info("Starting NSE data collection from Google Cloud Functions")
        
        # Check if required environment variables are set
        if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
            error_msg = "Missing Supabase configuration"
            logger.error(error_msg)
            return (json.dumps({"error": error_msg}), 400, headers)
        
        # Check market hours (allow override with force parameter)
        force_run = request.args.get('force', '').lower() == 'true'
        
        if not force_run and not is_market_hours():
            msg = "Outside market hours - data collection skipped"
            logger.info(msg)
            return (json.dumps({"message": msg, "skipped": True}), 200, headers)
        
        # Create session and establish cookies
        session = requests.Session()
        establish_session(session)
        
        # Generate session ID
        session_id = f"GCF_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"
        
        # Fetch calls and puts data
        logger.info("Fetching NSE data...")
        calls_data = fetch_nse_data(session, CALLS_API_URL, "calls")
        puts_data = fetch_nse_data(session, PUTS_API_URL, "puts")
        
        # Store data in Supabase
        calls_stored = store_in_supabase("most_active_stock_calls", calls_data, session_id)
        puts_stored = store_in_supabase("most_active_stock_puts", puts_data, session_id)
        
        # Prepare response
        result = {
            "success": True,
            "session_id": session_id,
            "timestamp": datetime.utcnow().isoformat(),
            "data": {
                "calls": {
                    "count": len(calls_data),
                    "stored": calls_stored,
                    "sample": calls_data[:3] if calls_data else []
                },
                "puts": {
                    "count": len(puts_data),
                    "stored": puts_stored,
                    "sample": puts_data[:3] if puts_data else []
                }
            }
        }
        
        logger.info(f"Data collection completed: {len(calls_data)} calls, {len(puts_data)} puts")
        return (json.dumps(result), 200, headers)
        
    except Exception as e:
        error_msg = f"Data collection failed: {str(e)}"
        logger.error(error_msg)
        return (json.dumps({"error": error_msg, "success": False}), 500, headers)

# For local testing
if __name__ == "__main__":
    # Mock request for local testing
    class MockRequest:
        method = "GET"
        args = {"force": "true"}
    
    print("Testing locally...")
    result = collect_nse_data(MockRequest())
    print(result)

