'use client';

import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { Fno } from '@/components/Fno';

export function FuturesAnalysisPageClient() {
  const router = useRouter();

  const handleSectionChange = (section: string, subSection?: string) => {
    // Handle Intraday Trading submenus - navigate to separate pages
    if (section === 'intraday' && subSection) {
      if (subSection === 'smart-money-flow') {
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
      <main className="relative" role="main" aria-label="Futures Analysis">
        <Fno initialSubSection="futures-analysis" />
      </main>
    </div>
  );
}
