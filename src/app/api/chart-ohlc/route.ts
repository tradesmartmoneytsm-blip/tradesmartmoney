import { NextResponse } from 'next/server';
import { sortDedupeCandles } from '@/lib/chart-candles';

export const dynamic = 'force-dynamic';

const DHAN_OHLC_URL = 'https://openweb-ticks.dhan.co/getDataH';
const DHAN_SCANX_URL = 'https://ow-scanx-analytics.dhan.co/customscan/fetchdt';

const DHAN_HEADERS: HeadersInit = {
  Accept: '*/*',
  'Content-Type': 'application/json; charset=UTF-8',
  Origin: 'https://dhan.co',
  Referer: 'https://dhan.co/',
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
};

type DhanOhlc = {
  o: number[];
  h: number[];
  l: number[];
  c: number[];
  v: number[];
  t: number[];
};

async function resolveSecurityId(symbol: string): Promise<number | null> {
  const sym = symbol.toUpperCase().replace(/^NSE:/, '');
  const payload = {
    data: {
      sort: 'PPerchange',
      sorder: 'desc',
      count: 1,
      params: [
        { field: 'Sym', op: '', val: sym },
        { field: 'OgInst', op: '', val: 'ES' },
        { field: 'Seg', op: '', val: 'E' },
      ],
      fields: ['Sym', 'Sid', 'DispSym'],
      pgno: 1,
    },
  };

  const res = await fetch(DHAN_SCANX_URL, {
    method: 'POST',
    headers: DHAN_HEADERS,
    body: JSON.stringify(payload),
    cache: 'no-store',
  });
  if (!res.ok) return null;
  const json = await res.json();
  const row = json?.data?.[0];
  const sid = row?.Sid;
  return typeof sid === 'number' ? sid : null;
}

// ── Live session snapshot (for special sessions Dhan OHLC history skips) ──
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

function istDateKey(unixSeconds: number): string {
  return new Date(unixSeconds * 1000 + IST_OFFSET_MS).toISOString().slice(0, 10);
}

/** Midnight IST for a `YYYY-MM-DD` key, expressed as a UTC unix timestamp. */
function istMidnightUtcSeconds(dateKey: string): number {
  const [y, m, d] = dateKey.split('-').map(Number);
  return Math.floor((Date.UTC(y, m - 1, d) - IST_OFFSET_MS) / 1000);
}

/** Parse Dhan's `LastTradeTime` (e.g. `08/11/2026 15:53:58`, IST) → `YYYY-MM-DD`. */
function parseIstTradeDateKey(value: string): string | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})/.exec(value);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : null;
}

interface LiveSnapshot {
  dateKey: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

async function fetchLiveSnapshot(symbol: string): Promise<LiveSnapshot | null> {
  const sym = symbol.toUpperCase().replace(/^NSE:/, '');
  const payload = {
    data: {
      sort: 'PPerchange',
      sorder: 'desc',
      count: 1,
      params: [
        { field: 'Sym', op: '', val: sym },
        { field: 'OgInst', op: '', val: 'ES' },
        { field: 'Seg', op: '', val: 'E' },
      ],
      fields: ['Sym', 'Sid', 'Open', 'High', 'Low', 'Close', 'Ltp', 'LastTradeTime', 'Volume'],
      pgno: 1,
    },
  };

  try {
    const res = await fetch(DHAN_SCANX_URL, {
      method: 'POST',
      headers: DHAN_HEADERS,
      body: JSON.stringify(payload),
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    const row = json?.data?.[0];
    if (!row) return null;

    const open = Number(row.Open);
    // ScanX's `Close` can remain at the previous session's close while the
    // market is live. `Ltp` is the current session price and must form the
    // close of the live daily candle.
    const close = Number(row.Ltp ?? row.Close);
    const rawHigh = Number(row.High);
    const rawLow = Number(row.Low);
    if (
      ![open, rawHigh, rawLow, close].every((n) => Number.isFinite(n) && n > 0)
    ) {
      return null;
    }

    // Guard against small feed update-order differences so the live candle
    // always satisfies low <= open/close <= high.
    const high = Math.max(rawHigh, open, close);
    const low = Math.min(rawLow, open, close);

    const dateKey = parseIstTradeDateKey(String(row.LastTradeTime ?? ''));
    if (!dateKey) return null;

    return {
      dateKey,
      open,
      high,
      low,
      close,
      volume: Number(row.Volume) || 0,
    };
  } catch {
    return null;
  }
}

function dhanInterval(interval: string): string {
  if (interval === 'D' || interval === '1D') return 'D';
  if (interval === '60' || interval === '1h') return '60';
  if (interval === '15' || interval === '15m') return '15';
  return '5';
}

function lookbackDays(interval: string): number {
  // ~10 years of NSE daily bars (~2,450+ sessions); 3650 calendar days
  if (interval === 'D' || interval === '1D') return 3650;
  if (interval === '60' || interval === '1h') return 30;
  return 10;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = (searchParams.get('symbol') || 'RELIANCE').toUpperCase().replace(/^NSE:/, '');
    const intervalParam = searchParams.get('interval') || '5';
    const dhanIv = dhanInterval(intervalParam);
    const days = lookbackDays(dhanIv);

    let sid = parseInt(searchParams.get('sid') || '', 10);
    if (!Number.isFinite(sid)) {
      sid = (await resolveSecurityId(symbol)) ?? NaN;
    }
    if (!Number.isFinite(sid)) {
      return NextResponse.json({ success: false, error: `Unknown symbol: ${symbol}` }, { status: 404 });
    }

    const end = Math.floor(Date.now() / 1000);
    const start = end - days * 24 * 60 * 60;

    const body = {
      EXCH: 'NSE',
      SYM: symbol,
      SEG: 'E',
      INST: 'EQUITY',
      EXPCODE: 0,
      SEC_ID: sid,
      START: start,
      END: end,
      INTERVAL: dhanIv,
    };

    const res = await fetch(DHAN_OHLC_URL, {
      method: 'POST',
      headers: DHAN_HEADERS,
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Dhan OHLC HTTP ${res.status}`);
    }

    const json = await res.json();
    if (!json.success || !json.data) {
      throw new Error('Dhan OHLC returned no data');
    }

    const raw = json.data as DhanOhlc;
    const len = raw.t?.length ?? 0;
    let candles = sortDedupeCandles(
      Array.from({ length: len }, (_, i) => ({
        time: raw.t[i],
        open: raw.o[i],
        high: raw.h[i],
        low: raw.l[i],
        close: raw.c[i],
        volume: raw.v[i] ?? 0,
      })),
    );

    // Dhan's OHLC history omits special sessions (e.g. Muhurat trading), so the
    // last bar can lag behind the live session. Merge the live snapshot
    // whenever it is at least as recent as the newest bar — this backfills the
    // missing session and keeps the forming candle current on regular days.
    const snapshot = await fetchLiveSnapshot(symbol);
    if (snapshot) {
      const lastDateKey = candles.length ? istDateKey(candles[candles.length - 1].time) : null;
      if (lastDateKey === null || snapshot.dateKey >= lastDateKey) {
        candles = sortDedupeCandles([
          ...candles.filter((c) => istDateKey(c.time) !== snapshot.dateKey),
          {
            time: istMidnightUtcSeconds(snapshot.dateKey),
            open: snapshot.open,
            high: snapshot.high,
            low: snapshot.low,
            close: snapshot.close,
            volume: snapshot.volume,
          },
        ]);
      }
    }

    return NextResponse.json({
      success: true,
      symbol,
      sid,
      interval: dhanIv,
      candles,
      count: candles.length,
    });
  } catch (error) {
    console.error('chart-ohlc:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Chart data failed',
        candles: [],
      },
      { status: 500 },
    );
  }
}
