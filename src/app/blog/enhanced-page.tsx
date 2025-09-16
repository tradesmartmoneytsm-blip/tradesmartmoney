'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  User, ArrowRight, TrendingUp, BarChart3, Brain, Search, 
  Filter, Eye, MessageCircle, Clock, Star,
  ChevronRight, Zap, TrendingDown, DollarSign, Activity, PieChart
} from 'lucide-react';

// Enhanced blog posts with more realistic data
const blogPosts = [
  {
    id: 1,
    slug: 'complete-guide-smart-money-trading-2025',
    title: 'Complete Guide to Smart Money Trading in 2025',
    excerpt: 'Master institutional money flow tracking with advanced techniques, real-world examples, and proven strategies for Indian markets.',
    content: 'Full article content...',
    publishDate: '2025-01-15',
    lastUpdated: '2025-01-15',
    author: {
      name: 'Raj Patel',
      avatar: '/team/raj-patel.jpg',
      role: 'Senior Market Analyst',
      bio: '10+ years experience in institutional trading'
    },
    category: 'Smart Money',
    tags: ['Institutional Flow', 'FII/DII', 'Order Flow', 'Strategy'],
    readTime: '12 min read',
    difficulty: 'Intermediate',
    icon: Brain,
    featured: true,
    views: 15420,
    comments: 89,
    likes: 342,
    imageUrl: '/blog/smart-money-guide.jpg',
    premium: false
  },
  {
    id: 2,
    slug: 'fii-dii-data-analysis-january-2025',
    title: 'FII/DII Data Analysis: January 2025 Market Impact',
    excerpt: 'Deep dive into recent foreign and domestic institutional flow patterns and their dramatic impact on Nifty direction.',
    content: 'Full article content...',
    publishDate: '2025-01-14',
    lastUpdated: '2025-01-14',
    author: {
      name: 'Priya Sharma',
      avatar: '/team/priya-sharma.jpg',
      role: 'Data Analyst',
      bio: 'Specialist in institutional flow analysis'
    },
    category: 'Market Analysis',
    tags: ['FII DII', 'Market Data', 'Institutional Flow', 'Nifty'],
    readTime: '8 min read',
    difficulty: 'Beginner',
    icon: TrendingUp,
    featured: true,
    views: 12150,
    comments: 64,
    likes: 278,
    imageUrl: '/blog/fii-dii-analysis.jpg',
    premium: false
  },
  {
    id: 3,
    slug: 'top-algo-trading-strategies-nse-bse',
    title: '10 Proven Algo Trading Strategies for NSE & BSE',
    excerpt: 'Battle-tested algorithmic trading strategies specifically optimized for Indian market conditions with backtesting results.',
    content: 'Full article content...',
    publishDate: '2025-01-12',
    lastUpdated: '2025-01-12',
    author: {
      name: 'Vikram Singh',
      avatar: '/team/vikram-singh.jpg',
      role: 'Algorithmic Trading Expert',
      bio: 'Former quant trader at leading hedge fund'
    },
    category: 'Algo Trading',
    tags: ['Algorithms', 'Backtesting', 'NSE', 'BSE', 'Quantitative'],
    readTime: '15 min read',
    difficulty: 'Advanced',
    icon: BarChart3,
    featured: false,
    views: 8920,
    comments: 156,
    likes: 445,
    imageUrl: '/blog/algo-strategies.jpg',
    premium: true
  },
  {
    id: 4,
    slug: 'bank-nifty-intraday-trading-masterclass',
    title: 'Bank Nifty Intraday Trading: Complete Masterclass',
    excerpt: 'Master Bank Nifty intraday patterns, key levels, volatility analysis, and risk management for consistent profits.',
    content: 'Full article content...',
    publishDate: '2025-01-10',
    lastUpdated: '2025-01-11',
    author: {
      name: 'Arjun Mehta',
      avatar: '/team/arjun-mehta.jpg',
      role: 'Intraday Specialist',
      bio: 'Professional day trader with 8+ years experience'
    },
    category: 'Intraday Trading',
    tags: ['Bank Nifty', 'Intraday', 'Options', 'Technical Analysis'],
    readTime: '10 min read',
    difficulty: 'Intermediate',
    icon: Activity,
    featured: false,
    views: 11200,
    comments: 92,
    likes: 301,
    imageUrl: '/blog/bank-nifty-trading.jpg',
    premium: false
  },
  {
    id: 5,
    slug: 'options-chain-analysis-complete-guide',
    title: 'Options Chain Analysis: The Ultimate Guide',
    excerpt: 'Learn to decode options chain data, understand Put-Call ratio, max pain theory, and gamma levels for better trading decisions.',
    content: 'Full article content...',
    publishDate: '2025-01-08',
    lastUpdated: '2025-01-09',
    author: {
      name: 'Sneha Gupta',
      avatar: '/team/sneha-gupta.jpg',
      role: 'Options Trading Specialist',
      bio: 'Certified options strategist and market maker'
    },
    category: 'Options Trading',
    tags: ['Options Chain', 'PCR', 'Max Pain', 'Gamma', 'Greeks'],
    readTime: '18 min read',
    difficulty: 'Advanced',
    icon: PieChart,
    featured: false,
    views: 9540,
    comments: 78,
    likes: 234,
    imageUrl: '/blog/options-chain.jpg',
    premium: true
  },
  {
    id: 6,
    slug: 'swing-trading-nifty-stocks-2025',
    title: 'Swing Trading Nifty Stocks: 2025 Strategy Guide',
    excerpt: 'Identify high-probability swing trades in Nifty constituents using technical analysis, sector rotation, and earnings plays.',
    content: 'Full article content...',
    publishDate: '2025-01-06',
    lastUpdated: '2025-01-07',
    author: {
      name: 'Karan Desai',
      avatar: '/team/karan-desai.jpg',
      role: 'Swing Trading Expert',
      bio: 'Portfolio manager specializing in equity strategies'
    },
    category: 'Swing Trading',
    tags: ['Swing Trading', 'Nifty Stocks', 'Technical Analysis', 'Sector Rotation'],
    readTime: '14 min read',
    difficulty: 'Intermediate',
    icon: TrendingDown,
    featured: true,
    views: 7820,
    comments: 45,
    likes: 189,
    imageUrl: '/blog/swing-trading.jpg',
    premium: false
  }
];

const categories = [
  { name: 'All', count: blogPosts.length, color: 'gray' },
  { name: 'Smart Money', count: blogPosts.filter(p => p.category === 'Smart Money').length, color: 'blue' },
  { name: 'Market Analysis', count: blogPosts.filter(p => p.category === 'Market Analysis').length, color: 'green' },
  { name: 'Algo Trading', count: blogPosts.filter(p => p.category === 'Algo Trading').length, color: 'purple' },
  { name: 'Intraday Trading', count: blogPosts.filter(p => p.category === 'Intraday Trading').length, color: 'red' },
  { name: 'Options Trading', count: blogPosts.filter(p => p.category === 'Options Trading').length, color: 'yellow' },
  { name: 'Swing Trading', count: blogPosts.filter(p => p.category === 'Swing Trading').length, color: 'indigo' }
];

const difficultyColors: Record<string, string> = {
  'Beginner': 'bg-green-100 text-green-700',
  'Intermediate': 'bg-yellow-100 text-yellow-700',
  'Advanced': 'bg-red-100 text-red-700'
};

export default function EnhancedBlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState('latest');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let filtered = blogPosts;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        post.author.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Difficulty filter
    if (selectedDifficulty !== 'All') {
      filtered = filtered.filter(post => post.difficulty === selectedDifficulty);
    }

    // Sort
    switch (sortBy) {
      case 'latest':
        filtered.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'commented':
        filtered.sort((a, b) => b.comments - a.comments);
        break;
      case 'liked':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategory, selectedDifficulty, sortBy]);

  const featuredPosts = blogPosts.filter(post => post.featured);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Enhanced Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-blue-200 text-sm font-medium">📚 Professional Trading Education</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Master the Markets with
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Expert Insights
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Deep-dive analysis, proven strategies, and actionable insights from India's top trading professionals
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-300">50+</div>
                <div className="text-blue-200 text-sm">Expert Articles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-300">25K+</div>
                <div className="text-blue-200 text-sm">Active Readers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-300">95%</div>
                <div className="text-blue-200 text-sm">Success Rate</div>
              </div>
            </div>

            {/* Topic Links */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/smart-money-concepts"
                className="group bg-blue-700/30 backdrop-blur-sm px-6 py-3 rounded-full hover:bg-blue-600/40 transition-all duration-300 border border-blue-500/30"
              >
                <span className="text-blue-100 group-hover:text-white flex items-center">
                  🧠 Smart Money Concepts
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link 
                href="/algo-trading"
                className="group bg-purple-700/30 backdrop-blur-sm px-6 py-3 rounded-full hover:bg-purple-600/40 transition-all duration-300 border border-purple-500/30"
              >
                <span className="text-purple-100 group-hover:text-white flex items-center">
                  🤖 Algorithmic Trading
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link 
                href="/market"
                className="group bg-green-700/30 backdrop-blur-sm px-6 py-3 rounded-full hover:bg-green-600/40 transition-all duration-300 border border-green-500/30"
              >
                <span className="text-green-100 group-hover:text-white flex items-center">
                  📊 Market Analysis
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles, topics, or authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.slice(0, 4).map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category.name
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors flex items-center"
              >
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </button>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="latest">Latest</option>
              <option value="popular">Most Popular</option>
              <option value="commented">Most Commented</option>
              <option value="liked">Most Liked</option>
            </select>
          </div>

          {/* Extended Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                <div className="flex gap-2">
                  <button className="px-3 py-2 bg-gray-100 rounded-lg text-sm">All</button>
                  <button className="px-3 py-2 bg-gray-100 rounded-lg text-sm flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Premium
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Posts Carousel */}
        {featuredPosts.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                <Zap className="w-8 h-8 mr-3 text-yellow-500" />
                Featured Articles
              </h2>
              <Link 
                href="/blog/featured" 
                className="text-blue-600 hover:text-blue-700 flex items-center text-sm font-medium"
              >
                View All Featured
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <article className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 transform hover:-translate-y-2">
                    {/* Featured Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                        ⭐ FEATURED
                      </span>
                    </div>

                    {/* Premium Badge */}
                    {post.premium && (
                      <div className="absolute top-4 right-4 z-10">
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                          👑 PREMIUM
                        </span>
                      </div>
                    )}

                    {/* Article Image */}
                    <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600 overflow-hidden">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center mb-2">
                          <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg mr-3">
                            <post.icon className="w-5 h-5 text-white" />
                          </div>
                          <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
                            {post.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
                        {post.excerpt}
                      </p>

                      {/* Author Info */}
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{post.author.name}</div>
                          <div className="text-xs text-gray-500">{post.author.role}</div>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      
                      {/* Stats and Meta */}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {post.views.toLocaleString()}
                          </div>
                          <div className="flex items-center">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {post.comments}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {post.readTime}
                          </div>
                        </div>
                        
                        <div className={`px-2 py-1 rounded text-xs font-medium ${difficultyColors[post.difficulty]}`}>
                          {post.difficulty}
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All Posts Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {selectedCategory === 'All' ? 'All Articles' : `${selectedCategory} Articles`}
              <span className="text-lg text-gray-500 ml-2">({filteredPosts.length})</span>
            </h2>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <article className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col">
                    {/* Article Header */}
                    <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600">
                      {post.premium && (
                        <div className="absolute top-2 right-2">
                          <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-bold">
                            👑 PREMIUM
                          </span>
                        </div>
                      )}
                      <div className="absolute bottom-3 left-3">
                        <div className="flex items-center">
                          <div className="bg-white/20 backdrop-blur-sm p-1.5 rounded mr-2">
                            <post.icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium">
                            {post.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 flex-shrink-0">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed flex-1">
                        {post.excerpt}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      
                      {/* Author */}
                      <div className="flex items-center mb-4">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-2">
                          <User className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-gray-700 font-medium">{post.author.name}</span>
                        <span className="text-xs text-gray-500 ml-2">• {post.author.role}</span>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-xs text-gray-500 flex-shrink-0">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {post.views > 1000 ? `${(post.views/1000).toFixed(1)}k` : post.views}
                          </div>
                          <div className="flex items-center">
                            <MessageCircle className="w-3 h-3 mr-1" />
                            {post.comments}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {post.readTime}
                          </div>
                        </div>
                        
                        <div className={`px-2 py-1 rounded text-xs font-medium ${difficultyColors[post.difficulty]}`}>
                          {post.difficulty}
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Load More Button */}
        {filteredPosts.length > 0 && (
          <div className="text-center mt-12">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium">
              Load More Articles
            </button>
          </div>
        )}

        {/* Enhanced Newsletter Section */}
        <section className="mt-20 relative">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl p-8 lg:p-12 text-white overflow-hidden relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }} />
            </div>

            <div className="relative text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                  <DollarSign className="w-8 h-8 text-yellow-300" />
                </div>
              </div>
              
              <h3 className="text-3xl lg:text-4xl font-bold mb-4">
                Get Premium Trading Insights
              </h3>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Join 25,000+ traders receiving weekly market analysis, exclusive strategies, 
                and real-time alerts directly to their inbox.
              </p>

              {/* Benefits */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl inline-block mb-3">
                    <TrendingUp className="w-6 h-6 text-green-300" />
                  </div>
                  <div className="font-semibold">Weekly Market Analysis</div>
                  <div className="text-sm text-blue-200">Deep-dive reports every Sunday</div>
                </div>
                <div className="text-center">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl inline-block mb-3">
                    <Zap className="w-6 h-6 text-yellow-300" />
                  </div>
                  <div className="font-semibold">Real-time Alerts</div>
                  <div className="text-sm text-blue-200">Breaking news and opportunities</div>
                </div>
                <div className="text-center">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl inline-block mb-3">
                    <Star className="w-6 h-6 text-purple-300" />
                  </div>
                  <div className="font-semibold">Exclusive Content</div>
                  <div className="text-sm text-blue-200">Premium-only articles and videos</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium"
                />
                <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors whitespace-nowrap">
                  Get Started Free
                </button>
              </div>

              <p className="text-xs text-blue-200 mt-4">
                No spam, unsubscribe anytime. 14-day free trial.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 