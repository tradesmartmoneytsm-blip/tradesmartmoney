import { NextResponse } from 'next/server';
import {
  fetchIndexConstituents,
  type IndexConstituent,
} from '@/lib/dhan-index-constituents';
import { fetchDhanIndexList, displaySectorName } from '@/lib/dhan-sector-indices';
import { fetchMoverSort, fetchScan, type NormalizedStock } from '@/lib/dhan-scanx';
import {
  MOVER_BASKET_PRESETS,
  MOVER_SCAN_OPTIONS,
  type MoverScanId,
} from '@/lib/movers-filters';

export const dynamic = 'force-dynamic';

const SORT_SCANS = new Set(['topGainers', 'topLosers', 'mostActiveVolume', 'mostActiveValue']);

function isMoverScan(scan: string): scan is MoverScanId {
  return MOVER_SCAN_OPTIONS.some((o) => o.id === scan);
}

function constituentToRow(c: IndexConstituent): NormalizedStock {
  return {
    symbol: c.symbol,
    name: c.name,
    seoSymbol: c.seoSymbol,
    sid: c.sid,
    ltp: c.ltp,
    open: null,
    high: null,
    low: null,
    prevClose: null,
    change: c.change,
    changePercent: c.changePercent,
    volume: c.volume,
    marketCap: null,
    tradedValue: c.ltp * c.volume,
    upperCircuit: false,
    lowerCircuit: false,
    week52High: null,
    week52Low: null,
  };
}

function sortConstituents(scan: MoverScanId, rows: IndexConstituent[]): NormalizedStock[] {
  const mapped = rows.map(constituentToRow);
  switch (scan) {
    case 'topGainers':
      return mapped.sort((a, b) => (b.changePercent ?? 0) - (a.changePercent ?? 0));
    case 'topLosers':
      return mapped.sort((a, b) => (a.changePercent ?? 0) - (b.changePercent ?? 0));
    case 'mostActiveVolume':
      return mapped.sort((a, b) => b.volume - a.volume);
    case 'mostActiveValue':
      return mapped.sort((a, b) => b.tradedValue - a.tradedValue);
    default:
      return mapped;
  }
}

function filterRows(rows: NormalizedStock[], symbols: Set<string>): NormalizedStock[] {
  return rows.filter((r) => symbols.has(r.symbol.toUpperCase()));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  if (searchParams.get('baskets') === '1') {
    try {
      const list = await fetchDhanIndexList();
      const presetIds = new Set(MOVER_BASKET_PRESETS.map((p) => p.id));
      const presetSeosyms = new Set(
        MOVER_BASKET_PRESETS.map((p) => p.seosym?.toLowerCase()).filter(Boolean) as string[],
      );
      const extra = list
        .filter((row) => {
          const sym = row.Seosym?.toLowerCase();
          return sym && !presetIds.has(sym) && !presetSeosyms.has(sym);
        })
        .map((row) => ({
          id: row.Seosym.toLowerCase(),
          label: displaySectorName(row.DispSym),
          group: 'More indices',
          seosym: row.Seosym.toLowerCase(),
        }));

      return NextResponse.json({
        success: true,
        presets: MOVER_BASKET_PRESETS,
        more: extra.slice(0, 120),
      });
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          presets: MOVER_BASKET_PRESETS,
          more: [],
          error: error instanceof Error ? error.message : 'Basket list failed',
        },
        { status: 500 },
      );
    }
  }

  const scanParam = searchParams.get('scan') || 'topGainers';
  const scan = isMoverScan(scanParam) ? scanParam : 'topGainers';
  const basketParam = searchParams.get('basket') || 'all';
  const countParam = parseInt(searchParams.get('count') || '50', 10);
  const count = Number.isFinite(countParam) ? Math.min(Math.max(countParam, 10), 100) : 50;

  const preset =
    MOVER_BASKET_PRESETS.find((p) => p.id === basketParam) ??
    (basketParam !== 'all' ? { id: basketParam, label: basketParam, group: 'Custom', seosym: basketParam } : null);

  const scope: 'all' | 'fno' = preset?.fnoScope ? 'fno' : 'all';
  const seosym = preset?.seosym;

  try {
    let rows: NormalizedStock[] = [];
    let asOf: string | null = null;
    let label: string = MOVER_SCAN_OPTIONS.find((o) => o.id === scan)?.label ?? scan;
    let error: string | undefined;

    if (seosym && SORT_SCANS.has(scan)) {
      const constituents = await fetchIndexConstituents(seosym);
      rows = sortConstituents(scan, constituents).slice(0, count);
    } else if (SORT_SCANS.has(scan)) {
      const result = await fetchMoverSort(scan, scope, count);
      rows = result.rows;
      asOf = result.asOf;
      error = result.error;
      label = result.label;
    } else {
      const fetchCount = seosym ? Math.min(250, count * 5) : count;
      const result = await fetchScan(scan, scope, fetchCount);
      rows = result.rows;
      asOf = result.asOf;
      error = result.error;
      label = result.label;

      if (seosym) {
        const constituents = await fetchIndexConstituents(seosym);
        const symbols = new Set(constituents.map((c) => c.symbol.toUpperCase()));
        rows = filterRows(rows, symbols).slice(0, count);
      } else {
        rows = rows.slice(0, count);
      }
    }

    return NextResponse.json({
      success: true,
      scan,
      label,
      basket: basketParam,
      basketLabel: preset?.label ?? 'All',
      scope,
      asOf,
      count: rows.length,
      rows,
      error,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('❌ Movers API failed:', err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : 'Movers failed',
        rows: [],
      },
      { status: 500 },
    );
  }
}
