import { NextResponse } from 'next/server';
import { fetchAllScans } from '@/lib/dhan-scanx';
import { fetchIndexConstituents, constituentSymbols } from '@/lib/dhan-index-constituents';

/**
 * Live Scanner API — Dhan ScanX multi-scan bundle for the terminal.
 * Supports a `universe` filter: nifty-50 | nifty-100 | nifty-200 | nifty-500 | fno.
 */

export const dynamic = 'force-dynamic';

export type { LiveScannerPayload, ScanResult } from '@/lib/dhan-scanx';

const NIFTY_UNIVERSES = new Set(['nifty-50', 'nifty-100', 'nifty-200', 'nifty-500']);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const universeParam = (searchParams.get('universe') || 'nifty-50').toLowerCase();
    const scope: 'all' | 'fno' = universeParam === 'fno' ? 'fno' : 'all';
    const countParam = parseInt(searchParams.get('count') || '50', 10);
    const count = Number.isFinite(countParam) ? Math.min(Math.max(countParam, 10), 250) : 50;

    const payload = await fetchAllScans(scope, count);

    // Filter each scan to the selected NIFTY index's constituents.
    if (NIFTY_UNIVERSES.has(universeParam)) {
      try {
        const constituents = await fetchIndexConstituents(universeParam);
        const symbols = constituentSymbols(constituents);
        for (const key of Object.keys(payload.scans)) {
          const scan = payload.scans[key];
          scan.rows = scan.rows.filter((r) => symbols.has(r.symbol.toUpperCase()));
          scan.total = scan.rows.length;
        }
      } catch {
        // Constituents fetch failed → keep unfiltered rather than empty.
      }
    }

    return NextResponse.json(payload, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('❌ Live scanner failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Live scanner failed',
        scans: {},
      },
      { status: 500 },
    );
  }
}