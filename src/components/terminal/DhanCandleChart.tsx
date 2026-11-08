'use client';

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import {
  createChart,
  CandlestickSeries,
  ColorType,
  type IChartApi,
  type ISeriesApi,
  type CandlestickData,
  type Time,
  type UTCTimestamp,
} from 'lightweight-charts';
import { ExternalLink, Loader2, Search } from 'lucide-react';
import { sortDedupeCandles } from '@/lib/chart-candles';
import { tradingViewChartUrl, buildTradingViewSymbol } from '@/lib/tradingview';
import { THEME_UI, type TerminalTheme } from './theme';
import { TerminalThemeSelect } from './TerminalThemeSelect';

export type ChartInterval = '5' | '15' | '60' | 'D';

interface DhanCandleChartProps {
  symbol: string;
  sid?: number;
  interval?: ChartInterval;
  className?: string;
  /** Terminal appearance applied to the chart. */
  theme?: TerminalTheme;
  /** Called when a new appearance is picked from the header dropdown. */
  onThemeChange?: (theme: TerminalTheme) => void;
  /** Called when the user submits a new symbol from the header search box. */
  onSymbolChange?: (symbol: string) => void;
}

/** lightweight-charts palettes for each terminal appearance. */
const CHART_PALETTE: Record<
  TerminalTheme,
  { background: string; textColor: string; grid: string; border: string; up: string; down: string }
> = {
  dark: {
    background: '#0b0e14',
    textColor: '#9ca3af',
    grid: 'rgba(42, 46, 57, 0.45)',
    border: '#27272a',
    up: '#22c55e',
    down: '#ef4444',
  },
  light: {
    background: '#ffffff',
    textColor: '#525252',
    grid: 'rgba(226, 232, 240, 0.6)',
    border: '#e4e4e7',
    up: '#16a34a',
    down: '#dc2626',
  },
  /** VS Code Dark+ (C++): editor bg, muted labels, types teal up, error red down. */
  vscode: {
    background: '#1e1e1e',
    textColor: '#a8a8a8',
    grid: 'rgba(128, 128, 128, 0.22)',
    border: '#3c3c3c',
    up: '#4ec9b0',
    down: '#f14c4c',
  },
};

const INTERVAL_LABELS: Record<ChartInterval, string> = {
  '5': '5m',
  '15': '15m',
  '60': '1h',
  D: '1D',
};

// Only show daily (1D) candles for now.
const AVAILABLE_INTERVALS: ChartInterval[] = ['D'];

/** Default viewport: ~8 months of NSE sessions (API still loads ~10Y). */
const DEFAULT_VISIBLE_DAILY_BARS = 170;

function applyInitialDailyViewport(chart: IChartApi, barCount: number) {
  if (barCount <= 0) return;
  const visible = Math.min(barCount, DEFAULT_VISIBLE_DAILY_BARS);
  chart.timeScale().setVisibleLogicalRange({
    from: barCount - visible,
    to: barCount - 0.5,
  });
}

export function DhanCandleChart({
  symbol,
  sid,
  interval: initialInterval = 'D',
  className = '',
  theme = 'dark',
  onThemeChange,
  onSymbolChange,
}: DhanCandleChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const [timeframe, setTimeframe] = useState<ChartInterval>(initialInterval);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastPrice, setLastPrice] = useState<number | null>(null);
  const [query, setQuery] = useState(symbol);
  const [menuOpen, setMenuOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{ sym: string; name: string; sid?: number }>>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<number | null>(null);
  const resetViewportRef = useRef(true);
  const ui = THEME_UI[theme];

  // Keep the search box in sync when the symbol changes externally
  // (e.g. a stock clicked in Traders Desk / scan results).
  useEffect(() => {
    setQuery(symbol);
  }, [symbol]);

  // Close the suggestion dropdown on outside click.
  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [menuOpen]);

  // Debounced symbol lookup — TradingView-style suggestions.
  const fetchSuggestions = useCallback((q: string) => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/symbol-search?q=${encodeURIComponent(q)}`, {
          cache: 'no-store',
        });
        const json = await res.json();
        setSuggestions(json?.success ? json.matches ?? [] : []);
      } catch {
        setSuggestions([]);
      }
    }, 120);
  }, []);

  const handleQueryChange = (value: string) => {
    const next = value.toUpperCase();
    setQuery(next);
    setMenuOpen(true);
    const q = next.trim().replace(/^NSE:/, '');
    if (q) fetchSuggestions(q);
    else setSuggestions([]);
  };

  const loadSymbol = (value: string) => {
    const ticker = value.trim().toUpperCase().replace(/^NSE:/, '');
    if (!ticker) return;
    setQuery(ticker);
    setMenuOpen(false);
    onSymbolChange?.(ticker);
  };

  const handleSymbolSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loadSymbol(query);
  };

  useEffect(() => {
    resetViewportRef.current = true;
  }, [symbol, sid, timeframe]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        symbol,
        interval: timeframe,
      });
      if (sid) params.set('sid', String(sid));
      const res = await fetch(`/api/chart-ohlc?${params.toString()}`, { cache: 'no-store' });
      const json = await res.json();
      if (!json.success || !Array.isArray(json.candles)) {
        throw new Error(json.error || 'No candle data');
      }
      if (json.candles.length === 0) {
        throw new Error('No candles for this interval (market may be closed). Try 1D.');
      }

      const data: CandlestickData<Time>[] = sortDedupeCandles(json.candles).map(
        (c: { time: number; open: number; high: number; low: number; close: number }) => ({
          time: c.time as UTCTimestamp,
          open: c.open,
          high: c.high,
          low: c.low,
          close: c.close,
        }),
      );

      try {
        seriesRef.current?.setData(data);
      } catch (e) {
        throw new Error(e instanceof Error ? e.message : 'Invalid candle series');
      }
      if (chartRef.current) {
        if (timeframe === 'D' && resetViewportRef.current) {
          applyInitialDailyViewport(chartRef.current, data.length);
          resetViewportRef.current = false;
        } else if (timeframe !== 'D') {
          chartRef.current.timeScale().fitContent();
        }
      }
      const last = json.candles[json.candles.length - 1];
      setLastPrice(last.close);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load chart');
      seriesRef.current?.setData([]);
    } finally {
      setLoading(false);
    }
  }, [symbol, sid, timeframe]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const palette = CHART_PALETTE[theme];

    const chart = createChart(el, {
      layout: {
        background: { type: ColorType.Solid, color: palette.background },
        textColor: palette.textColor,
      },
      grid: {
        vertLines: { color: palette.grid },
        horzLines: { color: palette.grid },
      },
      rightPriceScale: { borderColor: palette.border },
      timeScale: {
        borderColor: palette.border,
        timeVisible: true,
        secondsVisible: false,
        barSpacing: 7,
        rightOffset: 6,
      },
      handleScroll: { mouseWheel: true, pressedMouseMove: true, horzTouchDrag: true },
      handleScale: { axisPressedMouseMove: true, mouseWheel: true, pinch: true },
      crosshair: { mode: 1 },
      autoSize: true,
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: palette.up,
      downColor: palette.down,
      borderUpColor: palette.up,
      borderDownColor: palette.down,
      wickUpColor: palette.up,
      wickDownColor: palette.down,
    });

    chartRef.current = chart;
    seriesRef.current = series;

    const ro = new ResizeObserver(() => chart.applyOptions({ width: el.clientWidth, height: el.clientHeight }));
    ro.observe(el);

    return () => {
      ro.disconnect();
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, []);

  // Re-apply chart colors when the terminal appearance changes (keeps data/zoom).
  useEffect(() => {
    const palette = CHART_PALETTE[theme];
    chartRef.current?.applyOptions({
      layout: {
        background: { type: ColorType.Solid, color: palette.background },
        textColor: palette.textColor,
      },
      grid: {
        vertLines: { color: palette.grid },
        horzLines: { color: palette.grid },
      },
      rightPriceScale: { borderColor: palette.border },
      timeScale: { borderColor: palette.border },
    });
    seriesRef.current?.applyOptions({
      upColor: palette.up,
      downColor: palette.down,
      borderUpColor: palette.up,
      borderDownColor: palette.down,
      wickUpColor: palette.up,
      wickDownColor: palette.down,
    });
  }, [theme]);

  useEffect(() => {
    loadData();
    const poll = window.setInterval(() => {
      if (!document.hidden) loadData();
    }, 60_000);
    return () => window.clearInterval(poll);
  }, [loadData]);

  const tvSym = buildTradingViewSymbol(symbol);

  return (
    <div className={`flex h-full min-h-0 flex-col ${className}`}>
      <div
        className={`flex shrink-0 items-center justify-between gap-2 border-b px-2 py-1 ${ui.panel} ${ui.border}`}
      >
        <form onSubmit={handleSymbolSearch} className="flex min-w-0 flex-1 items-center gap-2">
          <div ref={searchRef} className="relative min-w-0 flex-1">
            <div
              className={`flex items-center gap-1.5 rounded-md border px-2 py-1 transition-colors ${ui.border} ${ui.inputBg}`}
            >
              <Search className={`h-3.5 w-3.5 shrink-0 ${ui.textFaint}`} />
              <span className={`shrink-0 text-[10px] font-semibold ${ui.textFaint}`}>NSE:</span>
              <input
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                onFocus={(e) => {
                  setMenuOpen(true);
                  e.target.select();
                }}
                placeholder="Search stock…"
                spellCheck={false}
                autoCapitalize="characters"
                autoComplete="off"
                aria-label="Search stock symbol"
                className={`min-w-0 flex-1 bg-transparent text-xs font-semibold outline-none ${ui.textStrong} ${ui.inputPlaceholder}`}
              />
            </div>

            {menuOpen && (
              <div
                className={`absolute left-0 right-0 top-full z-20 mt-1 max-h-72 overflow-y-auto rounded-md border shadow-lg ${ui.panelSub} ${ui.border}`}
              >
                {suggestions.length === 0 ? (
                  <div className={`px-3 py-2 text-[11px] ${ui.textMuted}`}>
                    Type to search NSE stocks…
                  </div>
                ) : (
                  suggestions.map((s) => (
                    <button
                      key={s.sym}
                      type="button"
                      onClick={() => loadSymbol(s.sym)}
                      className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs ${ui.hoverRow}`}
                    >
                      <span className={`shrink-0 font-semibold ${ui.textStrong}`}>{s.sym}</span>
                      <span className={`min-w-0 flex-1 truncate ${ui.textMuted}`}>{s.name}</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
          {lastPrice != null && (
            <span className={`shrink-0 text-xs tabular-nums ${ui.accentText}`}>
              {lastPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </span>
          )}
        </form>
        <div className="flex items-center gap-1">
          {AVAILABLE_INTERVALS.map((iv) => (
            <button
              key={iv}
              type="button"
              onClick={() => setTimeframe(iv)}
              className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
                timeframe === iv ? ui.btnActive : ui.btnIdle
              }`}
            >
              {INTERVAL_LABELS[iv]}
            </button>
          ))}
          <a
            href={tradingViewChartUrl(tvSym, timeframe === 'D' ? 'D' : timeframe)}
            target="_blank"
            rel="noopener noreferrer"
            className={`ml-1 inline-flex items-center gap-0.5 rounded border px-1.5 py-0.5 text-[10px] ${ui.btnOutline}`}
            title="Optional: open TradingView in new tab"
          >
            TV
            <ExternalLink className="h-2.5 w-2.5" />
          </a>
          {onThemeChange && <TerminalThemeSelect theme={theme} onChange={onThemeChange} />}
        </div>
      </div>

      <div className="relative min-h-0 flex-1">
        {loading && (
          <div
            className={`absolute inset-0 z-10 flex items-center justify-center ${ui.overlay}`}
          >
            <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
          </div>
        )}
        {error && !loading && (
          <div
            className={`absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 px-4 text-center ${ui.panelBg}`}
          >
            <p className={`text-xs ${ui.textMuted}`}>{error}</p>
            <button
              type="button"
              onClick={() => (timeframe !== 'D' ? setTimeframe('D') : loadData())}
              className={`text-xs font-semibold hover:underline ${ui.accentText}`}
            >
              {timeframe !== 'D' ? 'Switch to daily (1D)' : 'Retry'}
            </button>
          </div>
        )}
        <div ref={containerRef} className="h-full w-full" />
      </div>
      <p
        className={`shrink-0 border-t px-2 py-0.5 text-[9px] ${ui.borderSoft} ${ui.textFaint}`}
      >
        ~10Y daily data · starts zoomed ~8M · scroll or pinch to explore · Dhan · IST
      </p>
    </div>
  );
}
