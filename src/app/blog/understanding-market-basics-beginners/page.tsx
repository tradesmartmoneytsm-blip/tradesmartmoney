import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { ArrowLeft, BookOpen, TrendingUp, BarChart3, Users, AlertTriangle } from 'lucide-react';

// SEO IMPROVEMENT #2: Meta Description (150-160 chars)
export const metadata: Metadata = {
  title: 'Stock Market Basics: Complete Beginner\'s Guide | TradeSmart Money',
  description: 'Learn stock market fundamentals for Indian markets. Understand NSE, BSE, trading basics, technical analysis, and how to start investing safely with examples.',
  keywords: 'stock market basics, beginner trading guide, NSE BSE, Indian stock market, how to invest in stocks, trading for beginners, stock market education',
  authors: [{ name: 'TradeSmart Team' }],
  openGraph: {
    title: 'Stock Market Basics: Complete Beginner\'s Guide',
    description: 'Learn stock market fundamentals for Indian markets with practical examples and step-by-step guidance',
    url: 'https://www.tradesmartmoney.com/blog/understanding-market-basics-beginners',
    type: 'article',
    publishedTime: '2025-01-20T05:30:00.000Z',
    modifiedTime: '2025-02-07T05:30:00.000Z',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stock Market Basics: Complete Beginner\'s Guide',
    description: 'Learn stock market fundamentals for Indian markets with practical examples',
  },
  alternates: {
    canonical: 'https://www.tradesmartmoney.com/blog/understanding-market-basics-beginners',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function MarketBasicsPost() {
  return (
    <>
      {/* SEO IMPROVEMENT #1: Structured Data */}
      <Script id="article-schema" type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'Understanding Stock Market Basics: A Complete Beginner\'s Guide',
          description: 'Learn stock market fundamentals for Indian markets. Understand NSE, BSE, trading basics, technical analysis, and how to start investing safely with examples.',
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
          datePublished: '2025-01-20T05:30:00.000Z',
          dateModified: '2025-02-07T05:30:00.000Z',
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': 'https://www.tradesmartmoney.com/blog/understanding-market-basics-beginners',
          },
          articleSection: 'Trading Education',
          keywords: 'stock market basics, beginner trading guide, NSE BSE, Indian stock market',
          wordCount: 1500,
          timeRequired: 'PT15M',
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
              Understanding Stock Market Basics: A Complete Beginner's Guide
            </h1>
            <div className="flex items-center text-gray-600 text-sm">
              <BookOpen className="w-4 h-4 mr-2" aria-label="Educational guide icon" />
              <span>Educational Guide</span>
              <span className="mx-2">•</span>
              <span>15 min read</span>
              <span className="mx-2">•</span>
              <span>January 20, 2025</span>
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
                    We are not SEBI registered advisors. Please consult qualified financial advisors before making investment decisions.
                  </p>
                </div>
              </div>
            </div>

            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">What is the Stock Market?</h2>
              <p className="text-gray-700 mb-6">
                The stock market is a platform where shares of publicly-held companies are bought and sold. 
                Think of it as a giant marketplace where instead of fruits and vegetables, people trade ownership 
                pieces (called shares or stocks) of companies. {/* SEO IMPROVEMENT #4: Internal Link */}
                You can track real-time market movements on our{' '}
                <Link href="/market/sector-performance" className="text-blue-600 hover:underline font-medium">
                  sector performance dashboard
                </Link> to see how different sectors perform throughout the day.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Key Players in the Indian Stock Market</h3>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* SEO IMPROVEMENT #3: Add aria-labels to icons */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Users className="w-5 h-5 text-blue-600 mr-2" aria-label="Retail investors icon" />
                    <h4 className="font-semibold text-gray-900">Retail Investors</h4>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Individual investors like you and me who buy and sell stocks for personal investment.
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600 mr-2" aria-label="Institutional investors icon" />
                    <h4 className="font-semibold text-gray-900">Institutional Investors</h4>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Large organizations like mutual funds, insurance companies, and foreign investors (FII/DII). 
                    {/* SEO IMPROVEMENT #4: Internal Link */}
                    Track their activity on our{' '}
                    <Link href="/market/fii-dii-activity" className="text-green-700 hover:underline font-medium">
                      FII/DII monitoring page
                    </Link>.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Understanding Stock Exchanges</h3>
              <p className="text-gray-700 mb-4">
                In India, we have two main stock exchanges:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li><strong>NSE (National Stock Exchange):</strong> The largest stock exchange in India</li>
                <li><strong>BSE (Bombay Stock Exchange):</strong> The oldest stock exchange in Asia</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Basic Market Terminology</h3>
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Bull Market</h4>
                    <p className="text-gray-700 text-sm">A period when stock prices are rising or expected to rise.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Bear Market</h4>
                    <p className="text-gray-700 text-sm">A period when stock prices are falling or expected to fall.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Market Cap</h4>
                    <p className="text-gray-700 text-sm">Total value of a company's shares in the market.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Dividend</h4>
                    <p className="text-gray-700 text-sm">Payment made by companies to shareholders from profits.</p>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">How Stock Prices Move</h3>
              <p className="text-gray-700 mb-4">
                Stock prices are determined by supply and demand. When more people want to buy a stock (demand) 
                than sell it (supply), the price goes up. When more people want to sell than buy, the price goes down. 
                {/* SEO IMPROVEMENT #4: Internal Link */}
                Monitor live price movements and market sentiment with our{' '}
                <Link href="/market/market-sentiment" className="text-blue-600 hover:underline font-medium">
                  market sentiment indicators
                </Link>.
              </p>

              <h4 className="text-lg font-semibold text-gray-900 mb-3">Factors Affecting Stock Prices:</h4>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li><strong>Company Performance:</strong> Earnings, revenue growth, new products</li>
                <li><strong>Economic Factors:</strong> Interest rates, inflation, GDP growth</li>
                <li><strong>Market Sentiment:</strong> Investor emotions and market psychology</li>
                <li><strong>Global Events:</strong> International news, trade wars, pandemics</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Types of Analysis</h3>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="border border-gray-200 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <BarChart3 className="w-5 h-5 text-purple-600 mr-2" aria-label="Technical analysis icon" />
                    <h4 className="font-semibold text-gray-900">Technical Analysis</h4>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Studying price charts and patterns to predict future price movements. 
                    Uses historical price data and trading volume. Learn more in our{' '}
                    <Link href="/blog/how-to-read-financial-charts" className="text-purple-600 hover:underline">
                      chart reading guide
                    </Link>.
                  </p>
                </div>
                <div className="border border-gray-200 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <BookOpen className="w-5 h-5 text-orange-600 mr-2" aria-label="Fundamental analysis icon" />
                    <h4 className="font-semibold text-gray-900">Fundamental Analysis</h4>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Analyzing company's financial health, earnings, revenue, and business model 
                    to determine stock value.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Getting Started: Basic Steps</h3>
              <ol className="list-decimal pl-6 text-gray-700 mb-6">
                <li className="mb-2"><strong>Education First:</strong> Learn the basics before investing any money</li>
                <li className="mb-2"><strong>Open a Demat Account:</strong> Required to hold shares electronically</li>
                <li className="mb-2"><strong>Start Small:</strong> Begin with small amounts you can afford to lose</li>
                <li className="mb-2"><strong>Diversify:</strong> Don't put all money in one stock</li>
                <li className="mb-2"><strong>Stay Updated:</strong> Follow market news and company updates</li>
              </ol>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Common Beginner Mistakes to Avoid</h3>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <ul className="list-disc pl-4 text-gray-700">
                  <li>Investing without understanding the company</li>
                  <li>Following tips from unverified sources</li>
                  <li>Emotional trading (buying high, selling low)</li>
                  <li>Not having a clear investment goal</li>
                  <li>Ignoring risk management - read our{' '}
                    <Link href="/blog/risk-management-trading-education" className="text-yellow-800 hover:underline font-medium">
                      risk management guide
                    </Link>
                  </li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Final Thoughts</h3>
              <p className="text-gray-700 mb-6">
                The stock market can be a powerful tool for building wealth over time, but it requires patience, 
                discipline, and continuous learning. Remember that all investments carry risk, and past performance 
                doesn't guarantee future results.
              </p>

              <p className="text-gray-700 mb-6">
                <strong>Always consult with SEBI registered investment advisors before making any investment decisions. 
                This content is purely educational and should not be considered as investment advice.</strong>
              </p>
            </div>

            {/* Related Links */}
            <div className="border-t border-gray-200 pt-8 mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Continue Learning</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Link href="/blog/how-to-read-financial-charts" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                  <h4 className="font-semibold text-gray-900 mb-2">How to Read Financial Charts</h4>
                  <p className="text-gray-600 text-sm">Learn the basics of reading stock charts and understanding price movements.</p>
                </Link>
                <Link href="/blog/risk-management-trading-education" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                  <h4 className="font-semibold text-gray-900 mb-2">Risk Management in Trading</h4>
                  <p className="text-gray-600 text-sm">Educational guide on protecting your capital while trading.</p>
                </Link>
              </div>
            </div>
          </article>
        </main>
      </div>
    </>
  );
}
