import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, User, Clock, Share2, BookOpen, Newspaper, TrendingUp } from 'lucide-react';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'How to Read & Use Stock Market News Effectively | TradeSmart Money',
  description: 'Learn how to read and use Indian stock market news for better trading decisions. Understand how macro data, earnings, policy decisions, and global cues affect Nifty, Bank Nifty, and individual stocks.',
  keywords: 'stock market news India, how to read market news, Indian stock market updates, NSE news today, market moving news India, RBI announcement impact, budget impact stocks',
  authors: [{ name: 'TradeSmart Research Team' }],
  openGraph: {
    title: 'How to Read & Use Stock Market News Effectively',
    description: 'Learn how macro data, earnings, RBI policy, and global cues affect Indian markets and how to trade around them.',
    url: 'https://www.tradesmartmoney.com/blog/stock-market-news-today-india',
    type: 'article',
    publishedTime: '2025-01-28T05:30:00.000Z',
    modifiedTime: '2025-03-12T05:30:00.000Z',
    authors: ['TradeSmart Research Team'],
    tags: ['Market News', 'India', 'NSE', 'RBI', 'Trading', 'Nifty'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Read & Use Stock Market News Effectively',
    description: 'Guide to understanding and using Indian stock market news for trading decisions.',
  },
  alternates: {
    canonical: 'https://www.tradesmartmoney.com/blog/stock-market-news-today-india',
  },
  robots: { index: true, follow: true },
};

const tableOfContents = [
  { id: 'types-of-news', title: 'Types of Market-Moving News', level: 2 },
  { id: 'rbi-macro', title: 'RBI Policy & Macro Data', level: 2 },
  { id: 'earnings', title: 'Corporate Earnings Impact', level: 2 },
  { id: 'global-cues', title: 'Global Cues & Their Impact', level: 2 },
  { id: 'budget-policy', title: 'Budget & Sector Policy Impact', level: 2 },
  { id: 'reading-strategy', title: 'Strategy: Trading Around News', level: 2 },
  { id: 'reliable-sources', title: 'Reliable News Sources', level: 2 },
  { id: 'conclusion', title: 'Key Takeaways', level: 2 },
];

const relatedPosts = [
  {
    slug: 'fii-dii-data-analysis-january-2025',
    title: 'FII DII Data Analysis: How Institutional Flows Move Markets',
    excerpt: 'How to read FII and DII data to understand institutional market direction.',
  },
  {
    slug: 'nifty-50-prediction-2025',
    title: 'Nifty 50 Prediction 2025: Expert Analysis & Target Levels',
    excerpt: 'Comprehensive analysis of Nifty 50 with support, resistance, and target levels.',
  },
];

export default function StockMarketNewsIndia() {
  const publishDate = new Date('2025-01-28T05:30:00.000Z');

  return (
    <>
      <Script id="blog-structured-data" type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'How to Read & Use Stock Market News Effectively',
          description: 'Learn how to read and use Indian stock market news for better trading decisions including macro data, earnings, and global cues.',
          image: 'https://www.tradesmartmoney.com/api/og?title=Stock%20Market%20News%20India',
          author: { '@type': 'Organization', name: 'TradeSmart Money', url: 'https://www.tradesmartmoney.com' },
          publisher: {
            '@type': 'Organization',
            name: 'TradeSmart Money',
            logo: { '@type': 'ImageObject', url: 'https://www.tradesmartmoney.com/favicon.svg' },
          },
          datePublished: '2025-01-28T05:30:00.000Z',
          dateModified: '2025-03-12T05:30:00.000Z',
          mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.tradesmartmoney.com/blog/stock-market-news-today-india' },
          articleSection: 'Market Education',
          keywords: 'stock market news, India, NSE, RBI, market analysis, trading',
          wordCount: 1900,
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

        <header className="bg-gradient-to-r from-gray-800 via-blue-700 to-blue-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                <Newspaper className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              How to Read &amp; Use Stock Market News Effectively
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              A practical guide to understanding which news moves Indian markets, how to interpret it, and how to build a trading strategy around major announcements
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-blue-200">
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
                    <strong>Educational Disclaimer:</strong> This content is for educational purposes only and is not investment advice. We are not SEBI registered advisors.
                  </p>
                </div>

                <div className="mb-10 rounded-xl overflow-hidden shadow-xl">
                  <Image
                    src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=600&fit=crop"
                    alt="Financial news broadcast showing Indian stock market data and breaking market news"
                    width={1200}
                    height={600}
                    className="w-full h-auto"
                    priority
                  />
                </div>

                <section id="types-of-news" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                    <Newspaper className="w-8 h-8 mr-3 text-blue-700" />
                    Types of Market-Moving News
                  </h2>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    Not all news moves markets equally. Learning to distinguish high-impact from low-impact events will save you from overreacting to noise and help you focus on information that genuinely shifts market direction. Follow live market news and updates on our{' '}
                    <Link href="/news" className="text-blue-600 hover:underline font-medium">market news section</Link>.
                  </p>
                  <div className="overflow-x-auto mb-6">
                    <table className="min-w-full bg-white border border-gray-200 rounded-xl overflow-hidden text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-5 py-3 text-left font-bold text-gray-700">News Category</th>
                          <th className="px-5 py-3 text-left font-bold text-gray-700">Market Impact</th>
                          <th className="px-5 py-3 text-left font-bold text-gray-700">Duration of Impact</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {[
                          { category: 'RBI Monetary Policy', impact: 'Very High', duration: '1–3 days, sometimes weeks' },
                          { category: 'Union Budget', impact: 'Very High', duration: '1–4 weeks (sector-specific)', },
                          { category: 'US Fed Rate Decision', impact: 'High', duration: '1–2 days' },
                          { category: 'Nifty 50 Earnings (Results)', impact: 'High (stock-specific)', duration: '1–5 days' },
                          { category: 'India CPI/IIP/GDP Data', impact: 'Moderate', duration: 'Intraday to 1 day' },
                          { category: 'Global Geo-political Events', impact: 'High (situational)', duration: 'Unpredictable' },
                          { category: 'Crude Oil Price Change', impact: 'Moderate', duration: '1–2 days (energy/infra stocks)' },
                          { category: 'Analyst Upgrades/Downgrades', impact: 'Low–Moderate', duration: 'Intraday' },
                        ].map((row, i) => (
                          <tr key={i} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                            <td className="px-5 py-3 font-medium text-gray-900">{row.category}</td>
                            <td className="px-5 py-3 text-blue-700 font-medium">{row.impact}</td>
                            <td className="px-5 py-3 text-gray-700">{row.duration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                <section id="rbi-macro" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">RBI Policy &amp; Macro Data</h2>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    The RBI Monetary Policy Committee (MPC) meets 6 times a year to decide on the repo rate. The decision and Governor&apos;s commentary significantly impact Bank Nifty (often 500–1,500 points), bond yields, and rupee exchange rates.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-green-50 rounded-xl p-5">
                      <h3 className="font-bold text-green-800 mb-3">Rate Cut Scenario</h3>
                      <ul className="text-green-700 text-sm space-y-1">
                        <li>• Bank Nifty: Bullish (lower borrowing cost, higher NIMs)</li>
                        <li>• Real Estate stocks: Bullish (cheaper home loans)</li>
                        <li>• Auto sector: Bullish (lower EMIs)</li>
                        <li>• IT sector: Neutral to positive</li>
                        <li>• Rupee: May weaken slightly</li>
                      </ul>
                    </div>
                    <div className="bg-red-50 rounded-xl p-5">
                      <h3 className="font-bold text-red-800 mb-3">Rate Hike / Hawkish Stance</h3>
                      <ul className="text-red-700 text-sm space-y-1">
                        <li>• Bank Nifty: Bearish short-term (squeezed margins)</li>
                        <li>• Real Estate: Bearish (EMIs rise)</li>
                        <li>• Auto sector: Bearish (demand dampening)</li>
                        <li>• IT/Export stocks: Neutral to positive (stronger rupee bad)</li>
                        <li>• Rupee: May strengthen</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <div className="mb-10 grid md:grid-cols-2 gap-6">
                  <Image
                    src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&h=400&fit=crop"
                    alt="Indian economic data analysis showing GDP CPI and market impact charts"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-lg"
                  />
                  <Image
                    src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop"
                    alt="NSE market reaction to earnings results and corporate news"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-lg"
                  />
                </div>

                <section id="earnings" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Corporate Earnings Impact</h2>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    Quarterly earnings results are the most frequent high-impact events for individual stocks. Understanding how to interpret earnings releases — and more importantly, how the market has already priced them in — is critical for traders.
                  </p>
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6">
                    <p className="text-blue-900 font-medium mb-2">The &ldquo;Buy the rumour, sell the news&rdquo; effect:</p>
                    <p className="text-blue-800">Often, stocks rally into earnings on expectations and then sell off even on good results if the actual numbers only match (not beat) estimates. Compare actual EPS and revenue vs consensus estimates — the delta matters more than the absolute numbers.</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
                    {[
                      { title: 'Earnings Beat', detail: 'Revenue AND profit both beat estimates. Stock typically gaps up. The guidance for next quarter matters even more — positive guidance sustains the rally.' },
                      { title: 'Earnings Miss', detail: 'Either revenue or profit (or both) miss estimates. Stock gaps down. Look at management commentary — is this a one-time miss or structural issue?' },
                      { title: 'In-line Results', detail: 'Results match estimates. Price reaction depends on recent stock performance and whether guidance is raised, maintained, or lowered.' },
                      { title: 'Margin Compression', detail: 'Revenue may grow but falling margins (EBITDA/PAT margin) indicate cost pressures. Often more bearish than a simple miss because it signals structural headwinds.' },
                    ].map((item, i) => (
                      <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                        <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600 text-sm">{item.detail}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section id="global-cues" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Global Cues &amp; Their Impact</h2>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    Indian markets open at 9:15 AM IST but are heavily influenced by overnight global developments. Before markets open, experienced traders check 4 primary global cues to form their morning bias.
                  </p>
                  <div className="space-y-4">
                    {[
                      { cue: 'SGX Nifty / GIFT Nifty Futures', detail: 'The GIFT City Nifty futures trade nearly 24 hours and are the best real-time indicator of where Nifty will open. Available from 6:30 AM IST.', icon: '🔮' },
                      { cue: 'Dow Jones / S&P 500 Close', detail: 'US market performance significantly influences FII sentiment and next-day Indian market direction. Major US sell-offs typically create a weak Indian market opening.', icon: '🇺🇸' },
                      { cue: 'Crude Oil Price (Brent)', detail: 'India imports 80%+ of its crude oil. Rising crude increases inflation pressure (negative for markets) and hurts current account. Falling crude is generally bullish for India.', icon: '🛢️' },
                      { cue: 'USD/INR Exchange Rate', detail: 'Rupee weakness is generally negative for markets (increases import costs, may trigger FII outflows). Rupee strength signals capital inflows and improves sentiment.', icon: '💱' },
                    ].map((item, i) => (
                      <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 flex gap-4">
                        <div className="text-2xl shrink-0">{item.icon}</div>
                        <div>
                          <h3 className="font-bold text-gray-900 mb-1">{item.cue}</h3>
                          <p className="text-gray-600 text-sm">{item.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section id="reading-strategy" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                    <TrendingUp className="w-8 h-8 mr-3 text-green-600" />
                    Strategy: Trading Around News
                  </h2>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
                    <h3 className="font-bold text-yellow-800 mb-2">⚠️ The #1 Mistake: Trading INTO Major News</h3>
                    <p className="text-yellow-700 text-sm">Most retail traders try to predict outcomes and trade before announcements. Institutions are almost always better positioned. The smarter approach is to trade the REACTION after the news settles, not the anticipation.</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-green-50 rounded-xl p-5">
                      <h3 className="font-bold text-green-800 mb-3">Before Major News Events</h3>
                      <ul className="text-green-700 text-sm space-y-1">
                        <li>• Reduce position size by 30–50%</li>
                        <li>• Move stops to protect existing profits</li>
                        <li>• Avoid initiating new positions 1 day before</li>
                        <li>• Note consensus expectations vs your own view</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-5">
                      <h3 className="font-bold text-blue-800 mb-3">After News Releases</h3>
                      <ul className="text-blue-700 text-sm space-y-1">
                        <li>• Wait 15–30 minutes for initial volatility to settle</li>
                        <li>• Trade in the direction of the post-news trend</li>
                        <li>• Use technical levels for entry confirmation</li>
                        <li>• Keep position sizes smaller than normal</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section id="reliable-sources" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Reliable News Sources for Indian Traders</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { name: 'NSE India (nseindia.com)', type: 'Official', detail: 'Corporate announcements, bulk deals, FII/DII data, circuit filters' },
                      { name: 'RBI Website (rbi.org.in)', type: 'Official', detail: 'Monetary policy, inflation data, banking sector regulations' },
                      { name: 'SEBI Website (sebi.gov.in)', type: 'Official', detail: 'Regulatory circulars, F&O lot size changes, insider trading disclosures' },
                      { name: 'TradeSmart News Dashboard', type: 'Aggregated', detail: 'Real-time market news aggregated from reliable sources with market context' },
                      { name: 'Bloomberg/Reuters', type: 'Premium', detail: 'Global macro data, FII flows, institutional sentiment from global perspective' },
                      { name: 'Ministry of Finance (finmin.nic.in)', type: 'Official', detail: 'Budget documents, economic survey, disinvestment announcements' },
                    ].map((source, i) => (
                      <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 text-sm">{source.name}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded font-medium ${source.type === 'Official' ? 'bg-green-100 text-green-700' : source.type === 'Premium' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{source.type}</span>
                        </div>
                        <p className="text-gray-600 text-xs">{source.detail}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section id="conclusion" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Takeaways</h2>
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-8">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-blue-700 mb-3">Good news habits:</h4>
                        <ul className="space-y-2 text-gray-700 text-sm">
                          <li>✅ Check GIFT Nifty and global cues every morning</li>
                          <li>✅ Mark earnings dates for stocks you hold</li>
                          <li>✅ Reduce size before scheduled high-impact events</li>
                          <li>✅ Focus on news vs expectations, not just news alone</li>
                          <li>✅ Trade the reaction, not the anticipation</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-3">Bad news habits to break:</h4>
                        <ul className="space-y-2 text-gray-700 text-sm">
                          <li>🚫 Panic selling on noise-level headlines</li>
                          <li>🚫 Chasing stocks on initial news pop</li>
                          <li>🚫 Over-leveraging before budget/RBI day</li>
                          <li>🚫 Ignoring global cues completely</li>
                          <li>🚫 Acting on social media tips disguised as news</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="bg-gradient-to-r from-gray-800 to-blue-700 rounded-2xl p-8 text-white text-center">
                  <h3 className="text-2xl font-bold mb-4">Stay Updated with TradeSmart Market News</h3>
                  <p className="text-blue-200 mb-6">Real-time market news aggregation, FII/DII data, and sector analysis — all in one platform.</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/news" className="bg-white text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                      Market News Feed
                    </Link>
                    <Link href="/live-scanner" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                      Live Market Data
                    </Link>
                  </div>
                </div>

                <div className="mt-12 bg-gray-50 rounded-xl p-6 flex gap-4 items-start">
                  <div className="bg-gray-700 text-white rounded-full w-14 h-14 flex items-center justify-center font-bold text-xl shrink-0">
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
