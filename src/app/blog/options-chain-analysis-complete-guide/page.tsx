import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, User, Clock, Share2, BookOpen, TrendingUp, Target, BarChart2 } from 'lucide-react';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Options Chain Analysis: Complete Guide for Indian Traders | TradeSmart Money',
  description: 'Learn how to read and analyse the NSE options chain. Understand open interest, put-call ratio, max pain, OI buildup patterns, and use options data to predict market direction.',
  keywords: 'options chain analysis, options chain NSE, open interest analysis, put call ratio, max pain options, OI buildup, options chain reading, Nifty options chain',
  authors: [{ name: 'TradeSmart Research Team' }],
  openGraph: {
    title: 'Options Chain Analysis: Complete Guide for Indian Traders',
    description: 'Learn how to read the NSE options chain and use OI, PCR, and max pain data to predict market direction.',
    url: 'https://www.tradesmartmoney.com/blog/options-chain-analysis-complete-guide',
    type: 'article',
    publishedTime: '2025-02-20T05:30:00.000Z',
    modifiedTime: '2025-03-18T05:30:00.000Z',
    authors: ['TradeSmart Research Team'],
    tags: ['Options', 'Options Chain', 'NSE', 'Open Interest', 'Trading'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Options Chain Analysis: Complete Guide for Indian Traders',
    description: 'How to read NSE options chain and use OI, PCR, and max pain for market direction.',
  },
  alternates: {
    canonical: 'https://www.tradesmartmoney.com/blog/options-chain-analysis-complete-guide',
  },
  robots: { index: true, follow: true },
};

const tableOfContents = [
  { id: 'what-is-options-chain', title: 'What is an Options Chain?', level: 2 },
  { id: 'key-columns', title: 'Understanding Key Columns', level: 2 },
  { id: 'open-interest', title: 'Open Interest (OI) Analysis', level: 2 },
  { id: 'put-call-ratio', title: 'Put-Call Ratio (PCR)', level: 2 },
  { id: 'max-pain', title: 'Max Pain Theory', level: 2 },
  { id: 'oi-patterns', title: 'OI Buildup Patterns', level: 2 },
  { id: 'practical-strategy', title: 'Practical Trading Strategy', level: 2 },
  { id: 'conclusion', title: 'Key Takeaways', level: 2 },
];

const relatedPosts = [
  {
    slug: 'bank-nifty-intraday-trading-masterclass',
    title: 'Bank Nifty Intraday Trading Masterclass',
    excerpt: 'Complete Bank Nifty intraday trading strategies using options data and key levels.',
  },
  {
    slug: 'nifty-50-prediction-2025',
    title: 'Nifty 50 Prediction 2025: Expert Analysis & Target Levels',
    excerpt: 'Comprehensive technical and fundamental analysis for India\'s premier stock index.',
  },
];

export default function OptionsChainAnalysisGuide() {
  const publishDate = new Date('2025-02-20T05:30:00.000Z');

  return (
    <>
      <Script id="blog-structured-data" type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'Options Chain Analysis: Complete Guide for Indian Traders',
          description: 'Learn how to read and analyse the NSE options chain. Understand open interest, put-call ratio, max pain, and OI buildup patterns.',
          image: 'https://www.tradesmartmoney.com/api/og?title=Options%20Chain%20Analysis%20Complete%20Guide',
          author: { '@type': 'Organization', name: 'TradeSmart Money', url: 'https://www.tradesmartmoney.com' },
          publisher: {
            '@type': 'Organization',
            name: 'TradeSmart Money',
            logo: { '@type': 'ImageObject', url: 'https://www.tradesmartmoney.com/favicon.svg' },
          },
          datePublished: '2025-02-20T05:30:00.000Z',
          dateModified: '2025-03-18T05:30:00.000Z',
          mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.tradesmartmoney.com/blog/options-chain-analysis-complete-guide' },
          articleSection: 'Options Trading Education',
          keywords: 'options chain, open interest, put-call ratio, max pain, NSE options',
          wordCount: 2300,
          timeRequired: 'PT12M',
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

        <header className="bg-gradient-to-r from-purple-700 via-purple-600 to-blue-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                <BarChart2 className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Options Chain Analysis: Complete Guide for Indian Traders
            </h1>
            <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Master reading the NSE options chain — understand OI, PCR, max pain, and strike-level analysis to trade Nifty and Bank Nifty with greater confidence
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-purple-100">
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
                12 min read
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
                          <a href={`#${item.id}`} className="text-sm text-gray-600 hover:text-purple-600 transition-colors block py-1">
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
                    <strong>Educational Disclaimer:</strong> Options trading involves significant risk. This content is for educational purposes only and is not investment advice. We are not SEBI registered advisors.
                  </p>
                </div>

                <div className="mb-10 rounded-xl overflow-hidden shadow-xl">
                  <Image
                    src="https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=1200&h=600&fit=crop"
                    alt="NSE options chain analysis dashboard showing open interest and strike price data"
                    width={1200}
                    height={600}
                    className="w-full h-auto"
                    priority
                  />
                </div>

                <section id="what-is-options-chain" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                    <TrendingUp className="w-8 h-8 mr-3 text-purple-600" />
                    What is an Options Chain?
                  </h2>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    An options chain (also called an option matrix) is a table that displays all available options contracts for a given underlying asset — such as Nifty 50 or Bank Nifty — across multiple strike prices and expiry dates. It is the single most comprehensive tool for understanding where institutional money is positioned and what the market expects the underlying to do before expiry.
                  </p>
                  <div className="bg-purple-50 border-l-4 border-purple-500 p-6 mb-6">
                    <p className="text-lg font-medium text-purple-900 mb-2">Why it matters:</p>
                    <p className="text-purple-800">Options writers (who sell options) are typically well-capitalised institutions. The strikes where they have written the most options are likely to act as support (put side) or resistance (call side). The options chain reveals this positioning in real time. Analyse live options data on our <Link href="/option-analysis" className="underline font-medium">options analysis tool</Link>.</p>
                  </div>
                </section>

                <section id="key-columns" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Understanding Key Columns</h2>
                  <div className="overflow-x-auto mb-6">
                    <table className="min-w-full bg-white border border-gray-200 rounded-xl overflow-hidden text-sm">
                      <thead className="bg-purple-50">
                        <tr>
                          <th className="px-4 py-3 text-left font-bold text-purple-800">Column</th>
                          <th className="px-4 py-3 text-left font-bold text-purple-800">Meaning</th>
                          <th className="px-4 py-3 text-left font-bold text-purple-800">Trading Insight</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {[
                          { col: 'OI (Open Interest)', meaning: 'Total outstanding contracts at a strike', insight: 'High OI = strong support/resistance level' },
                          { col: 'Change in OI', meaning: 'OI added or unwound in current session', insight: 'Rising OI = fresh conviction; falling OI = positions exiting' },
                          { col: 'Volume', meaning: 'Contracts traded today', insight: 'High volume + high OI = strong price level' },
                          { col: 'IV (Implied Volatility)', meaning: 'Market-expected volatility priced into options', insight: 'High IV = expensive options; low IV = cheap options' },
                          { col: 'LTP (Last Traded Price)', meaning: 'Current premium of the options contract', insight: 'Compare with intrinsic value to gauge overpricing' },
                        ].map((row, i) => (
                          <tr key={i} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                            <td className="px-4 py-3 font-medium text-gray-900">{row.col}</td>
                            <td className="px-4 py-3 text-gray-700">{row.meaning}</td>
                            <td className="px-4 py-3 text-purple-700">{row.insight}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                <div className="mb-10 grid md:grid-cols-2 gap-6">
                  <Image
                    src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&h=400&fit=crop"
                    alt="Trader analysing options chain open interest data on trading terminal"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-lg"
                  />
                  <Image
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop"
                    alt="NSE derivatives data dashboard showing options chain strike-wise analysis"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-lg"
                  />
                </div>

                <section id="open-interest" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Open Interest (OI) Analysis</h2>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    Open Interest is the most important metric in the options chain. It tells you how many contracts are currently open (not closed or expired) at each strike price. High OI at a call strike means many sellers have written calls there — creating a &quot;wall&quot; of resistance. High OI at a put strike creates a support floor.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-green-50 rounded-xl p-5">
                      <h3 className="font-bold text-green-800 mb-3">High Call OI Strike</h3>
                      <p className="text-green-700 text-sm mb-3">Acts as strong resistance. Option sellers (institutions) will defend this level as the price approaching it increases their risk of loss. Market often stalls or reverses here.</p>
                      <div className="bg-white rounded p-2 text-sm font-mono text-green-800">Example: If max call OI is at 24,000 CE, expect resistance near 24,000</div>
                    </div>
                    <div className="bg-red-50 rounded-xl p-5">
                      <h3 className="font-bold text-red-800 mb-3">High Put OI Strike</h3>
                      <p className="text-red-700 text-sm mb-3">Acts as strong support. Put sellers will defend this level. Market often bounces from high put OI strikes during corrections.</p>
                      <div className="bg-white rounded p-2 text-sm font-mono text-red-800">Example: If max put OI is at 23,500 PE, expect support near 23,500</div>
                    </div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                    <h3 className="font-bold text-yellow-800 mb-2">⚠️ OI Shift Warning:</h3>
                    <p className="text-yellow-700 text-sm">When max OI shifts significantly between sessions (e.g., call writers moving from 24,000 to 24,500), it signals a change in institutional sentiment. This OI shift is often more informative than the absolute OI level.</p>
                  </div>
                </section>

                <section id="put-call-ratio" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Put-Call Ratio (PCR)</h2>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    PCR is calculated as Total Put OI ÷ Total Call OI. It is a sentiment indicator. A PCR above 1.0 means more put contracts are open (bearish bets or hedges), while below 1.0 suggests more call activity (bullish bets or caution from bulls).
                  </p>
                  <div className="overflow-x-auto mb-6">
                    <table className="min-w-full bg-white border border-gray-200 rounded-xl overflow-hidden text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-5 py-3 text-left font-bold text-gray-700">PCR Range</th>
                          <th className="px-5 py-3 text-left font-bold text-gray-700">Interpretation</th>
                          <th className="px-5 py-3 text-left font-bold text-gray-700">Trader Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {[
                          { range: 'Above 1.3', interp: 'Extreme bearishness / oversold hedging', action: 'Contrarian bullish signal — potential bounce' },
                          { range: '1.0 – 1.3', interp: 'Mildly bearish / cautious market', action: 'Neutral to mildly bullish; watch for support holding' },
                          { range: '0.7 – 1.0', interp: 'Balanced to mildly bullish', action: 'Normal market; trend continuation likely' },
                          { range: 'Below 0.7', interp: 'Extreme bullishness / overconfidence', action: 'Contrarian bearish signal — potential reversal or correction' },
                        ].map((row, i) => (
                          <tr key={i} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                            <td className="px-5 py-3 font-medium text-gray-900">{row.range}</td>
                            <td className="px-5 py-3 text-gray-700">{row.interp}</td>
                            <td className="px-5 py-3 text-blue-700 font-medium">{row.action}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                <section id="max-pain" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                    <Target className="w-8 h-8 mr-3 text-orange-500" />
                    Max Pain Theory
                  </h2>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    Max pain is the strike price at which options buyers (both call and put) collectively lose the most money at expiry. Since option sellers (typically large institutions) want to maximise their income, there is a tendency for the underlying to gravitate toward the max pain strike on and around expiry.
                  </p>
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-6">
                    <h3 className="font-bold text-orange-800 mb-3">💡 How to use Max Pain:</h3>
                    <ul className="text-orange-700 space-y-2 text-sm">
                      <li>• Calculate max pain each morning of expiry week on our <Link href="/option-analysis" className="underline">options analysis tool</Link></li>
                      <li>• If spot is well above max pain, call writers will resist further upside — be cautious with call buying</li>
                      <li>• If spot is well below max pain, put writers will support the market — dips may be shallower than expected</li>
                      <li>• Strongest pull toward max pain happens on Thursday (weekly expiry day)</li>
                      <li>• Max pain works best on low-volatility, rangebound expiry days; less effective on high-news days</li>
                    </ul>
                  </div>
                </section>

                <section id="oi-patterns" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">OI Buildup Patterns</h2>
                  <div className="space-y-4">
                    {[
                      {
                        title: 'Long Buildup',
                        condition: 'Price rising + OI rising + Volume rising',
                        meaning: 'Fresh long positions being added. Bullish trend confirmation.',
                        bg: 'bg-green-50 border-green-200',
                        text: 'text-green-800',
                      },
                      {
                        title: 'Short Buildup',
                        condition: 'Price falling + OI rising + Volume rising',
                        meaning: 'Fresh short positions being added. Bearish trend confirmation.',
                        bg: 'bg-red-50 border-red-200',
                        text: 'text-red-800',
                      },
                      {
                        title: 'Long Unwinding',
                        condition: 'Price falling + OI falling',
                        meaning: 'Existing longs are exiting. Bearish but not as strong as short buildup.',
                        bg: 'bg-yellow-50 border-yellow-200',
                        text: 'text-yellow-800',
                      },
                      {
                        title: 'Short Covering',
                        condition: 'Price rising + OI falling',
                        meaning: 'Shorts are covering (buying back). Can create sharp upward squeezes.',
                        bg: 'bg-blue-50 border-blue-200',
                        text: 'text-blue-800',
                      },
                    ].map((pattern, i) => (
                      <div key={i} className={`border rounded-xl p-5 ${pattern.bg}`}>
                        <h3 className={`font-bold mb-1 ${pattern.text}`}>{pattern.title}</h3>
                        <p className={`text-sm font-mono mb-2 ${pattern.text}`}>{pattern.condition}</p>
                        <p className={`text-sm ${pattern.text}`}>{pattern.meaning}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section id="practical-strategy" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Practical Trading Strategy</h2>
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6">
                    <p className="text-blue-900 font-medium mb-2">A Simple Framework:</p>
                    <p className="text-blue-800">Before entering any Nifty or Bank Nifty trade, spend 2 minutes checking: (1) Where is max OI on call and put side? (2) What is the PCR? (3) Is OI building or unwinding? These three inputs give you a directional edge before adding technical setups.</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Morning Checklist Using Options Chain:</h3>
                    <div className="space-y-3">
                      {[
                        'Note max call OI strike (immediate resistance) and max put OI strike (immediate support)',
                        'Calculate or note PCR — above 1.0 is supportive; below 0.7 is cautionary',
                        'Check if any significant OI shift happened overnight vs previous close',
                        'Note max pain level — expect price to be attracted toward it on expiry days',
                        'Cross-reference with key technical levels for high-conviction trades',
                      ].map((item, i) => (
                        <div key={i} className="flex gap-3 items-start">
                          <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</div>
                          <p className="text-gray-700 text-sm">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section id="conclusion" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Takeaways</h2>
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-purple-700 mb-3">Options chain tells you:</h4>
                        <ul className="space-y-2 text-gray-700 text-sm">
                          <li>✅ Where institutional resistance exists (max call OI)</li>
                          <li>✅ Where institutional support exists (max put OI)</li>
                          <li>✅ Market sentiment (PCR)</li>
                          <li>✅ Where price is likely to expire (max pain)</li>
                          <li>✅ Trend direction (OI buildup pattern)</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-700 mb-3">Options chain does not tell you:</h4>
                        <ul className="space-y-2 text-gray-700 text-sm">
                          <li>🚫 Exact timing of market moves</li>
                          <li>🚫 Whether a breakout will succeed</li>
                          <li>🚫 Impact of unexpected news events</li>
                          <li>🚫 Long-term stock direction</li>
                          <li>🚫 Guaranteed support/resistance levels</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center">
                  <h3 className="text-2xl font-bold mb-4">Analyse Options Chain Live on TradeSmart</h3>
                  <p className="text-purple-100 mb-6">Real-time Nifty and Bank Nifty options chain with OI charts, PCR tracker, and max pain calculator.</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/option-analysis" className="bg-white text-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                      View Options Chain
                    </Link>
                    <Link href="/fno" className="bg-purple-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-800 transition-colors">
                      F&O Analysis Dashboard
                    </Link>
                  </div>
                </div>

                <div className="mt-12 bg-gray-50 rounded-xl p-6 flex gap-4 items-start">
                  <div className="bg-purple-600 text-white rounded-full w-14 h-14 flex items-center justify-center font-bold text-xl shrink-0">
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
