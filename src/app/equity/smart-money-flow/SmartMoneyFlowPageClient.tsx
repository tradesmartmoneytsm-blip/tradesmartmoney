'use client';

import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { Equity } from '@/components/Equity';

export function SmartMoneyFlowPageClient() {
  const router = useRouter();

  const handleSectionChange = (section: string, subSection?: string) => {
    // Handle Equity submenus - navigate to separate pages
    if (section === 'equity' && subSection) {
      router.push(`/equity/${subSection}`);
      return;
    }
    
    if (section === 'equity') {
      // Stay on Equity main page
      router.push('/equity');
      return;
    }
    
    // Navigate to different sections
    const routes: { [key: string]: string } = {
      'home': '/',
      'market': '/market/sector-performance',
      'swing': '/swing-trades/bit-strategy',
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
        activeSection="equity" 
        onSectionChange={handleSectionChange}
      />
      <main className="relative" role="main" aria-label="SmartMoneyFlow Analysis">
        <Equity initialSubSection="smart-money-flow" />
      </main>
    </div>
  );
}
