'use client';

import { ChevronRight } from 'lucide-react';
import { SectorPerformanceHistogram } from '@/components/SectorPerformanceHistogram';
import { ZeeBusinessLiveTV } from '@/components/ZeeBusinessLiveTV';

interface MarketOutlookRailProps {
  collapsed: boolean;
  onCollapse: () => void;
  onExpand: () => void;
  /**
   * When provided, clicking a stock in the sector list opens its chart in
   * the caller (e.g. the embedded terminal) instead of TradingView.
   */
  onStockClick?: (symbol: string) => void;
}

export function MarketOutlookRail({ collapsed, onCollapse, onExpand, onStockClick }: MarketOutlookRailProps) {
  if (collapsed) {
    return (
      <button
        type="button"
        onClick={onExpand}
        className="hidden lg:flex fixed left-2 top-[5.75rem] z-30 items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg shadow-md text-xs font-medium text-slate-600 hover:bg-slate-50"
      >
        <ChevronRight className="w-4 h-4" />
        Market Outlook
      </button>
    );
  }

  return (
    <aside
      className="hidden lg:flex flex-shrink-0 w-[280px] xl:w-[300px] pl-2 sticky top-[5.75rem] self-start z-10"
      aria-label="Market outlook"
    >
      <div className="w-full flex flex-col gap-2">
        <div className="shadow-md ring-1 ring-blue-200/40 rounded-lg overflow-hidden">
          <SectorPerformanceHistogram onCollapse={onCollapse} onStockClick={onStockClick} />
        </div>
        <ZeeBusinessLiveTV isEmbedded />
      </div>
    </aside>
  );
}