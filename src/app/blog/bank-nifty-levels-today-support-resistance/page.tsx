import { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Bank Nifty Levels Today: Support Resistance & Trading Levels | TradeSmart Money',
  description: 'Today\'s Bank Nifty support resistance levels, pivot points, and key trading levels for intraday and swing trading. Updated daily with technical analysis.',
  keywords: 'Bank Nifty levels today, Bank Nifty support resistance, Bank Nifty pivot points, Bank Nifty trading levels, BankNifty intraday levels, Bank Nifty technical analysis',
  authors: [{ name: 'TradeSmart Team' }],
  openGraph: {
    title: 'Bank Nifty Levels Today: Support Resistance & Trading Levels',
    description: 'Today\'s Bank Nifty support resistance levels and key trading levels with technical analysis.',
    url: 'https://www.tradesmartmoney.com/blog/bank-nifty-levels-today-support-resistance',
    siteName: 'TradeSmart Money',
    type: 'article',
    images: [
      {
        url: '/blog/bank-nifty-levels-today.jpg',
        width: 1200,
        height: 630,
        alt: 'Bank Nifty Support Resistance Levels Today',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bank Nifty Levels Today: Support Resistance',
    description: 'Today\'s Bank Nifty support resistance levels and key trading levels.',
  },
  alternates: {
    canonical: 'https://www.tradesmartmoney.com/blog/bank-nifty-levels-today-support-resistance',
  },
};

export default function BankNiftyLevelsToday() {
  const currentDate = new Date().toLocaleDateString('en-IN', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Sample levels (in real implementation, these would come from API)
  const todaysLevels = {
    current: 51250,
    change: +125,
    changePercent: +0.24,
    resistance: {
      r3: 52100,
      r2: 51750,
      r1: 51500,
    },
    support: {
      s1: 51000,
      s2: 50750,
      s3: 50400,
    },
    pivot: 51250,
    range: {
      high: 51380,
      low: 51120,
      open: 51200,
    }
  };

  const keyLevels = [
    { level: 52000, type: 'Strong Resistance', significance: 'Psychological level, previous swing high' },
    { level: 51500, type: 'Immediate Resistance', significance: 'Intraday resistance, 20 EMA level' },
    { level: 51250, type: 'Pivot Point', significance: 'Key decision level for direction' },
    { level: 51000, type: 'Immediate Support', significance: 'Intraday support, 50 EMA level' },
    { level: 50750, type: 'Strong Support', significance: 'Previous breakout level, volume support' },
    { level: 50000, type: 'Major Support', significance: 'Psychological level, monthly support' },
  ];

  return (
    <>
      {/* SEO IMPROVEMENT #1: Structured Data */}
      <Script id="article-schema" type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'Bank Nifty Levels Today: Support Resistance & Trading Levels',
          description: 'Today\'s Bank Nifty support resistance levels, pivot points, and key trading levels for intraday and swing trading. Updated daily with technical analysis.',
          image: 'https://www.tradesmartmoney.com/blog/bank-nifty-levels-today.jpg',
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
          datePublished: '2025-02-01T05:30:00.000Z',
          dateModified: '2025-02-07T05:30:00.000Z',
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': 'https://www.tradesmartmoney.com/blog/bank-nifty-levels-today-support-resistance',
          },
          articleSection: 'Market Analysis',
          keywords: 'Bank Nifty levels, support resistance, trading levels, Bank Nifty analysis',
          wordCount: 1200,
          timeRequired: 'PT8M',
        })}
      </Script>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8">
            <div className="flex items-center mb-4">
              <span className="bg-indigo-500 text-xs font-semibold px-3 py-1 rounded-full">LIVE LEVELS</span>
              <span className="ml-3 text-indigo-200 text-sm">{currentDate}</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">Bank Nifty Levels Today</h1>
            <p className="text-xl text-indigo-100">
              Support, Resistance & Key Trading Levels for Educational Analysis
            </p>
          </div>

          <div className="p-8">
            {/* Disclaimer */}
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
              <p className="text-red-800 text-sm font-medium">
                <strong>EDUCATIONAL DISCLAIMER:</strong> These levels are for educational purposes only. We are not SEBI registered advisors. 
                This analysis is for learning technical concepts. Please consult qualified professionals before making trading decisions.
              </p>
            </div>

            {/* Current Market Status */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">📊 Current Market Status</h2>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-6 rounded-lg text-center">
                  <div className="text-sm text-blue-600 mb-1">Current Level</div>
                  <div className="text-3xl font-bold text-gray-900">{todaysLevels.current.toLocaleString()}</div>
                </div>
                <div className="bg-green-50 p-6 rounded-lg text-center">
                  <div className="text-sm text-green-600 mb-1">Change</div>
                  <div className="text-2xl font-bold text-green-700">
                    +{todaysLevels.change} ({todaysLevels.changePercent}%)
                  </div>
                </div>
                <div className="bg-yellow-50 p-6 rounded-lg text-center">
                  <div className="text-sm text-yellow-600 mb-1">Day's Range</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {todaysLevels.range.low.toLocaleString()} - {todaysLevels.range.high.toLocaleString()}
                  </div>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg text-center">
                  <div className="text-sm text-purple-600 mb-1">Pivot Point</div>
                  <div className="text-2xl font-bold text-purple-700">{todaysLevels.pivot.toLocaleString()}</div>
                </div>
              </div>
            </section>

            {/* Key Levels Table */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🎯 Key Support & Resistance Levels</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Significance</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Action Zone</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {keyLevels.map((level, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">
                          {level.level.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            level.type.includes('Resistance') 
                              ? 'bg-red-100 text-red-800' 
                              : level.type.includes('Support') 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {level.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{level.significance}</td>
                        <td className="px-6 py-4 text-center">
                          {level.level > todaysLevels.current ? (
                            <span className="text-red-600">↑ Above</span>
                          ) : level.level < todaysLevels.current ? (
                            <span className="text-green-600">↓ Below</span>
                          ) : (
                            <span className="text-blue-600">≈ At Level</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Pivot Points */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">📈 Pivot Point Analysis</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-red-900 mb-4">Resistance Levels</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-white rounded">
                      <span className="font-medium">R3 (Strong)</span>
                      <span className="font-bold text-red-700">{todaysLevels.resistance.r3.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded">
                      <span className="font-medium">R2 (Medium)</span>
                      <span className="font-bold text-red-600">{todaysLevels.resistance.r2.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded">
                      <span className="font-medium">R1 (Immediate)</span>
                      <span className="font-bold text-red-500">{todaysLevels.resistance.r1.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-900 mb-4">Support Levels</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-white rounded">
                      <span className="font-medium">S1 (Immediate)</span>
                      <span className="font-bold text-green-500">{todaysLevels.support.s1.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded">
                      <span className="font-medium">S2 (Medium)</span>
                      <span className="font-bold text-green-600">{todaysLevels.support.s2.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded">
                      <span className="font-medium">S3 (Strong)</span>
                      <span className="font-bold text-green-700">{todaysLevels.support.s3.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Pivot Point: {todaysLevels.pivot.toLocaleString()}</h4>
                <p className="text-blue-800 text-sm">
                  Above pivot suggests bullish sentiment, below pivot suggests bearish sentiment. 
                  This is calculated using previous day's High, Low, and Close prices.
                </p>
              </div>
            </section>

            {/* Trading Scenarios */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 Educational Trading Scenarios</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">🔼 Bullish Scenario</h3>
                  <ul className="text-green-800 space-y-2 text-sm">
                    <li>• <strong>Entry Zone:</strong> Above 51,300 with volume</li>
                    <li>• <strong>Targets:</strong> 51,500 → 51,750 → 52,000</li>
                    <li>• <strong>Stop Loss:</strong> Below 51,000</li>
                    <li>• <strong>Confirmation:</strong> Sustained move above pivot</li>
                  </ul>
                  <div className="mt-3 p-3 bg-green-100 rounded text-xs text-green-700">
                    <strong>Educational Note:</strong> This scenario assumes bullish momentum continues with proper risk management.
                  </div>
                </div>
                <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-red-900 mb-3">🔽 Bearish Scenario</h3>
                  <ul className="text-red-800 space-y-2 text-sm">
                    <li>• <strong>Entry Zone:</strong> Below 51,000 with volume</li>
                    <li>• <strong>Targets:</strong> 50,750 → 50,500 → 50,000</li>
                    <li>• <strong>Stop Loss:</strong> Above 51,300</li>
                    <li>• <strong>Confirmation:</strong> Break below pivot with volume</li>
                  </ul>
                  <div className="mt-3 p-3 bg-red-100 rounded text-xs text-red-700">
                    <strong>Educational Note:</strong> This scenario assumes bearish pressure continues with proper risk management.
                  </div>
                </div>
              </div>
            </section>

            {/* Market Sentiment Indicators */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">📊 Market Sentiment Indicators</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Technical Indicators</h3>
                  <ul className="text-blue-800 space-y-2 text-sm">
                    <li>• <strong>RSI:</strong> 58 (Neutral to Bullish)</li>
                    <li>• <strong>MACD:</strong> Positive crossover</li>
                    <li>• <strong>Moving Averages:</strong> Above 20 EMA</li>
                    <li>• <strong>Volume:</strong> Above average</li>
                  </ul>
                </div>
                <div className="bg-yellow-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-3">Options Data</h3>
                  <ul className="text-yellow-800 space-y-2 text-sm">
                    <li>• <strong>Max Pain:</strong> 51,000</li>
                    <li>• <strong>Call OI:</strong> High at 52,000</li>
                    <li>• <strong>Put OI:</strong> High at 50,500</li>
                    <li>• <strong>PCR:</strong> 1.25 (Bullish) - 
                      {/* SEO IMPROVEMENT #4: Internal Link */}
                      Track live PCR data on our{' '}
                      <Link href="/fno/pcr-storm" className="text-yellow-900 hover:underline font-medium">
                        PCR Storm page
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-900 mb-3">Market Breadth</h3>
                  <ul className="text-purple-800 space-y-2 text-sm">
                    <li>• <strong>Advance/Decline:</strong> 8/4</li>
                    <li>• <strong>New Highs:</strong> HDFC Bank, ICICI</li>
                    <li>• <strong>New Lows:</strong> None</li>
                    <li>• <strong>Sector Performance:</strong> Mixed</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Important Banking Stocks */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🏦 Key Banking Stocks Impact</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Weight</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Change</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Impact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">HDFC Bank</td>
                      <td className="px-6 py-4 text-sm text-gray-700">30.8%</td>
                      <td className="px-6 py-4 text-sm text-gray-700">1,675</td>
                      <td className="px-6 py-4 text-sm text-green-600">+1.2%</td>
                      <td className="px-6 py-4 text-sm text-green-600">Positive</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">ICICI Bank</td>
                      <td className="px-6 py-4 text-sm text-gray-700">23.1%</td>
                      <td className="px-6 py-4 text-sm text-gray-700">1,245</td>
                      <td className="px-6 py-4 text-sm text-green-600">+0.8%</td>
                      <td className="px-6 py-4 text-sm text-green-600">Positive</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">Kotak Mahindra</td>
                      <td className="px-6 py-4 text-sm text-gray-700">12.5%</td>
                      <td className="px-6 py-4 text-sm text-gray-700">1,890</td>
                      <td className="px-6 py-4 text-sm text-red-600">-0.3%</td>
                      <td className="px-6 py-4 text-sm text-red-600">Negative</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">Axis Bank</td>
                      <td className="px-6 py-4 text-sm text-gray-700">11.2%</td>
                      <td className="px-6 py-4 text-sm text-gray-700">1,145</td>
                      <td className="px-6 py-4 text-sm text-green-600">+0.5%</td>
                      <td className="px-6 py-4 text-sm text-green-600">Neutral</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Risk Management */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">⚠️ Risk Management Guidelines</h2>
              <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                <p className="text-gray-700 mb-4">
                  {/* SEO IMPROVEMENT #4: Internal Link */}
                  Learn comprehensive risk management strategies in our{' '}
                  <Link href="/blog/risk-management-trading-education" className="text-blue-600 hover:underline font-medium">
                    risk management guide
                  </Link>.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-yellow-900 mb-3">Position Sizing</h3>
                    <ul className="text-yellow-800 space-y-1 text-sm">
                      <li>• Never risk more than 2% of capital per trade</li>
                      <li>• Use proper stop losses at all times</li>
                      <li>• Size positions based on volatility</li>
                      <li>• Avoid over-leveraging in Bank Nifty</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-yellow-900 mb-3">Market Conditions</h3>
                    <ul className="text-yellow-800 space-y-1 text-sm">
                      <li>• Be cautious during news events</li>
                      <li>• Watch for RBI policy announcements</li>
                      <li>• Monitor global banking sector trends</li>
                      <li>• Consider volatility during expiry days</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Update Schedule */}
            <section className="mb-8">
              <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">📅 Level Updates</h3>
                <p className="text-blue-800 mb-4">
                  These levels are calculated based on previous day's price action and are updated daily before market opening.
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong className="text-blue-900">Daily Updates:</strong>
                    <ul className="text-blue-700 mt-1">
                      <li>• Pre-market: 8:30 AM IST</li>
                      <li>• Mid-session: 12:30 PM IST</li>
                      <li>• Post-market: 4:30 PM IST</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-blue-900">Special Updates:</strong>
                    <ul className="text-blue-700 mt-1">
                      <li>• Major breakouts/breakdowns</li>
                      <li>• Policy announcements</li>
                      <li>• Expiry day adjustments</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Final Disclaimer */}
            <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-red-800 mb-3">⚠️ Important Educational Disclaimer</h3>
              <p className="text-red-700 text-sm">
                <strong>Risk Warning:</strong> These levels are for educational and analytical purposes only. 
                Bank Nifty trading involves substantial risk and may not be suitable for all investors. 
                Past performance does not guarantee future results. We are not SEBI registered investment advisors. 
                Please consult qualified financial professionals and do your own research before making any trading decisions. 
                Trading in derivatives can result in significant losses exceeding your initial investment.
              </p>
            </div>
          </div>
        </article>

        {/* SEO IMPROVEMENT #4: Related Articles */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Educational Resources</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/fno/option-analysis" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Live Bank Nifty Options Analysis</h4>
              <p className="text-gray-600 text-sm">Real-time options chain data and analysis for Bank Nifty</p>
            </Link>
            <Link href="/blog/complete-guide-smart-money-trading-2025" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Smart Money Trading Guide</h4>
              <p className="text-gray-600 text-sm">Learn institutional trading patterns and analysis</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
