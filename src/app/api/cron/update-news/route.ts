import { NextResponse } from 'next/server';
import { ingestMarketNews } from '@/lib/newsIngestion';

/**
 * Scheduled news ingestion.
 * Runs on Vercel Cron (see vercel.json) and can also be triggered manually:
 *   curl -X POST <origin>/api/cron/update-news
 * When CRON_SECRET is set, requests must pass `Authorization: Bearer <secret>`.
 */
async function handleCronExecution() {
  try {
    const result = await ingestMarketNews();
    console.log(`✅ CRON: news ingestion completed (${result.inserted} new of ${result.fetched} fetched, ${result.sourcesOk}/${result.sourcesTotal} sources ok)`);
    return NextResponse.json({
      success: true,
      message: 'News ingestion completed',
      timestamp: new Date().toISOString(),
      result,
    });
  } catch (error) {
    console.error('❌ CRON: news ingestion failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

const isAuthorized = (request: Request): boolean => {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true; // no secret configured, allow (matches other cron routes)
  const auth = request.headers.get('authorization') || '';
  return auth === `Bearer ${secret}`;
};

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  return handleCronExecution();
}

export async function GET(request: Request) {
  return POST(request);
}
