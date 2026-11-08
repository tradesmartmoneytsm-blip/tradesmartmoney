'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, RefreshCw, TrendingDown, TrendingUp } from 'lucide-react';
import {
  MOVER_BASKET_PRESETS,
  MOVER_SCAN_OPTIONS,
  type MoverBasketOption,
  type MoverScanId,
} from '@/lib/movers-filters';
import type { NormalizedStock } from '@/lib/dhan-scanx';

interface MoverRow {
  symbol: string;
  name: string;
  seoSymbol?: string;
  sid?: number;
  ltp: number;
  changePercent: number | null;
}

interface TerminalMoversProps {
  selectedSymbol?: string;
  onSelectSymbol?: (symbol: string, seoSymbol?: string, sid?: number) => void;
}

const ROW_COUNT = 25;

/**
 * Movers — compact DEXT-style filters (native selects so menus aren’t clipped
 * in the narrow right rail).
 */
export function TerminalMovers({ selectedSymbol, onSelectSymbol }: TerminalMoversProps) {
  const [scan, setScan] = useState<MoverScanId>('topGainers');
  const [basket, setBasket] = useState('nifty-500');
  const baskets: MoverBasketOption[] = MOVER_BASKET_PRESETS;
  const [rows, setRows] = useState<MoverRow[]>([]);
  const [asOf, setAsOf] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const fetchRef = useRef(0);

  const fetchMovers = useCallback(
    async (opts?: { silent?: boolean }) => {
      const id = ++fetchRef.current;
      if (!opts?.silent) setLoading(true);
      try {
        const params = new URLSearchParams({
          scan,
          basket,
          count: String(ROW_COUNT),
        });
        const res = await fetch(`/api/movers?${params}`, { cache: 'no-store' });
        const json = await res.json();
        if (id !== fetchRef.current) return;
        if (!json?.success || !Array.isArray(json.rows)) {
          throw new Error(json?.error || 'Movers unavailable');
        }
        setRows(
          json.rows.map((r: NormalizedStock) => ({
            symbol: r.symbol,
            name: r.name,
            seoSymbol: r.seoSymbol || undefined,
            sid: r.sid,
            ltp: r.ltp,
            changePercent: r.changePercent,
          })),
        );
        setAsOf(json.asOf ?? null);
        setError(null);
      } catch (e) {
        if (id !== fetchRef.current) return;
        setError(e instanceof Error ? e.message : 'Failed to load movers');
      } finally {
        if (id === fetchRef.current) setLoading(false);
      }
    },
    [scan, basket],
  );

  useEffect(() => {
    fetchMovers();
  }, [fetchMovers]);

  useEffect(() => {
    const id = setInterval(() => {
      if (!document.hidden) fetchMovers({ silent: true });
    }, 20000);
    return () => clearInterval(id);
  }, [fetchMovers]);

  const basketGroups = useMemo(() => {
    const groups = new Map<string, MoverBasketOption[]>();
    for (const b of baskets) {
      const list = groups.get(b.group) ?? [];
      list.push(b);
      groups.set(b.group, list);
    }
    const order = ['Universe', 'Benchmark', 'Broad', 'Cap', 'Sector', 'Custom'];
    return order
      .filter((g) => groups.has(g))
      .map((g) => [g, groups.get(g)!] as const);
  }, [baskets]);

  const scanLabel = MOVER_SCAN_OPTIONS.find((o) => o.id === scan)?.label ?? scan;
  const basketLabel = baskets.find((b) => b.id === basket)?.label ?? basket;

  const selectClass =
    'w-full min-w-0 cursor-pointer appearance-none truncate rounded border border-gray-200 bg-gray-50 px-2 py-1 pr-7 text-[10px] font-semibold text-gray-800 focus:border-blue-400 focus:outline-none';

  return (
    <div className="flex h-full min-h-0 flex-col bg-white text-gray-900">
      <div className="flex shrink-0 items-center gap-1 border-b border-gray-200 px-1.5 py-1.5">
        <div className="relative min-w-0 flex-1">
          <select
            aria-label="Movers scan"
            className={selectClass}
            value={scan}
            onChange={(e) => setScan(e.target.value as MoverScanId)}
          >
            {MOVER_SCAN_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
        </div>
        <div className="relative min-w-0 flex-1">
          <select
            aria-label="Index basket"
            className={selectClass}
            value={basket}
            onChange={(e) => setBasket(e.target.value)}
          >
            {basketGroups.map(([group, options]) => (
              <optgroup key={group} label={group}>
                {options.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
        </div>
        <button
          type="button"
          onClick={async () => {
            setRefreshing(true);
            try {
              await fetchMovers();
            } finally {
              setRefreshing(false);
            }
          }}
          disabled={refreshing}
          title="Refresh"
          aria-label="Refresh movers"
          className="shrink-0 rounded border border-gray-200 p-1 text-gray-500 hover:text-blue-600 disabled:opacity-50"
        >
          <RefreshCw className={`h-3 w-3 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-gray-100 px-2 py-0.5 text-[10px] text-gray-400">
        <span className="truncate">
          {scanLabel} · {basketLabel}
        </span>
        <span className="shrink-0 tabular-nums">{loading && rows.length ? '…' : asOf ? asOf : ''}</span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        {loading && rows.length === 0 && (
          <p className="p-4 text-center text-xs text-gray-400">Loading movers…</p>
        )}
        {!loading && error && rows.length === 0 && (
          <p className="p-4 text-center text-xs text-red-500">{error}</p>
        )}
        {!loading && !error && rows.length === 0 && (
          <p className="p-4 text-center text-xs text-gray-400">No stocks matched this filter.</p>
        )}
        {rows.map((row) => {
          const active = selectedSymbol === row.symbol;
          const positive = (row.changePercent ?? 0) >= 0;
          return (
            <button
              key={row.symbol}
              type="button"
              title={row.name}
              onClick={() => onSelectSymbol?.(row.symbol, row.seoSymbol, row.sid)}
              className={`flex w-full items-center gap-2 border-b border-gray-100 px-2 py-1.5 text-left text-xs hover:bg-blue-50 ${
                active ? 'bg-blue-50' : ''
              }`}
            >
              <span className="min-w-0 flex-1 truncate font-semibold text-gray-900">{row.symbol}</span>
              <span className="shrink-0 tabular-nums text-[11px] text-gray-600">
                {row.ltp.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </span>
              <span
                className={`flex w-[52px] shrink-0 items-center justify-end gap-0.5 tabular-nums text-[11px] font-semibold ${
                  positive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {row.changePercent != null ? (
                  <>
                    {positive ? '+' : ''}
                    {row.changePercent.toFixed(2)}%
                  </>
                ) : (
                  '—'
                )}
                {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
