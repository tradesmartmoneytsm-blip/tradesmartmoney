import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { ArrowLeft, BookOpen, TrendingUp, BarChart3, Activity, AlertTriangle } from 'lucide-react';

// SEO IMPROVEMENT #2: Meta Description (150-160 chars)
export const metadata: Metadata = {
  title: 'How to Read Financial Charts: Beginner\'s Guide | TradeSmart Money',
  description: 'Learn to read stock charts, candlestick patterns, support resistance levels, and volume analysis. Complete guide with examples for Indian market trading.',
  keywords: 'how to read stock charts, candlestick charts, technical analysis, chart patterns, support resistance, volume analysis, chart reading guide',
  authors: [{ name: 'TradeSmart Team' }],
  openGraph: {
    title: 'How to Read Financial Charts: Educational Guide for Beginners',
    description: 'Learn candlestick charts, patterns, technical indicators, and price analysis with practical examples',
    url: 'https://www.tradesmartmoney.com/blog/how-to-read-financial-charts',
    type: 'article',
    publishedTime: '2025-01-28T05:30:00.000Z',
    modifiedTime: '2025-02-07T05:30:00.000Z',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Read Financial Charts: Beginner\'s Guide',
    description: 'Learn stock charts, candlestick patterns, and technical analysis',
  },
  alternates: {
    canonical: 'https://www.tradesmartmoney.com/blog/how-to-read-financial-charts',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ChartReadingPost() {
  return (
    <>
      {/* SEO IMPROVEMENT #1: Structured Data */}
      <Script id="article-schema" type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'How to Read Financial Charts: Educational Guide for Beginners',
          description: 'Learn to read stock charts, candlestick patterns, support resistance levels, and volume analysis. Complete guide with examples for Indian market trading.',
          image: 'https://www.tradesmartmoney.com/favicon.svg',
          author: {
            '@type': 'Organization',
            name: 'TradeSmart Money',
            url: 'https://www.tradesmartmoney.com',
          },
          publisher: {
            '@type': 'Organization',
            name: 'TradeSmart Money',
            logo: {
              '@type': 'ImageObject',
              url: 'https://www.tradesmartmoney.com/favicon.svg',
            },
          },
          datePublished: '2025-01-28T05:30:00.000Z',
          dateModified: '2025-02-07T05:30:00.000Z',
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': 'https://www.tradesmartmoney.com/blog/how-to-read-financial-charts',
          },
          articleSection: 'Technical Analysis',
          keywords: 'chart reading, candlestick patterns, technical analysis, stock charts',
          wordCount: 1500,
          timeRequired: 'PT12M',
        })}
      </Script>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <Link href="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" aria-label="Back arrow icon" />
              Back to Blog
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              How to Read Financial Charts: Educational Guide for Beginners
            </h1>
            <div className="flex items-center text-gray-600 text-sm">
              <BookOpen className="w-4 h-4 mr-2" aria-label="Educational guide icon" />
              <span>Educational Guide</span>
              <span className="mx-2">•</span>
              <span>12 min read</span>
              <span className="mx-2">•</span>
              <span>January 28, 2025</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          <article className="bg-white rounded-lg shadow-lg p-8">
            {/* Disclaimer */}
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
              <div className="flex">
                <AlertTriangle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" aria-label="Warning icon" />
                <div>
                  <p className="text-sm text-red-800 font-medium">
                    <strong>Educational Disclaimer:</strong> This content is for educational purposes only. 
                    We are not SEBI registered advisors. Chart reading requires practice and should not be the sole basis for investment decisions.
                  </p>
                </div>
              </div>
            </div>

            {/* Hero Image - Chart Analysis */}
            <div className="mb-8 rounded-lg overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=500&fit=crop"
                alt="Financial chart analysis showing candlestick patterns and technical indicators for beginners"
                width={1200}
                height={500}
                className="w-full h-auto"
                priority
              />
            </div>

            {/* Chart Types Visual Grid */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=400&h=300&fit=crop"
                  alt="Candlestick chart example showing price action and trading patterns"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop"
                  alt="Technical indicators on trading chart with moving averages and volume"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=300&fit=crop"
                  alt="Stock market chart reading tutorial for beginners"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Understanding Financial Charts</h2>
              <p className="text-gray-700 mb-6">
                Financial charts are visual representations of price movements over time. They help investors and traders 
                understand how a stock's price has behaved historically and identify potential patterns. Learning to read 
                charts is like learning a new language - it takes time and practice. 
                {/* SEO IMPROVEMENT #4: Internal Link */}
                You can practice chart reading with live data on our{' '}
                <Link href="/market/sector-performance" className="text-blue-600 hover:underline font-medium">
                  sector performance charts
                </Link>{' '}
                and explore{' '}
                <Link href="/swing-trades" className="text-blue-600 hover:underline font-medium">
                  swing trading examples
                </Link>.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Types of Charts</h3>
              
              <h4 className="text-lg font-semibold text-gray-900 mb-3">1. Line Charts</h4>
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <div className="flex items-center mb-2">
                  {/* SEO IMPROVEMENT #3: Add aria-labels */}
                  <Activity className="w-5 h-5 text-blue-600 mr-2" aria-label="Line chart icon" />
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
                  <BarChart3 className="w-5 h-5 text-green-600 mr-2" aria-label="Candlestick chart icon" />
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
                    <div className="w-4 h-4 bg-green-500 rounded mr-3 mt-1" aria-label="Bullish candle indicator"></div>
                    <div>
                      <h5 className="font-semibold text-gray-900">Long Green Candle</h5>
                      <p className="text-gray-700 text-sm">Strong buying pressure, bullish sentiment</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-4 h-4 bg-red-500 rounded mr-3 mt-1" aria-label="Bearish candle indicator"></div>
                    <div>
                      <h5 className="font-semibold text-gray-900">Long Red Candle</h5>
                      <p className="text-gray-700 text-sm">Strong selling pressure, bearish sentiment</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-4 h-2 bg-gray-400 rounded mr-3 mt-2" aria-label="Doji candle indicator"></div>
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
                    <TrendingUp className="w-5 h-5 text-green-600 mr-2" aria-label="Support level icon" />
                    <h4 className="font-semibold text-gray-900">Support Level</h4>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Price level where a stock tends to find buying interest and bounce back up. 
                    Like a floor that prevents prices from falling further.
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <BarChart3 className="w-5 h-5 text-red-600 mr-2" aria-label="Resistance level icon" />
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
                the strength of price movements. 
                {/* SEO IMPROVEMENT #4: Internal Link */}
                Monitor volume patterns on our{' '}
                <Link href="/market/top-gainers" className="text-blue-600 hover:underline font-medium">
                  top gainers page
                </Link>{' '}
                to identify strong moves.
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

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Moving Averages on Charts</h3>
              <p className="text-gray-700 mb-4">
                Moving averages are trend-following indicators plotted directly on price charts:
              </p>
              <div className="space-y-3 mb-6">
                <div className="bg-gray-50 p-3 rounded">
                  <strong className="text-gray-900">50-Day Moving Average (50 DMA):</strong>
                  <span className="text-gray-700 text-sm ml-2">
                    Average price over the last 50 trading days, shows medium-term trend
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <strong className="text-gray-900">200-Day Moving Average (200 DMA):</strong>
                  <span className="text-gray-700 text-sm ml-2">
                    Average price over the last 200 trading days, shows long-term trend
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Tips for Chart Reading Practice</h3>
              <ol className="list-decimal pl-6 text-gray-700 mb-6">
                <li className="mb-2"><strong>Start Simple:</strong> Begin with line charts before moving to candlesticks</li>
                <li className="mb-2"><strong>Practice Daily:</strong> Look at charts regularly to develop pattern recognition</li>
                <li className="mb-2"><strong>Use Multiple Time Frames:</strong> Check different time frames for complete picture</li>
                <li className="mb-2"><strong>Keep a Trading Journal:</strong> Record your observations and learnings</li>
                <li className="mb-2"><strong>Don't Rely Solely on Charts:</strong> Combine with fundamental analysis. 
                  Read our{' '}
                  <Link href="/blog/understanding-market-basics-beginners" className="text-blue-600 hover:underline">
                    market basics guide
                  </Link>{' '}
                  for a complete approach.
                </li>
              </ol>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Common Mistakes to Avoid</h3>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <ul className="list-disc pl-4 text-gray-700">
                  <li>Over-analyzing every small price movement</li>
                  <li>Seeing patterns that don't actually exist (pattern bias)</li>
                  <li>Ignoring volume when analyzing price movements</li>
                  <li>Using only one time frame for analysis</li>
                  <li>Making investment decisions based on charts alone</li>
                  <li>Not using proper{' '}
                    <Link href="/blog/risk-management-trading-education" className="text-yellow-800 hover:underline font-medium">
                      risk management
                    </Link>
                  </li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Conclusion</h3>
              <p className="text-gray-700 mb-6">
                Learning to read financial charts is a valuable skill that takes time to develop. Charts are tools 
                that help visualize price movements and market sentiment, but they should be used in conjunction 
                with other forms of analysis and research. Practice regularly with real market data to improve 
                your chart reading skills.
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
    </>
  );
}
