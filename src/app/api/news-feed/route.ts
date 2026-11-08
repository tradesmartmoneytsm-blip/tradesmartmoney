import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { ingestMarketNews, getNewestPublishedAt } from '@/lib/newsIngestion';

export const dynamic = 'force-dynamic';

// ============================================================
// India news feed API
// ------------------------------------------------------------
// Serves cached articles from Supabase `news_articles`. If the
// cache is stale (>20 min) or empty, ingests fresh RSS feeds
// on demand and re-reads. Realtime INSERTs are streamed to the
// client via Supabase Realtime (no polling required for updates
// that arrive while a visitor is on the page).
// ============================================================

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
  timestamp: string;
  impact: 'Positive' | 'Negative' | 'Neutral';
  source: string;
  url?: string;
  pubDate: string;
}

const STALE_MS = 10 * 60 * 1000; // ingest when newest article is older than 10 min

const formatTimestamp = (isIso: string): string => {
  try {
    const diffMs = Date.now() - new Date(isIso).getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${Math.floor(diffHours / 24)} days ago`;
  } catch {
    return 'Recently';
  }
};

const fetchCachedArticles = async (limit = 24): Promise<NewsArticle[]> => {
  const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  let { data, error } = await supabaseAdmin
    .from('news_articles')
    .select('id, title, summary, category, source, impact, source_url, published_at')
    .gte('published_at', since)
    .order('published_at', { ascending: false })
    .limit(limit);

  // If too old to have entries within 24h, fall back to latest rows
  if ((!data || data.length === 0) && !error) {
    const res = await supabaseAdmin
      .from('news_articles')
      .select('id, title, summary, category, source, impact, source_url, published_at')
      .order('published_at', { ascending: false })
      .limit(limit);
    data = res.data;
    error = res.error;
  }

  if (error) {
    console.error('❌ API: Supabase news read error:', error.message);
    return [];
  }

  return (data || []).map((row: Record<string, string>) => ({
    id: row.id,
    title: row.title,
    summary: row.summary ? row.summary.substring(0, 150) + (row.summary.length > 150 ? '...' : '') : 'Click to read more about this market development',
    category: row.category,
    timestamp: formatTimestamp(row.published_at),
    impact: (row.impact as NewsArticle['impact']) ?? 'Neutral',
    source: row.source,
    url: row.source_url,
    pubDate: row.published_at,
  }));
};

export async function GET() {
  try {
    let articles = await fetchCachedArticles();

    // On-demand refresh when the cache is empty or stale
    const newest = await getNewestPublishedAt();
    const isStale = !newest || Date.now() - new Date(newest).getTime() > STALE_MS;

    if (isStale) {
      console.log('🔄 API: news cache stale, ingesting live feeds...');
      const result = await ingestMarketNews();
      articles = await fetchCachedArticles(); // re-read whatever succeeded
      if (articles.length === 0 && result.sourcesOk === 0) {
        return NextResponse.json({
          success: false,
          error: 'No news sources available and no cached articles',
          lastUpdated: new Date().toISOString(),
        }, { status: 503 });
      }
    }

    return NextResponse.json({
      success: true,
      articles,
      lastUpdated: articles[0]?.pubDate ?? new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ API: Error fetching news:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
