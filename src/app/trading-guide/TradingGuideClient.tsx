'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, TrendingUp, Shield, AlertTriangle, Target, BarChart3, Brain } from 'lucide-react';
import { trackPageView } from '@/lib/analytics';

export function TradingGuideClient() {
  useEffect(() => {
    trackPageView('/trading-guide', 'Trading Guide');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center text-blue-100 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center mb-4">
            <BookOpen className="h-8 w-8 mr-3" />
            <h1 className="text-4xl font-bold">Complete Trading Guide</h1>
          </div>
          <p className="text-xl text-blue-100">
            Learn about stock market concepts and trading education for educational purposes only
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
              <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
              <nav className="space-y-2">
                <a href="#basics" className="block text-blue-600 hover:underline">Trading Basics</a>
                <a href="#analysis" className="block text-blue-600 hover:underline">Technical Analysis</a>
                <a href="#strategies" className="block text-blue-600 hover:underline">Trading Strategies</a>
                <a href="#risk" className="block text-blue-600 hover:underline">Risk Management</a>
                <a href="#psychology" className="block text-blue-600 hover:underline">Trading Psychology</a>
                <a href="#tools" className="block text-blue-600 hover:underline">Trading Tools</a>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            
            {/* Trading Basics */}
            <section id="basics" className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <TrendingUp className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold">Trading Basics</h2>
              </div>
              
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-4">What is Stock Trading?</h3>
                <p className="text-gray-700 mb-6">
                  Stock trading involves buying and selling shares of publicly traded companies to profit from price movements. 
                  Unlike investing, which focuses on long-term growth, trading capitalizes on short-term price fluctuations.
                </p>

                <h3 className="text-xl font-semibold mb-4">Types of Trading</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-blue-600">Day Trading</h4>
                    <p className="text-sm text-gray-600">Buy and sell within the same trading day</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-green-600">Swing Trading</h4>
                    <p className="text-sm text-gray-600">Hold positions for days to weeks</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-purple-600">Position Trading</h4>
                    <p className="text-sm text-gray-600">Hold for weeks to months</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-orange-600">Scalping</h4>
                    <p className="text-sm text-gray-600">Very short-term, minutes to hours</p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-4">Key Market Concepts</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                  <li><strong>Bid-Ask Spread:</strong> Difference between highest buyer price and lowest seller price</li>
                  <li><strong>Volume:</strong> Number of shares traded in a given period</li>
                  <li><strong>Market Cap:</strong> Total value of a company&apos;s shares</li>
                  <li><strong>Volatility:</strong> Measure of price movement intensity</li>
                  <li><strong>Liquidity:</strong> Ease of buying/selling without affecting price</li>
                </ul>
              </div>
            </section>

            {/* Technical Analysis */}
            <section id="analysis" className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <BarChart3 className="h-6 w-6 text-green-600 mr-3" />
                <h2 className="text-2xl font-bold">Technical Analysis</h2>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-gray-700 mb-6">
                  Technical analysis involves studying price charts and patterns to predict future price movements. 
                  It&apos;s based on the premise that all relevant information is reflected in the stock price.
                </p>

                <h3 className="text-xl font-semibold mb-4">Key Chart Patterns</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="border rounded-lg p-4 text-center">
                    <div className="w-full h-20 bg-gradient-to-r from-green-100 to-green-200 rounded mb-2 flex items-center justify-center">
                      <span className="text-green-600 font-bold">📈</span>
                    </div>
                    <h4 className="font-semibold">Support & Resistance</h4>
                    <p className="text-xs text-gray-600">Price levels where buying/selling pressure emerges</p>
                  </div>
                  <div className="border rounded-lg p-4 text-center">
                    <div className="w-full h-20 bg-gradient-to-r from-blue-100 to-blue-200 rounded mb-2 flex items-center justify-center">
                      <span className="text-blue-600 font-bold">📊</span>
                    </div>
                    <h4 className="font-semibold">Trend Lines</h4>
                    <p className="text-xs text-gray-600">Connect highs/lows to identify trend direction</p>
                  </div>
                  <div className="border rounded-lg p-4 text-center">
                    <div className="w-full h-20 bg-gradient-to-r from-purple-100 to-purple-200 rounded mb-2 flex items-center justify-center">
                      <span className="text-purple-600 font-bold">🔺</span>
                    </div>
                    <h4 className="font-semibold">Chart Patterns</h4>
                    <p className="text-xs text-gray-600">Triangles, flags, head & shoulders</p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-4">Popular Technical Indicators</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold">Moving Averages (MA)</h4>
                    <p className="text-gray-600 text-sm">Smooth out price data to identify trend direction</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold">Relative Strength Index (RSI)</h4>
                    <p className="text-gray-600 text-sm">Measures overbought/oversold conditions (0-100 scale)</p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-semibold">MACD (Moving Average Convergence Divergence)</h4>
                    <p className="text-gray-600 text-sm">Shows relationship between two moving averages</p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-semibold">Bollinger Bands</h4>
                    <p className="text-gray-600 text-sm">Volatility bands around moving average</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Trading Strategies */}
            <section id="strategies" className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <Target className="h-6 w-6 text-purple-600 mr-3" />
                <h2 className="text-2xl font-bold">Trading Concepts (Educational)</h2>
              </div>
              
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-4">Momentum Trading</h3>
                <p className="text-gray-700 mb-4">
                  <strong>Educational Concept:</strong> Momentum trading involves studying stocks showing strong directional movement. 
                  This concept is based on the idea of trend continuation for educational understanding.
                </p>

                <h3 className="text-xl font-semibold mb-4">Mean Reversion</h3>
                <p className="text-gray-700 mb-4">
                  <strong>Educational Concept:</strong> Mean reversion theory suggests that prices tend to return to their average over time. 
                  This is a statistical concept used for educational study of market behavior.
                </p>

                <h3 className="text-xl font-semibold mb-4">Breakout Trading</h3>
                <p className="text-gray-700 mb-6">
                  <strong>Educational Concept:</strong> Breakout analysis studies price movements through key support or resistance levels. 
                  This concept helps understand how markets react to technical levels for educational purposes.
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Educational Note</h4>
                  <p className="text-blue-700 text-sm">
                    <strong>Disclaimer:</strong> These are educational concepts only. Always consult SEBI registered advisors before making investment decisions. 
                    Historical analysis is for learning purposes and does not guarantee future results.
                  </p>
                </div>
              </div>
            </section>

            {/* Risk Management */}
            <section id="risk" className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <Shield className="h-6 w-6 text-red-600 mr-3" />
                <h2 className="text-2xl font-bold">Risk Management</h2>
              </div>
              
              <div className="prose max-w-none">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                    <h3 className="font-semibold text-red-800">Risk Management is Critical</h3>
                  </div>
                  <p className="text-red-700 text-sm mt-2">
                    Poor risk management is the #1 reason traders fail. Protecting your capital is more important than making profits.
                  </p>
                </div>

                <h3 className="text-xl font-semibold mb-4">Key Risk Management Rules</h3>
                <ol className="list-decimal pl-6 text-gray-700 space-y-3 mb-6">
                  <li><strong>Never risk more than 1-2% per trade:</strong> This ensures you can survive losing streaks</li>
                  <li><strong>Set stop losses:</strong> Predefined exit point to limit losses</li>
                  <li><strong>Use position sizing:</strong> Calculate trade size based on your risk tolerance</li>
                  <li><strong>Diversify:</strong> Don&apos;t put all your money in one stock or sector</li>
                  <li><strong>Keep a trading journal:</strong> Track what works and what doesn&apos;t</li>
                </ol>

                <h3 className="text-xl font-semibold mb-4">Position Sizing Formula</h3>
                <div className="bg-gray-100 rounded-lg p-4 mb-6">
                  <code className="text-sm">
                    Position Size = (Account Risk ÷ (Entry Price - Stop Loss)) × Account Balance
                  </code>
                  <p className="text-xs text-gray-600 mt-2">
                    Example: ₹10,000 account, 2% risk (₹200), Entry at ₹100, Stop at ₹95<br/>
                    Position Size = ₹200 ÷ ₹5 = 40 shares maximum
                  </p>
                </div>
              </div>
            </section>

            {/* Trading Psychology */}
            <section id="psychology" className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <Brain className="h-6 w-6 text-indigo-600 mr-3" />
                <h2 className="text-2xl font-bold">Trading Psychology</h2>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-gray-700 mb-6">
                  Trading success is 80% psychology and 20% strategy. Understanding and controlling your emotions 
                  is crucial for consistent profitability.
                </p>

                <h3 className="text-xl font-semibold mb-4">Common Psychological Traps</h3>
                <div className="space-y-4 mb-6">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-red-600">Fear of Missing Out (FOMO)</h4>
                    <p className="text-gray-600 text-sm">Entering trades late due to fear of missing profits</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-orange-600">Revenge Trading</h4>
                    <p className="text-gray-600 text-sm">Trying to recover losses with increasingly risky trades</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-purple-600">Overconfidence</h4>
                    <p className="text-gray-600 text-sm">Taking excessive risks after a few winning trades</p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-4">Developing Mental Discipline</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Stick to your trading plan regardless of emotions</li>
                  <li>Accept that losses are part of trading</li>
                  <li>Focus on process, not individual trade outcomes</li>
                  <li>Take breaks during losing streaks</li>
                  <li>Practice mindfulness and stress management</li>
                </ul>
              </div>
            </section>

            {/* Trading Tools */}
            <section id="tools" className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <BookOpen className="h-6 w-6 text-green-600 mr-3" />
                <h2 className="text-2xl font-bold">Essential Trading Tools</h2>
              </div>
              
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-4">Trading Platforms</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold">Zerodha Kite</h4>
                    <p className="text-sm text-gray-600">Popular Indian platform with advanced charting</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold">TradingView</h4>
                    <p className="text-sm text-gray-600">Professional charting and analysis tools</p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-4">Market Data Sources</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                  <li>NSE/BSE official websites for real-time data</li>
                  <li>Economic calendars for news and events</li>
                  <li>Sector rotation tracking tools</li>
                  <li>FII/DII activity monitoring</li>
                </ul>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">Start Your Trading Journey</h4>
                  <p className="text-green-700 text-sm mb-3">
                    Ready to put these concepts into practice? TradeSmartMoney provides real-time data, 
                    trading signals, and educational resources to help you succeed.
                  </p>
                  <Link 
                    href="/" 
                    className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    Explore Trading Tools
                    <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
