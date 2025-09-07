'use client';

import { useEffect, useState, useCallback } from 'react';
import { Globe, Clock, ExternalLink, RefreshCw, TrendingUp, Building2, FileText, BarChart3, Briefcase } from 'lucide-react';

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

// Category configuration for filtering
const NEWS_CATEGORIES = [
  { id: 'all', name: 'All News', icon: Globe, color: 'blue' },
  { id: 'Markets', name: 'Markets', icon: TrendingUp, color: 'green' },
  { id: 'Stocks', name: 'Stocks', icon: BarChart3, color: 'purple' },
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
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState('all');
  
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
  }, []);

  useEffect(() => {
    fetchAllNews();
    
    // Refresh news every 30 minutes
    const interval = setInterval(fetchAllNews, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAllNews]);

  // Filter articles by category
  const filteredArticles = activeCategory === 'all' 
    ? newsArticles 
    : newsArticles.filter(article => article.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 lg:py-6">
      {/* Header Advertisement */}
      {/* Auto ads will handle all ad placement automatically */}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 rounded-lg p-2">
              <Globe className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Stock Market News</h2>
              <p className="text-gray-600 text-sm">
                {loading ? 'Updating...' : `Last updated: ${lastUpdated}`}
              </p>
            </div>
          </div>
          
          <button 
            onClick={fetchAllNews}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium">Refresh</span>
          </button>
        </div>

        {/* Category Tabs */}
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
        )}
        
        {/* No articles message */}
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
        
        {/* In-Content Advertisement */}
        {/* Auto ads will handle all ad placement automatically */}
      </div>
    </div>
  );
} 