'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LiveActivities } from '@/components/terminal/LiveActivities';
import { Navigation } from '@/components/Navigation';
import { MarketOutlookRail } from '@/components/layout/MarketOutlookRail';

export function LiveScannerPageClient() {
  const router = useRouter();
  const [railCollapsed, setRailCollapsed] = useState(false);

  const handleSectionChange = (section: string) => {
    if (section === 'intraday' || section === 'live-scanner') {
      // Stay on current page
      return;
    }

    // Navigate to different sections
    const routes: { [key: string]: string } = {
      'home': '/',
      'swing': '/swing-trades',
      'news': '/news',
      'algo-trading': '/algo-trading',
      'commodity': '/commodity',
      'us-stock-market': '/us-stock-market',
      'books': '/books',
    };

    const route = routes[section];
    if (route) {
      router.push(route);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navigation
        activeSection="intraday"
        onSectionChange={handleSectionChange}
      />
      <article className="w-full pt-3 sm:pt-4 pb-2 sm:pb-3">
        <div className="flex w-full items-start">
          <MarketOutlookRail
            collapsed={railCollapsed}
            onCollapse={() => setRailCollapsed(true)}
            onExpand={() => setRailCollapsed(false)}
          />

          <div className="flex-1 min-w-0 px-2 sm:px-3">
            <main
              className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"
              role="main"
              aria-label="Live Market Scanner"
            >
              {/* Page header */}
              <header className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Live Market Scanner
                </h1>
                <p className="mt-1 max-w-3xl text-sm text-gray-600">
                  Dhan DEXT–style live activity feed: Stocks, F&amp;O, and index filters with Symbol ·
                  Highlight · LTP · Volume · Time. Updates via ScanX polling (~12s); full push parity needs
                  Dhan live-scan WebSocket.
                </p>
              </header>

              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="h-[min(72vh,720px)] min-h-[420px]">
                  <LiveActivities />
                </div>
              </div>

              <p className="mt-4 text-xs text-gray-400">
                Disclaimer: Market data is delayed and sourced from third-party feeds.
                This scanner is for informational purposes only and is not investment advice.
              </p>
            </main>
          </div>
        </div>
      </article>
    </div>
  );
}
