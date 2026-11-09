'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown, Loader2, RefreshCw, TrendingDown, TrendingUp } from 'lucide-react';
import type { ScanResult } from '@/lib/dhan-scanx';
import { SCANNER_BASKET_OPTIONS } from '@/lib/scanner-basket';

const SCAN_CHIPS = [
  { key: 'dayHigh', label: 'Day High', tone: 'up' as const },
  { key: 'dayLow', label: 'Day Low', tone: 'down' as const },
  { key: 'weekHigh', label: 'Week High', tone: 'up' as const },
  { key: 'weekLow', label: 'Week Low', tone: 'down' as const },
  { key: 'monthHigh', label: 'Month High', tone: 'up' as const },
  { key: 'monthLow', label: 'Month Low', tone: 'down' as const },
  { key: 'yearHigh', label: '52W High', tone: 'up' as const },
  { key: 'yearLow', label: '52W Low', tone: 'down' as const },
  { key: 'upperCircuit', label: 'Upper Cir', tone: 'up' as const },
  { key: 'lowerCircuit', label: 'Lower Cir', tone: 'down' as const },
];

type ScanKey = (typeof SCAN_CHIPS)[number]['key'];

const POLL_MS = 15000;
const ROW_LIMIT = 40;

interface TerminalLiveScannerProps {
  selectedSymbol?: string;
  onSelectSymbol?: (symbol: string, seoSymbol?: string, sid?: number) => void;
}

/** DEXT-style live scanner for the terminal right rail (single scan + index universe). */
export function TerminalLiveScanner({ selectedSymbol, onSelectSymbol }: TerminalLiveScannerProps) {
  const [activeScan, setActiveScan] = useState<ScanKey>('dayHigh');
  const [universe, setUniverse] = useState('nifty-500');
  const [scan, setScan] = useState<ScanResult | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchRef = useRef(0);

  const fetchScanner = useCallback(
    async (opts?: { silent?: boolean }) => {
      const id = ++fetchRef.current;
      if (!opts?.silent) setLoading(true);
      try {
        const params = new URLSearchParams({
          scan: activeScan,
          universe,
          count: String(ROW_LIMIT),
        });
        const res = await fetch(`/api/live-scanner?${params}`, { cache: 'no-store' });
        const json = await res.json();
        if (id !== fetchRef.current) return;
        if (!json?.success) throw new Error(json?.error || 'Scanner failed');
        const next = json.scan as ScanResult;
        setScan(next);
        setCounts((prev) => ({ ...prev, [activeScan]: next.total }));
        setError(null);
      } catch (e) {
        if (id !== fetchRef.current) return;
        setError(e instanceof Error ? e.message : 'Failed to load scanner');
      } finally {
        if (id === fetchRef.current) setLoading(false);
      }
    },
    [activeScan, universe],
  );

  useEffect(() => {
    fetchScanner();
  }, [fetchScanner]);

  useEffect(() => {
    const id = setInterval(() => {
      if (!document.hidden) fetchScanner({ silent: true });
    }, POLL_MS);
    return () => clearInterval(id);
  }, [fetchScanner]);

  const universeLabel = SCANNER_BASKET_OPTIONS.find((o) => o.id === universe)?.label ?? universe;
  const selectClass =
    'w-full min-w-0 cursor-pointer appearance-none truncate rounded border border-gray-200 bg-gray-50 px-2 py-1 pr-7 text-[10px] font-semibold text-gray-800 focus:border-blue-400 focus:outline-none';

  return (
    <div className="flex h-full min-h-0 flex-col bg-white text-gray-900">
      <div className="flex shrink-0 items-center gap-1 border-b border-gray-100 px-1.5 py-1.5">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
        </span>
        <div className="relative min-w-0 flex-1">
          <select
            aria-label="Scanner universe"
            className={selectClass}
            value={universe}
            onChange={(e) => setUniverse(e.target.value)}
          >
            {SCANNER_BASKET_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
        </div>
        <button
          type="button"
          title="Refresh"
          aria-label="Refresh live scanner"
          disabled={refreshing}
          onClick={async () => {
            setRefreshing(true);
            try {
              await fetchScanner();
            } finally {
              setRefreshing(false);
            }
          }}
          className="shrink-0 rounded border border-gray-200 p-1 text-gray-500 hover:text-blue-600 disabled:opacity-50"
        >
          {refreshing ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
        </button>
      </div>

      <div
        className="flex shrink-0 gap-1 overflow-x-auto border-b border-gray-100 bg-slate-50/90 px-1.5 py-1.5"
        role="tablist"
        aria-label="Live scan type"
      >
        {SCAN_CHIPS.map((chip) => {
          const active = activeScan === chip.key;
          const total = counts[chip.key];
          return (
            <button
              key={chip.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveScan(chip.key)}
              className={`flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold ${
                active
                  ? chip.tone === 'up'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-red-600 text-white'
                  : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {chip.label}
              {typeof total === 'number' && (
                <span
                  className={`rounded-full px-1 text-[9px] tabular-nums ${
                    active ? 'bg-white/25' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {total}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-gray-100 px-2 py-0.5 text-[10px] text-gray-400">
        <span className="truncate">
          Live scan · {scan?.label ?? activeScan} · {universeLabel}
        </span>
        <span className="shrink-0 tabular-nums">{scan?.asOf ?? ''}</span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        {loading && !scan?.rows?.length && (
          <p className="flex items-center justify-center gap-2 p-6 text-xs text-gray-400">
            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
            Scanning live market…
          </p>
        )}
        {error && !scan?.rows?.length && (
          <p className="p-4 text-center text-xs text-red-500">{error}</p>
        )}
        {scan?.error && (
          <p className="border-b border-amber-100 bg-amber-50 px-2 py-1 text-[10px] text-amber-800">
            {scan.error}
          </p>
        )}
        {(scan?.rows ?? []).map((row) => {
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
              <span className="min-w-0 flex-1 truncate">
                <span className="block truncate font-semibold text-gray-900">{row.symbol}</span>
                <span className="block truncate text-[10px] text-gray-400">{row.name}</span>
              </span>
              <span className="shrink-0 tabular-nums text-[11px] text-gray-700">
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
        {!loading && !error && (scan?.rows?.length ?? 0) === 0 && (
          <p className="p-4 text-center text-xs text-gray-400">
            No stocks in this scan right now (market may be closed).
          </p>
        )}
      </div>
    </div>
  );
}
