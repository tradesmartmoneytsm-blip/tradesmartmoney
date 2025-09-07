'use client';

import { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import { Globe, Clock, ExternalLink, RefreshCw, TrendingUp, Building2, FileText, BarChart3, Briefcase, Search, ArrowLeft } from 'lucide-react';

// Lazy load the EarningsEstimates component
const EarningsEstimates = lazy(() => import('./EarningsEstimates').then(module => ({ default: module.EarningsEstimates })));

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
  timestamp: string;
  impact: 'Positive' | 'Negative' | 'Neutral';
  source: string;
  url?: string;
  pubDate: string;
}

interface StockNews {
  id: string;
  title: string;
  summary: string;
  timestamp: string;
  source: string;
  url?: string;
  pubDate: string;
  stockSymbols: string[];
}

interface StockSummary {
  symbol: string;
  name: string;
  newsCount: number;
  latestNews: string;
  lastUpdated: string;
}

interface StockNewsData {
  symbol: string;
  name: string;
  newsCount: number;
}

// Main news types
const NEWS_TYPES = [
  { id: 'market', name: 'Market News', icon: Globe, description: 'General market and sector news' },
  { id: 'stock', name: 'Stock News', icon: BarChart3, description: 'Company-specific news and analysis' }
];

// Category configuration for market news filtering
const NEWS_CATEGORIES = [
  { id: 'all', name: 'All News', icon: Globe, color: 'blue' },
  { id: 'Markets', name: 'Markets', icon: TrendingUp, color: 'green' },
  { id: 'Results', name: 'Results', icon: FileText, color: 'orange' },
  { id: 'Companies', name: 'Companies', icon: Building2, color: 'indigo' },
  { id: 'Policy', name: 'Policy', icon: Briefcase, color: 'red' }
];

// Color mappings for Tailwind classes
const COLOR_CLASSES = {
  blue: {
    border: 'border-blue-500',
    text: 'text-blue-600',
    bg: 'bg-blue-100'
  },
  green: {
    border: 'border-green-500',
    text: 'text-green-600',
    bg: 'bg-green-100'
  },
  purple: {
    border: 'border-purple-500',
    text: 'text-purple-600',
    bg: 'bg-purple-100'
  },
  orange: {
    border: 'border-orange-500',
    text: 'text-orange-600',
    bg: 'bg-orange-100'
  },
  indigo: {
    border: 'border-indigo-500',
    text: 'text-indigo-600',
    bg: 'bg-indigo-100'
  },
  red: {
    border: 'border-red-500',
    text: 'text-red-600',
    bg: 'bg-red-100'
  }
};

// Sample fallback articles (in case API fails)
const FALLBACK_ARTICLES: NewsArticle[] = [
  {
    id: '1',
    title: 'Nifty Hits Fresh All-Time High Above 25,000',
    summary: 'Indian benchmark indices surge to record levels driven by strong FII inflows and positive earnings.',
    category: 'Markets',
    timestamp: '2 hours ago',
    impact: 'Positive',
    source: 'Economic Times Markets',
    pubDate: new Date().toISOString()
  },
  {
    id: '2', 
    title: 'RBI Repo Rate Decision Awaited This Week',
    summary: 'Market expects central bank to maintain current rates amid balanced inflation and growth outlook.',
    category: 'Policy',
    timestamp: '4 hours ago',
    impact: 'Neutral',
    source: 'MoneyControl Markets',
    pubDate: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Banking Sector Leads Market Rally', 
    summary: 'HDFC Bank, ICICI Bank, and SBI gain 3-5% on strong quarterly results and NIM improvement.',
    category: 'Stocks',
    timestamp: '6 hours ago',
    impact: 'Positive',
    source: 'Business Standard Markets',
    pubDate: new Date().toISOString()
  }
];

export function News() {
  // Market News State
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Main News Type State
  const [activeNewsType, setActiveNewsType] = useState('market');
  
  // Stock News State
  const [stockMode, setStockMode] = useState<'list' | 'search'>('list');
  const [stockList, setStockList] = useState<StockSummary[]>([]);
  const [selectedStock, setSelectedStock] = useState<StockNewsData | null>(null);
  const [stockArticles, setStockArticles] = useState<StockNews[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string>('');
  
  // Sample fallback articles (in case API fails)
  const fallbackArticles = FALLBACK_ARTICLES;

  const fetchAllNews = useCallback(async () => {
    setLoading(true);
    try {
      // Use our server-side API instead of direct RSS fetching
      const response = await fetch('/api/news-feed');
      const data = await response.json();
      
      if (data.success && data.articles) {
        setNewsArticles(data.articles);
        setLastUpdated(new Date(data.lastUpdated).toLocaleTimeString());
        console.log(`✅ News: Loaded ${data.articles.length} articles`);
      } else {
        // Use fallback articles if API fails
        setNewsArticles(fallbackArticles);
        setLastUpdated('Using cached articles');
        console.log('⚠️ News: Using fallback articles');
      }
    } catch (error) {
      console.error('Failed to fetch news:', error);
      setNewsArticles(fallbackArticles);
      setLastUpdated('Using cached articles');
    } finally {
      setLoading(false);
    }
  }, [fallbackArticles]);

  // Stock News Functions
  const fetchStockList = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/stock-news?mode=list');
      const data = await response.json();
      
      if (data.success) {
        setStockList(data.stocks);
        console.log(`✅ Stock News: Found ${data.totalStocks} stocks with news`);
      } else {
        setError('Failed to load stock news');
      }
    } catch (error) {
      console.error('Failed to fetch stock list:', error);
      setError('Failed to load stock news');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStockNews = useCallback(async (stockSymbol: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/stock-news?stock=${stockSymbol}`);
      const data = await response.json();
      
      if (data.success) {
        setSelectedStock(data.stock);
        setStockArticles(data.articles);
        setStockMode('search');
        console.log(`✅ Stock News: Found ${data.articles.length} articles for ${stockSymbol}`);
      } else {
        setError(`No news found for ${stockSymbol}`);
      }
    } catch (error) {
      console.error(`Failed to fetch news for ${stockSymbol}:`, error);
      setError(`Failed to load news for ${stockSymbol}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchStockNews(searchQuery.toUpperCase());
    }
  };

  const handleStockSelect = (stock: StockSummary) => {
    fetchStockNews(stock.symbol);
  };

  const backToStockList = () => {
    setStockMode('list');
    setSelectedStock(null);
    setStockArticles([]);
    setSearchQuery('');
    setError('');
  };

  // Handle news type switching
  const handleNewsTypeChange = (type: string) => {
    setActiveNewsType(type);
    setError('');
    if (type === 'stock' && stockList.length === 0) {
      fetchStockList();
    } else if (type === 'market' && newsArticles.length === 0) {
      fetchAllNews();
    }
  };

  useEffect(() => {
    fetchAllNews();
  }, [fetchAllNews]);

  // Filter articles by category for market news
  const filteredArticles = activeCategory === 'all' 
    ? newsArticles 
    : newsArticles.filter(article => article.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 lg:py-6">
      {/* Header Advertisement */}
      {/* Auto ads will handle all ad placement automatically */}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {/* Main Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            {activeNewsType === 'stock' && stockMode === 'search' && selectedStock ? (
              <button 
                onClick={backToStockList}
                className="bg-gray-100 rounded-lg p-2 hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
            ) : (
              <div className="bg-blue-100 rounded-lg p-2">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {activeNewsType === 'stock' && selectedStock 
                  ? `${selectedStock.name} News`
                  : 'Market News Center'
                }
              </h2>
              <p className="text-gray-600 text-sm">
                {loading ? 'Updating...' : 
                 activeNewsType === 'stock' && selectedStock 
                   ? `${selectedStock.newsCount} articles found`
                   : `Last updated: ${lastUpdated}`
                }
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => {
              if (activeNewsType === 'market') {
                fetchAllNews();
              } else if (activeNewsType === 'stock') {
                if (stockMode === 'search' && selectedStock) {
                  fetchStockNews(selectedStock.symbol);
                } else {
                  fetchStockList();
                }
              }
            }}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium">Refresh</span>
          </button>
        </div>

        {/* Main News Type Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {NEWS_TYPES.map((type) => {
                const Icon = type.icon;
                const isActive = activeNewsType === type.id;
                
                return (
                  <button
                    key={type.id}
                    onClick={() => handleNewsTypeChange(type.id)}
                    className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      isActive
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <div className="text-left">
                      <div>{type.name}</div>
                      <div className="text-xs text-gray-400 font-normal">{type.description}</div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Market News Content */}
        {activeNewsType === 'market' && (
          <>
            {/* Category Tabs for Market News */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 overflow-x-auto">
                  {NEWS_CATEGORIES.map((category) => {
                    const Icon = category.icon;
                    const isActive = activeCategory === category.id;
                    const articleCount = category.id === 'all' 
                      ? newsArticles.length 
                      : newsArticles.filter(article => article.category === category.id).length;
                    
                    const colors = COLOR_CLASSES[category.color as keyof typeof COLOR_CLASSES];
                    
                    return (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                          isActive
                            ? `${colors.border} ${colors.text}`
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{category.name}</span>
                        {articleCount > 0 && (
                          <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none rounded-full ${
                            isActive 
                              ? `${colors.text} ${colors.bg}` 
                              : 'text-gray-600 bg-gray-100'
                          }`}>
                            {articleCount}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Market News Articles */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Show Earnings Estimates for Results category */}
                {activeCategory === 'Results' && (
                  <div className="mb-8">
                    <Suspense fallback={
                      <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-24 bg-gray-200 rounded"></div>
                        <div className="h-32 bg-gray-200 rounded"></div>
                        <div className="h-32 bg-gray-200 rounded"></div>
                      </div>
                    }>
                      <EarningsEstimates />
                    </Suspense>
                    
                    {/* Separator */}
                    <div className="my-8 border-t border-gray-200">
                      <div className="relative -top-3 text-center">
                        <span className="bg-white px-4 text-sm font-medium text-gray-500">Latest Results News</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredArticles.map((article) => (
                    <div key={article.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            article.category === 'Markets' ? 'bg-green-100 text-green-800' :
                            article.category === 'Policy' ? 'bg-blue-100 text-blue-800' :
                            article.category === 'Business' ? 'bg-purple-100 text-purple-800' :
                            article.category === 'Stocks' ? 'bg-purple-100 text-purple-800' :
                            article.category === 'Results' ? 'bg-orange-100 text-orange-800' :
                            article.category === 'Companies' ? 'bg-indigo-100 text-indigo-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {article.category}
                          </span>
                          <span className={`w-2 h-2 rounded-full ${
                            article.impact === 'Positive' ? 'bg-green-400' :
                            article.impact === 'Negative' ? 'bg-red-400' :
                            'bg-gray-400'
                          }`}></span>
                        </div>
                        <div className="flex items-center text-gray-500 text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {article.timestamp}
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {article.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {article.summary}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500">
                          {article.source}
                        </span>
                        {article.url && (
                          <a 
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-600 hover:text-blue-700 text-xs font-medium"
                          >
                            Read More
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* No articles message for market news */}
                {!loading && filteredArticles.length === 0 && (
                  <div className="text-center py-12">
                    <Globe className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No {activeCategory === 'all' ? '' : activeCategory.toLowerCase()} news available
                    </h3>
                    <p className="text-gray-500">
                      {activeCategory === 'all' 
                        ? 'No news articles found. Try refreshing to get the latest updates.'
                        : `No ${activeCategory.toLowerCase()} news found. Try selecting a different category or refresh for updates.`
                      }
                    </p>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Stock News Content */}
        {activeNewsType === 'stock' && (
          <>
            {/* Search Bar for Stock News */}
            <div className="mb-6">
              <div className="flex items-center space-x-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search by stock symbol (e.g., RELIANCE, TCS, HDFC)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={loading || !searchQuery.trim()}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Stock News Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-8 h-8 animate-spin rounded-full border-4 border-gray-300 border-t-purple-600"></div>
                <p className="text-gray-500 mt-4">
                  {stockMode === 'list' ? 'Loading stocks with news...' : 'Searching for stock news...'}
                </p>
              </div>
            )}

            {/* Stock List View */}
            {stockMode === 'list' && !loading && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Stocks in News ({stockList.length})
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stockList.map((stock) => (
                    <button
                      key={stock.symbol}
                      onClick={() => handleStockSelect(stock)}
                      className="text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-purple-200 transition-all group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900 group-hover:text-purple-600">
                            {stock.symbol}
                          </h4>
                          <p className="text-sm text-gray-600">{stock.name}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-purple-600">
                            {stock.newsCount}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                        Latest: {stock.latestNews}
                      </p>
                      
                      <div className="flex items-center text-xs text-gray-400">
                        <Clock className="h-3 w-3 mr-1" />
                        {stock.lastUpdated}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Empty state for stock list */}
                {stockList.length === 0 && (
                  <div className="text-center py-12">
                    <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No stock news available
                    </h3>
                    <p className="text-gray-500">
                      No recent news found for any stocks. Try refreshing or check back later.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Stock News Articles View */}
            {stockMode === 'search' && selectedStock && !loading && (
              <div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {stockArticles.map((article) => (
                    <div key={article.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                            {article.stockSymbols.join(', ')}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-500 text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {article.timestamp}
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {article.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                        {article.summary}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500">
                          {article.source}
                        </span>
                        {article.url && (
                          <a 
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-purple-600 hover:text-purple-700 text-xs font-medium"
                          >
                            Read More
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* No articles for selected stock */}
                {stockArticles.length === 0 && (
                  <div className="text-center py-12">
                    <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No news found for {selectedStock.name}
                    </h3>
                    <p className="text-gray-500">
                      There are currently no recent news articles for this stock.
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
        
        {/* In-Content Advertisement */}
        {/* Auto ads will handle all ad placement automatically */}
      </div>
    </div>
  );
} 