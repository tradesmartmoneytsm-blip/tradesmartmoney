'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trackPageView } from '@/lib/analytics';
import { Building2, TrendingUp, Globe, BarChart3, Activity } from 'lucide-react';
import { Market } from '@/components/Market';
import { Navigation } from '@/components/Navigation';

export function FiiDiiActivityPageClient() {
  const router = useRouter();

  useEffect(() => {
    trackPageView('/market/fii-dii-activity', 'FII DII Activity Analysis');
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
      {/* Main Content - Market Component with FII DII Focus */}
      <div>
        <Market initialSubSection="fii-dii-activity" />
      </div>

      {/* SEO Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="prose max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Understanding FII DII Activity
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Foreign Institutional Investors (FII)</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <Globe className="h-4 w-4 text-blue-600 mr-2" />
                    <strong>Global Investment Funds:</strong> Mutual funds, pension funds, hedge funds
                  </li>
                  <li className="flex items-center">
                    <Globe className="h-4 w-4 text-blue-600 mr-2" />
                    <strong>Market Impact:</strong> Significant influence on market direction
                  </li>
                  <li className="flex items-center">
                    <Globe className="h-4 w-4 text-blue-600 mr-2" />
                    <strong>Currency Effect:</strong> Impact on rupee exchange rates
                  </li>
                  <li className="flex items-center">
                    <Globe className="h-4 w-4 text-blue-600 mr-2" />
                    <strong>Sector Preferences:</strong> Focus on large-cap and quality stocks
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Domestic Institutional Investors (DII)</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <Building2 className="h-4 w-4 text-green-600 mr-2" />
                    <strong>Indian Institutions:</strong> Mutual funds, insurance companies, banks
                  </li>
                  <li className="flex items-center">
                    <Building2 className="h-4 w-4 text-green-600 mr-2" />
                    <strong>Market Stability:</strong> Often counterbalance FII flows
                  </li>
                  <li className="flex items-center">
                    <Building2 className="h-4 w-4 text-green-600 mr-2" />
                    <strong>Long-term Focus:</strong> Generally long-term investment approach
                  </li>
                  <li className="flex items-center">
                    <Building2 className="h-4 w-4 text-green-600 mr-2" />
                    <strong>Domestic Knowledge:</strong> Better understanding of local markets
                  </li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">Key Metrics to Track</h3>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600 mb-2" />
                <h4 className="font-semibold text-gray-800">Net Investment</h4>
                <p className="text-sm text-gray-600">Daily net buying/selling by FII and DII</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600 mb-2" />
                <h4 className="font-semibold text-gray-800">Cumulative Flow</h4>
                <p className="text-sm text-gray-600">Monthly and yearly investment trends</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <Activity className="h-6 w-6 text-purple-600 mb-2" />
                <h4 className="font-semibold text-gray-800">Market Correlation</h4>
                <p className="text-sm text-gray-600">Impact on Nifty and Bank Nifty movements</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">Trading Implications</h3>
            <p className="text-gray-600 mb-4">
              FII and DII activity data is crucial for understanding market sentiment and direction. 
              Heavy FII buying often indicates positive global sentiment towards Indian markets, 
              while DII activity can provide stability during volatile periods.
            </p>
            
            <p className="text-gray-600 mb-6">
              Traders and investors use this data to gauge institutional interest, predict market movements, 
              and align their strategies with institutional flows for better returns.
            </p>

            {/* Educational Disclaimer */}
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
              <p className="text-red-800 text-sm font-medium">
                <strong>Educational Disclaimer:</strong> This FII DII activity data is for educational and informational purposes only. 
                We are not SEBI registered investment advisors. Please consult with qualified financial professionals before making investment decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
