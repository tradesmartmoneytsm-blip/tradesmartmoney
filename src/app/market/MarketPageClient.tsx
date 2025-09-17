'use client';

import { useRouter } from 'next/navigation';
import { Market } from '@/components/Market';
import { Navigation } from '@/components/Navigation';

export function MarketPageClient() {
  const router = useRouter();

  const handleSectionChange = (section: string) => {
    if (section === 'market') {
      // Stay on current page, just pass the subsection
      return;
    }
    
    // Navigate to different sections
    const routes: { [key: string]: string } = {
      'home': '/',
      'swing': '/swing-trades',
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
        activeSection="market" 
        onSectionChange={handleSectionChange}
      />
      <main className="relative" role="main" aria-label="Market Analysis">
        <Market />
      </main>
    </div>
  );
} 