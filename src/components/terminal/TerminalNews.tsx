'use client';

import { useCallback, useEffect, useState } from 'react';
import { Globe, Newspaper, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { NewsArticle } from '@/types/news';

type NewsFilter = 'all' | 'india' | 'global';

const FILTERS: { id: NewsFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'india', label: 'India' },
  { id: 'global', label: 'Global' },
];

const INDIA_CATEGORIES = new Set(['Markets', 'Results', 'Companies', 'Policy']);

const CATEGORY_BADGE: Record<string, string> = {
  Markets: 'bg-green-100 text-green-700',
  Results: 'bg-orange-100 text-orange-700',
  Companies: 'bg-indigo-100 text-indigo-700',
  Policy: 'bg-blue-100 text-blue-700',
  Global: 'bg-purple-100 text-purple-700',
};

/**
 * Live news list for the trading terminal's "Traders Desk".
 * Pulls Indian market news + global economics/geopolitics from /api/news-feed,
 * streams new articles in realtime via Supabase, and polls every minute.
 */
export function TerminalNews() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<NewsFilter>('all');

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/news-feed');
      const data = await res.json();
      if (data?.success && Array.isArray(data.articles)) {
        setArticles(data.articles);
      }
    } catch {
      // keep whatever we already have
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load + a silent poll every 60s (in case nothing else triggers ingestion).
  useEffect(() => {
    load();
    const timer = setInterval(load, 60_000);
    return () => clearInterval(timer);
  }, [load]);

  // Realtime: prepend new articles the moment they are ingested.
  useEffect(() => {
    const channel = supabase
      .channel('terminal-news-feed')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'news_articles' },
        (payload: { new: Record<string, string> }) => {
          const row = payload.new;
          const article: NewsArticle = {
            id: row.id,
            title: row.title,
            summary: row.summary ? row.summary.substring(0, 150) : '',
            category: row.category,
            timestamp: 'Just now',
            impact: (row.impact as NewsArticle['impact']) || 'Neutral',
            source: row.source,
            url: row.source_url,
            pubDate: row.published_at,
          };
          setArticles((prev) => [
            article,
            ...prev.filter((a) => a.id !== article.id && a.url !== article.url),
          ].slice(0, 60));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const visible =
    filter === 'all'
      ? articles
      : articles.filter((a) =>
          filter === 'india' ? INDIA_CATEGORIES.has(a.category) : a.category === 'Global',
        );

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-gray-100 px-3 py-1.5">
        <div className="flex items-center gap-1.5">
          <Newspaper className="h-3.5 w-3.5 text-blue-600" />
          <span className="text-[11px] font-bold text-gray-700">News</span>
        </div>
        <div className="flex rounded-full bg-gray-100 p-0.5">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold transition-colors ${
                filter === f.id ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {loading && articles.length === 0 ? (
          <div className="flex items-center justify-center gap-2 py-6 text-xs text-gray-400">
            <TrendingUp className="h-4 w-4 animate-pulse" />
            Loading news…
          </div>
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center gap-1 py-6 text-center">
            <Globe className="h-6 w-6 text-gray-300" />
            <p className="text-xs text-gray-400">No news yet for this filter.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {visible.map((a) => (
              <li key={a.id}>
                <a
                  href={a.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-3 py-2 transition-colors hover:bg-blue-50/60"
                >
                  <div className="mb-0.5 flex items-center gap-1.5">
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                        a.impact === 'Positive'
                          ? 'bg-green-500'
                          : a.impact === 'Negative'
                            ? 'bg-red-500'
                            : 'bg-gray-300'
                      }`}
                    />
                    <span
                      className={`rounded px-1 py-px text-[9px] font-bold ${
                        CATEGORY_BADGE[a.category] || 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {a.category}
                    </span>
                    <span className="ml-auto shrink-0 text-[10px] text-gray-400">
                      {a.timestamp}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-[11px] font-semibold leading-snug text-gray-800">
                    {a.title}
                  </p>
                  <p className="mt-0.5 text-[10px] text-gray-400">{a.source}</p>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default TerminalNews;