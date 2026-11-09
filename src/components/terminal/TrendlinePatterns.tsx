'use client';

import { useCallback, useEffect, useState } from 'react';
import { CandlestickChart, TrendingDown, TrendingUp } from 'lucide-react';
import type { TrendlineOverlay } from '@/lib/trendline-patterns';

type PatternType = 'breakout' | 'breakdown';
type Filter = 'all' | PatternType;

interface PatternRow {
  symbol: string;
  name: string;
  sid?: number;
  type: PatternType;
  price: number;
  trendline: TrendlineOverlay;
  sessionDate: string;
}

const POLL_MS = 60_000;

function formatPrice(price: number): string {
  return `₹${price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}

function formatTime(date: string | null): string {
  if (!date) return '';
  return new Date(date).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface TrendlinePatternsProps {
  onSelectSymbol?: (
    symbol: string,
    seoSymbol?: string,
    sid?: number,
    trendline?: TrendlineOverlay,
  ) => void;
}

/** Live daily trendline cross signals for NSE F&O stocks. */
export function TrendlinePatterns({ onSelectSymbol }: TrendlinePatternsProps) {
  const [filter, setFilter] = useState<Filter>('all');
  const [patterns, setPatterns] = useState<PatternRow[]>([]);
  const [scanned, setScanned] = useState(0);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const response = await fetch('/api/trendline-patterns', { cache: 'no-store' });
      const json = await response.json();
      if (!response.ok || !json?.success) {
        throw new Error(json?.error || 'Trendline scan unavailable');
      }
      setPatterns(json.patterns ?? []);
      setScanned(json.scanned ?? 0);
      setUpdatedAt(json.updatedAt ?? null);
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Trendline scan unavailable');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const timer = window.setInterval(() => {
      if (!document.hidden) load();
    }, POLL_MS);
    return () => window.clearInterval(timer);
  }, [load]);

  const visible = patterns.filter((pattern) => filter === 'all' || pattern.type === filter);

  return (
    <div className="flex h-full min-h-0 flex-col bg-white text-gray-900">
      <div className="shrink-0 border-b border-gray-100 px-3 py-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <CandlestickChart className="h-3.5 w-3.5 text-blue-600" />
            <span className="text-[11px] font-bold text-gray-700">Trendline Patterns</span>
          </div>
          {updatedAt && <span className="text-[10px] text-gray-400">Updated {formatTime(updatedAt)}</span>}
        </div>
        <p className="mt-0.5 text-[10px] text-gray-400">
          Live daily signals · F&amp;O universe · refreshes every minute
        </p>
        <div className="mt-2 flex gap-1" role="tablist" aria-label="Trendline pattern filter">
          {([
            ['all', 'All'],
            ['breakout', 'Breakouts'],
            ['breakdown', 'Breakdowns'],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={filter === key}
              onClick={() => setFilter(key)}
              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold transition-colors ${
                filter === key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {loading && patterns.length === 0 ? (
          <p className="px-3 py-6 text-center text-xs text-gray-400">
            Scanning F&amp;O trendlines…
          </p>
        ) : error && patterns.length === 0 ? (
          <p className="px-3 py-6 text-center text-xs text-red-500">{error}</p>
        ) : visible.length === 0 ? (
          <div className="px-3 py-7 text-center">
            <CandlestickChart className="mx-auto mb-2 h-6 w-6 text-gray-300" />
            <p className="text-xs text-gray-500">
              {filter === 'all'
                ? 'No live trendline breaks detected.'
                : `No live trendline ${filter} signals detected.`}
            </p>
            {scanned > 0 && <p className="mt-1 text-[10px] text-gray-400">Scanned {scanned} stocks</p>}
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {visible.map((pattern) => {
              const breakout = pattern.type === 'breakout';
              return (
                <li key={`${pattern.symbol}-${pattern.type}`}>
                  <button
                    type="button"
                    onClick={() =>
                      onSelectSymbol?.(pattern.symbol, undefined, pattern.sid, pattern.trendline)
                    }
                    className="flex w-full items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-blue-50"
                    title={`Load ${pattern.name} chart`}
                  >
                    <span className={`shrink-0 ${breakout ? 'text-emerald-600' : 'text-red-500'}`}>
                      {breakout ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-semibold text-gray-900">{pattern.name}</span>
                      <span className="block truncate text-[10px] text-gray-400">
                        {pattern.symbol} · Trendline {breakout ? 'Breakout' : 'Breakdown'}
                      </span>
                    </span>
                    <span
                      className={`shrink-0 text-[11px] font-semibold tabular-nums ${
                        breakout ? 'text-emerald-700' : 'text-red-600'
                      }`}
                    >
                      {formatPrice(pattern.price)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default TrendlinePatterns;
