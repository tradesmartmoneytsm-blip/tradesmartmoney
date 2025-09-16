'use client';

import { useRouter } from 'next/navigation';
import { SwingTrades } from '@/components/SwingTrades';
import { Navigation } from '@/components/Navigation';

export function SwingTradesPageClient() {
  const router = useRouter();

  const handleSectionChange = (section: string, _subSection?: string) => {
    if (section === 'swing') {
      // Stay on current page
      return;
    }
    
    // Navigate to different sections
    const routes: { [key: string]: string } = {
      'home': '/',
      'market': '/market',
      'intraday': '/intraday-trades',
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
        activeSection="swing" 
        onSectionChange={handleSectionChange}
      />
      <main className="relative" role="main" aria-label="Swing Trading">
        <SwingTrades />
      </main>
    </div>
  );
} 