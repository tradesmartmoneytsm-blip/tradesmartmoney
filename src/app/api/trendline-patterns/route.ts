import { NextResponse } from 'next/server';
import { DHAN_SCANX_URL } from '@/lib/dhan-scanx';
import { sortDedupeCandles } from '@/lib/chart-candles';
import {
  detectTrendlinePattern,
  type DailyCandle,
  type TrendlineOverlay,
  type TrendlinePatternType,
} from '@/lib/trendline-patterns';

export const dynamic = 'force-dynamic';

const DHAN_OHLC_URL = 'https://openweb-ticks.dhan.co/getDataH';
const DHAN_HEADERS: HeadersInit = {
  Accept: '*/*',
  'Content-Type': 'application/json; charset=UTF-8',
  Origin: 'https://dhan.co',
  Referer: 'https://dhan.co/',
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
};

const CACHE_MS = 60_000;
const REQUEST_CONCURRENCY = 8;
const LOOKBACK_DAYS = 180;

interface PatternRow {
  symbol: string;
  name: string;
  sid?: number;
  type: TrendlinePatternType;
  price: number;
  trendline: TrendlineOverlay;
  sessionDate: string;
}

interface CachedPayload {
  patterns: PatternRow[];
  scanned: number;
  updatedAt: string;
}

let cache: { payload: CachedPayload; expires: number } | null = null;

async function fetchDailyCandles(symbol: string, sid: number): Promise<DailyCandle[]> {
  const end = Math.floor(Date.now() / 1000);
  const body = {
    EXCH: 'NSE',
    SYM: symbol,
    SEG: 'E',
    INST: 'EQUITY',
    EXPCODE: 0,
    SEC_ID: sid,
    START: end - LOOKBACK_DAYS * 24 * 60 * 60,
    END: end,
    INTERVAL: 'D',
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const response = await fetch(DHAN_OHLC_URL, {
      method: 'POST',
      headers: DHAN_HEADERS,
      body: JSON.stringify(body),
      signal: controller.signal,
      cache: 'no-store',
    });
    if (!response.ok) return [];

    const json = await response.json();
    if (!json?.success || !json.data) return [];
    const raw = json.data as {
      t?: number[];
      o?: number[];
      h?: number[];
      l?: number[];
      c?: number[];
    };
    const length = raw.t?.length ?? 0;
    const candles: DailyCandle[] = Array.from({ length }, (_, index) => ({
      time: Number(raw.t?.[index]),
      open: Number(raw.o?.[index]),
      high: Number(raw.h?.[index]),
      low: Number(raw.l?.[index]),
      close: Number(raw.c?.[index]),
    })).filter((candle) =>
      [candle.time, candle.open, candle.high, candle.low, candle.close].every(Number.isFinite),
    );

    return sortDedupeCandles(candles);
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, async () => {
      while (true) {
        const index = next;
        next += 1;
        if (index >= items.length) return;
        results[index] = await worker(items[index]);
      }
    }),
  );
  return results;
}

function istDateKey(unixSeconds: number): string {
  return new Date(unixSeconds * 1000 + 5.5 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

interface UniverseStock {
  symbol: string;
  name: string;
  sid?: number;
}

/**
 * Full NSE F&O universe (~140 liquid stocks, a superset of NIFTY 50/Next 50).
 * Used instead of Dhan's index-companies page, which only returns 25 rows.
 */
async function fetchFnoUniverse(): Promise<UniverseStock[]> {
  const payload = {
    data: {
      sort: 'Mcap',
      sorder: 'desc',
      count: 300,
      params: [
        { field: 'FnoFlag', op: '', val: '1' },
        { field: 'Exch', op: '', val: 'NSE' },
        { field: 'OgInst', op: '', val: 'ES' },
        { field: 'Seg', op: '', val: 'E' },
      ],
      fields: ['Sym', 'DispSym', 'Sid'],
      pgno: 1,
    },
  };

  const res = await fetch(DHAN_SCANX_URL, {
    method: 'POST',
    headers: DHAN_HEADERS,
    body: JSON.stringify(payload),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`F&O universe HTTP ${res.status}`);
  const json = await res.json();

  return (json?.data ?? [])
    .map((row: Record<string, unknown>) => ({
      symbol: String(row.Sym ?? ''),
      name: String(row.DispSym ?? ''),
      sid: typeof row.Sid === 'number' ? row.Sid : undefined,
    }))
    .filter((stock: UniverseStock) => stock.symbol);
}

async function scanPatterns(): Promise<CachedPayload> {
  const stocks = await fetchFnoUniverse();
  const rows = await mapWithConcurrency(stocks, REQUEST_CONCURRENCY, async (stock) => {
    if (!stock.sid) return null;
    const candles = await fetchDailyCandles(stock.symbol, stock.sid);
    const match = detectTrendlinePattern(candles);
    if (!match) return null;

    return {
      symbol: stock.symbol,
      name: stock.name,
      sid: stock.sid,
      type: match.type,
      price: match.price,
      trendline: match.trendline,
      sessionDate: candles.length ? istDateKey(candles[candles.length - 1].time) : '',
    } satisfies PatternRow;
  });

  const patterns = rows.filter((row) => row !== null);
  patterns.sort((a, b) => a.name.localeCompare(b.name));
  return { patterns, scanned: stocks.length, updatedAt: new Date().toISOString() };
}

export async function GET() {
  try {
    if (cache && cache.expires > Date.now()) {
      return NextResponse.json({ success: true, ...cache.payload });
    }

    const payload = await scanPatterns();
    cache = { payload, expires: Date.now() + CACHE_MS };
    return NextResponse.json({ success: true, ...payload }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('trendline-patterns:', error);
    return NextResponse.json(
      {
        success: false,
        patterns: [],
        error: error instanceof Error ? error.message : 'Trendline scan failed',
      },
      { status: 500 },
    );
  }
}
