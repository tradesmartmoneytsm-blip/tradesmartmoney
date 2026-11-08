import { getWebScrapingHeaders } from '@/lib/api-headers';
import { companiesUrlFromSeosym } from '@/lib/dhan-sector-indices';

export interface IndexConstituent {
  symbol: string;
  name: string;
  seoSymbol: string;
  sid?: number;
  ltp: number;
  change: number;
  changePercent: number;
  volume: number;
}

interface DhanStockData {
  Sym?: string;
  DispSym?: string;
  Seosym?: string;
  Sid?: number;
  Pchange?: string | number;
  PPerchange?: string | number;
  Ltp?: string | number;
  Volume?: string | number;
}

const CACHE_TTL_MS = 60_000;
const cache = new Map<string, { rows: IndexConstituent[]; expires: number }>();

const num = (v: unknown): number => {
  const n = typeof v === 'string' ? parseFloat(v) : typeof v === 'number' ? v : NaN;
  return Number.isFinite(n) ? n : 0;
};

/** Live constituent list from a Dhan index companies page (`sniData`). */
export async function fetchIndexConstituents(seosym: string): Promise<IndexConstituent[]> {
  const key = seosym.trim().toLowerCase();
  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) {
    return cached.rows;
  }

  const url = companiesUrlFromSeosym(key);
  const response = await fetch(url, { headers: getWebScrapingHeaders(), cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Constituents HTTP ${response.status}`);
  }

  const html = await response.text();
  const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/);
  if (!match?.[1]) {
    throw new Error('Constituents __NEXT_DATA__ not found');
  }

  const nextData = JSON.parse(match[1]) as {
    props?: { pageProps?: { sniData?: DhanStockData[] } };
  };
  const sniData = nextData?.props?.pageProps?.sniData;
  if (!sniData?.length) {
    return [];
  }

  const rows: IndexConstituent[] = sniData
    .map((stock) => ({
      symbol: String(stock.Sym || ''),
      name: String(stock.DispSym || stock.Sym || ''),
      seoSymbol: String(stock.Seosym || ''),
      sid: typeof stock.Sid === 'number' ? stock.Sid : undefined,
      ltp: num(stock.Ltp),
      change: num(stock.Pchange),
      changePercent: num(stock.PPerchange),
      volume: Math.round(num(stock.Volume)),
    }))
    .filter((r) => r.symbol);

  cache.set(key, { rows, expires: Date.now() + CACHE_TTL_MS });
  return rows;
}

export function constituentSymbols(rows: IndexConstituent[]): Set<string> {
  return new Set(rows.map((r) => r.symbol.toUpperCase()));
}
