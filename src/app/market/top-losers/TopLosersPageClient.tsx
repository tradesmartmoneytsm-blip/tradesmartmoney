'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trackPageView } from '@/lib/analytics';
import { TrendingDown, Activity, AlertTriangle, Target, ArrowDown } from 'lucide-react';
import { Market } from '@/components/Market';
import { Navigation } from '@/components/Navigation';

export function TopLosersPageClient() {
  const router = useRouter();

  useEffect(() => {
    trackPageView('/market/top-losers', 'Top Losers Analysis');
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
      {/* Main Content - Market Component with Top Losers Focus */}
      <div className="py-8">
        <Market initialSubSection="top-losers" />
      </div>

      {/* SEO Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="prose max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Understanding Top Losers Analysis
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Why Stocks Decline</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                    <strong>Negative News:</strong> Poor earnings, downgrades, regulatory issues
                  </li>
                  <li className="flex items-center">
                    <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                    <strong>Market Sentiment:</strong> Sector rotation, risk-off sentiment
                  </li>
                  <li className="flex items-center">
                    <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                    <strong>Technical Breakdown:</strong> Support level breaks, chart patterns
                  </li>
                  <li className="flex items-center">
                    <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                    <strong>Profit Booking:</strong> After significant gains, investors book profits
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Opportunity Analysis</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <Target className="h-4 w-4 text-green-600 mr-2" />
                    Oversold bounce opportunities
                  </li>
                  <li className="flex items-center">
                    <Target className="h-4 w-4 text-green-600 mr-2" />
                    Value investment picks
                  </li>
                  <li className="flex items-center">
                    <Target className="h-4 w-4 text-green-600 mr-2" />
                    Contrarian trading strategies
                  </li>
                  <li className="flex items-center">
                    <Target className="h-4 w-4 text-green-600 mr-2" />
                    Support level identification
                  </li>
                  <li className="flex items-center">
                    <Target className="h-4 w-4 text-green-600 mr-2" />
                    Risk-reward assessment
                  </li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">Contrarian Trading Approach</h3>
            <p className="text-gray-600 mb-4">
              Top losers can present excellent contrarian trading opportunities when the decline is overdone 
              or based on temporary factors. However, it's crucial to distinguish between temporary setbacks 
              and fundamental deterioration in business prospects.
            </p>
            
            <p className="text-gray-600 mb-6">
              Use technical analysis to identify support levels, RSI oversold conditions, and volume patterns 
              to time your entries. Always implement proper risk management and position sizing when trading losers.
            </p>

            {/* Educational Disclaimer */}
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
              <p className="text-red-800 text-sm font-medium">
                <strong>Educational Disclaimer:</strong> This top losers data is for educational and informational purposes only. 
                We are not SEBI registered investment advisors. Please consult with qualified financial professionals before making investment decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
