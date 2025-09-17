'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, TrendingUp, BarChart3, Activity, AlertTriangle } from 'lucide-react';
import { trackPageView } from '@/lib/analytics';

export default function ChartReadingPost() {
  useEffect(() => {
    trackPageView('/blog/how-to-read-financial-charts', 'How to Read Financial Charts');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            How to Read Financial Charts: Educational Guide for Beginners
          </h1>
          <div className="flex items-center text-gray-600 text-sm">
            <BookOpen className="w-4 h-4 mr-2" />
            <span>Educational Guide</span>
            <span className="mx-2">•</span>
            <span>12 min read</span>
            <span className="mx-2">•</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white rounded-lg shadow-lg p-8">
          {/* Disclaimer */}
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
            <div className="flex">
              <AlertTriangle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-800 font-medium">
                  <strong>Educational Disclaimer:</strong> This content is for educational purposes only. 
                  We are not SEBI registered advisors. Chart reading requires practice and should not be the sole basis for investment decisions.
                </p>
              </div>
            </div>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Understanding Financial Charts</h2>
            <p className="text-gray-700 mb-6">
              Financial charts are visual representations of price movements over time. They help investors and traders 
              understand how a stock's price has behaved historically and identify potential patterns. Learning to read 
              charts is like learning a new language - it takes time and practice.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Types of Charts</h3>
            
            <h4 className="text-lg font-semibold text-gray-900 mb-3">1. Line Charts</h4>
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <div className="flex items-center mb-2">
                <Activity className="w-5 h-5 text-blue-600 mr-2" />
                <h5 className="font-semibold text-gray-900">Line Chart</h5>
              </div>
              <p className="text-gray-700 text-sm mb-3">
                The simplest type of chart that connects closing prices over time with a line.
              </p>
              <div className="bg-white p-3 rounded border">
                <p className="text-xs text-gray-600"><strong>Best for:</strong> Getting a quick overview of price trends</p>
                <p className="text-xs text-gray-600"><strong>Shows:</strong> Closing prices only</p>
              </div>
            </div>

            <h4 className="text-lg font-semibold text-gray-900 mb-3">2. Candlestick Charts</h4>
            <div className="bg-green-50 p-4 rounded-lg mb-6">
              <div className="flex items-center mb-2">
                <BarChart3 className="w-5 h-5 text-green-600 mr-2" />
                <h5 className="font-semibold text-gray-900">Candlestick Chart</h5>
              </div>
              <p className="text-gray-700 text-sm mb-3">
                Shows four key prices: Open, High, Low, and Close (OHLC) for each time period.
              </p>
              <div className="bg-white p-3 rounded border">
                <p className="text-xs text-gray-600 mb-1"><strong>Green/White Candle:</strong> Closing price higher than opening price (bullish)</p>
                <p className="text-xs text-gray-600"><strong>Red/Black Candle:</strong> Closing price lower than opening price (bearish)</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Key Components of a Chart</h3>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="border border-gray-200 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Price Axis (Y-Axis)</h4>
                <p className="text-gray-700 text-sm">
                  Vertical axis showing the price levels. Usually on the right side of the chart.
                </p>
              </div>
              <div className="border border-gray-200 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Time Axis (X-Axis)</h4>
                <p className="text-gray-700 text-sm">
                  Horizontal axis showing time periods (minutes, hours, days, months, years).
                </p>
              </div>
              <div className="border border-gray-200 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Volume</h4>
                <p className="text-gray-700 text-sm">
                  Usually shown at the bottom, indicates how many shares were traded.
                </p>
              </div>
              <div className="border border-gray-200 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Price Scale</h4>
                <p className="text-gray-700 text-sm">
                  Can be linear (equal spacing) or logarithmic (percentage-based spacing).
                </p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Understanding Candlestick Patterns</h3>
            <p className="text-gray-700 mb-4">
              Candlestick patterns can provide insights into market sentiment. Here are some basic patterns:
            </p>

            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Single Candle Patterns</h4>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-4 h-4 bg-green-500 rounded mr-3 mt-1"></div>
                  <div>
                    <h5 className="font-semibold text-gray-900">Long Green Candle</h5>
                    <p className="text-gray-700 text-sm">Strong buying pressure, bullish sentiment</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-4 h-4 bg-red-500 rounded mr-3 mt-1"></div>
                  <div>
                    <h5 className="font-semibold text-gray-900">Long Red Candle</h5>
                    <p className="text-gray-700 text-sm">Strong selling pressure, bearish sentiment</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-4 h-2 bg-gray-400 rounded mr-3 mt-2"></div>
                  <div>
                    <h5 className="font-semibold text-gray-900">Doji</h5>
                    <p className="text-gray-700 text-sm">Open and close prices are nearly equal, indicates indecision</p>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Time Frames</h3>
            <p className="text-gray-700 mb-4">
              Different time frames serve different purposes:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li><strong>1-minute to 15-minute:</strong> For day trading and very short-term movements</li>
              <li><strong>1-hour to 4-hour:</strong> For intraday analysis and swing trading</li>
              <li><strong>Daily:</strong> Most common for general analysis and swing trading</li>
              <li><strong>Weekly/Monthly:</strong> For long-term trends and investment decisions</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Support and Resistance Levels</h3>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                  <h4 className="font-semibold text-gray-900">Support Level</h4>
                </div>
                <p className="text-gray-700 text-sm">
                  Price level where a stock tends to find buying interest and bounce back up. 
                  Like a floor that prevents prices from falling further.
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <BarChart3 className="w-5 h-5 text-red-600 mr-2" />
                  <h4 className="font-semibold text-gray-900">Resistance Level</h4>
                </div>
                <p className="text-gray-700 text-sm">
                  Price level where a stock tends to face selling pressure and move down. 
                  Like a ceiling that prevents prices from rising further.
                </p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Volume Analysis</h3>
            <p className="text-gray-700 mb-4">
              Volume is the number of shares traded during a specific time period. It's crucial for understanding 
              the strength of price movements:
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <ul className="list-disc pl-4 text-gray-700">
                <li><strong>High volume with price increase:</strong> Strong bullish signal</li>
                <li><strong>High volume with price decrease:</strong> Strong bearish signal</li>
                <li><strong>Low volume with price movement:</strong> Weak signal, movement may not sustain</li>
                <li><strong>Volume spikes:</strong> Often indicate important news or events</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Common Chart Patterns (Educational)</h3>
            <p className="text-gray-700 mb-4">
              These patterns are commonly studied in technical analysis education:
            </p>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="border border-gray-200 p-3 rounded">
                <h4 className="font-semibold text-gray-900 text-sm mb-1">Head and Shoulders</h4>
                <p className="text-gray-600 text-xs">Potential trend reversal pattern</p>
              </div>
              <div className="border border-gray-200 p-3 rounded">
                <h4 className="font-semibold text-gray-900 text-sm mb-1">Double Top/Bottom</h4>
                <p className="text-gray-600 text-xs">Potential reversal at key levels</p>
              </div>
              <div className="border border-gray-200 p-3 rounded">
                <h4 className="font-semibold text-gray-900 text-sm mb-1">Triangle Patterns</h4>
                <p className="text-gray-600 text-xs">Consolidation before breakout</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Tips for Chart Reading Practice</h3>
            <ol className="list-decimal pl-6 text-gray-700 mb-6">
              <li className="mb-2"><strong>Start Simple:</strong> Begin with line charts before moving to candlesticks</li>
              <li className="mb-2"><strong>Practice Daily:</strong> Look at charts regularly to develop pattern recognition</li>
              <li className="mb-2"><strong>Use Multiple Time Frames:</strong> Check different time frames for complete picture</li>
              <li className="mb-2"><strong>Keep a Trading Journal:</strong> Record your observations and learnings</li>
              <li className="mb-2"><strong>Don't Rely Solely on Charts:</strong> Combine with fundamental analysis</li>
            </ol>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Common Mistakes to Avoid</h3>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <ul className="list-disc pl-4 text-gray-700">
                <li>Over-analyzing every small price movement</li>
                <li>Seeing patterns that don't actually exist</li>
                <li>Ignoring volume when analyzing price movements</li>
                <li>Using only one time frame for analysis</li>
                <li>Making investment decisions based on charts alone</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Conclusion</h3>
            <p className="text-gray-700 mb-6">
              Learning to read financial charts is a valuable skill that takes time to develop. Charts are tools 
              that help visualize price movements and market sentiment, but they should be used in conjunction 
              with other forms of analysis and research.
            </p>

            <p className="text-gray-700 mb-6">
              <strong>Remember: Chart patterns and technical analysis are educational concepts. 
              Always consult with SEBI registered investment advisors before making any investment decisions. 
              Past price patterns do not guarantee future performance.</strong>
            </p>
          </div>

          {/* Related Links */}
          <div className="border-t border-gray-200 pt-8 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Continue Learning</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/blog/understanding-market-basics-beginners" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <h4 className="font-semibold text-gray-900 mb-2">Market Basics for Beginners</h4>
                <p className="text-gray-600 text-sm">Start with the fundamentals of how stock markets work.</p>
              </Link>
              <Link href="/blog/risk-management-trading-education" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <h4 className="font-semibold text-gray-900 mb-2">Risk Management in Trading</h4>
                <p className="text-gray-600 text-sm">Learn how to protect your capital while trading.</p>
              </Link>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
