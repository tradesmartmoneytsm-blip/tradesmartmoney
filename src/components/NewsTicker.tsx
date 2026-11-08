'use client';

import { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';
import type { NewsArticle } from '@/types/news';

interface NewsTickerProps {
  className?: string;
}

/**
 * Scrolling headline ticker showing the latest India market news.
 * Data comes from /api/news-feed (Supabase cache, refreshed by ingestion).
 */
export function NewsTicker({ className = '' }: NewsTickerProps) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const response = await fetch('/api/news-feed');
        const data = await response.json();
        if (active && data.success && data.articles?.length) {
          setArticles(data.articles.slice(0, 20)); // longer loop → fewer visible repeats
        }
      } catch {
        // ticker stays hidden until data is available
      }
    };

    load();
    const timer = setInterval(load, 120_000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  if (articles.length === 0) return null;

  const renderHeadline = (article: NewsArticle, key: string) => (
    <a
      key={key}
      href={article.url || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="mx-10 inline-flex items-center space-x-2 text-lg whitespace-nowrap hover:underline"
    >
      <span
        className={
          article.impact === 'Positive'
            ? 'text-green-600'
            : article.impact === 'Negative'
              ? 'text-red-600'
              : 'text-slate-400'
        }
      >
        ●
      </span>
      <span className="font-semibold">{article.title}</span>
      <span className="text-gray-500 text-sm font-normal">({article.source})</span>
    </a>
  );

  return (
    <div className={`relative bg-white/80 backdrop-blur border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      <div className="flex items-center">
        <div className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 text-white shrink-0 z-10">
          <Zap className="h-5 w-5" />
          <span className="text-sm font-bold tracking-wide uppercase">Live</span>
        </div>
        <div className="flex-1 overflow-hidden relative py-3">
          <style jsx>{`
            @keyframes ticker-scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .ticker-track {
              display: inline-block;
              white-space: nowrap;   /* one horizontal line, no vertical wrap */
              animation: ticker-scroll 60s linear infinite;
            }
            .ticker-track:hover {
              animation-play-state: paused;
            }
          `}</style>
          <div
            className="ticker-track"
            style={{ animationDuration: `${Math.max(75, articles.length * 9)}s` }}
          >
            {articles.map((article, i) => renderHeadline(article, `first-${i}`))}
            {articles.map((article, i) => renderHeadline(article, `dup-${i}`))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewsTicker;
