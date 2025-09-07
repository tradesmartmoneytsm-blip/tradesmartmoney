'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, Building2, TrendingUp, Clock, ExternalLink, ArrowLeft, BarChart3, RefreshCw } from 'lucide-react';

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

export function StockNews() {
  const [mode, setMode] = useState<'list' | 'search'>('list');
  const [stockList, setStockList] = useState<StockSummary[]>([]);
  const [selectedStock, setSelectedStock] = useState<StockNewsData | null>(null);
  const [stockArticles, setStockArticles] = useState<StockNews[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string>('');

  // Fetch list of stocks with news
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

  // Fetch news for specific stock
  const fetchStockNews = useCallback(async (stockSymbol: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/stock-news?stock=${stockSymbol}`);
      const data = await response.json();
      
      if (data.success) {
        setSelectedStock(data.stock);
        setStockArticles(data.articles);
        setMode('search');
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

  // Handle search
  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchStockNews(searchQuery.toUpperCase());
    }
  };

  // Handle stock selection from list
  const handleStockSelect = (stock: StockSummary) => {
    fetchStockNews(stock.symbol);
  };

  // Back to list view
  const backToList = () => {
    setMode('list');
    setSelectedStock(null);
    setStockArticles([]);
    setSearchQuery('');
    setError('');
  };

  // Initial load
  useEffect(() => {
    fetchStockList();
  }, [fetchStockList]);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 lg:py-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            {mode === 'search' && selectedStock ? (
              <button 
                onClick={backToList}
                className="bg-gray-100 rounded-lg p-2 hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
            ) : (
              <div className="bg-purple-100 rounded-lg p-2">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {mode === 'search' && selectedStock 
                  ? `${selectedStock.name} News`
                  : 'Stock-Specific News'
                }
              </h2>
              <p className="text-gray-600 text-sm">
                {mode === 'search' && selectedStock 
                  ? `${selectedStock.newsCount} news articles found`
                  : 'Search by stock or browse stocks with news'
                }
              </p>
            </div>
          </div>
          
          <button 
            onClick={mode === 'list' ? fetchStockList : () => fetchStockNews(selectedStock?.symbol || '')}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium">Refresh</span>
          </button>
        </div>

        {/* Search Bar (always visible) */}
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

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-8 h-8 animate-spin rounded-full border-4 border-gray-300 border-t-purple-600"></div>
            <p className="text-gray-500 mt-4">
              {mode === 'list' ? 'Loading stocks with news...' : 'Searching for stock news...'}
            </p>
          </div>
        )}

        {/* Stock List View */}
        {mode === 'list' && !loading && (
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
          </div>
        )}

        {/* Stock News View */}
        {mode === 'search' && selectedStock && !loading && (
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

        {/* Empty state for stock list */}
        {mode === 'list' && !loading && stockList.length === 0 && (
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
    </div>
  );
} 