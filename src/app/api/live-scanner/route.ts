import { NextResponse } from 'next/server';
import { SCANS, fetchAllScans, fetchScan, type ScanResult } from '@/lib/dhan-scanx';
import { filterStocksByBasket, resolveScannerBasket } from '@/lib/scanner-basket';

/**
 * Live Scanner API — Dhan ScanX (DEXT / ScanX parity).
 * Query: scope via `universe` (all | fno | nifty-50 …), optional `scan` for one tab, `count`.
 */

export const dynamic = 'force-dynamic';

export type { LiveScannerPayload, ScanResult } from '@/lib/dhan-scanx';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const universeParam = (searchParams.get('universe') || searchParams.get('basket') || 'nifty-500').toLowerCase();
    const scanParam = searchParams.get('scan');
    const countParam = parseInt(searchParams.get('count') || '50', 10);
    const count = Number.isFinite(countParam) ? Math.min(Math.max(countParam, 10), 100) : 50;

    const { scope, seosym } = resolveScannerBasket(universeParam);
    const fetchCount = seosym ? Math.min(250, count * 4) : count;

    if (scanParam && SCANS[scanParam]) {
      const result = await fetchScan(scanParam, scope, fetchCount);
      const rows = await filterStocksByBasket(result.rows, seosym, count);
      const scan: ScanResult = { ...result, rows, total: rows.length };
      return NextResponse.json(
        {
          success: true,
          mode: 'single',
          universe: universeParam,
          scope,
          asOf: scan.asOf,
          scan,
          timestamp: new Date().toISOString(),
        },
        { headers: { 'Cache-Control': 'no-store' } },
      );
    }

    const payload = await fetchAllScans(scope, fetchCount);

    if (seosym) {
      for (const key of Object.keys(payload.scans)) {
        const scan = payload.scans[key];
        scan.rows = await filterStocksByBasket(scan.rows, seosym, count);
        scan.total = scan.rows.length;
      }
    } else {
      for (const key of Object.keys(payload.scans)) {
        const scan = payload.scans[key];
        scan.rows = scan.rows.slice(0, count);
        scan.total = scan.rows.length;
      }
    }

    return NextResponse.json(
      { ...payload, universe: universeParam, mode: 'bundle' },
      { headers: { 'Cache-Control': 'no-store' } },
    );
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
