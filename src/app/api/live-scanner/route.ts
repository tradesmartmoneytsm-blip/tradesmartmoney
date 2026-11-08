import { NextResponse } from 'next/server';
import { fetchAllScans } from '@/lib/dhan-scanx';

/**
 * Live Scanner API — Dhan ScanX multi-scan bundle for the terminal scanner tab.
 */

export const dynamic = 'force-dynamic';

export type { LiveScannerPayload, ScanResult } from '@/lib/dhan-scanx';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const scopeParam = searchParams.get('scope');
    const scope: 'all' | 'fno' = scopeParam === 'fno' ? 'fno' : 'all';
    const countParam = parseInt(searchParams.get('count') || '50', 10);
    const count = Number.isFinite(countParam) ? Math.min(Math.max(countParam, 10), 250) : 50;

    const payload = await fetchAllScans(scope, count);
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
