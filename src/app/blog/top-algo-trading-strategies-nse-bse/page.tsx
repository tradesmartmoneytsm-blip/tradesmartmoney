import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, User, Clock, Eye, ChevronLeft, BarChart3 } from 'lucide-react';

export const metadata: Metadata = {
  title: '10 Proven Algo Trading Strategies for NSE & BSE | Coming Soon - TradeSmart Money',
  description: 'This comprehensive guide to algorithmic trading strategies is currently being written by our expert team. Check back soon!',
  keywords: 'algo trading strategies, NSE BSE, algorithmic trading, quantitative trading, backtesting',
  alternates: {
    canonical: 'https://www.tradesmartmoney.com/blog/top-algo-trading-strategies-nse-bse',
  },
};

export default function AlgoTradingStrategiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center mb-6 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-white/30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
              Algo Trading
            </span>
            <span className="bg-red-100 text-red-700 border-red-200 border px-3 py-1 rounded-full text-sm font-medium">
              Advanced
            </span>
            <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
              👑 Premium
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            10 Proven Algo Trading Strategies for NSE & BSE
          </h1>
          
          <p className="text-xl text-blue-100 mb-8 leading-relaxed max-w-3xl">
            Our quantitative analysts are currently backtesting and documenting advanced algorithmic trading strategies 
            specifically optimized for Indian market conditions. This comprehensive guide will include real performance data.
          </p>
          
          <div className="flex flex-wrap items-center gap-6 text-blue-100">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              Vikram Singh - Algorithmic Trading Expert
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              15 min read
            </div>
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-2" />
              Coming Soon
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BarChart3 className="w-8 h-8 text-purple-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Advanced Content in Development
          </h2>
          
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Our algorithmic trading expert is currently backtesting these strategies against 5+ years of NSE/BSE data. 
            This premium guide will include code examples, performance metrics, and risk management techniques.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h3 className="font-bold text-blue-800 mb-3">What You'll Learn:</h3>
            <ul className="text-left text-blue-700 space-y-2 max-w-md mx-auto">
              <li>✓ Mean reversion strategies for Indian markets</li>
              <li>✓ Momentum-based algorithms with volatility filters</li>
              <li>✓ Pairs trading in NSE stocks</li>
              <li>✓ Options market-making algorithms</li>
              <li>✓ Risk management and position sizing</li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/algo-trading"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Explore Algo Trading Features
            </Link>
            <Link
              href="/blog"
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Browse Other Articles
            </Link>
          </div>
        </div>

        {/* Related Articles */}
        <section className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/blog/complete-guide-smart-money-trading-2025">
              <article className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-500 relative">
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded text-sm font-medium">
                      Smart Money
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    Complete Guide to Smart Money Trading
                  </h4>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    Master institutional money flow tracking with advanced techniques.
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    12 min read
                  </div>
                </div>
              </article>
            </Link>
            
            <Link href="/blog/fii-dii-data-analysis-january-2025">
              <article className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                <div className="h-32 bg-gradient-to-r from-green-500 to-blue-500 relative">
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded text-sm font-medium">
                      Market Analysis
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    FII/DII Data Analysis: January 2025
                  </h4>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    Deep dive into institutional flow patterns and market impact.
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    8 min read
                  </div>
                </div>
              </article>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
