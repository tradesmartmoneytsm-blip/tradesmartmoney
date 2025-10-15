'use client';

import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { Fno } from '@/components/Fno';

export function PcrStormPageClient() {
  const router = useRouter();

  const handleSectionChange = (section: string, subSection?: string) => {
    // Handle FNO submenus - navigate to separate pages
    if (section === 'fno' && subSection) {
      router.push(`/fno/${subSection}`);
      return;
    }
    
    if (section === 'fno') {
      // Stay on FNO main page
      router.push('/fno');
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
        activeSection="fno" 
        onSectionChange={handleSectionChange}
      />
      <main className="relative" role="main" aria-label="PCR Storm Analysis">
        <Fno initialSubSection="pcr-storm" />
      </main>
    </div>
  );
}
