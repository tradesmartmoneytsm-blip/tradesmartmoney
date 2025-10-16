'use client';

import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { Swing } from '@/components/Swing';

export function BitStrategyPageClient() {
  const router = useRouter();

  const handleSectionChange = (section: string, subSection?: string) => {
    // Handle Swing Trade submenus - navigate to separate pages
    if (section === 'swing' && subSection) {
      router.push(`/swing-trades/${subSection}`);
      return;
    }
    
    if (section === 'swing') {
      // Stay on Swing main page
      router.push('/swing-trades');
      return;
    }
    
    // Navigate to different sections
    const routes: { [key: string]: string } = {
      'home': '/',
      'market': '/market/sector-performance',
      'fno': '/fno/option-analysis',
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
      <main className="relative" role="main" aria-label="BIT Strategy">
        <Swing initialSubSection="bit-strategy" />
      </main>
    </div>
  );
}
