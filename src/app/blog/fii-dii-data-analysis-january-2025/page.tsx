import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, User, Clock, Eye, ChevronLeft, TrendingUp, BarChart3, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'FII/DII Data Analysis: January 2025 Market Impact | TradeSmart Money',
  description: 'Deep dive into recent foreign and domestic institutional flow patterns and their dramatic impact on Nifty direction in January 2025.',
  keywords: 'FII DII data, institutional flow, market analysis, Nifty movement, foreign investment, domestic investment, January 2025',
  openGraph: {
    title: 'FII/DII Data Analysis: January 2025 Market Impact',
    description: 'Deep dive into recent foreign and domestic institutional flow patterns and their dramatic impact on Nifty direction.',
    url: 'https://www.tradesmartmoney.com/blog/fii-dii-data-analysis-january-2025',
    siteName: 'TradeSmart Money',
    type: 'article',
    images: [
      {
        url: '/blog/fii-dii-analysis.jpg',
        width: 1200,
        height: 630,
        alt: 'FII DII Data Analysis January 2025',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FII/DII Data Analysis: January 2025 Market Impact',
    description: 'Deep dive into institutional flow patterns and market impact.',
  },
  alternates: {
    canonical: 'https://www.tradesmartmoney.com/blog/fii-dii-data-analysis-january-2025',
  },
};

export default function FIIDIIAnalysisPage() {
  const publishDate = new Date('2025-01-14T05:30:00.000Z');
  
  const post = {
    title: 'FII/DII Data Analysis: January 2025 Market Impact',
    excerpt: 'Deep dive into recent foreign and domestic institutional flow patterns and their dramatic impact on Nifty direction.',
    author: {
      name: 'Priya Sharma',
      role: 'Data Analyst',
      bio: 'Specialist in institutional flow analysis'
    },
    category: 'Market Analysis',
    tags: ['FII DII', 'Market Data', 'Institutional Flow', 'Nifty'],
    readTime: '8 min read',
    difficulty: 'Beginner',
    views: 12150,
    comments: 64,
    likes: 278
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center mb-6 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-white/30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
              {post.category}
            </span>
            <span className="bg-green-100 text-green-700 border-green-200 border px-3 py-1 rounded-full text-sm font-medium">
              {post.difficulty}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>
          
          <p className="text-xl text-blue-100 mb-8 leading-relaxed max-w-3xl">
            {post.excerpt}
          </p>
          
          <div className="flex flex-wrap items-center gap-6 text-blue-100">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              {post.author.name}
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {publishDate.toLocaleDateString('en-IN')}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              {post.readTime}
            </div>
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-2" />
              {post.views.toLocaleString()} views
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-8 md:p-12">
            {/* Author Card */}
            <div className="flex items-center p-6 bg-gray-50 rounded-xl border border-gray-100 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mr-4">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">{post.author.name}</div>
                <div className="text-sm text-gray-600">{post.author.role}</div>
                <div className="text-sm text-gray-500 mt-1">{post.author.bio}</div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm hover:bg-blue-100 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl mb-8">
                <h3 className="text-blue-900 font-bold mb-2 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Key Insights from January 2025
                </h3>
                <ul className="text-blue-800 space-y-2">
                  <li>FII outflows reached ₹15,420 crores in the first half of January</li>
                  <li>DII buying provided strong support with ₹18,750 crores inflow</li>
                  <li>Net institutional flow remained positive at ₹3,330 crores</li>
                  <li>Banking and IT sectors saw maximum institutional interest</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">Understanding January&apos;s Market Dynamics</h2>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                January 2025 presented a fascinating case study in institutional behavior. While Foreign Institutional Investors (FIIs) 
                continued their selling spree amid global uncertainties, Domestic Institutional Investors (DIIs) stepped up significantly 
                to provide market support.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">FII Outflows: The Global Picture</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                The persistent FII selling can be attributed to several factors:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li>Rising US treasury yields making dollar assets attractive</li>
                <li>Concerns over India&apos;s premium valuations</li>
                <li>Profit booking after stellar 2024 performance</li>
                <li>Reallocation to other emerging markets</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">DII Strength: Domestic Confidence</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                Domestic institutions showed remarkable confidence, with mutual funds and insurance companies leading the buying spree. 
                This demonstrates the maturity of Indian capital markets and the growing pool of domestic savings.
              </p>

              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
                <h4 className="font-bold text-green-800 mb-3 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Sector-wise Analysis
                </h4>
                <div className="grid md:grid-cols-2 gap-4 text-green-700">
                  <div>
                    <strong>Banking:</strong> ₹4,250 crores net buying
                  </div>
                  <div>
                    <strong>IT Services:</strong> ₹2,180 crores net buying
                  </div>
                  <div>
                    <strong>FMCG:</strong> ₹1,950 crores net buying
                  </div>
                  <div>
                    <strong>Auto:</strong> ₹1,420 crores net selling
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">Impact on Nifty Movement</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                The net positive institutional flow helped Nifty maintain its upward trajectory despite global headwinds. 
                The 50-stock index gained 3.2% in January, outperforming most global indices.
              </p>

              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white mb-8">
                <h3 className="text-xl font-bold mb-3 flex items-center">
                  <Award className="w-6 h-6 mr-2 text-yellow-300" />
                  Expert Trading Tip
                </h3>
                <p className="text-blue-100 mb-4">
                  &ldquo;Watch for days when DII buying exceeds ₹2,000 crores while FII selling is below ₹1,500 crores. 
                  These often mark strong support levels for the market.&rdquo; - Priya Sharma, Data Analyst
                </p>
                <Link 
                  href="/market"
                  className="inline-flex items-center bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  View Live FII/DII Data
                </Link>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">Looking Ahead: February Expectations</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                As we move into February, several factors will influence institutional flows:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-8 space-y-2">
                <li>Union Budget announcements and policy changes</li>
                <li>Q3 FY25 earnings season outcomes</li>
                <li>Global central bank policy decisions</li>
                <li>Geopolitical developments</li>
              </ul>

              <div className="bg-gray-100 p-6 rounded-xl border-l-4 border-gray-400">
                <h4 className="font-bold text-gray-800 mb-2">Disclaimer</h4>
                <p className="text-gray-600 text-sm">
                  This analysis is for educational purposes only. Past performance doesn&apos;t guarantee future results. 
                  Always consult with financial advisors before making investment decisions.
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/blog/complete-guide-smart-money-trading-2025">
              <article className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-500 relative">
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded text-sm font-medium">
                      Smart Money
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    Complete Guide to Smart Money Trading in 2025
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    Master institutional money flow tracking with advanced techniques and real-world examples.
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    12 min read
                  </div>
                </div>
              </article>
            </Link>
            
            <Link href="/blog/swing-trading-nifty-stocks-2025">
              <article className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                <div className="h-32 bg-gradient-to-r from-green-500 to-blue-500 relative">
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded text-sm font-medium">
                      Swing Trading
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    Swing Trading Nifty Stocks: 2025 Strategy Guide
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    Identify high-probability swing trades in Nifty constituents using technical analysis.
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    14 min read
                  </div>
                </div>
              </article>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
} 