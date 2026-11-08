'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { MarketOutlookRail } from '@/components/layout/MarketOutlookRail';
import { DextTerminal } from '@/components/terminal/DextTerminal';

export function TerminalPageClient() {
  const router = useRouter();
  const [railCollapsed, setRailCollapsed] = useState(false);
  // Symbol picked from the Market Outlook sector list — loaded into the terminal chart.
  const [selectedSymbol, setSelectedSymbol] = useState<string>('RELIANCE');

  const handleSectionChange = (section: string, subSection?: string) => {
    // Handle Intraday Trading submenus - navigate to separate pages
    if (section === 'intraday' && subSection) {
      if (subSection === 'terminal') {
        // Already on the trading terminal
        return;
      }
      if (subSection === 'live-scanner') {
        router.push('/live-scanner');
      } else if (subSection === 'smart-money-flow') {
        router.push('/equity/smart-money-flow');
      } else {
        router.push(`/fno/${subSection}`);
      }
      return;
    }

    if (section === 'intraday') {
      // Default to futures analysis
      router.push('/fno/futures-analysis');
      return;
    }

    // Navigate to different sections
    const routes: { [key: string]: string } = {
      'home': '/',
      'swing': '/swing-trades',
      'news': '/news',
      'eodscans': '/eod-scans',
      'algo-trading': '/algo-trading',
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
            onStockClick={(symbol) => setSelectedSymbol(symbol)}
          />

          <div className="flex-1 min-w-0 px-2 sm:px-3">
            <main
              className="w-full"
              role="main"
              aria-label="Trading Terminal"
            >
              <DextTerminal embedded selectedSymbol={selectedSymbol} />
            </main>
          </div>
        </div>
      </article>
    </div>
  );
}