'use client';

import { useRouter } from 'next/navigation';
import { IntradayTrades } from '@/components/IntradayTrades';
import { Navigation } from '@/components/Navigation';

export function IntradayTradesPageClient() {
  const router = useRouter();

  const handleSectionChange = (section: string, subSection?: string) => {
    if (section === 'intraday') {
      // Stay on current page
      return;
    }
    
    // Navigate to different sections
    const routes: { [key: string]: string } = {
      'home': '/',
      'market': '/market',
      'swing': '/swing-trades',
      'news': '/news',
      'eodscans': '/eod-scans',
      'algo-trading': '/algo-trading',
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
      <main className="relative" role="main" aria-label="Intraday Trading">
        <IntradayTrades />
      </main>
    </div>
  );
} 