'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trackPageView } from '@/lib/analytics';
import { TrendingUp, BarChart3, Activity, Target, ArrowUpRight } from 'lucide-react';
import { Market } from '@/components/Market';
import { Navigation } from '@/components/Navigation';

export function LongBuildupPageClient() {
  const router = useRouter();

  useEffect(() => {
    trackPageView('/market/long-buildup', 'Long Buildup Analysis');
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
      {/* Main Content - Market Component with Long Buildup Focus */}
      <div className="py-8">
        <Market initialSubSection="long-buildup" />
      </div>

      {/* SEO Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="prose max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Understanding Long Buildup
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">What is Long Buildup?</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <ArrowUpRight className="h-4 w-4 text-green-600 mr-2" />
                    <strong>Increasing Long Positions:</strong> Rising open interest with price increase
                  </li>
                  <li className="flex items-center">
                    <ArrowUpRight className="h-4 w-4 text-green-600 mr-2" />
                    <strong>Bullish Sentiment:</strong> Traders expecting price appreciation
                  </li>
                  <li className="flex items-center">
                    <ArrowUpRight className="h-4 w-4 text-green-600 mr-2" />
                    <strong>Institutional Activity:</strong> Smart money accumulation
                  </li>
                  <li className="flex items-center">
                    <ArrowUpRight className="h-4 w-4 text-green-600 mr-2" />
                    <strong>Volume Confirmation:</strong> High volume supporting the move
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Trading Implications</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-blue-600 mr-2" />
                    Potential upward price movement
                  </li>
                  <li className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-blue-600 mr-2" />
                    Strong support at lower levels
                  </li>
                  <li className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-blue-600 mr-2" />
                    Momentum trading opportunities
                  </li>
                  <li className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-blue-600 mr-2" />
                    Breakout confirmation signals
                  </li>
                  <li className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-blue-600 mr-2" />
                    Institutional backing validation
                  </li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">Key Metrics to Monitor</h3>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-green-50 p-4 rounded-lg">
                <BarChart3 className="h-6 w-6 text-green-600 mb-2" />
                <h4 className="font-semibold text-gray-800">Open Interest</h4>
                <p className="text-sm text-gray-600">Increasing OI with rising prices</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <Activity className="h-6 w-6 text-blue-600 mb-2" />
                <h4 className="font-semibold text-gray-800">Volume Analysis</h4>
                <p className="text-sm text-gray-600">High volume confirming the buildup</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <Target className="h-6 w-6 text-purple-600 mb-2" />
                <h4 className="font-semibold text-gray-800">Price Action</h4>
                <p className="text-sm text-gray-600">Consistent upward price movement</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">How to Trade Long Buildup</h3>
            <p className="text-gray-600 mb-4">
              Long buildup indicates strong bullish sentiment and potential for continued upward movement. 
              Traders can use this information to identify momentum opportunities and align with institutional sentiment.
            </p>
            
            <p className="text-gray-600 mb-6">
              However, always confirm with technical analysis, check for any resistance levels, 
              and implement proper risk management strategies before taking positions.
            </p>

            {/* Educational Disclaimer */}
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
              <p className="text-red-800 text-sm font-medium">
                <strong>Educational Disclaimer:</strong> This long buildup analysis is for educational and informational purposes only. 
                We are not SEBI registered investment advisors. Please consult with qualified financial professionals before making investment decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
