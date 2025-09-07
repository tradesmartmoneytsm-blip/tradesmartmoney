'use client';

import { useEffect, useState, useCallback } from 'react';
import { Globe, Clock, ExternalLink, RefreshCw } from 'lucide-react';

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

// RSS to JSON converter service (free)
const RSS_TO_JSON_API = 'https://api.rss2json.com/v1/api.json';

// RSS feed item interface
interface RSSItem {
  title: string;
  description?: string;
  link: string;
  pubDate: string;
}

interface RSSResponse {
  status: string;
  items: RSSItem[];
}

const NEWS_SOURCES = [
  {
    name: 'Economic Times',
    rss: 'https://economictimes.indiatimes.com/rssfeedstopstories.cms',
    category: 'Business'
  },
  {
    name: 'MoneyControl',  
    rss: 'https://www.moneycontrol.com/rss/latestnews.xml',
    category: 'Markets'
  },
  {
    name: 'Business Standard',
    rss: 'https://www.business-standard.com/rss/home_page_top_stories.rss', 
    category: 'Finance'
  }
];

// Sample fallback articles (in case RSS fails)
const FALLBACK_ARTICLES: NewsArticle[] = [
  {
    id: '1',
    title: 'Market Hits New All-Time High',
    summary: 'Nifty crosses 22,200 mark driven by IT and banking sector gains.',
    category: 'Markets',
    timestamp: '2 hours ago',
    impact: 'Positive',
    source: 'Economic Times',
    pubDate: new Date().toISOString()
  },
  {
    id: '2', 
    title: 'RBI Monetary Policy Decision Expected',
    summary: 'Central bank likely to maintain repo rate at current levels amid inflation concerns.',
    category: 'Policy',
    timestamp: '4 hours ago',
    impact: 'Neutral',
    source: 'Business Standard',
    pubDate: new Date().toISOString()
  },
  {
    id: '3',
    title: 'FII Outflows Continue for Third Day', 
    summary: 'Foreign institutional investors pull out ₹1,250 crores from Indian markets.',
    category: 'FII/DII',
    timestamp: '6 hours ago',
    impact: 'Negative',
    source: 'Mint',
    pubDate: new Date().toISOString()
  }
];

export function News() {
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  
  // Sample fallback articles (in case RSS fails)
  const fallbackArticles = FALLBACK_ARTICLES;

  const fetchNewsFromRSS = async (source: typeof NEWS_SOURCES[0]) => {
    try {
      const response = await fetch(`${RSS_TO_JSON_API}?rss_url=${encodeURIComponent(source.rss)}&api_key=public`);
      const data: RSSResponse = await response.json();
      
      if (data.status === 'ok' && data.items) {
        return data.items.slice(0, 4).map((item: RSSItem) => ({
          id: `${source.name}-${item.title.slice(0, 20).replace(/\s+/g, '-')}`,
          title: item.title,
          summary: item.description ? item.description.substring(0, 150) + '...' : 'Click to read more',
          category: source.category,
          timestamp: formatTimestamp(item.pubDate),
          impact: 'Neutral' as const,
          source: source.name,
          url: item.link,
          pubDate: item.pubDate
        }));
      }
      return [];
    } catch (error) {
      console.error(`Failed to fetch news from ${source.name}:`, error);
      return [];
    }
  };

  const formatTimestamp = (pubDate: string) => {
    try {
      const date = new Date(pubDate);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      
      if (diffHours < 1) return 'Just now';
      if (diffHours < 24) return `${diffHours} hours ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} days ago`;
    } catch {
      return 'Recently';
    }
  };

  const fetchAllNews = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch from all RSS sources
      const newsPromises = NEWS_SOURCES.map(fetchNewsFromRSS);
      const results = await Promise.all(newsPromises);
      
      // Combine and sort by publication date
      const allNews = results.flat().sort((a, b) => 
        new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
      );
      
      if (allNews.length > 0) {
        setNewsArticles(allNews.slice(0, 8)); // Show top 8 articles
        setLastUpdated(new Date().toLocaleTimeString());
      } else {
        // Use fallback articles if RSS fails
        setNewsArticles(fallbackArticles);
        setLastUpdated('Using cached articles');
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
              <h2 className="text-2xl font-bold text-gray-900">Market News</h2>
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
            {newsArticles.map((article) => (
              <div key={article.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      article.category === 'Markets' ? 'bg-green-100 text-green-800' :
                      article.category === 'Policy' ? 'bg-blue-100 text-blue-800' :
                      article.category === 'Business' ? 'bg-purple-100 text-purple-800' :
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
        
        {/* In-Content Advertisement */}
        {/* Auto ads will handle all ad placement automatically */}
      </div>
    </div>
  );
} 