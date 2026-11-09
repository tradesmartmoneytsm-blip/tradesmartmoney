'use client';

/**
 * Live Scanner — DEXT-style live market scanner
 * Data source: /api/live-scanner (Dhan ScanX via customscan/fetchdt)
 * Scans: Day High/Low, Weekly/Monthly/52-Week High/Low, Upper/Lower Circuit
 * Scope: All Stocks or F&O only
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SCANNER_BASKET_OPTIONS } from '@/lib/scanner-basket';
import { Loader2, RefreshCw, TrendingUp, TrendingDown, ExternalLink, AlertCircle, Radio } from 'lucide-react';

interface NormalizedStock {
  symbol: string;
  name: string;
  seoSymbol: string;
  sid?: number;
  ltp: number;
  open: number | null;
  high: number | null;
  low: number | null;
  prevClose: number | null;
  change: number | null;
  changePercent: number | null;
  volume: number;
  marketCap: number | null;
  upperCircuit: boolean;
  lowerCircuit: boolean;
  week52High: number | null;
  week52Low: number | null;
}

interface ScanResult {
  scan: string;
  label: string;
  total: number;
  asOf: string | null;
  rows: NormalizedStock[];
  error?: string;
}

interface LiveScannerPayload {
  success: boolean;
  scope: 'all' | 'fno';
  asOf: string | null;
  scans: Record<string, ScanResult>;
  timestamp: string;
  error?: string;
}

const SCAN_TABS = [
  { key: 'dayHigh', label: 'Day High', tone: 'up' },
  { key: 'dayLow', label: 'Day Low', tone: 'down' },
  { key: 'weekHigh', label: 'Weekly High', tone: 'up' },
  { key: 'weekLow', label: 'Weekly Low', tone: 'down' },
  { key: 'monthHigh', label: 'Monthly High', tone: 'up' },
  { key: 'monthLow', label: 'Monthly Low', tone: 'down' },
  { key: 'yearHigh', label: '52W High', tone: 'up' },
  { key: 'yearLow', label: '52W Low', tone: 'down' },
  { key: 'upperCircuit', label: 'Upper Circuit', tone: 'up' },
  { key: 'lowerCircuit', label: 'Lower Circuit', tone: 'down' },
] as const;

type ScanKey = (typeof SCAN_TABS)[number]['key'];
type Scope = 'all' | 'fno';

const POLL_INTERVAL_MS = 15000;

function formatNumber(value: number | null, decimals = 2): string {
  if (value === null || !Number.isFinite(value)) return '—';
  return value.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// Indian market volume formatting: K / L (lakh) / Cr
function formatVolume(volume: number): string {
  if (!Number.isFinite(volume) || volume <= 0) return '—';
  if (volume >= 1_00_00_000) return `${(volume / 1_00_00_000).toFixed(2)} Cr`;
  if (volume >= 1_00_000) return `${(volume / 1_00_000).toFixed(2)} L`;
  if (volume >= 1_000) return `${(volume / 1_000).toFixed(1)} K`;
  return String(Math.round(volume));
}

function formatMarketCap(mcap: number | null): string {
  if (mcap === null || !Number.isFinite(mcap) || mcap <= 0) return '—';
  if (mcap >= 100000) return `₹${(mcap / 100000).toFixed(2)}L Cr`;
  return `₹${mcap.toLocaleString('en-IN', { maximumFractionDigits: 0 })} Cr`;
}

function ChangePill({ value }: { value: number | null }) {
  if (value === null || !Number.isFinite(value)) return <span className="text-gray-400">—</span>;
  const positive = value >= 0;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold tabular-nums ${
        positive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
      }`}
    >
      {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {positive ? '+' : ''}{value.toFixed(2)}%
    </span>
  );
}

export interface LiveScannerProps {
  appearance?: 'light' | 'terminal';
  compact?: boolean;
  onSelectSymbol?: (symbol: string, seoSymbol?: string, sid?: number) => void;
  className?: string;
}

export function LiveScanner({
  appearance = 'light',
  compact = false,
  onSelectSymbol,
  className = '',
}: LiveScannerProps = {}) {
  const isTerminal = appearance === 'terminal';
  const [activeScan, setActiveScan] = useState<ScanKey>('dayHigh');
  const [scope, setScope] = useState<Scope>('all');
  const [universe, setUniverse] = useState('nifty-500');
  const [data, setData] = useState<LiveScannerPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [secondsToRefresh, setSecondsToRefresh] = useState(POLL_INTERVAL_MS / 1000);
  const [sortBy, setSortBy] = useState<'changePercent' | 'ltp' | 'volume' | 'marketCap'>('changePercent');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const scopeRef = useRef(scope);
  scopeRef.current = scope;
  const universeRef = useRef(universe);
  universeRef.current = universe;

  const fetchScanner = useCallback(async (showSpinner: boolean) => {
    if (showSpinner) setIsRefreshing(true);
    try {
      const response = await fetch(
        `/api/live-scanner?universe=${encodeURIComponent(universeRef.current)}&count=50`,
        {
        cache: 'no-store',
        },
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      const payload = await response.json() as LiveScannerPayload;
      if (!payload.success) throw new Error(payload.error || 'Scanner failed');
      setData(payload);
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch live scanner');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setSecondsToRefresh(POLL_INTERVAL_MS / 1000);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchScanner(false);
  }, [fetchScanner]);

  // Poll every 15s, pause when tab hidden
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.hidden) return;
      fetchScanner(false);
    }, POLL_INTERVAL_MS);

    const tick = setInterval(() => {
      setSecondsToRefresh((s) => (s <= 1 ? POLL_INTERVAL_MS / 1000 : s - 1));
    }, 1000);

    const onVisibility = () => {
      if (!document.hidden) fetchScanner(false);
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      clearInterval(interval);
      clearInterval(tick);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [fetchScanner]);

  const handleUniverseChange = (next: string) => {
    if (next === universe) return;
    setUniverse(next);
    setIsLoading(true);
    universeRef.current = next;
    const nextScope: Scope = next === 'fno' ? 'fno' : 'all';
    setScope(nextScope);
    scopeRef.current = nextScope;
    fetchScanner(false);
  };

  // Legacy scope toggle (F&O vs all market) — maps to universe ids.
  const handleScopeChange = (next: Scope) => {
    if (next === scope) return;
    const mapped = next === 'fno' ? 'fno' : universe === 'fno' ? 'nifty-500' : universe;
    handleUniverseChange(mapped);
  };

  const activeResult: ScanResult | undefined = data?.scans?.[activeScan];
  const activeTab = SCAN_TABS.find((t) => t.key === activeScan)!;

  const sortedRows = useMemo(() => {
    const rows = [...(activeResult?.rows || [])];
    rows.sort((a, b) => {
      const av = a[sortBy] ?? (sortBy === 'volume' ? 0 : -Infinity);
      const bv = b[sortBy] ?? (sortBy === 'volume' ? 0 : -Infinity);
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'desc' ? bv - av : av - bv;
      }
      return 0;
    });
    return rows;
  }, [activeResult, sortBy, sortDir]);

  const handleSort = (key: typeof sortBy) => {
    if (key === sortBy) {
      setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortBy(key);
      setSortDir('desc');
    }
  };

  const openChart = (stock: NormalizedStock) => {
    const symbol = stock.symbol || stock.seoSymbol;
    if (!symbol) return;
    window.open(
      `https://www.tradingview.com/chart/?symbol=NSE:${symbol}&interval=5`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const isError = Boolean(error) || (data && !Object.values(data.scans).some((s) => s.rows.length || !s.error));
  const failedScans = data ? Object.values(data.scans).filter((s) => s.error).length : 0;

  return (
    <section
      className={`overflow-hidden ${
        isTerminal
          ? 'rounded-lg border border-zinc-700 bg-zinc-900 shadow-none'
          : 'rounded-2xl border border-gray-200 bg-white shadow-lg'
      } ${className}`}
      aria-label="Live Market Scanner"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
          </span>
          <h2 className="flex items-center gap-1.5 text-sm font-bold tracking-wide text-white">
            <Radio className="h-4 w-4 text-red-400" />
            LIVE SCANNER
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={universe}
            onChange={(e) => handleUniverseChange(e.target.value)}
            className="rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-xs font-semibold text-white"
            aria-label="Index universe"
          >
            {SCANNER_BASKET_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id} className="text-gray-900">
                {opt.label}
              </option>
            ))}
          </select>
          {/* Scope toggle */}
          <div className="flex rounded-lg bg-white/10 p-0.5" role="group" aria-label="Scanner scope">
            <button
              onClick={() => handleScopeChange('all')}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                scope === 'all' ? 'bg-white text-slate-900' : 'text-white/70 hover:text-white'
              }`}
            >
              All Stocks
            </button>
            <button
              onClick={() => handleScopeChange('fno')}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                scope === 'fno' ? 'bg-white text-slate-900' : 'text-white/70 hover:text-white'
              }`}
            >
              F&O
            </button>
          </div>

          <button
            onClick={() => fetchScanner(true)}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-white/20 disabled:opacity-50"
            aria-label="Refresh scanner"
          >
            {isRefreshing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
            Refresh
          </button>
        </div>
      </div>

      {/* Scan tabs */}
      <div
        className={`flex gap-1 overflow-x-auto border-b px-2 py-2 ${
          isTerminal ? 'border-zinc-800 bg-zinc-950' : 'border-gray-100 bg-gray-50'
        }`}
        role="tablist"
        aria-label="Scan categories"
      >
        {SCAN_TABS.map((tab) => {
          const result = data?.scans?.[tab.key];
          const count = result?.total ?? 0;
          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={activeScan === tab.key}
              onClick={() => setActiveScan(tab.key)}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                activeScan === tab.key
                  ? tab.tone === 'up'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-red-600 text-white shadow-sm'
                  : isTerminal
                    ? 'border border-zinc-700 bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {tab.tone === 'up' ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {tab.label}
              <span
                className={`rounded-full px-1.5 text-[10px] tabular-nums ${
                  activeScan === tab.key ? 'bg-white/25' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Body */}
      <div className={compact ? 'min-h-[200px]' : 'min-h-[300px]'}>
        {isLoading ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3 text-gray-500">
            <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
            <p className="text-sm">Scanning live market…</p>
          </div>
        ) : isError ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3 px-6 text-center">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <p className="text-sm font-semibold text-gray-800">Live scanner unavailable</p>
            <p className="max-w-md text-xs text-gray-500">{error || 'No scan data returned. The upstream feed may be temporarily down — try refreshing.'}</p>
            <button
              onClick={() => fetchScanner(true)}
              className="mt-1 flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Retry
            </button>
          </div>
        ) : (
          <>
            {failedScans > 0 && (
              <div className="flex items-center gap-2 border-b border-amber-100 bg-amber-50 px-4 py-1.5 text-xs text-amber-700">
                <AlertCircle className="h-3.5 w-3.5" />
                {failedScans} of {Object.keys(data!.scans).length} scans failed upstream; those tabs may be empty.
              </div>
            )}

            {/* Table */}
            <div className={`overflow-auto ${compact ? 'max-h-[360px]' : 'max-h-[560px]'}`}>
              <table className={`w-full text-left ${compact ? 'text-xs' : 'text-sm'}`}>
                <thead
                  className={`sticky top-0 z-10 text-xs uppercase tracking-wide ${
                    isTerminal ? 'bg-zinc-950 text-zinc-500' : 'bg-gray-50 text-gray-500'
                  }`}
                >
                  <tr>
                    <th className="px-4 py-2.5 font-semibold">#</th>
                    <th className="px-3 py-2.5 font-semibold">Stock</th>
                    <th
                      className="cursor-pointer px-3 py-2.5 font-semibold hover:text-gray-800"
                      onClick={() => handleSort('ltp')}
                    >
                      LTP {sortBy === 'ltp' && (sortDir === 'desc' ? '↓' : '↑')}
                    </th>
                    <th
                      className="cursor-pointer px-3 py-2.5 font-semibold hover:text-gray-800"
                      onClick={() => handleSort('changePercent')}
                    >
                      Chg% {sortBy === 'changePercent' && (sortDir === 'desc' ? '↓' : '↑')}
                    </th>
                    <th
                      className="hidden cursor-pointer px-3 py-2.5 font-semibold hover:text-gray-800 sm:table-cell"
                      onClick={() => handleSort('volume')}
                    >
                      Volume {sortBy === 'volume' && (sortDir === 'desc' ? '↓' : '↑')}
                    </th>
                    {!compact && (
                      <th
                        className="hidden cursor-pointer px-3 py-2.5 font-semibold hover:text-gray-800 lg:table-cell"
                        onClick={() => handleSort('marketCap')}
                      >
                        Mkt Cap {sortBy === 'marketCap' && (sortDir === 'desc' ? '↓' : '↑')}
                      </th>
                    )}
                    <th className="px-3 py-2.5 font-semibold">Chart</th>
                  </tr>
                </thead>
                <tbody className={isTerminal ? 'divide-y divide-zinc-800' : 'divide-y divide-gray-50'}>
                  {sortedRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={compact ? 6 : 7}
                        className={`px-4 py-10 text-center text-sm ${isTerminal ? 'text-zinc-500' : 'text-gray-400'}`}
                      >
                        {activeResult?.error
                          ? `Scan failed: ${activeResult.error}`
                          : 'No stocks match this scan right now.'}
                      </td>
                    </tr>
                  ) : (
                    sortedRows.map((stock, idx) => (
                      <tr
                        key={stock.symbol || idx}
                        className={`transition-colors ${
                          isTerminal ? 'hover:bg-zinc-800/80' : 'hover:bg-blue-50/50'
                        } ${onSelectSymbol ? 'cursor-pointer' : ''}`}
                        onClick={
                          onSelectSymbol && stock.symbol
                            ? () => onSelectSymbol(stock.symbol, stock.seoSymbol, stock.sid)
                            : undefined
                        }
                      >
                        <td className={`px-4 py-2 text-xs tabular-nums ${isTerminal ? 'text-zinc-600' : 'text-gray-400'}`}>
                          {idx + 1}
                        </td>
                        <td className="px-3 py-2">
                          <div className={`font-semibold ${isTerminal ? 'text-zinc-100' : 'text-gray-900'}`}>{stock.name}</div>
                          <div className={`text-xs ${isTerminal ? 'text-zinc-500' : 'text-gray-400'}`}>
                            {stock.symbol}
                            {!compact && stock.marketCap ? ` · ${formatMarketCap(stock.marketCap)}` : ''}
                          </div>
                        </td>
                        <td className={`px-3 py-2 font-medium tabular-nums ${isTerminal ? 'text-zinc-100' : 'text-gray-900'}`}>
                          {formatNumber(stock.ltp)}
                        </td>
                        <td className="px-3 py-2">
                          <ChangePill value={stock.changePercent} />
                        </td>
                        <td className="hidden px-3 py-2 tabular-nums text-gray-600 sm:table-cell">
                          {formatVolume(stock.volume)}
                        </td>
                        {!compact && (
                          <td className="hidden px-3 py-2 tabular-nums text-gray-600 lg:table-cell">
                            {formatMarketCap(stock.marketCap)}
                          </td>
                        )}
                        <td className="px-3 py-2">
                          <button
                            onClick={() => openChart(stock)}
                            className="flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-blue-100 hover:text-blue-700"
                            aria-label={`Open ${stock.name} 5-minute chart on TradingView`}
                          >
                            <ExternalLink className="h-3 w-3" />
                            5m
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Circuit-semantics note: Dhan's circuit flag = upper/lower price band
          hit or broken. For non-F&O stocks that is a frozen circuit; for F&O
          stocks (dynamic bands that flex on breach) it is a band break — price
          traded through, no freeze. */}
      {(activeTab.key === 'upperCircuit' || activeTab.key === 'lowerCircuit') && (
        <div className="border-t border-amber-100 bg-amber-50 px-4 py-2 text-xs text-amber-800">
          <strong>How to read this:</strong> these stocks hit or broke their
          exchange price band this session. In non-F&O names that is a frozen
          circuit (buyers/sellers locked); in F&O names the dynamic band flexes
          on breach, so the stock traded through the band — a band break, not a
          freeze. The feed keeps the flag after the stock comes off the band.
        </div>
      )}

      {/* Footer */}
      <div
        className={`flex flex-wrap items-center justify-between gap-2 border-t px-4 py-2 text-xs ${
          isTerminal ? 'border-zinc-800 bg-zinc-950 text-zinc-500' : 'border-gray-100 bg-gray-50 text-gray-500'
        }`}
      >
        <span>
          {activeResult?.total ?? 0} stocks in <span className="font-semibold text-gray-700">{activeTab.label}</span>
          {scope === 'fno' && ' (F&O only)'}
        </span>
        <span className="flex items-center gap-2">
          {data?.asOf && <span className="tabular-nums">Feed: {data.asOf}</span>}
          {lastUpdated && (
            <>
              <span>·</span>
              <span>Updated {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            </>
          )}
          <span>·</span>
          <span className="tabular-nums">Next refresh in {secondsToRefresh}s</span>
        </span>
      </div>
    </section>
  );
}
