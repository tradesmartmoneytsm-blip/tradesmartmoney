import { getWebScrapingHeaders } from '@/lib/api-headers';

export interface DhanIndexRow {
  DispSym: string;
  Seosym: string;
  Ltp: number;
  PPerchange: number;
  Sym?: string;
}

export interface SectorIndexItem {
  name: string;
  change: number;
  value: string;
  seosym: string;
  lastUpdated: Date;
}

/** Legacy / fallback UI labels → Dhan Seosym */
export const SECTOR_ALIASES: Record<string, string> = {
  'CONSUMER GOODS': 'nifty-fmcg',
  'Nifty Consumer Durables': 'nifty-consumer-durable',
  'CONSR DURBL': 'nifty-consumer-durable',
  'Consumption': 'nifty-india-consumption',
  'AUTOMOBILE': 'nifty-auto',
  Auto: 'nifty-auto',
  'METALS': 'nifty-metal',
  Metals: 'nifty-metal',
  'MEDIA & ENTERTAINMENT': 'nifty-media',
  Media: 'nifty-media',
  'Nifty Healthcare Index': 'nifty-healthcare',
  Healthcare: 'nifty-healthcare',
  PHARMA: 'nifty-pharma',
  Pharma: 'nifty-pharma',
  'Bank Nifty': 'nifty-bank',
  'NIFTY BANK': 'nifty-bank',
  Banking: 'nifty-bank',
  'Nifty Financial Services': 'nifty-financial-services',
  Finnifty: 'nifty-financial-services',
  'PVT Bank': 'nifty-private-bank',
  'Private Bank': 'nifty-private-bank',
  'PSU Bank': 'nifty-psu-bank',
  Energy: 'nifty-energy',
  'Nifty Oil & Gas': 'nifty-oil-and-gas',
  'Oil & Gas': 'nifty-oil-and-gas',
  IT: 'nifty-it',
  FMCG: 'nifty-fmcg',
  'CONSTRUCTION': 'nifty-infrastructure',
  Infrastructure: 'nifty-infrastructure',
  Realty: 'nifty-realty',
  'Nifty 50': 'nifty-50',
};

let cacheBucket: { rows: DhanIndexRow[]; expires: number } | null = null;

/** Strategy / equal-weight indices hidden from Market Outlook 1D list */
const EXCLUDED_MARKET_OUTLOOK_SEOSYMS = new Set([
  'nifty-alpha-50',
  'nifty500-multicap-momentum-quality-50',
  'nifty500-momentum-50',
  'nifty-50-equal-weight',
  'nifty-100-equal-weight',
  'nifty-500-multifactor-mqvlv-50',
]);

function isExcludedFromMarketOutlook(row: DhanIndexRow): boolean {
  const seosym = row.Seosym?.toLowerCase() ?? '';
  if (EXCLUDED_MARKET_OUTLOOK_SEOSYMS.has(seosym)) {
    return true;
  }
  const name = row.DispSym?.toLowerCase() ?? '';
  if (/equal\s*weight/i.test(name)) {
    return true;
  }
  if (/alpha\s*50/i.test(name)) {
    return true;
  }
  if (/500\s+multicap/i.test(name)) {
    return true;
  }
  if (/momentum/i.test(name) || /momentum/i.test(seosym)) {
    return true;
  }
  // MQ = momentum quality style indices
  if (/\bmq\b/i.test(name) || /-mq-|-mq$|momentum-quality/i.test(seosym)) {
    return true;
  }
  return false;
}

/** UI label: drop redundant Nifty prefix (data/API still use full Dhan names). */
export function displaySectorName(name: string): string {
  return name.replace(/^(?:NIFTY|Nifty)\s+/i, '').trim() || name;
}

export function companiesUrlFromSeosym(seosym: string): string {
  const slug = seosym.trim().toLowerCase();
  return `https://dhan.co/indices/${slug}-companies/`;
}

export async function fetchDhanIndexList(): Promise<DhanIndexRow[]> {
  const now = Date.now();
  if (cacheBucket && cacheBucket.expires > now && cacheBucket.rows.length > 0) {
    return cacheBucket.rows;
  }

  const response = await fetch('https://dhan.co/all-nse-indices/', {
    headers: getWebScrapingHeaders(),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Dhan indices HTTP ${response.status}`);
  }

  const html = await response.text();
  const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/);
  if (!match?.[1]) {
    throw new Error('Dhan __NEXT_DATA__ not found');
  }

  const nextData = JSON.parse(match[1]) as {
    props?: { pageProps?: { listData?: DhanIndexRow[] } };
  };
  const list = nextData?.props?.pageProps?.listData ?? [];
  cacheBucket = { rows: list, expires: now + 60_000 };
  return list;
}

/** Classic Nifty sector indices shown in Market Outlook (1D) */
export const MARKET_OUTLOOK_CORE_SECTORS: { seosym: string; displayName?: string }[] = [
  { seosym: 'nifty-energy', displayName: 'Energy' },
  { seosym: 'nifty-metal', displayName: 'Metals' },
  { seosym: 'nifty-oil-and-gas', displayName: 'Oil & Gas' },
  { seosym: 'nifty-pharma', displayName: 'Pharma' },
  { seosym: 'nifty-media', displayName: 'Media' },
  { seosym: 'nifty-financial-services', displayName: 'Finnifty' },
  { seosym: 'nifty-fmcg', displayName: 'FMCG' },
  { seosym: 'nifty-psu-bank', displayName: 'PSU Bank' },
  { seosym: 'nifty-realty', displayName: 'Realty' },
  { seosym: 'nifty-infrastructure', displayName: 'Infrastructure' },
  { seosym: 'nifty-healthcare', displayName: 'Healthcare' },
  { seosym: 'nifty-private-bank', displayName: 'Private Bank' },
  { seosym: 'nifty-bank', displayName: 'Bank' },
  { seosym: 'nifty-50', displayName: 'Nifty 50' },
  { seosym: 'nifty-india-consumption', displayName: 'Consumption' },
  { seosym: 'nifty-auto', displayName: 'Auto' },
  { seosym: 'nifty-consumer-durable', displayName: 'CONSR DURBL' },
  { seosym: 'nifty-it', displayName: 'IT' },
];

const sectorSnapshotCache = new Map<string, { row: DhanIndexRow; expires: number }>();

async function fetchSectorIndexFromCompaniesPage(seosym: string): Promise<DhanIndexRow | null> {
  const key = seosym.toLowerCase();
  const cached = sectorSnapshotCache.get(key);
  if (cached && cached.expires > Date.now()) {
    return cached.row;
  }

  const url = companiesUrlFromSeosym(seosym);
  const response = await fetch(url, { headers: getWebScrapingHeaders(), cache: 'no-store' });
  if (!response.ok) {
    return null;
  }

  const html = await response.text();
  const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/);
  if (!match?.[1]) {
    return null;
  }

  const nextData = JSON.parse(match[1]) as {
    props?: {
      pageProps?: {
        scripData?: { d_sym?: string; sym?: string };
        charthistory?: { c?: number[] };
      };
    };
  };
  const pageProps = nextData.props?.pageProps;
  const scrip = pageProps?.scripData;
  const closes = pageProps?.charthistory?.c;
  if (!closes || closes.length < 2) {
    return null;
  }

  const ltp = closes[closes.length - 1];
  const prev = closes[closes.length - 2];
  const pPerchange = prev ? ((ltp - prev) / prev) * 100 : 0;

  const row: DhanIndexRow = {
    DispSym: scrip?.d_sym || scrip?.sym || seosym,
    Seosym: seosym,
    Ltp: ltp,
    PPerchange: pPerchange,
  };

  sectorSnapshotCache.set(key, { row, expires: Date.now() + 60_000 });
  return row;
}

function rowToSectorItem(row: DhanIndexRow, displayName?: string): SectorIndexItem {
  return {
    name: displayName || row.DispSym,
    change: Number(Number(row.PPerchange).toFixed(2)),
    value: `₹${Math.round(Number(row.Ltp) || 0).toLocaleString('en-IN')}`,
    seosym: row.Seosym,
    lastUpdated: new Date(),
  };
}

/** 1D Market Outlook: fixed sector basket; enriches missing indices from each index's Dhan companies page. */
export async function buildMarketOutlook1DSectors(): Promise<SectorIndexItem[]> {
  const list = await fetchDhanIndexList();
  const liveBySeosym = new Map(list.map((r) => [r.Seosym.toLowerCase(), r]));

  const rows = await Promise.all(
    MARKET_OUTLOOK_CORE_SECTORS.map(async (core) => {
      const key = core.seosym.toLowerCase();
      const live = liveBySeosym.get(key);
      if (live && !isExcludedFromMarketOutlook(live)) {
        return rowToSectorItem(live, core.displayName);
      }
      const snapshot = await fetchSectorIndexFromCompaniesPage(core.seosym);
      if (!snapshot) {
        return null;
      }
      return rowToSectorItem(snapshot, core.displayName);
    }),
  );

  return rows.filter((r): r is SectorIndexItem => r !== null).sort((a, b) => b.change - a.change);
}

export function listToSectorItems(list: DhanIndexRow[]): SectorIndexItem[] {
  return list
    .filter((row) => row.Seosym && row.DispSym && !isExcludedFromMarketOutlook(row))
    .map((row) => rowToSectorItem(row))
    .sort((a, b) => b.change - a.change);
}

export function resolveSeosym(
  sector: string,
  list: DhanIndexRow[],
): { seosym: string; displayName: string } | null {
  const trimmed = sector.trim();
  const lower = trimmed.toLowerCase();

  const alias = SECTOR_ALIASES[trimmed] || SECTOR_ALIASES[sector];
  if (alias) {
    const row = list.find((r) => r.Seosym?.toLowerCase() === alias.toLowerCase());
    return { seosym: alias, displayName: row?.DispSym || trimmed };
  }

  if (lower.startsWith('nifty-') || lower.includes('-')) {
    const row = list.find((r) => r.Seosym?.toLowerCase() === lower);
    return { seosym: lower, displayName: row?.DispSym || trimmed };
  }

  const exact = list.find((r) => r.DispSym?.toLowerCase() === lower);
  if (exact?.Seosym) {
    return { seosym: exact.Seosym, displayName: exact.DispSym };
  }

  const partial = list.find(
    (r) =>
      r.DispSym?.toLowerCase().includes(lower) || lower.includes(r.DispSym?.toLowerCase() || ''),
  );
  if (partial?.Seosym) {
    return { seosym: partial.Seosym, displayName: partial.DispSym };
  }

  return null;
}
