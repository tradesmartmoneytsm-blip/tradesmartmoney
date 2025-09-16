'use client';

import { useRouter } from 'next/navigation';
import { News } from '@/components/News';
import { Navigation } from '@/components/Navigation';

export function NewsPageClient() {
  const router = useRouter();

  const handleSectionChange = (section: string, _subSection?: string) => {
    if (section === 'news') {
      // Stay on current page
      return;
    }
    
    // Navigate to different sections
    const routes: { [key: string]: string } = {
      'home': '/',
      'market': '/market',
      'swing': '/swing-trades',
      'intraday': '/intraday-trades',
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
        activeSection="news" 
        onSectionChange={handleSectionChange}
      />
      <main className="relative" role="main" aria-label="Market News">
        <News />
      </main>
    </div>
  );
} 