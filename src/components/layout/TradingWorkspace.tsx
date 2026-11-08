'use client';

import { useState } from 'react';
import { MarketOutlookRail } from './MarketOutlookRail';

interface TradingWorkspaceProps {
  children: React.ReactNode;
  flush?: boolean;
  showRail?: boolean;
  /** Full-width panel — no side rail, content spans the workspace */
  fullWidth?: boolean;
}

export function TradingWorkspace({
  children,
  flush = false,
  showRail = true,
  fullWidth = false,
}: TradingWorkspaceProps) {
  const [railCollapsed, setRailCollapsed] = useState(false);

  if (fullWidth) {
    return (
      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6 py-3 lg:py-4">
        <div
          className={`bg-white rounded-lg border border-slate-200 shadow-sm ${
            flush ? 'overflow-hidden' : ''
          }`}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pt-4 pb-3 lg:pt-5 lg:pb-4">
      <div className="flex w-full items-start">
        {showRail && (
          <MarketOutlookRail
            collapsed={railCollapsed}
            onCollapse={() => setRailCollapsed(true)}
            onExpand={() => setRailCollapsed(false)}
          />
        )}

        <section
          className={`min-w-0 flex-1 px-3 sm:px-4 lg:px-6 max-w-[1600px] ${!showRail || railCollapsed ? 'mx-auto' : ''}`}
          aria-label="Trading data"
        >
          <div
            className={`bg-white rounded-lg border border-slate-200 shadow-sm min-h-[480px] ${
              flush ? 'overflow-hidden' : 'p-4 sm:p-5'
            }`}
          >
            {children}
          </div>
        </section>
      </div>

    </div>
  );
}
