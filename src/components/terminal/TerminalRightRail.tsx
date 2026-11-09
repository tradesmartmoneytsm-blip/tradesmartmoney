'use client';

import { useState } from 'react';
import { Newspaper, Radio, CandlestickChart, Zap } from 'lucide-react';
import { TerminalMovers } from './TerminalMovers';
import { TerminalNews } from './TerminalNews';
import { LiveActivities } from './LiveActivities';
import { TrendlinePatterns } from './TrendlinePatterns';
import type { TrendlineOverlay } from '@/lib/trendline-patterns';

type RightTab = 'news' | 'scanner' | 'movers' | 'patterns';

interface TerminalRightRailProps {
  onSelectSymbol?: (
    symbol: string,
    seoSymbol?: string,
    sid?: number,
    trendline?: TrendlineOverlay,
  ) => void;
  /** Currently charted symbol — highlights the matching movers row. */
  selectedSymbol?: string;
}

/**
 * Right rail — Movers / News / Live Scanner / Patterns.
 * Light chrome matching the site background, independent of the chart
 * appearance dropdown.
 */
export function TerminalRightRail({ onSelectSymbol, selectedSymbol }: TerminalRightRailProps) {
  const [tab, setTab] = useState<RightTab>('movers');

  const activeTab = 'border-b-2 border-blue-600 text-blue-700';
  const inactiveTab = 'text-gray-500 hover:text-gray-700';

  return (
    <div className="flex h-full flex-col bg-white text-gray-900">
      <div className="flex shrink-0 items-center justify-between bg-gradient-to-r from-blue-600 to-purple-600 px-2.5 py-1.5">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-white/95">
          Traders Desk
        </p>
      </div>
      <div className="flex shrink-0 border-b border-gray-200 bg-slate-50/80">
        <button
          type="button"
          onClick={() => setTab('movers')}
          className={`flex flex-1 items-center justify-center gap-1 py-2 text-[11px] font-semibold ${
            tab === 'movers' ? activeTab : inactiveTab
          }`}
        >
          <Zap className="h-3.5 w-3.5" />
          Movers
        </button>
        <button
          type="button"
          onClick={() => setTab('news')}
          className={`flex flex-1 items-center justify-center gap-1 py-2 text-[11px] font-semibold ${
            tab === 'news' ? activeTab : inactiveTab
          }`}
        >
          <Newspaper className="h-3.5 w-3.5" />
          News
        </button>
        <button
          type="button"
          onClick={() => setTab('scanner')}
          className={`flex flex-1 items-center justify-center gap-1 py-2 text-[11px] font-semibold ${
            tab === 'scanner' ? activeTab : inactiveTab
          }`}
        >
          <Radio className="h-3.5 w-3.5" />
          Live Scanner
        </button>
        <button
          type="button"
          onClick={() => setTab('patterns')}
          className={`flex flex-1 items-center justify-center gap-1 py-2 text-[11px] font-semibold ${
            tab === 'patterns' ? activeTab : inactiveTab
          }`}
        >
          <CandlestickChart className="h-3.5 w-3.5" />
          Patterns
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        {tab === 'news' && (
          <div className="h-full overflow-hidden">
            <TerminalNews />
          </div>
        )}
        {tab === 'scanner' && (
          <div className="flex h-full min-h-0 flex-col overflow-hidden">
            <LiveActivities selectedSymbol={selectedSymbol} onSelectSymbol={onSelectSymbol} />
          </div>
        )}
        {tab === 'movers' && (
          <div className="flex h-full min-h-0 flex-col overflow-hidden">
            <TerminalMovers
              selectedSymbol={selectedSymbol}
              onSelectSymbol={onSelectSymbol}
            />
          </div>
        )}
        {tab === 'patterns' && (
          <div className="h-full overflow-hidden">
            <TrendlinePatterns onSelectSymbol={onSelectSymbol} />
          </div>
        )}
      </div>
    </div>
  );
}
