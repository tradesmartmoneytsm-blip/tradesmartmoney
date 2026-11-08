import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, User, Clock, Share2, BookOpen, Bot, TrendingUp, Target } from 'lucide-react';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Top Algo Trading Strategies for NSE & BSE in 2025 | TradeSmart Money',
  description: 'Explore the most effective algorithmic trading strategies used on NSE and BSE. Learn about momentum, mean reversion, arbitrage, and options strategies — plus how to evaluate and backtest algo systems.',
  keywords: 'algo trading strategies NSE, algorithmic trading India, algo trading BSE, automated trading strategies, momentum algo, mean reversion trading, NSE algo trading 2025',
  authors: [{ name: 'TradeSmart Research Team' }],
  openGraph: {
    title: 'Top Algo Trading Strategies for NSE & BSE in 2025',
    description: 'The most effective algorithmic trading strategies for Indian markets — momentum, mean reversion, arbitrage, and more.',
    url: 'https://www.tradesmartmoney.com/blog/top-algo-trading-strategies-nse-bse',
    type: 'article',
    publishedTime: '2025-02-15T05:30:00.000Z',
    modifiedTime: '2025-03-17T05:30:00.000Z',
    authors: ['TradeSmart Research Team'],
    tags: ['Algo Trading', 'NSE', 'BSE', 'Algorithmic Trading', 'Automated Trading'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Top Algo Trading Strategies for NSE & BSE in 2025',
    description: 'Effective algorithmic trading strategies for Indian equity markets.',
  },
  alternates: {
    canonical: 'https://www.tradesmartmoney.com/blog/top-algo-trading-strategies-nse-bse',
  },
  robots: { index: true, follow: true },
};

const tableOfContents = [
  { id: 'algo-trading-india', title: 'Algo Trading in India: Overview', level: 2 },
  { id: 'momentum-strategies', title: 'Momentum-Based Strategies', level: 2 },
  { id: 'mean-reversion', title: 'Mean Reversion Strategies', level: 2 },
  { id: 'arbitrage', title: 'Statistical Arbitrage', level: 2 },
  { id: 'options-strategies', title: 'Options-Based Algo Strategies', level: 2 },
  { id: 'backtesting', title: 'Backtesting & Evaluation', level: 2 },
  { id: 'regulatory', title: 'Regulatory Framework in India', level: 2 },
  { id: 'conclusion', title: 'Key Takeaways', level: 2 },
];

const relatedPosts = [
  {
    slug: 'complete-guide-smart-money-trading-2025',
    title: 'Complete Guide to Smart Money Trading in 2025',
    excerpt: 'Understand institutional money flow analysis and smart money concepts.',
  },
  {
    slug: 'options-chain-analysis-complete-guide',
    title: 'Options Chain Analysis: Complete Guide for Indian Traders',
    excerpt: 'Master reading NSE options chain data for trading decisions.',
  },
];

export default function TopAlgoTradingStrategies() {
  const publishDate = new Date('2025-02-15T05:30:00.000Z');

  return (
    <>
      <Script id="blog-structured-data" type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'Top Algo Trading Strategies for NSE & BSE in 2025',
          description: 'Explore the most effective algorithmic trading strategies for NSE and BSE including momentum, mean reversion, arbitrage, and options strategies.',
          image: 'https://www.tradesmartmoney.com/api/og?title=Top%20Algo%20Trading%20Strategies%20NSE%20BSE',
          author: { '@type': 'Organization', name: 'TradeSmart Money', url: 'https://www.tradesmartmoney.com' },
          publisher: {
            '@type': 'Organization',
            name: 'TradeSmart Money',
            logo: { '@type': 'ImageObject', url: 'https://www.tradesmartmoney.com/favicon.svg' },
          },
          datePublished: '2025-02-15T05:30:00.000Z',
          dateModified: '2025-03-17T05:30:00.000Z',
          mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.tradesmartmoney.com/blog/top-algo-trading-strategies-nse-bse' },
          articleSection: 'Algorithmic Trading',
          keywords: 'algo trading, NSE, BSE, momentum, mean reversion, arbitrage',
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

        <header className="bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                <Bot className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Top Algo Trading Strategies for NSE &amp; BSE in 2025
            </h1>
            <p className="text-xl text-blue-200 mb-8 max-w-3xl mx-auto">
              A comprehensive look at the most effective algorithmic trading strategies used in Indian markets — from momentum systems to options-based automation
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
                    <strong>Educational Disclaimer:</strong> This content is for educational purposes only and is not investment advice. Algorithmic trading requires technical expertise and carries significant risk. We are not SEBI registered advisors.
                  </p>
                </div>

                <div className="mb-10 rounded-xl overflow-hidden shadow-xl">
                  <Image
                    src="https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&h=600&fit=crop"
                    alt="Algorithmic trading system code and market data showing automated strategy execution"
                    width={1200}
                    height={600}
                    className="w-full h-auto"
                    priority
                  />
                </div>

                <section id="algo-trading-india" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                    <Bot className="w-8 h-8 mr-3 text-blue-700" />
                    Algo Trading in India: Overview
                  </h2>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    Algorithmic trading now accounts for approximately 50–55% of total NSE cash market turnover and an even higher proportion of F&O volume. Institutional players have used algos for years; increasingly, sophisticated retail traders and family offices are deploying semi-automated and fully automated strategies as SEBI-approved API access becomes more accessible.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-xl p-5 text-center">
                      <div className="text-2xl font-bold text-blue-700 mb-1">~55%</div>
                      <div className="text-sm text-blue-800">NSE turnover via algos</div>
                    </div>
                    <div className="bg-indigo-50 rounded-xl p-5 text-center">
                      <div className="text-2xl font-bold text-indigo-700 mb-1">milliseconds</div>
                      <div className="text-sm text-indigo-800">HFT execution speed</div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-5 text-center">
                      <div className="text-2xl font-bold text-slate-700 mb-1">24/7</div>
                      <div className="text-sm text-slate-800">Monitoring capability</div>
                    </div>
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    Explore our educational{' '}
                    <Link href="/algo-trading" className="text-blue-600 hover:underline font-medium">algo trading section</Link>{' '}
                    to understand how algorithmic signals work in practice using Indian market data.
                  </p>
                </section>

                <section id="momentum-strategies" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                    <TrendingUp className="w-8 h-8 mr-3 text-green-600" />
                    Momentum-Based Strategies
                  </h2>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    Momentum strategies are among the most widely used and empirically validated approaches in Indian markets. They exploit the tendency of outperforming assets to continue outperforming over the short to medium term.
                  </p>
                  <div className="space-y-5 mb-6">
                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                      <h3 className="font-bold text-gray-900 mb-2">Time-Series Momentum (Trend Following)</h3>
                      <p className="text-gray-600 text-sm mb-3">Go long on assets that have risen over a lookback period (e.g., 3-month return) and short those that have fallen. Simple but robust across asset classes.</p>
                      <div className="bg-gray-50 rounded p-3 text-sm">
                        <span className="font-semibold text-gray-700">Common parameters for NSE:</span>
                        <span className="text-gray-600"> 3-month or 6-month momentum, rebalanced monthly. Typically filtered by liquidity (top 200 stocks by market cap).</span>
                      </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                      <h3 className="font-bold text-gray-900 mb-2">Breakout Momentum</h3>
                      <p className="text-gray-600 text-sm mb-3">Enter when price breaks above a rolling high (e.g., 20-day or 52-week high) with volume confirmation. Exit when price breaks below a shorter rolling low (e.g., 10-day low).</p>
                      <div className="bg-gray-50 rounded p-3 text-sm">
                        <span className="font-semibold text-gray-700">Works well on:</span>
                        <span className="text-gray-600"> Nifty 50 constituents, Nifty Midcap 100 stocks during trending market phases.</span>
                      </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                      <h3 className="font-bold text-gray-900 mb-2">Moving Average Crossover</h3>
                      <p className="text-gray-600 text-sm mb-3">Classic 50/200 EMA crossover or faster 9/21 EMA for intraday. Goes long when short MA crosses above long MA; exits on reverse. Simple to code but suffers in choppy markets.</p>
                      <div className="bg-gray-50 rounded p-3 text-sm">
                        <span className="font-semibold text-gray-700">Tip:</span>
                        <span className="text-gray-600"> Add a volatility filter (e.g., ATR-based) to avoid signals during low-range, directionless days.</span>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="mb-10 grid md:grid-cols-2 gap-6">
                  <Image
                    src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=400&fit=crop"
                    alt="Algorithmic trading code and backtest results for NSE momentum strategy"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-lg"
                  />
                  <Image
                    src="https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=600&h=400&fit=crop"
                    alt="Mean reversion strategy performance chart on Indian stock market data"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-lg"
                  />
                </div>

                <section id="mean-reversion" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Mean Reversion Strategies</h2>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    Mean reversion strategies exploit the tendency of prices to return to a historical average after extreme moves. They work best in rangebound, low-trend markets and are particularly effective in Indian index futures and Bank Nifty intraday contexts.
                  </p>
                  <div className="grid md:grid-cols-2 gap-5 mb-6">
                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                      <h3 className="font-bold text-gray-900 mb-2">Bollinger Band Mean Reversion</h3>
                      <p className="text-gray-600 text-sm">Buy when price touches the lower Bollinger Band (2 SD below 20-day MA) and sell at the middle band. Short at upper band, cover at middle. Requires a rangebound market filter to avoid momentum breakouts.</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                      <h3 className="font-bold text-gray-900 mb-2">RSI Extreme Reversion</h3>
                      <p className="text-gray-600 text-sm">Buy when RSI(14) drops below 30 (oversold) and exit when RSI recovers above 50. Short when RSI exceeds 70. Works best with a trend filter to avoid buying into strong downtrends.</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                      <h3 className="font-bold text-gray-900 mb-2">Opening Gap Fade</h3>
                      <p className="text-gray-600 text-sm">Fade excessively large gaps at the open (gap up: short; gap down: long). NSE frequently sees gaps of 0.5–1.5% that fill during the session. A simple and effective intraday mean reversion approach.</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                      <h3 className="font-bold text-gray-900 mb-2">Intraday VWAP Reversion</h3>
                      <p className="text-gray-600 text-sm">Buy when price dips significantly below VWAP with declining volume; exit at VWAP. Widely used by institutional desks. VWAP acts as a dynamic mean for the session.</p>
                    </div>
                  </div>
                </section>

                <section id="arbitrage" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Statistical Arbitrage</h2>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    Statistical arbitrage exploits price discrepancies between related instruments. These strategies are lower risk in theory, but require low latency infrastructure and careful execution.
                  </p>
                  <div className="bg-slate-50 rounded-xl p-6 mb-6">
                    <h3 className="font-bold text-gray-900 mb-4">Common Arb Strategies in India:</h3>
                    <div className="space-y-3">
                      {[
                        { name: 'Cash-Futures Arbitrage', desc: 'Exploit the basis (spread between spot and futures price) when it diverges beyond transaction costs. Buy spot, sell futures when premium is high; reverse on convergence.' },
                        { name: 'ETF Arbitrage', desc: 'Trade discrepancies between ETF price and its NAV. Nifty BeES and Bank BeES frequently offer small but consistent arb opportunities around market events.' },
                        { name: 'Pairs Trading', desc: 'Trade two historically correlated stocks (e.g., HDFC Bank vs. ICICI Bank, Infosys vs. TCS) when their spread diverges significantly. Go long the underperformer, short the outperformer.' },
                        { name: 'Index Arbitrage', desc: 'Exploit price differences between Nifty index futures on NSE and the underlying basket of stocks. Requires sophisticated infrastructure and DMA access.' },
                      ].map((item, i) => (
                        <div key={i} className="flex gap-3">
                          <div className="text-blue-500 font-bold shrink-0 mt-0.5">→</div>
                          <div>
                            <span className="font-semibold text-gray-900">{item.name}: </span>
                            <span className="text-gray-600 text-sm">{item.desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section id="options-strategies" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                    <Target className="w-8 h-8 mr-3 text-purple-600" />
                    Options-Based Algo Strategies
                  </h2>
                  <div className="space-y-5">
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
                      <h3 className="font-bold text-purple-800 mb-2">Theta Decay Strategies (Short Straddle/Strangle)</h3>
                      <p className="text-purple-700 text-sm">Sell ATM straddle at the start of the week and buy back near expiry. Profits from time decay in a non-trending market. Requires strict delta-hedging and defined loss limits. High risk on event days.</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                      <h3 className="font-bold text-blue-800 mb-2">Iron Condor on Weekly Expiry</h3>
                      <p className="text-blue-700 text-sm">Sell OTM call spread + OTM put spread around the expected range. Collects premium in low-volatility weeks. The defined max-loss structure makes it more manageable than naked short options for retail traders.</p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                      <h3 className="font-bold text-green-800 mb-2">Delta-Neutral Hedging</h3>
                      <p className="text-green-700 text-sm">Build a position-neutral options portfolio and profit from volatility changes (vega) rather than directional moves. Requires real-time Greeks monitoring and frequent rebalancing — best suited for systematic traders.</p>
                    </div>
                  </div>
                </section>

                <section id="backtesting" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Backtesting &amp; Evaluation</h2>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
                    <h3 className="font-bold text-yellow-800 mb-3">⚠️ Key Backtesting Pitfalls:</h3>
                    <ul className="text-yellow-700 space-y-2 text-sm">
                      <li>• <strong>Lookahead bias:</strong> Using future data points in your signal calculation gives unrealistically good backtests.</li>
                      <li>• <strong>Survivorship bias:</strong> Testing only on currently listed stocks ignores delisted companies and overstates returns.</li>
                      <li>• <strong>Transaction costs:</strong> Always include realistic brokerage, STT, GST, and slippage in your backtest. Especially critical for high-frequency strategies.</li>
                      <li>• <strong>Overfitting:</strong> Too many parameters tuned to historical data create strategies that fail in live markets. Keep models simple.</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Metrics to evaluate an algo strategy:</h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {[
                        { metric: 'CAGR', note: 'Minimum 15–20% annualised to justify algo effort vs passive investing' },
                        { metric: 'Sharpe Ratio', note: 'Above 1.0 is acceptable; above 1.5 is good for Indian markets' },
                        { metric: 'Max Drawdown', note: 'Keep below 15% for overnight strategies; tighter for intraday' },
                        { metric: 'Win Rate', note: 'Less important than reward-risk ratio; 40% win-rate with 2:1 R/R is profitable' },
                        { metric: 'Out-of-Sample Performance', note: 'Always test on unseen data (last 12–24 months). This is the real test.' },
                        { metric: 'Number of Trades', note: 'Statistical significance requires 100+ trades minimum before trusting backtest results' },
                      ].map((item, i) => (
                        <div key={i} className="flex gap-2">
                          <span className="font-semibold text-gray-900 text-sm">{item.metric}:</span>
                          <span className="text-gray-600 text-sm">{item.note}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section id="regulatory" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Regulatory Framework in India</h2>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    SEBI regulates algorithmic trading in India through a series of circulars. Key points for retail algo traders:
                  </p>
                  <div className="space-y-3">
                    {[
                      'API-based trading is permitted through broker-provided APIs. SEBI mandates that the broker is responsible for compliance of all algo orders.',
                      'Retail traders using broker APIs (e.g., Zerodha Kite Connect, Upstox Pro) for semi-automated strategies are permitted without SEBI registration.',
                      'Fully automated high-frequency algos require co-location facility access at NSE/BSE and are subject to stricter SEBI oversight including algo audit trails.',
                      'SEBI\'s 2024 framework introduced risk controls including mandatory kill switches, order-to-trade ratio limits, and real-time monitoring requirements for all algo strategies.',
                    ].map((point, i) => (
                      <div key={i} className="flex gap-3 bg-white border border-gray-200 rounded-lg p-4">
                        <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</div>
                        <p className="text-gray-700 text-sm">{point}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section id="conclusion" className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Takeaways</h2>
                  <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-8">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-blue-700 mb-3">Getting started in algo trading:</h4>
                        <ul className="space-y-2 text-gray-700 text-sm">
                          <li>✅ Start with a simple, well-understood strategy</li>
                          <li>✅ Backtest with realistic costs and out-of-sample data</li>
                          <li>✅ Paper trade for 1–3 months before going live</li>
                          <li>✅ Use broker APIs (no SEBI registration needed for retail)</li>
                          <li>✅ Monitor live performance vs backtest regularly</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-700 mb-3">Common algo trading mistakes:</h4>
                        <ul className="space-y-2 text-gray-700 text-sm">
                          <li>🚫 Over-optimising (curve fitting) on historical data</li>
                          <li>🚫 Ignoring transaction costs in backtests</li>
                          <li>🚫 No kill switch or max drawdown circuit breaker</li>
                          <li>🚫 Deploying live without paper trading first</li>
                          <li>🚫 Using undercapitalised accounts for options selling algos</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="bg-gradient-to-r from-slate-800 to-blue-700 rounded-2xl p-8 text-white text-center">
                  <h3 className="text-2xl font-bold mb-4">Explore Algo Trading on TradeSmart</h3>
                  <p className="text-blue-200 mb-6">Learn how algorithmic signals and market scanning tools work with Indian equity and derivatives data.</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/algo-trading" className="bg-white text-slate-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                      Algo Trading Tools
                    </Link>
                    <Link href="/eod-scans" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                      EOD Scans & Screeners
                    </Link>
                  </div>
                </div>

                <div className="mt-12 bg-gray-50 rounded-xl p-6 flex gap-4 items-start">
                  <div className="bg-slate-700 text-white rounded-full w-14 h-14 flex items-center justify-center font-bold text-xl shrink-0">
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
