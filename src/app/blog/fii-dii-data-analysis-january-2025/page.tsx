import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, User, Clock, Share2, BookOpen, TrendingUp, BarChart2, Globe } from 'lucide-react';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'FII DII Data Analysis: How Institutional Flows Move Indian Markets | TradeSmart Money',
  description: 'Learn how to read and analyse FII DII data to predict Indian market movements. Understand institutional buying-selling patterns, their impact on Nifty, and how to use this data in your trading.',
  keywords: 'FII DII data analysis, FII data India, DII buying selling, institutional flow analysis, FII impact Nifty, foreign institutional investors India, domestic institutional investors',
  authors: [{ name: 'TradeSmart Research Team' }],
  openGraph: {
    title: 'FII DII Data Analysis: How Institutional Flows Move Indian Markets',
    description: 'Learn how to read and analyse FII DII data to predict Indian market direction and improve your trading decisions.',
    url: 'https://www.tradesmartmoney.com/blog/fii-dii-data-analysis-january-2025',
    type: 'article',
    publishedTime: '2025-01-20T05:30:00.000Z',
    modifiedTime: '2025-03-10T05:30:00.000Z',
    authors: ['TradeSmart Research Team'],
    tags: ['FII', 'DII', 'Institutional Flows', 'Market Analysis', 'Indian Markets'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FII DII Data Analysis: Institutional Flows in Indian Markets',
    description: 'How to read FII DII data to predict Indian market movements and improve trading decisions.',
  },
  alternates: {
    canonical: 'https://www.tradesmartmoney.com/blog/fii-dii-data-analysis-january-2025',
  },
  robots: { index: true, follow: true },
};

const tableOfContents = [
  { id: 'what-is-fii-dii', title: 'What Are FII and DII?', level: 2 },
  { id: 'where-to-find-data', title: 'Where to Find FII/DII Data', level: 2 },
  { id: 'reading-the-data', title: 'How to Read the Data', level: 2 },
  { id: 'market-impact', title: 'Market Impact of Institutional Flows', level: 2 },
  { id: 'patterns', title: 'Common FII/DII Flow Patterns', level: 2 },
  { id: 'practical-use', title: 'Using FII/DII Data in Your Trading', level: 2 },
  { id: 'limitations', title: 'Limitations of FII/DII Analysis', level: 2 },
  { id: 'conclusion', title: 'Key Takeaways', level: 2 },
];

const relatedPosts = [
  {
    slug: 'complete-guide-smart-money-trading-2025',
    title: 'Complete Guide to Smart Money Trading in 2025',
    excerpt: 'Master institutional money flow analysis and advanced order flow techniques for Indian markets.',
  },
  {
    slug: 'nifty-50-prediction-2025',
    title: 'Nifty 50 Prediction 2025: Expert Analysis & Target Levels',
    excerpt: 'Comprehensive Nifty 50 technical and fundamental analysis with target levels.',
  },
];

export default function FiiDiiDataAnalysis() {
  const publishDate = new Date('2025-01-20T05:30:00.000Z');

  return (
    <>
      <Script id="blog-structured-data" type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'FII DII Data Analysis: How Institutional Flows Move Indian Markets',
          description: 'Learn how to read and analyse FII DII data to predict Indian market movements and improve your trading decisions.',
          image: 'https://www.tradesmartmoney.com/api/og?title=FII%20DII%20Data%20Analysis',
          author: { '@type': 'Organization', name: 'TradeSmart Money', url: 'https://www.tradesmartmoney.com' },
          publisher: {
            '@type': 'Organization',
            name: 'TradeSmart Money',
            logo: { '@type': 'ImageObject', url: 'https://www.tradesmartmoney.com/favicon.svg' },
          },
          datePublished: '2025-01-20T05:30:00.000Z',
          dateModified: '2025-03-10T05:30:00.000Z',
          mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.tradesmartmoney.com/blog/fii-dii-data-analysis-january-2025' },
          articleSection: 'Market Analysis',
          keywords: 'FII DII, institutional flows, Indian markets, Nifty analysis',
          wordCount: 2100,
          timeRequired: 'PT11M',
        })}
      </Script>

      <div className="min-h-screen bg-white">
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </div>
        </div>

        <header className="bg-gradient-to-r from-blue-700 via-blue-600 to-green-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                <BarChart2 className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              FII DII Data Analysis: How Institutional Flows Move Indian Markets
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              A practical guide to reading FII and DII data, understanding institutional buying-selling patterns, and using this intelligence in your trading decisions
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-blue-100">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                {publishDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                TradeSmart Research Team
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                11 min read
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-2 order-2 lg:order-1">
              <div className="sticky top-8">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Table of Contents
                  </h3>
                  <nav>
                    <ul className="space-y-3">
                      {tableOfContents.map((item) => (
                        <li key={item.id}>
                          <a href={`#${item.id}`} className="text-sm text-gray-600 hover:text-blue-600 transition-colors block py-1">
                            {item.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
                <div className="mt-8 bg-gray-50 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                    <Share2 className="w-5 h-5 mr-2" />
                    Share Article
                  </h3>
                  <div className="space-y-2">
                    <button className="w-full text-left text-sm text-gray-600 hover:text-blue-600 transition-colors py-2">Share on Twitter</button>
                    <button className="w-full text-left text-sm text-gray-600 hover:text-blue-600 transition-colors py-2">Share on LinkedIn</button>
                    <button className="w-full text-left text-sm text-gray-600 hover:text-blue-600 transition-colors py-2">Copy Link</button>
                  </div>
                </div>
              </div>
            </div>

            <article className="lg:col-span-10 order-1 lg:order-2">
              <div className="prose prose-lg max-w-none">
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8 rounded-r-lg">
                  <p className="text-red-800 text-sm font-medium">
                    <strong>Educational Disclaimer:</strong> All analysis presented here is for educational purposes only. This is not investment advice. We are not SEBI registered advisors.
                  </p>
                </div>

                <div className="mb-10 rounded-xl overflow-hidden shadow-xl">
                  <Image
                    src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200&h=600&fit=crop"
                    alt="Institutional investors analysing FII DII market flow data on trading terminals"
                    width={1200}
                    height={600}
                    className="w-full h-auto"
                    priority
                  />
                </div>

                <section id="what-is-fii-dii" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                    <Globe className="w-8 h-8 mr-3 text-blue-600" />
                    What Are FII and DII?
                  </h2>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    In the Indian stock market, institutional participants are broadly classified into two categories: Foreign Institutional Investors (FII) — also called Foreign Portfolio Investors (FPI) — and Domestic Institutional Investors (DII). Together, they control a significant portion of market capitalisation and their buying/selling has an outsized impact on index direction.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-blue-50 rounded-xl p-6">
                      <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                        <Globe className="w-5 h-5" /> Foreign Institutional Investors (FII/FPI)
                      </h3>
                      <ul className="text-blue-800 space-y-2 text-sm">
                        <li>• Overseas funds, hedge funds, sovereign wealth funds</li>
                        <li>• Registered with SEBI under FPI category</li>
                        <li>• Sensitive to USD/INR exchange rate and global risk appetite</li>
                        <li>• Can move markets significantly due to large position sizes</li>
                        <li>• Tend to react to US Fed policy, crude oil, and EM sentiment</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 rounded-xl p-6">
                      <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" /> Domestic Institutional Investors (DII)
                      </h3>
                      <ul className="text-green-800 space-y-2 text-sm">
                        <li>• Mutual funds, insurance companies, banks, pension funds</li>
                        <li>• Funded by domestic savings (SIP, ULIP, NPS flows)</li>
                        <li>• Often buy on FII-driven dips, providing market support</li>
                        <li>• Monthly SIP inflows (~₹20,000+ Cr) are largely price-insensitive</li>
                        <li>• Long-term oriented, lower volatility impact</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section id="where-to-find-data" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Where to Find FII/DII Data</h2>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    NSE publishes provisional FII and DII cash market data every evening after market close. You can track this data in real time on our market analysis dashboard, which aggregates daily institutional flow data with trend analysis.
                  </p>
                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <h3 className="font-bold text-gray-900 mb-4">Primary Data Sources:</h3>
                    <div className="space-y-3">
                      {[
                        { source: 'NSE India (nseindia.com)', detail: 'Official provisional FII/DII data released daily after market close under the "Market Data" section.' },
                        { source: 'SEBI Website', detail: 'Weekly and monthly FII/DII data in both cash and derivatives segments. Useful for trend analysis.' },
                        { source: 'TradeSmart Money Market Dashboard', detail: 'Aggregated daily FII/DII data with 30-day rolling charts for trend identification.' },
                        { source: 'BSE India (bseindia.com)', detail: 'BSE-listed stock institutional activity data including bulk and block deals.' },
                      ].map((item, i) => (
                        <div key={i} className="flex gap-3">
                          <div className="text-blue-500 font-bold shrink-0">→</div>
                          <div>
                            <span className="font-semibold text-gray-900">{item.source}: </span>
                            <span className="text-gray-600 text-sm">{item.detail}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <div className="mb-10 grid md:grid-cols-2 gap-6">
                  <Image
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop"
                    alt="Financial data dashboard showing FII DII institutional flow charts"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-lg"
                  />
                  <Image
                    src="https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=600&h=400&fit=crop"
                    alt="Indian stock market NSE screen showing institutional trading activity"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-lg"
                  />
                </div>

                <section id="reading-the-data" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">How to Read the Data</h2>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    The raw data shows daily gross purchases, gross sales, and net value (purchases minus sales) for both FII and DII in the cash segment. Here is what each number tells you:
                  </p>
                  <div className="overflow-x-auto mb-6">
                    <table className="min-w-full bg-white border border-gray-200 rounded-xl overflow-hidden">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase">Column</th>
                          <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase">What it means</th>
                          <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase">How to use it</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-5 py-4 text-sm font-medium text-gray-900">Net FII (positive)</td>
                          <td className="px-5 py-4 text-sm text-gray-700">FIIs bought more than they sold</td>
                          <td className="px-5 py-4 text-sm text-green-700 font-medium">Bullish signal — global confidence in India is high</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="px-5 py-4 text-sm font-medium text-gray-900">Net FII (negative)</td>
                          <td className="px-5 py-4 text-sm text-gray-700">FIIs sold more than they bought</td>
                          <td className="px-5 py-4 text-sm text-red-700 font-medium">Bearish pressure — watch for market dips</td>
                        </tr>
                        <tr>
                          <td className="px-5 py-4 text-sm font-medium text-gray-900">Net DII (positive)</td>
                          <td className="px-5 py-4 text-sm text-gray-700">Domestic institutions are net buyers</td>
                          <td className="px-5 py-4 text-sm text-blue-700 font-medium">Support building — market less likely to crash sharply</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="px-5 py-4 text-sm font-medium text-gray-900">Both negative</td>
                          <td className="px-5 py-4 text-sm text-gray-700">Both FII and DII are selling</td>
                          <td className="px-5 py-4 text-sm text-red-700 font-medium">High risk period — reduce exposure significantly</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                <section id="patterns" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Common FII/DII Flow Patterns</h2>
                  <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                      <h3 className="font-bold text-green-800 mb-2">Pattern 1: FII Selling + DII Buying (Accumulation)</h3>
                      <p className="text-green-700 text-sm">This is one of the most reliable bottom-formation signals. When FIIs exit due to global risk-off events, DIIs step in with systematic SIP and ULIP-driven purchases. This often marks a medium-term low. Historical examples: October 2021, June 2022, October 2023.</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <h3 className="font-bold text-blue-800 mb-2">Pattern 2: Both FII + DII Buying (Dual Inflow)</h3>
                      <p className="text-blue-700 text-sm">When both institutional categories are net buyers simultaneously, it creates strong and sustained rallies. This alignment typically occurs during economic upturn periods or post-budget when corporate earnings visibility is high.</p>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                      <h3 className="font-bold text-yellow-800 mb-2">Pattern 3: FII Buying + DII Selling (Distribution)</h3>
                      <p className="text-yellow-700 text-sm">DIIs booking profits at higher levels while FIIs are still entering. This often occurs near market tops when valuations are stretched. It is a caution signal, not necessarily an immediate sell, but warrants reducing overweight positions.</p>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                      <h3 className="font-bold text-red-800 mb-2">Pattern 4: Consecutive 5+ Day FII Outflows</h3>
                      <p className="text-red-700 text-sm">Sustained FII selling over multiple sessions (₹5,000+ Cr daily) usually leads to significant index corrections of 3–7%. This often coincides with rupee weakness and rising US bond yields. Reduce long exposure and wait for flow reversal.</p>
                    </div>
                  </div>
                </section>

                <section id="practical-use" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Using FII/DII Data in Your Trading</h2>
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6">
                    <p className="text-lg font-medium text-blue-900 mb-2">Important Note:</p>
                    <p className="text-blue-800">FII/DII data is a lagging indicator — it reflects what institutions did yesterday. Use it to understand market context and trend, not as a standalone signal for intraday entries. Combine with technical analysis for better results.</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                      <h3 className="font-bold text-gray-900 mb-3">For Swing Traders</h3>
                      <p className="text-gray-600 text-sm">Track 5-day and 10-day rolling net FII/DII flows. Sustained positive FII flow for 5+ days is a good backdrop for swing longs. Sustained negative flow for 5+ days warrants caution or hedging.</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                      <h3 className="font-bold text-gray-900 mb-3">For Position Traders</h3>
                      <p className="text-gray-600 text-sm">Monthly FII flow data from SEBI is useful. Three consecutive months of heavy FII selling (₹30,000+ Cr) often precedes larger corrections. Three months of buying precedes sustained rallies.</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                      <h3 className="font-bold text-gray-900 mb-3">For Intraday Traders</h3>
                      <p className="text-gray-600 text-sm">Check the previous day&apos;s net FII/DII data every morning before markets open. Heavy FII selling the previous day creates a weak opening bias. Combine with global cues (SGX Nifty, Dow futures) for a complete picture.</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                      <h3 className="font-bold text-gray-900 mb-3">For Portfolio Investors</h3>
                      <p className="text-gray-600 text-sm">Treat sustained DII buying as a sign of domestic confidence and use FII-driven dips as opportunities to add quality stocks, not panic sell. Long-term DII buying provides a structural support floor for the market.</p>
                    </div>
                  </div>
                </section>

                <section id="limitations" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Limitations of FII/DII Analysis</h2>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                    <h3 className="font-bold text-yellow-800 mb-3">⚠️ Be Aware of These Limitations:</h3>
                    <ul className="text-yellow-700 space-y-2 text-sm">
                      <li>• <strong>Cash vs. Derivatives mismatch:</strong> FIIs may be buying in cash but selling in futures (hedging), making the net picture different from what cash data alone shows.</li>
                      <li>• <strong>Lagging data:</strong> Provisional NSE data is released post-market. By the next day, the narrative may have changed.</li>
                      <li>• <strong>Not all DII buying is bullish:</strong> Some DII buying is mandate-driven (insurance companies must deploy premium income) regardless of market levels.</li>
                      <li>• <strong>Sector concentration:</strong> FII flows may be concentrated in 2–3 large-cap sectors, not representative of the broader market.</li>
                      <li>• <strong>Cannot predict short-term price:</strong> FII/DII data helps understand medium-term trend but cannot time intraday or even weekly moves reliably.</li>
                    </ul>
                  </div>
                </section>

                <section id="conclusion" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Takeaways</h2>
                  <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-8">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-blue-700 mb-3">Use FII/DII data to:</h4>
                        <ul className="space-y-2 text-gray-700 text-sm">
                          <li>✅ Understand medium-term market trend</li>
                          <li>✅ Identify accumulation and distribution zones</li>
                          <li>✅ Set a morning bias before trading</li>
                          <li>✅ Validate your swing trade setups</li>
                          <li>✅ Gauge risk appetite before adding positions</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-700 mb-3">Do not use FII/DII data to:</h4>
                        <ul className="space-y-2 text-gray-700 text-sm">
                          <li>🚫 Time exact intraday entries alone</li>
                          <li>🚫 Override clear technical signals</li>
                          <li>🚫 Panic sell on a single day of outflow</li>
                          <li>🚫 Ignore derivatives market positioning</li>
                          <li>🚫 Assume it covers all market participants</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white text-center">
                  <h3 className="text-2xl font-bold mb-4">Track Live FII/DII Data on TradeSmart</h3>
                  <p className="text-blue-100 mb-6">Monitor daily institutional flows, 30-day trend charts, and sector-wise FII activity on our platform.</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/smart-money-flow" className="bg-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors">
                      Smart Money Flow
                    </Link>
                  </div>
                </div>

                <div className="mt-12 bg-gray-50 rounded-xl p-6 flex gap-4 items-start">
                  <div className="bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center font-bold text-xl shrink-0">
                    TS
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">TradeSmart Research Team</h4>
                    <p className="text-sm text-gray-500 mb-2">Market Analysts &amp; Trading Educators</p>
                    <p className="text-gray-600 text-sm">
                      The TradeSmart Money research team consists of experienced traders and market analysts focused on Indian equity and derivatives markets. Our educational content is built on hands-on market experience and a deep understanding of NSE market microstructure.
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <section className="mt-16 border-t border-gray-200 pt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {relatedPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <article className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                    <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{post.title}</h4>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <div className="text-blue-600 font-medium group-hover:text-blue-700">Read Article →</div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
