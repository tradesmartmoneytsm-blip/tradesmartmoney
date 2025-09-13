import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, User, ArrowRight, TrendingUp, BarChart3, Brain, Target } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Trading Blog & Market Insights | TradeSmart Money - Expert Analysis & Strategies',
  description: 'Latest trading insights, market analysis, and expert strategies for Indian stock markets. Learn smart money concepts, algo trading, and advanced trading techniques from professionals.',
  keywords: 'trading blog, market analysis, stock market insights, trading strategies India, NSE BSE trading, smart money analysis, algo trading blog, FII DII analysis, technical analysis blog',
  openGraph: {
    title: 'Trading Blog & Market Insights | TradeSmart Money',
    description: 'Expert trading analysis, market insights, and proven strategies for Indian markets',
    url: 'https://www.tradesmartmoney.com/blog',
  },
};

// Blog posts data - In production, this would come from a CMS or database
const blogPosts = [
  {
    slug: 'complete-guide-smart-money-trading-2025',
    title: 'Complete Guide to Smart Money Trading in 2025',
    excerpt: 'Master the art of following institutional money flow with advanced techniques and real-world examples from Indian markets.',
    publishDate: '2025-01-15',
    author: 'TradeSmart Team',
    category: 'Strategy',
    readTime: '12 min read',
    icon: Brain,
    featured: true,
  },
  {
    slug: 'fii-dii-data-nifty-movement-analysis',
    title: 'How FII/DII Data Affects Nifty Movement',
    excerpt: 'Deep dive into foreign and domestic institutional investor patterns and their impact on market direction.',
    publishDate: '2025-01-12',
    author: 'TradeSmart Team',
    category: 'Analysis',
    readTime: '8 min read',
    icon: TrendingUp,
    featured: true,
  },
  {
    slug: 'top-10-algo-trading-strategies-indian-markets',
    title: 'Top 10 Algo Trading Strategies for Indian Markets',
    excerpt: 'Proven algorithmic trading strategies specifically designed for NSE and BSE market conditions.',
    publishDate: '2025-01-10',
    author: 'TradeSmart Team',
    category: 'Algo Trading',
    readTime: '15 min read',
    icon: BarChart3,
    featured: false,
  },
  {
    slug: 'bank-nifty-vs-nifty-50-trading-guide',
    title: 'Bank Nifty vs Nifty 50: Which to Trade?',
    excerpt: 'Comprehensive comparison of trading Bank Nifty versus Nifty 50 - volatility, opportunities, and risk management.',
    publishDate: '2025-01-08',
    author: 'TradeSmart Team',
    category: 'Strategy',
    readTime: '10 min read',
    icon: Target,
    featured: false,
  },
];

const categories = ['All', 'Strategy', 'Analysis', 'Algo Trading', 'Market Insights'];

export default function BlogPage() {
  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Trading Insights & Market Analysis
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Expert strategies, market insights, and proven techniques for Indian markets
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-blue-700/30 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-blue-100">📈 Smart Money Concepts</span>
              </div>
              <div className="bg-purple-700/30 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-purple-100">🤖 Algo Trading</span>
              </div>
              <div className="bg-blue-700/30 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-blue-100">📊 FII/DII Analysis</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Articles</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <article className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
                    <div className="p-8">
                      <div className="flex items-center mb-4">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
                          <post.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                            {post.category}
                          </span>
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-6 line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {new Date(post.publishDate).toLocaleDateString('en-IN')}
                          </div>
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            {post.author}
                          </div>
                          <span>{post.readTime}</span>
                        </div>
                        
                        <div className="flex items-center text-blue-600 group-hover:text-blue-700 font-medium">
                          Read More <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All Posts */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Latest Articles</h2>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className="px-4 py-2 rounded-full border border-gray-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors text-sm font-medium"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <article className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                        <post.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="ml-3 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(post.publishDate).toLocaleDateString('en-IN')}
                      </div>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Stay Updated with Market Insights</h3>
            <p className="text-blue-100 mb-6">
              Get weekly trading insights, market analysis, and exclusive strategies delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 