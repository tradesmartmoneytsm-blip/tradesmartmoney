import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { ArrowLeft, BookOpen, Shield, TrendingDown, AlertTriangle, DollarSign } from 'lucide-react';

// SEO IMPROVEMENT #2: Meta Description (150-160 chars)
export const metadata: Metadata = {
  title: 'Risk Management in Trading: Capital Protection Guide | TradeSmart Money',
  description: 'Master risk management strategies for trading. Learn position sizing, stop losses, diversification, and capital preservation techniques to protect your portfolio.',
  keywords: 'risk management trading, position sizing, stop loss strategies, capital preservation, trading risk, portfolio protection, risk reward ratio',
  authors: [{ name: 'TradeSmart Team' }],
  openGraph: {
    title: 'Risk Management in Trading: Educational Guide to Protecting Your Capital',
    description: 'Master risk management strategies including position sizing, stop losses, and capital preservation techniques',
    url: 'https://www.tradesmartmoney.com/blog/risk-management-trading-education',
    type: 'article',
    publishedTime: '2025-01-25T05:30:00.000Z',
    modifiedTime: '2025-02-07T05:30:00.000Z',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Risk Management in Trading: Educational Guide',
    description: 'Master risk management strategies for trading success',
  },
  alternates: {
    canonical: 'https://www.tradesmartmoney.com/blog/risk-management-trading-education',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RiskManagementPost() {
  return (
    <>
      {/* SEO IMPROVEMENT #1: Structured Data */}
      <Script id="article-schema" type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'Risk Management in Trading: Educational Guide to Protecting Your Capital',
          description: 'Master risk management strategies for trading. Learn position sizing, stop losses, diversification, and capital preservation techniques to protect your portfolio.',
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
          datePublished: '2025-01-25T05:30:00.000Z',
          dateModified: '2025-02-07T05:30:00.000Z',
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': 'https://www.tradesmartmoney.com/blog/risk-management-trading-education',
          },
          articleSection: 'Risk Management',
          keywords: 'risk management, trading education, position sizing, stop loss',
          wordCount: 1800,
          timeRequired: 'PT18M',
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
              Risk Management in Trading: Educational Guide to Protecting Your Capital
            </h1>
            <div className="flex items-center text-gray-600 text-sm">
              <BookOpen className="w-4 h-4 mr-2" aria-label="Educational guide icon" />
              <span>Educational Guide</span>
              <span className="mx-2">•</span>
              <span>18 min read</span>
              <span className="mx-2">•</span>
              <span>January 25, 2025</span>
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
                    We are not SEBI registered advisors. Risk management strategies discussed here are educational concepts. 
                    Please consult qualified financial advisors for personalized advice.
                  </p>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="mb-8 rounded-lg overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&h=500&fit=crop"
                alt="Risk management in trading with charts showing stop loss and position sizing strategies"
                width={1200}
                height={500}
                className="w-full h-auto"
                priority
              />
            </div>

            {/* Risk Management Visual */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Image
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop"
                alt="Financial risk assessment chart with portfolio diversification analysis"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
              <Image
                src="https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=600&h=400&fit=crop"
                alt="Trading risk management tools and position sizing calculator"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>

            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">What is Risk Management?</h2>
              <p className="text-gray-700 mb-6">
                Risk management in trading is the process of identifying, assessing, and controlling potential losses 
                from your trading activities. It's not about avoiding risk entirely (which is impossible in trading), 
                but rather about managing risk in a way that preserves your capital over the long term.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
                <p className="text-blue-800 font-medium">
                  <strong>Key Principle:</strong> The goal of risk management is not to maximize profits, 
                  but to minimize losses and preserve capital so you can continue trading tomorrow.
                </p>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Why Risk Management is Crucial</h3>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <TrendingDown className="w-5 h-5 text-red-600 mr-2" aria-label="Capital preservation icon" />
                    <h4 className="font-semibold text-gray-900">Capital Preservation</h4>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Protects your trading capital from significant losses that could end your trading career.
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Shield className="w-5 h-5 text-green-600 mr-2" aria-label="Emotional control icon" />
                    <h4 className="font-semibold text-gray-900">Emotional Control</h4>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Helps maintain psychological discipline by reducing the emotional impact of losses.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Types of Risk in Trading</h3>
              <div className="space-y-4 mb-8">
                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Market Risk</h4>
                  <p className="text-gray-700 text-sm">
                    The risk of losses due to overall market movements. Even good stocks can fall during market downturns. 
                    {/* SEO IMPROVEMENT #4: Internal Link */}
                    Track market-wide movements with our{' '}
                    <Link href="/market/top-gainers" className="text-blue-600 hover:underline">
                      top gainers and losers analysis
                    </Link>.
                  </p>
                </div>
                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Stock-Specific Risk</h4>
                  <p className="text-gray-700 text-sm">
                    Risk associated with individual companies - earnings disappointments, management changes, scandals.
                  </p>
                </div>
                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Liquidity Risk</h4>
                  <p className="text-gray-700 text-sm">
                    The risk of not being able to buy or sell a stock quickly at a fair price.
                  </p>
                </div>
                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Emotional Risk</h4>
                  <p className="text-gray-700 text-sm">
                    Risk of making poor decisions due to fear, greed, or other emotions.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">The 1% Rule (Educational Concept)</h3>
              <div className="bg-yellow-50 p-6 rounded-lg mb-6">
                <div className="flex items-center mb-3">
                  <DollarSign className="w-5 h-5 text-yellow-600 mr-2" aria-label="Money management icon" />
                  <h4 className="font-semibold text-gray-900">The 1% Risk Rule</h4>
                </div>
                <p className="text-gray-700 mb-3">
                  A commonly taught risk management principle suggests never risking more than 1% of your 
                  total trading capital on a single trade.
                </p>
                <div className="bg-white p-3 rounded border">
                  <p className="text-sm text-gray-700 mb-2"><strong>Example (Educational):</strong></p>
                  <p className="text-sm text-gray-700">
                    If you have ₹1,00,000 in trading capital, you would risk only ₹1,000 per trade. 
                    This means if you're wrong, you lose only 1% of your capital.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Position Sizing (Educational)</h3>
              <p className="text-gray-700 mb-4">
                Position sizing determines how much money you allocate to each trade. It's one of the most 
                important aspects of risk management.
              </p>
              
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Basic Position Sizing Formula:</h4>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-gray-700 font-mono text-center mb-2">
                  Position Size = Risk Amount ÷ (Entry Price - Stop Loss Price)
                </p>
                <p className="text-gray-600 text-sm text-center">
                  This is an educational formula used in risk management courses
                </p>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Stop Loss Orders (Educational)</h3>
              <p className="text-gray-700 mb-4">
                A stop loss is an order to sell a security when it reaches a certain price, designed to limit losses.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Fixed Percentage Stop Loss</h4>
                  <p className="text-gray-700 text-sm mb-2">
                    Set stop loss at a fixed percentage below purchase price (e.g., 5% or 10%).
                  </p>
                  <div className="bg-blue-50 p-2 rounded text-xs text-blue-800">
                    <strong>Example:</strong> Buy at ₹100, set stop loss at ₹95 (5% stop loss)
                  </div>
                </div>
                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Technical Stop Loss</h4>
                  <p className="text-gray-700 text-sm mb-2">
                    Set stop loss based on technical levels like support/resistance.
                  </p>
                  <div className="bg-green-50 p-2 rounded text-xs text-green-800">
                    <strong>Example:</strong> Set stop loss just below a key support level
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Diversification Strategies</h3>
              <p className="text-gray-700 mb-4">
                Diversification involves spreading risk across different investments to reduce overall portfolio risk. 
                {/* SEO IMPROVEMENT #4: Internal Link */}
                Use our{' '}
                <Link href="/market/sector-performance" className="text-blue-600 hover:underline font-medium">
                  sector performance analysis
                </Link>{' '}
                to identify opportunities across different sectors.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Sector Diversification</h4>
                  <p className="text-gray-700 text-sm">
                    Don't put all your money in one sector (e.g., only IT or only banking stocks). 
                    Monitor sector rotation patterns on our platform.
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Market Cap Diversification</h4>
                  <p className="text-gray-700 text-sm">
                    Mix of large-cap, mid-cap, and small-cap stocks with different risk profiles.
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Time Diversification</h4>
                  <p className="text-gray-700 text-sm">
                    Don't invest all your money at once; consider systematic investment over time.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Risk-Reward Ratio (Educational)</h3>
              <p className="text-gray-700 mb-4">
                The risk-reward ratio compares the potential profit of a trade to its potential loss.
              </p>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Common Risk-Reward Ratios:</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white p-3 rounded border">
                    <h5 className="font-semibold text-gray-900 text-sm">1:1 Ratio</h5>
                    <p className="text-gray-600 text-xs">Risk ₹100 to make ₹100</p>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <h5 className="font-semibold text-gray-900 text-sm">1:2 Ratio</h5>
                    <p className="text-gray-600 text-xs">Risk ₹100 to make ₹200</p>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <h5 className="font-semibold text-gray-900 text-sm">1:3 Ratio</h5>
                    <p className="text-gray-600 text-xs">Risk ₹100 to make ₹300</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-3">
                  <strong>Educational Note:</strong> Many traders aim for at least a 1:2 risk-reward ratio.
                </p>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Psychological Aspects of Risk Management</h3>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Common Psychological Traps</h4>
                  <ul className="text-gray-700 text-sm list-disc pl-4">
                    <li>Holding losing positions too long</li>
                    <li>Taking profits too early</li>
                    <li>Revenge trading after losses</li>
                    <li>Overconfidence after wins</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Healthy Trading Mindset</h4>
                  <ul className="text-gray-700 text-sm list-disc pl-4">
                    <li>Accept that losses are part of trading</li>
                    <li>Focus on process, not just profits</li>
                    <li>Maintain emotional discipline</li>
                    <li>Learn from both wins and losses</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Creating a Risk Management Plan</h3>
              <ol className="list-decimal pl-6 text-gray-700 mb-6">
                <li className="mb-2"><strong>Define Your Risk Tolerance:</strong> How much can you afford to lose?</li>
                <li className="mb-2"><strong>Set Position Size Rules:</strong> Maximum amount per trade</li>
                <li className="mb-2"><strong>Establish Stop Loss Rules:</strong> Where and when to exit losing trades</li>
                <li className="mb-2"><strong>Create Diversification Guidelines:</strong> How to spread risk</li>
                <li className="mb-2"><strong>Plan for Different Scenarios:</strong> Bull markets, bear markets, sideways markets</li>
                <li className="mb-2"><strong>Regular Review:</strong> Assess and adjust your plan periodically</li>
              </ol>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Common Risk Management Mistakes</h3>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <ul className="list-disc pl-4 text-gray-700">
                  <li>Not having a risk management plan at all</li>
                  <li>Risking too much on a single trade</li>
                  <li>Moving stop losses in the wrong direction</li>
                  <li>Ignoring correlation between positions</li>
                  <li>Emotional decision making during losses</li>
                  <li>Not adjusting position size based on volatility</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Tools for Risk Management</h3>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Position Size Calculators</h4>
                  <p className="text-gray-700 text-sm">
                    Online tools to calculate appropriate position sizes based on your risk parameters.
                  </p>
                </div>
                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Trading Journal</h4>
                  <p className="text-gray-700 text-sm">
                    Record all trades to analyze your risk management performance over time.
                  </p>
                </div>
                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Portfolio Trackers</h4>
                  <p className="text-gray-700 text-sm">
                    Monitor overall portfolio risk and correlation between positions.
                  </p>
                </div>
                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Volatility Indicators</h4>
                  <p className="text-gray-700 text-sm">
                    Use VIX and other volatility measures to adjust risk based on market conditions.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Risk Management for Different Trading Styles</h3>
              <div className="space-y-4 mb-8">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Day Trading Risk Management</h4>
                  <p className="text-gray-700 text-sm">
                    Stricter position sizing, tighter stops, daily loss limits, no overnight positions.
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Swing Trading Risk Management</h4>
                  <p className="text-gray-700 text-sm">
                    Wider stops to account for normal price swings, position sizing based on volatility. 
                    {/* SEO IMPROVEMENT #4: Internal Link */}
                    Explore our{' '}
                    <Link href="/swing-trades" className="text-green-700 hover:underline font-medium">
                      swing trading strategies
                    </Link>{' '}
                    for educational examples.
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Long-term Investing Risk Management</h4>
                  <p className="text-gray-700 text-sm">
                    Focus on diversification, regular rebalancing, and fundamental risk assessment.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Conclusion</h3>
              <p className="text-gray-700 mb-6">
                Risk management is not about avoiding risk entirely - it's about managing risk intelligently. 
                The goal is to preserve capital while still allowing for profitable opportunities. Remember that 
                even the best risk management system cannot guarantee profits or prevent all losses.
              </p>

              <p className="text-gray-700 mb-6">
                <strong>This educational content covers theoretical concepts in risk management. 
                Always consult with SEBI registered investment advisors before implementing any risk management 
                strategies. Your risk tolerance and financial situation are unique to you.</strong>
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
                <Link href="/blog/how-to-read-financial-charts" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                  <h4 className="font-semibold text-gray-900 mb-2">How to Read Financial Charts</h4>
                  <p className="text-gray-600 text-sm">Learn the basics of reading stock charts and understanding patterns.</p>
                </Link>
              </div>
            </div>
          </article>
        </main>
      </div>
    </>
  );
}
