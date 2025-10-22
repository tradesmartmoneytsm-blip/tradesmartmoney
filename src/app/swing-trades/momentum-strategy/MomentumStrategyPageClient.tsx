'use client';

import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { Swing } from '@/components/Swing';

export default function MomentumStrategyPageClient() {
  const router = useRouter();

  const handleSectionChange = (section: string, subSection?: string) => {
    if (section === 'swing' && subSection) {
      router.push(`/swing-trades/${subSection}`);
      return;
    }
    
    if (section === 'swing') {
      router.push('/swing-trades');
      return;
    }
    
    const routes: { [key: string]: string } = {
      'home': '/',
      'market': '/market/sector-performance',
      'fno': '/fno/option-analysis',
      'equity': '/equity/smart-money-flow',
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
      <main className="relative" role="main" aria-label="Momentum Strategy Trading">
        <Swing initialSubSection="momentum-strategy" />
      </main>
    </div>
  );
}
