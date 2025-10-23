'use client';

import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { Commodity } from '@/components/Commodity';

export function CommodityPageClient() {
  const router = useRouter();

  const handleSectionChange = (section: string, subSection?: string) => {
    // Handle Commodity submenus - navigate to separate pages
    if (section === 'commodity' && subSection) {
      router.push(`/commodity/${subSection}`);
      return;
    }
    
    if (section === 'commodity') {
      // Stay on Commodity main page
      router.push('/commodity');
      return;
    }
    
    // Navigate to different sections
    const routes: { [key: string]: string } = {
      'home': '/',
      'market': '/market',
      'swing': '/swing-trades',
      'fno': '/fno',
      'equity': '/equity',
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
        activeSection="commodity" 
        onSectionChange={handleSectionChange}
      />
      <main className="relative" role="main" aria-label="Commodity Analysis">
        <Commodity initialSubSection="coming-soon" />
      </main>
    </div>
  );
}
