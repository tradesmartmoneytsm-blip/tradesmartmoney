'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trackPageView } from '@/lib/analytics';
import { TrendingUp, BarChart3, Activity, Zap, Target, ArrowUp } from 'lucide-react';
import { Market } from '@/components/Market';
import { Navigation } from '@/components/Navigation';

export function TopGainersPageClient() {
  const router = useRouter();

  useEffect(() => {
    trackPageView('/market/top-gainers', 'Top Gainers Analysis');
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
      {/* Main Content - Market Component with Top Gainers Focus */}
      <div className="py-8">
        <Market initialSubSection="top-gainers" />
      </div>

      {/* SEO Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="prose max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Understanding Top Gainers Analysis
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">What Makes a Top Gainer?</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <Zap className="h-4 w-4 text-green-600 mr-2" />
                    <strong>High Percentage Gains:</strong> Stocks with significant price appreciation
                  </li>
                  <li className="flex items-center">
                    <Zap className="h-4 w-4 text-green-600 mr-2" />
                    <strong>Volume Confirmation:</strong> Price moves backed by trading volume
                  </li>
                  <li className="flex items-center">
                    <Zap className="h-4 w-4 text-green-600 mr-2" />
                    <strong>Market Cap Consideration:</strong> Gains across different market segments
                  </li>
                  <li className="flex items-center">
                    <Zap className="h-4 w-4 text-green-600 mr-2" />
                    <strong>Sector Performance:</strong> Individual stock vs sector performance
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Trading Strategies</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-blue-600 mr-2" />
                    Momentum trading opportunities
                  </li>
                  <li className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-blue-600 mr-2" />
                    Breakout pattern identification
                  </li>
                  <li className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-blue-600 mr-2" />
                    Volume-price analysis
                  </li>
                  <li className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-blue-600 mr-2" />
                    Risk management with stop losses
                  </li>
                  <li className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-blue-600 mr-2" />
                    Profit booking strategies
                  </li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">Key Factors Driving Stock Gains</h3>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-green-50 p-4 rounded-lg">
                <BarChart3 className="h-6 w-6 text-green-600 mb-2" />
                <h4 className="font-semibold text-gray-800">Fundamental News</h4>
                <p className="text-sm text-gray-600">Earnings, results, corporate actions</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <Activity className="h-6 w-6 text-blue-600 mb-2" />
                <h4 className="font-semibold text-gray-800">Technical Breakouts</h4>
                <p className="text-sm text-gray-600">Chart patterns and resistance breaks</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <Target className="h-6 w-6 text-purple-600 mb-2" />
                <h4 className="font-semibold text-gray-800">Market Sentiment</h4>
                <p className="text-sm text-gray-600">Sector rotation and institutional interest</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">How to Use Top Gainers Data</h3>
            <p className="text-gray-600 mb-4">
              Top gainers data helps identify stocks with strong momentum and potential trading opportunities. 
              However, it's important to analyze the reasons behind the gains and confirm with volume data 
              before making trading decisions.
            </p>
            
            <p className="text-gray-600 mb-6">
              Use this data in conjunction with technical analysis, fundamental research, and proper risk management 
              to make informed trading and investment decisions. Remember that past performance doesn't guarantee future results.
            </p>

            {/* Educational Disclaimer */}
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
              <p className="text-red-800 text-sm font-medium">
                <strong>Educational Disclaimer:</strong> This top gainers data is for educational and informational purposes only. 
                We are not SEBI registered investment advisors. Please consult with qualified financial professionals before making investment decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
