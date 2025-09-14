'use client';

import { useRouter } from 'next/navigation';
import { EodScans } from '@/components/EodScans';
import { Navigation } from '@/components/Navigation';

export function EodScansPageClient() {
  const router = useRouter();

  const handleSectionChange = (section: string, subSection?: string) => {
    if (section === 'eodscans') {
      // Stay on current page
      return;
    }
    
    // Navigate to different sections
    const routes: { [key: string]: string } = {
      'home': '/',
      'market': '/market',
      'swing': '/swing-trades',
      'intraday': '/intraday-trades',
      'news': '/news',
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
        activeSection="eodscans" 
        onSectionChange={handleSectionChange}
      />
      <main className="relative" role="main" aria-label="EOD Scans">
        <EodScans />
      </main>
    </div>
  );
} 