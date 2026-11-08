/**
 * Dhan ScanX (`customscan/fetchdt`) — shared by live scanner and movers.
 */

export const DHAN_SCANX_URL = 'https://ow-scanx-analytics.dhan.co/customscan/fetchdt';

export const DHAN_HEADERS: HeadersInit = {
  accept: '*/*',
  'accept-language': 'en-GB,en;q=0.9,en-US;q=0.8,hi;q=0.7,mr;q=0.6',
  'content-type': 'application/json; charset=UTF-8',
  origin: 'https://dhan.co',
  referer: 'https://dhan.co/',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-site',
  'user-agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
};

export interface ScanCondition {
  field: string;
  field2?: string;
  op: string;
  val?: string;
}

export interface RawStockRow {
  Sym?: string;
  DispSym?: string;
  Seosym?: string;
  Sid?: number;
  Ltp?: number;
  Open?: number;
  High?: number;
  Low?: number;
  BcClose?: number;
  PPerchange?: number;
  Pchange?: number;
  Volume?: number;
  volume?: number;
  Mcap?: number;
  High1Yr?: number;
  Low1Yr?: number;
  UpperCircuitBreak?: number | string;
  LowerCircuitBreak?: number | string;
  LiveData?: {
    UpperCircuitBreak?: number | string;
    LowerCircuitBreak?: number | string;
  };
  [key: string]: unknown;
}

interface ScanResponse {
  code?: number;
  remarks?: string;
  tot_rec?: number;
  tot_pg?: number;
  last_resp_time?: string;
  data?: RawStockRow[];
}

export interface NormalizedStock {
  symbol: string;
  name: string;
  seoSymbol: string;
  sid?: number;
  ltp: number;
  open: number | null;
  high: number | null;
  low: number | null;
  prevClose: number | null;
  change: number | null;
  changePercent: number | null;
  volume: number;
  marketCap: number | null;
  tradedValue: number;
  upperCircuit: boolean;
  lowerCircuit: boolean;
  week52High: number | null;
  week52Low: number | null;
}

export interface ScanResult {
  scan: string;
  label: string;
  total: number;
  asOf: string | null;
  rows: NormalizedStock[];
  error?: string;
}

export interface LiveScannerPayload {
  success: boolean;
  scope: 'all' | 'fno';
  asOf: string | null;
  scans: Record<string, ScanResult>;
  timestamp: string;
}

export const BASE_PARAMS: ScanCondition[] = [
  { field: 'OgInst', op: '', val: 'ES' },
  { field: 'Seg', op: '', val: 'E' },
];

export const NSE_PARAM: ScanCondition = { field: 'Exch', op: '', val: 'NSE' };

export const FNO_PARAM: ScanCondition = { field: 'FnoFlag', op: '', val: '1' };

export const FIELDS = [
  'Sym',
  'DispSym',
  'Seosym',
  'Sid',
  'Ltp',
  'Open',
  'High',
  'Low',
  'BcClose',
  'PPerchange',
  'Pchange',
  'Volume',
  'Mcap',
  'High1Wk',
  'Low1Wk',
  'High1Mon',
  'Low1Mon',
  'High1Yr',
  'Low1Yr',
  'LiveData.UpperCircuitBreak',
  'LiveData.LowerCircuitBreak',
];

export const SCANS: Record<string, { label: string; params: ScanCondition[]; sorder: 'asc' | 'desc' }> = {
  dayHigh: {
    label: 'Day High',
    params: [{ field: 'Ltp', field2: 'High', op: 'gte' }],
    sorder: 'desc',
  },
  dayLow: {
    label: 'Day Low',
    params: [{ field: 'Ltp', field2: 'Low', op: 'lte' }],
    sorder: 'asc',
  },
  weekHigh: {
    label: 'Weekly High',
    params: [{ field: 'Ltp', field2: 'High1Wk', op: 'gte' }],
    sorder: 'desc',
  },
  weekLow: {
    label: 'Weekly Low',
    params: [{ field: 'Ltp', field2: 'Low1Wk', op: 'lte' }],
    sorder: 'asc',
  },
  monthHigh: {
    label: 'Monthly High',
    params: [{ field: 'Ltp', field2: 'High1Mon', op: 'gte' }],
    sorder: 'desc',
  },
  monthLow: {
    label: 'Monthly Low',
    params: [{ field: 'Ltp', field2: 'Low1Mon', op: 'lte' }],
    sorder: 'asc',
  },
  yearHigh: {
    label: '52-Week High',
    params: [{ field: 'Ltp', field2: 'High1Yr', op: 'gte' }],
    sorder: 'desc',
  },
  yearLow: {
    label: '52-Week Low',
    params: [{ field: 'Ltp', field2: 'Low1Yr', op: 'lte' }],
    sorder: 'asc',
  },
  upperCircuit: {
    label: 'Upper Circuit',
    params: [{ field: 'LiveData.UpperCircuitBreak', op: '', val: '1' }],
    sorder: 'desc',
  },
  lowerCircuit: {
    label: 'Lower Circuit',
    params: [{ field: 'LiveData.LowerCircuitBreak', op: '', val: '1' }],
    sorder: 'asc',
  },
};

export const MOVER_SORT_SCANS: Record<
  string,
  { label: string; sort: string; sorder: 'asc' | 'desc'; params?: ScanCondition[] }
> = {
  topGainers: { label: 'Top Gainers', sort: 'PPerchange', sorder: 'desc' },
  topLosers: { label: 'Top Losers', sort: 'PPerchange', sorder: 'asc' },
  mostActiveVolume: { label: 'Most Active by Volume', sort: 'Volume', sorder: 'desc' },
  mostActiveValue: { label: 'Most Active by Value', sort: 'Volume', sorder: 'desc' },
};

const num = (v: unknown): number | null => {
  const n = typeof v === 'string' ? parseFloat(v) : typeof v === 'number' ? v : NaN;
  return Number.isFinite(n) ? n : null;
};

export function normalizeRow(raw: RawStockRow): NormalizedStock {
  const ltp = num(raw.Ltp) ?? 0;
  const volume = num(raw.Volume) ?? num(raw.volume) ?? 0;
  return {
    symbol: String(raw.Sym || raw.DispSym || ''),
    name: String(raw.DispSym || raw.Sym || ''),
    seoSymbol: String(raw.Seosym || ''),
    sid: num(raw.Sid) ?? undefined,
    ltp,
    open: num(raw.Open),
    high: num(raw.High),
    low: num(raw.Low),
    prevClose: num(raw.BcClose),
    change: num(raw.Pchange),
    changePercent: num(raw.PPerchange),
    volume,
    marketCap: num(raw.Mcap),
    tradedValue: ltp * volume,
    upperCircuit:
      String(
        raw['LiveData.UpperCircuitBreak'] ??
          raw.UpperCircuitBreak ??
          raw.LiveData?.UpperCircuitBreak ??
          '',
      ) === '1',
    lowerCircuit:
      String(
        raw['LiveData.LowerCircuitBreak'] ??
          raw.LowerCircuitBreak ??
          raw.LiveData?.LowerCircuitBreak ??
          '',
      ) === '1',
    week52High: num(raw.High1Yr),
    week52Low: num(raw.Low1Yr),
  };
}

async function postScanX(body: {
  sort: string;
  sorder: 'asc' | 'desc';
  count: number;
  params: ScanCondition[];
}): Promise<{ rows: NormalizedStock[]; total: number; asOf: string | null; error?: string }> {
  const payload = {
    data: {
      sort: body.sort,
      sorder: body.sorder,
      count: body.count,
      params: body.params,
      fields: FIELDS,
      pgno: 1,
    },
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const res = await fetch(DHAN_SCANX_URL, {
      method: 'POST',
      headers: DHAN_HEADERS,
      body: JSON.stringify(payload),
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`Dhan ScanX HTTP ${res.status}`);
    }

    const json = (await res.json()) as ScanResponse;
    if (json.code !== 0) {
      if (json.remarks?.toLowerCase().includes('no data found')) {
        return { rows: [], total: 0, asOf: null };
      }
      throw new Error(json.remarks || `Dhan ScanX error code ${json.code}`);
    }

    const rows = Array.isArray(json.data) ? json.data.map(normalizeRow) : [];
    return {
      rows,
      total: json.tot_rec ?? rows.length,
      asOf: json.last_resp_time || null,
    };
  } catch (error) {
    return {
      rows: [],
      total: 0,
      asOf: null,
      error: error instanceof Error ? error.message : 'Scan failed',
    };
  }
}

function buildScopeParams(scope: 'all' | 'fno', nseOnly: boolean): ScanCondition[] {
  const params = [...BASE_PARAMS];
  if (nseOnly) {
    params.push(NSE_PARAM);
  }
  if (scope === 'fno') {
    params.push(FNO_PARAM);
  }
  return params;
}

export async function fetchScan(
  scanKey: string,
  scope: 'all' | 'fno',
  count: number,
): Promise<ScanResult> {
  const scan = SCANS[scanKey];
  const params: ScanCondition[] = [...scan.params, ...buildScopeParams(scope, false)];

  const result = await postScanX({
    sort: 'PPerchange',
    sorder: scan.sorder,
    count,
    params,
  });

  return {
    scan: scanKey,
    label: scan.label,
    total: result.total,
    asOf: result.asOf,
    rows: result.rows,
    error: result.error,
  };
}

export async function fetchMoverSort(
  scanKey: string,
  scope: 'all' | 'fno',
  count: number,
): Promise<ScanResult> {
  const scan = MOVER_SORT_SCANS[scanKey];
  const params = [...buildScopeParams(scope, true), ...(scan.params ?? [])];

  const fetchCount =
    scanKey === 'mostActiveValue' ? Math.min(Math.max(count * 4, 80), 250) : count;

  const result = await postScanX({
    sort: scan.sort,
    sorder: scan.sorder,
    count: fetchCount,
    params,
  });

  let rows = result.rows;
  if (scanKey === 'mostActiveValue') {
    rows = [...rows].sort((a, b) => b.tradedValue - a.tradedValue);
  }
  rows = rows.slice(0, count);

  return {
    scan: scanKey,
    label: scan.label,
    total: result.total,
    asOf: result.asOf,
    rows,
    error: result.error,
  };
}

const CACHE_TTL_MS = 15000;
let cache: { payload: LiveScannerPayload; expires: number; scope: 'all' | 'fno' } | null = null;

export async function fetchAllScans(scope: 'all' | 'fno', count: number): Promise<LiveScannerPayload> {
  const now = Date.now();
  if (cache && cache.expires > now && cache.scope === scope) {
    return cache.payload;
  }

  const scanKeys = Object.keys(SCANS);
  const results = await Promise.all(scanKeys.map((key) => fetchScan(key, scope, count)));

  const scans: Record<string, ScanResult> = {};
  let latestAsOf: string | null = null;
  for (const result of results) {
    scans[result.scan] = result;
    if (result.asOf && (!latestAsOf || result.asOf > latestAsOf)) {
      latestAsOf = result.asOf;
    }
  }

  const payload: LiveScannerPayload = {
    success: true,
    scope,
    asOf: latestAsOf,
    scans,
    timestamp: new Date().toISOString(),
  };

  cache = { payload, expires: now + CACHE_TTL_MS, scope };
  return payload;
}
