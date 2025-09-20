'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trackPageView } from '@/lib/analytics';
import { Crown } from 'lucide-react';
import { Market } from '@/components/Market';
import { Navigation } from '@/components/Navigation';

export function FiftyTwoWeekHighPageClient() {
  const router = useRouter();

  useEffect(() => {
    trackPageView('/market/52w-high', '52 Week High Analysis');
  }, []);

  const handleSectionChange = (section: string, subSection?: string) => {
    // Handle market submenus - navigate to separate pages
    if (section === 'market' && subSection) {
      router.push(`/market/${subSection}`);
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
      {/* Main Content */}
      <div className="py-8">
        <Market initialSubSection="52w-high" />
      </div>

      {/* SEO Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="prose max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Understanding 52 Week High Stocks
            </h2>
            
            <p className="text-gray-600 mb-6">
              Stocks trading near their 52-week highs often indicate strong momentum and institutional interest. 
              These stocks have shown consistent strength and may continue their upward trajectory.
            </p>

            {/* Educational Disclaimer */}
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
              <p className="text-red-800 text-sm font-medium">
                <strong>Educational Disclaimer:</strong> This 52-week high analysis is for educational purposes only. 
                We are not SEBI registered investment advisors. Please consult with qualified professionals before making investment decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
