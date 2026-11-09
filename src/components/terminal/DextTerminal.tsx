'use client';

import { useCallback, useEffect, useState } from 'react';
import { TerminalTopBar } from './TerminalTopBar';
import { DhanCandleChart } from './DhanCandleChart';
import { TerminalRightRail } from './TerminalRightRail';
import { TerminalBottomDock } from './TerminalBottomDock';
import {
  persistTerminalTheme,
  readStoredTerminalTheme,
  type TerminalTheme,
} from './theme';
import type { TrendlineOverlay } from '@/lib/trendline-patterns';

interface DextTerminalProps {
  /**
   * When true, the terminal renders inside the page content area (below the
   * site Navigation) instead of taking over the whole viewport as a
   * fixed full-screen overlay.
   */
  embedded?: boolean;
  /**
   * Externally selected symbol (e.g. clicked in the Market Outlook sector
   * list). When it changes, the chart loads this symbol.
   */
  selectedSymbol?: string;
}

/**
 * Terminal shell. The appearance dropdown only restyles the chart panel —
 * the surrounding chrome (rails, dock, top bar) stays dark.
 */
export function DextTerminal({ embedded = false, selectedSymbol }: DextTerminalProps) {
  const [chartSymbol, setChartSymbol] = useState(selectedSymbol ?? 'RELIANCE');
  const [chartSid, setChartSid] = useState<number | undefined>(2885);
  const [patternOverlay, setPatternOverlay] = useState<TrendlineOverlay | undefined>();
  // Chart-only appearance theme (shell chrome is fixed dark).
  const [theme, setTheme] = useState<TerminalTheme>('light');

  useEffect(() => {
    setTheme(readStoredTerminalTheme());
  }, []);

  const changeTheme = useCallback((next: TerminalTheme) => {
    setTheme(next);
    persistTerminalTheme(next);
  }, []);

  // Sync an externally selected symbol (Market Outlook stock click) into the chart.
  useEffect(() => {
    if (!selectedSymbol) return;
    const ticker = selectedSymbol.replace(/^NSE:/, '').toUpperCase();
    setChartSymbol(ticker);
    setPatternOverlay(undefined);
    // Let the chart API resolve the security id for the new symbol.
    setChartSid(undefined);
  }, [selectedSymbol]);

  useEffect(() => {
    if (embedded) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('terminal-mode');
    return () => {
      document.body.style.overflow = prev;
      document.body.classList.remove('terminal-mode');
    };
  }, [embedded]);

  const selectSymbol = useCallback(
    (symbol: string, _seoSymbol?: string, sid?: number, trendline?: TrendlineOverlay) => {
      const ticker = symbol.replace(/^NSE:/, '').toUpperCase();
      setChartSymbol(ticker);
      setPatternOverlay(trendline);
      if (typeof sid === 'number') setChartSid(sid);
      else setChartSid(undefined);
    },
    [],
  );

  return (
    <div
      className={
        embedded
          ? 'relative flex h-[calc(100dvh-120px)] min-h-[560px] w-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white text-gray-900 shadow-xl'
          : 'fixed inset-0 z-[80] flex flex-col bg-white text-gray-900'
      }
    >
      {!embedded && <TerminalTopBar />}

      <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[minmax(0,1fr)_auto] gap-0 p-0 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:grid-rows-[minmax(0,1fr)_minmax(140px,180px)] lg:gap-2 lg:p-2 lg:pl-0">
        {/* Center — chart in its own card (appearance follows theme dropdown). */}
        <section className="flex min-h-0 flex-col overflow-hidden lg:rounded-lg lg:border lg:border-slate-200 lg:shadow-sm lg:ring-1 lg:ring-slate-200/70">
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1">
              <DhanCandleChart
                symbol={chartSymbol}
                sid={chartSid}
                interval="D"
                theme={theme}
                onThemeChange={changeTheme}
                patternOverlay={patternOverlay}
                onSymbolChange={(sym) => selectSymbol(sym)}
              />
            </div>
          </div>
        </section>

        {/* Right rail — separated card like Market Outlook / Live Activities */}
        <aside className="hidden min-h-0 lg:flex lg:flex-col lg:pr-2">
          <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-md ring-1 ring-blue-200/40">
            <TerminalRightRail
              onSelectSymbol={selectSymbol}
              selectedSymbol={chartSymbol}
            />
          </div>
        </aside>

        {/* Bottom dock spans chart + right rail on desktop */}
        <div className="hidden min-h-0 border-t border-gray-200 lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:block lg:border-t-0 lg:px-2 lg:pb-2 lg:pt-0">
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <TerminalBottomDock />
          </div>
        </div>

        {/* Mobile: stacked scanner + dock */}
        <div className="flex min-h-0 flex-col border-t border-gray-200 lg:hidden">
          <div className="h-[42vh] min-h-[240px] border-b border-gray-200 p-2">
            <div className="h-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-md ring-1 ring-blue-200/40">
              <TerminalRightRail
                onSelectSymbol={selectSymbol}
                selectedSymbol={chartSymbol}
              />
            </div>
          </div>
          <div className="h-[140px] shrink-0">
            <TerminalBottomDock />
          </div>
        </div>
      </div>
    </div>
  );
}
