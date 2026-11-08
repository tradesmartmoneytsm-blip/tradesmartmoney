import { NextResponse } from 'next/server';
import { DHAN_SCANX_URL, DHAN_HEADERS } from '@/lib/dhan-scanx';

export const dynamic = 'force-dynamic';

interface SymbolHit {
  sym: string;
  name: string;
  sid?: number;
}

const CACHE_TTL_MS = 10 * 60 * 1000;
let cache: { rows: SymbolHit[]; expires: number } | null = null;

/** Full NSE equity universe (symbol + company name + sid), cached briefly. */
async function getSymbolList(): Promise<SymbolHit[]> {
  if (cache && cache.expires > Date.now()) return cache.rows;

  const payload = {
    data: {
      sort: 'Sym',
      sorder: 'asc',
      count: 3000,
      params: [
        { field: 'OgInst', op: '', val: 'ES' },
        { field: 'Seg', op: '', val: 'E' },
        { field: 'Exch', op: '', val: 'NSE' },
      ],
      fields: ['Sym', 'DispSym', 'Sid'],
      pgno: 1,
    },
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  const res = await fetch(DHAN_SCANX_URL, {
    method: 'POST',
    headers: DHAN_HEADERS,
    body: JSON.stringify(payload),
    signal: controller.signal,
    cache: 'no-store',
  });
  clearTimeout(timer);

  if (!res.ok) throw new Error(`Dhan ScanX HTTP ${res.status}`);
  const json = await res.json();
  const rows: SymbolHit[] = (json?.data ?? []).map((r: Record<string, unknown>) => ({
    sym: String(r.Sym ?? '').toUpperCase(),
    name: String(r.DispSym ?? ''),
    sid: typeof r.Sid === 'number' ? r.Sid : undefined,
  }));

  cache = { rows, expires: Date.now() + CACHE_TTL_MS };
  return rows;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').toUpperCase().replace(/^NSE:/, '').trim();

  if (!q) {
    return NextResponse.json({ success: true, matches: [] });
  }

  try {
    const rows = await getSymbolList();

    const starts = rows.filter((r) => r.sym.startsWith(q));
    const contains = rows.filter(
      (r) => !r.sym.startsWith(q) && (r.sym.includes(q) || r.name.toUpperCase().includes(q)),
    );
    const matches = [...starts, ...contains].slice(0, 12);

    return NextResponse.json({ success: true, matches });
  } catch (error) {
    console.error('symbol-search:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { success: false, matches: [], error: 'Symbol search failed' },
      { status: 500 },
    );
  }
}