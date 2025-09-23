'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trackPageView } from '@/lib/analytics';
import { Navigation } from '@/components/Navigation';
import { Market } from '@/components/Market';

export function MarketSentimentPageClient() {
  const router = useRouter();

  useEffect(() => {
    trackPageView('/market/market-sentiment', 'Market Sentiment Analysis');
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
      
      {/* Main Content - Market Component with Market Sentiment Focus */}
      <div className="py-8">
        <Market initialSubSection="market-sentiment" />
      </div>

      {/* SEO Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="prose max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Understanding Indian Market Sentiment Analysis
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">What is Market Sentiment?</h3>
                <p className="text-gray-600 mb-4">
                  Market sentiment represents the overall attitude of investors toward the Indian stock market. 
                  Our AI-powered analysis combines multiple technical and fundamental indicators to provide 
                  a comprehensive view of market mood, ranging from Strongly Bearish to Strongly Bullish.
                </p>
                <p className="text-gray-600">
                  The sentiment score is calculated using weighted indicators including Nifty trends, 
                  VIX volatility levels, FII/DII institutional flows, sector breadth, and advance/decline ratios.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Key Indicators Analyzed</h3>
                <ul className="space-y-2 text-gray-600">
                  <li><strong>Nifty Trend (25% weight):</strong> Primary index momentum and direction</li>
                  <li><strong>VIX Level (20% weight):</strong> Market volatility and fear gauge</li>
                  <li><strong>FII/DII Activity (20% weight):</strong> Institutional money flow patterns</li>
                  <li><strong>Sector Breadth (15% weight):</strong> Performance across market sectors</li>
                  <li><strong>Market Cap Level (10% weight):</strong> Overall market structure analysis</li>
                  <li><strong>Advance/Decline (10% weight):</strong> Breadth of market participation</li>
                </ul>
              </div>
            </div>

            <h3 className="text-2xl font-semibold text-gray-800 mb-4">How to Use Market Sentiment</h3>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-6">
              <p className="text-gray-700">
                <strong>Investment Strategy:</strong> Use sentiment analysis as a complementary tool alongside 
                your fundamental and technical analysis. High confidence scores indicate stronger consensus 
                across multiple indicators, while low confidence suggests mixed market signals requiring caution.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Bullish Sentiment (+20 to +100)</h4>
                <p className="text-sm text-green-700">
                  Positive market indicators align, suggesting potential upward momentum. 
                  Consider long positions with proper risk management.
                </p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Neutral Sentiment (-19 to +19)</h4>
                <p className="text-sm text-yellow-700">
                  Mixed signals indicate consolidation or uncertainty. 
                  Focus on stock-specific opportunities and maintain balanced exposure.
                </p>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">Bearish Sentiment (-20 to -100)</h4>
                <p className="text-sm text-red-700">
                  Negative indicators dominate, suggesting potential downward pressure. 
                  Consider defensive strategies and risk reduction.
                </p>
              </div>
            </div>

            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Data Sources & Methodology</h3>
            <p className="text-gray-600 mb-4">
              Our sentiment analysis combines real-time data from NSE, BSE, and institutional flow reports. 
              The algorithm processes multiple data points every 5 minutes during market hours, ensuring 
              up-to-date sentiment readings that reflect current market conditions.
            </p>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                <strong>⚠️ Disclaimer:</strong> Market sentiment analysis is for educational and informational 
                purposes only. It should not be considered as investment advice. Indian stock markets carry 
                inherent risks, and past performance does not guarantee future results. Always consult with 
                SEBI registered investment advisors before making investment decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
