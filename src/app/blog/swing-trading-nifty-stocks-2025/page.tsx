import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, User, Clock, Share2, BookOpen, TrendingUp, Target } from 'lucide-react';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Swing Trading Nifty Stocks in 2025: Strategy & Stock Selection Guide | TradeSmart Money',
  description: 'Learn how to swing trade Nifty 50 stocks in 2025. Covers stock selection criteria, entry-exit strategies, timeframes, risk management, and sector rotation for swing traders in India.',
  keywords: 'swing trading Nifty stocks, swing trading India, swing trading strategy 2025, NSE swing trading, swing trade stock selection, swing trading risk management',
  authors: [{ name: 'TradeSmart Research Team' }],
  openGraph: {
    title: 'Swing Trading Nifty Stocks in 2025: Strategy & Stock Selection Guide',
    description: 'Complete guide to swing trading Nifty 50 stocks including stock selection, entry-exit strategies, and sector rotation.',
    url: 'https://www.tradesmartmoney.com/blog/swing-trading-nifty-stocks-2025',
    type: 'article',
    publishedTime: '2025-03-01T05:30:00.000Z',
    modifiedTime: '2025-03-20T05:30:00.000Z',
    authors: ['TradeSmart Research Team'],
    tags: ['Swing Trading', 'Nifty 50', 'Stock Selection', 'India', 'NSE'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Swing Trading Nifty Stocks in 2025: Strategy Guide',
    description: 'Complete swing trading strategy for Nifty 50 stocks with stock selection and risk management.',
  },
  alternates: {
    canonical: 'https://www.tradesmartmoney.com/blog/swing-trading-nifty-stocks-2025',
  },
  robots: { index: true, follow: true },
};

const tableOfContents = [
  { id: 'what-is-swing-trading', title: 'What is Swing Trading?', level: 2 },
  { id: 'why-nifty-50', title: 'Why Swing Trade Nifty 50 Stocks?', level: 2 },
  { id: 'stock-selection', title: 'Stock Selection Criteria', level: 2 },
  { id: 'entry-exit', title: 'Entry & Exit Rules', level: 2 },
  { id: 'sector-rotation', title: 'Sector Rotation Strategy', level: 2 },
  { id: 'risk-management', title: 'Risk Management', level: 2 },
  { id: 'tools', title: 'Useful Tools & Scanners', level: 2 },
  { id: 'conclusion', title: 'Key Takeaways', level: 2 },
];

const relatedPosts = [
  {
    slug: 'risk-management-trading-education',
    title: 'Risk Management in Trading: Capital Protection Guide',
    excerpt: 'Master position sizing, stop losses, and capital preservation techniques.',
  },
  {
    slug: 'complete-guide-smart-money-trading-2025',
    title: 'Complete Guide to Smart Money Trading in 2025',
    excerpt: 'Master institutional money flow analysis for Indian markets.',
  },
];

export default function SwingTradingNiftyStocks() {
  const publishDate = new Date('2025-03-01T05:30:00.000Z');

  return (
    <>
      <Script id="blog-structured-data" type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'Swing Trading Nifty Stocks in 2025: Strategy & Stock Selection Guide',
          description: 'Learn how to swing trade Nifty 50 stocks in 2025 with stock selection criteria, entry-exit strategies, and risk management.',
          image: 'https://www.tradesmartmoney.com/api/og?title=Swing%20Trading%20Nifty%20Stocks%202025',
          author: { '@type': 'Organization', name: 'TradeSmart Money', url: 'https://www.tradesmartmoney.com' },
          publisher: {
            '@type': 'Organization',
            name: 'TradeSmart Money',
            logo: { '@type': 'ImageObject', url: 'https://www.tradesmartmoney.com/favicon.svg' },
          },
          datePublished: '2025-03-01T05:30:00.000Z',
          dateModified: '2025-03-20T05:30:00.000Z',
          mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.tradesmartmoney.com/blog/swing-trading-nifty-stocks-2025' },
          articleSection: 'Trading Strategy',
          keywords: 'swing trading, Nifty 50, stock selection, NSE, risk management',
          wordCount: 2000,
          timeRequired: 'PT10M',
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

        <header className="bg-gradient-to-r from-teal-600 via-green-600 to-blue-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Swing Trading Nifty Stocks in 2025: Strategy &amp; Stock Selection Guide
            </h1>
            <p className="text-xl text-teal-100 mb-8 max-w-3xl mx-auto">
              A practical, step-by-step framework for identifying, entering, and managing swing trades in Nifty 50 stocks
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-teal-100">
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
                10 min read
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
                          <a href={`#${item.id}`} className="text-sm text-gray-600 hover:text-teal-600 transition-colors block py-1">
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
                    <strong>Educational Disclaimer:</strong> This content is for educational purposes only. We are not SEBI registered advisors. All trading involves risk. Past performance does not guarantee future results.
                  </p>
                </div>

                <div className="mb-10 rounded-xl overflow-hidden shadow-xl">
                  <Image
                    src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=600&fit=crop"
                    alt="Swing trading chart showing uptrend in Nifty 50 stocks with entry exit points marked"
                    width={1200}
                    height={600}
                    className="w-full h-auto"
                    priority
                  />
                </div>

                <section id="what-is-swing-trading" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">What is Swing Trading?</h2>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    Swing trading is a medium-term trading style that aims to capture &quot;swings&quot; — directional price moves that typically last between 3 days and 6 weeks. Unlike intraday trading, swing traders hold positions overnight and through weekends, targeting 5–20% moves in individual stocks.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-teal-50 rounded-xl p-5 text-center">
                      <div className="text-2xl font-bold text-teal-700 mb-1">3–42</div>
                      <div className="text-sm text-teal-800">Holding period (days)</div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-5 text-center">
                      <div className="text-2xl font-bold text-green-700 mb-1">5–20%</div>
                      <div className="text-sm text-green-800">Typical trade target</div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-5 text-center">
                      <div className="text-2xl font-bold text-blue-700 mb-1">Daily</div>
                      <div className="text-sm text-blue-800">Primary timeframe</div>
                    </div>
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    Swing trading suits people with full-time jobs since you only need 20–30 minutes after market close to scan for setups and manage open trades. It requires less screen time than intraday but more patience than day trading. View current swing trade ideas on our{' '}
                    <Link href="/swing-trades" className="text-blue-600 hover:underline font-medium">swing trades dashboard</Link>.
                  </p>
                </section>

                <section id="stock-selection" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                    <Target className="w-8 h-8 mr-3 text-teal-600" />
                    Stock Selection Criteria
                  </h2>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    The best swing trades in Nifty 50 stocks combine strong fundamentals with good technical setups. You want to trade stocks where the trend, sector momentum, and technical structure all align.
                  </p>
                  <div className="space-y-4 mb-6">
                    {[
                      {
                        title: 'Liquidity: Average daily turnover above ₹50 Cr',
                        detail: 'Sufficient liquidity ensures you can enter and exit at prices close to where you expect. Low liquidity stocks can gap adversely on news.',
                      },
                      {
                        title: 'Trend alignment: Stock trending in the direction of Nifty',
                        detail: 'In a bull market, look for stocks making higher highs and higher lows on weekly charts. Avoid counter-trend trades unless you have strong conviction.',
                      },
                      {
                        title: 'Sector momentum: Stock in a leading sector',
                        detail: 'Sector rotation is powerful. Stocks in leading sectors tend to outperform significantly in short periods. Track sector performance on our platform.',
                      },
                      {
                        title: 'Technical setup: Clear support-resistance with defined risk',
                        detail: 'Look for stocks forming flag/pennant consolidations, cup-with-handle bases, or pullbacks to rising moving averages. Entry near support provides best risk-reward.',
                      },
                      {
                        title: 'Fundamentals: Strong earnings growth or catalyst',
                        detail: 'A positive earnings surprise, new product launch, or policy benefit acting as a catalyst gives swing trades extra momentum beyond technical breakouts.',
                      },
                    ].map((item, i) => (
                      <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 flex gap-4">
                        <div className="bg-teal-100 text-teal-700 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">{i + 1}</div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                          <p className="text-gray-600 text-sm">{item.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="mb-10 grid md:grid-cols-2 gap-6">
                  <Image
                    src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&h=400&fit=crop"
                    alt="NSE stock chart showing swing trading setup with breakout and consolidation pattern"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-lg"
                  />
                  <Image
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop"
                    alt="Market analysis screen showing Nifty 50 sector performance for swing trade selection"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-lg"
                  />
                </div>

                <section id="entry-exit" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Entry &amp; Exit Rules</h2>
                  <div className="bg-teal-50 border-l-4 border-teal-500 p-6 mb-6">
                    <p className="text-teal-900 font-medium mb-2">The Golden Rule:</p>
                    <p className="text-teal-800">Only enter a swing trade if your target is at least 2× your stop-loss distance. If you&apos;re risking ₹50 per share, your minimum target should be ₹100. This ensures profitability even with a 40–50% win rate.</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-green-50 rounded-xl p-5">
                      <h3 className="font-bold text-green-800 mb-3">Entry Triggers (Long)</h3>
                      <ul className="text-green-700 text-sm space-y-2">
                        <li>• Breakout above resistance with above-average volume</li>
                        <li>• Pullback to rising 20 EMA (daily) with bounce candle</li>
                        <li>• Bullish reversal at weekly support level</li>
                        <li>• Stock breaking out from 3–6 week consolidation base</li>
                      </ul>
                    </div>
                    <div className="bg-red-50 rounded-xl p-5">
                      <h3 className="font-bold text-red-800 mb-3">Exit Triggers</h3>
                      <ul className="text-red-700 text-sm space-y-2">
                        <li>• Predefined stop-loss hit (exit immediately, no averaging)</li>
                        <li>• Target achieved — take at least partial profits</li>
                        <li>• Volume drying up at key resistance (warning sign)</li>
                        <li>• Sector losing relative strength to Nifty</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section id="sector-rotation" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Sector Rotation Strategy</h2>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    Indian markets rotate through sectors in predictable patterns tied to economic cycles, policy decisions, and earnings seasons. Being in the leading sector at the right time can double your returns on a swing trade versus picking a lagging sector stock. Track live sector rotation on our{' '}
                    <Link href="/equity" className="text-blue-600 hover:underline font-medium">equity analysis dashboard</Link>.
                  </p>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4">How to Identify the Leading Sector:</h3>
                    <div className="space-y-3">
                      {[
                        'Compare 4-week relative performance of NSE sectoral indices. The top 2–3 sectors by relative strength are your hunting ground.',
                        'Check FII activity in sector. Sustained FII buying in a sector (e.g., IT, Banking) indicates institutional conviction.',
                        'Look for earnings beats or positive guidance from bellwether stocks in the sector.',
                        'Avoid sectors in prolonged downtrends or under regulatory pressure regardless of how cheap valuations appear.',
                      ].map((tip, i) => (
                        <div key={i} className="flex gap-3">
                          <div className="text-teal-500 font-bold shrink-0">→</div>
                          <p className="text-gray-700 text-sm">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section id="risk-management" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Risk Management</h2>
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                      <h3 className="font-bold text-gray-900 mb-2">Portfolio Concentration</h3>
                      <p className="text-gray-600 text-sm">Hold a maximum of 4–6 swing positions simultaneously. Spreading across more stocks reduces your ability to monitor each position closely and dilutes returns.</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                      <h3 className="font-bold text-gray-900 mb-2">Position Size per Trade</h3>
                      <p className="text-gray-600 text-sm">Risk 1–2% of total capital per trade. If capital is ₹10 lakh and stop is ₹50/share, maximum shares = (₹10,000 ÷ ₹50) = 200 shares.</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                      <h3 className="font-bold text-gray-900 mb-2">Trailing Stop Loss</h3>
                      <p className="text-gray-600 text-sm">Once trade is up 10%, move stop to breakeven. At 15% profit, trail stop below recent swing low. Protect gains while letting winners run.</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                      <h3 className="font-bold text-gray-900 mb-2">Weekend Risk</h3>
                      <p className="text-gray-600 text-sm">Reduce overall position size before major economic announcements on Fridays (US jobs data, RBI meetings). Gaps on Monday can wipe out stops.</p>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    For a comprehensive deep dive into risk management principles, read our{' '}
                    <Link href="/blog/risk-management-trading-education" className="text-blue-600 hover:underline font-medium">complete risk management guide</Link>.
                  </p>
                </section>

                <section id="conclusion" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Takeaways</h2>
                  <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-xl p-8">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-teal-700 mb-3">Swing trading checklist:</h4>
                        <ul className="space-y-2 text-gray-700 text-sm">
                          <li>✅ Stock in leading sector with institutional buying</li>
                          <li>✅ Clear technical setup with defined stop and target</li>
                          <li>✅ Minimum 2:1 reward-to-risk ratio</li>
                          <li>✅ Nifty trend aligned with trade direction</li>
                          <li>✅ Position sized to risk max 2% of capital</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-700 mb-3">Avoid these swing trade mistakes:</h4>
                        <ul className="space-y-2 text-gray-700 text-sm">
                          <li>🚫 Buying breakouts without volume confirmation</li>
                          <li>🚫 Holding through earnings without protection</li>
                          <li>🚫 Ignoring the broader Nifty trend direction</li>
                          <li>🚫 Chasing stocks already up 15–20% from base</li>
                          <li>🚫 Overloading one sector with multiple trades</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="bg-gradient-to-r from-teal-600 to-green-600 rounded-2xl p-8 text-white text-center">
                  <h3 className="text-2xl font-bold mb-4">Find Your Next Swing Trade on TradeSmart</h3>
                  <p className="text-teal-100 mb-6">Our swing trade scanner identifies high-probability setups in Nifty 50 stocks using technical and institutional flow analysis.</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/swing-trades" className="bg-white text-teal-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                      View Swing Trades
                    </Link>
                    <Link href="/equity" className="bg-teal-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-800 transition-colors">
                      Equity Analysis
                    </Link>
                  </div>
                </div>

                <div className="mt-12 bg-gray-50 rounded-xl p-6 flex gap-4 items-start">
                  <div className="bg-teal-600 text-white rounded-full w-14 h-14 flex items-center justify-center font-bold text-xl shrink-0">
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
