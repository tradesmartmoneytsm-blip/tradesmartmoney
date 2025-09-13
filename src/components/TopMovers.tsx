'use client';

import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, Filter, ArrowUpDown } from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils';
import Image from 'next/image';

interface TopMoverStock {
  isin: string;
  companyName: string;
  companyShortName: string;
  ltp: number;
  close: number;
  logoUrl: string;
  nseScriptCode: string;
  change: number;
  changePercent: number;
  marketCap: number;
  yearHigh: number;
  yearLow: number;
}

interface TopMoversProps {
  type: 'TOP_GAINERS' | 'TOP_LOSERS';
  title: string;
  icon: React.ReactNode;
}

const INDEX_OPTIONS = [
  { value: 'NIFTY_TOTAL_MARKET', label: 'Nifty Total Market' },
  { value: 'NIFTY_100', label: 'NIFTY 100' },
  { value: 'NIFTY_500', label: 'NIFTY 500' },
  { value: 'NIFTY_MIDCAP_100', label: 'Nifty Midcap 100' },
  { value: 'NIFTY_SMALLCAP_100', label: 'Nifty Small Cap 100' }
];

const SORT_OPTIONS = [
  { value: 'default', label: 'Default Order' },
  { value: 'highest_to_lowest', label: 'Highest to Lowest %' },
  { value: 'lowest_to_highest', label: 'Lowest to Highest %' },
  { value: 'alphabetical', label: 'Alphabetical (A-Z)' }
];

export function TopMovers({ type, title, icon }: TopMoversProps) {
  const [stocks, setStocks] = useState<TopMoverStock[]>([]);
  const [selectedIndex, setSelectedIndex] = useState('NIFTY_TOTAL_MARKET');
  const [sortBy, setSortBy] = useState('default');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchTopMovers = useCallback(async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) setIsRefreshing(true);
      setError(null);
      
      console.log(`📡 Fetching ${type} for ${selectedIndex}...`);
      
      const response = await fetch(`/api/top-movers?type=${type}&index=${selectedIndex}`);
      const result = await response.json();
      
      if (result.success && result.data) {
        console.log(`✅ Received ${result.data.length} ${type.toLowerCase()}`);
        setStocks(result.data);
        setLastUpdated(new Date());
      } else {
        throw new Error(result.error || `Failed to fetch ${type.toLowerCase()}`);
      }
    } catch (error) {
      console.error(`❌ Failed to fetch ${type}:`, error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      setStocks([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [type, selectedIndex]);

  // Fetch data when component mounts or index changes
  useEffect(() => {
    setIsLoading(true);
    fetchTopMovers();
  }, [fetchTopMovers]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTopMovers(true);
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchTopMovers]);

  // Sort stocks based on selected sort option
  const sortStocks = (stocksToSort: TopMoverStock[]) => {
    const sorted = [...stocksToSort];
    
    switch (sortBy) {
      case 'highest_to_lowest':
        return sorted.sort((a, b) => b.changePercent - a.changePercent);
      case 'lowest_to_highest':
        return sorted.sort((a, b) => a.changePercent - b.changePercent);
      case 'alphabetical':
        return sorted.sort((a, b) => a.companyShortName.localeCompare(b.companyShortName));
      case 'default':
      default:
        return sorted; // Keep original order from API
    }
  };

  const formatCurrency = (value: number) => {
    if (value >= 10000) {
      return `₹${(value / 10000).toFixed(2)}Cr`;
    } else if (value >= 100) {
      return `₹${(value / 100).toFixed(2)}L`;
    } else {
      return `₹${value.toFixed(2)}`;
    }
  };

  const isGainer = type === 'TOP_GAINERS';

  return (
    <div className="space-y-4">
      {/* Header with Index Selection */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isGainer ? 'bg-green-100' : 'bg-red-100'}`}>
            <div className={isGainer ? 'text-green-600' : 'text-red-600'}>
              {icon}
            </div>
          </div>
          <div>
            <h2 className="text-lg lg:text-xl font-bold text-gray-900 font-serif">{title}</h2>
            <p className="text-sm text-gray-600">
              {isGainer ? 'Best performing' : 'Worst performing'} stocks in selected index
            </p>
          </div>
        </div>

        {/* Index Selection, Sort & Refresh */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          {/* Index Selection */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={selectedIndex}
              onChange={(e) => setSelectedIndex(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              disabled={isLoading}
            >
              {INDEX_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selection */}
          <div className="flex items-center space-x-2">
            <ArrowUpDown className="w-4 h-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              disabled={isLoading}
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Refresh Button */}
          <button
            onClick={() => fetchTopMovers(true)}
            disabled={isRefreshing}
            className="flex items-center justify-center space-x-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-3">
            <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
            <span className="text-gray-600">Loading {title.toLowerCase()}...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="text-red-600">⚠️</div>
            <div>
              <p className="text-red-800 font-medium">Failed to load data</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stocks Grid */}
      {!isLoading && !error && stocks.length > 0 && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {sortStocks(stocks).slice(0, 20).map((stock) => (
              <div 
                key={stock.isin} 
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300 bg-white"
              >
                <div className="flex items-center justify-between">
                  {/* Stock Info */}
                  <div className="flex items-center space-x-3">
                    {stock.logoUrl && (
                      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                        <Image 
                          src={stock.logoUrl} 
                          alt={stock.companyShortName}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                          unoptimized
                          onError={() => {
                            // Image error handling - Next.js Image handles this differently
                          }}
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm lg:text-base">
                        {stock.companyShortName}
                      </h3>
                      <p className="text-xs text-gray-500">{stock.nseScriptCode}</p>
                      <p className="text-xs text-gray-500">MCap: {formatCurrency(stock.marketCap)}</p>
                    </div>
                  </div>

                  {/* Price & Change */}
                  <div className="text-right">
                    <p className="font-bold text-lg text-gray-900">₹{stock.ltp.toFixed(2)}</p>
                    <div className={`flex items-center space-x-1 ${
                      stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stock.changePercent >= 0 ? 
                        <TrendingUp className="w-3 h-3" /> : 
                        <TrendingDown className="w-3 h-3" />
                      }
                      <span className="font-medium text-sm">
                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </span>
                    </div>
                    <p className={`text-xs ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stock.change >= 0 ? '+' : ''}₹{stock.change.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Info */}
          <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-100">
            📈 Live market data • Updates every 5 minutes
            {lastUpdated && (
              <span className="ml-2">
                • Last updated {formatTimeAgo(lastUpdated)}
              </span>
            )}
          </div>
        </>
      )}

      {/* No Data State */}
      {!isLoading && !error && stocks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">📊</div>
          <p className="text-gray-600">No {title.toLowerCase()} data available</p>
          <p className="text-sm text-gray-500 mt-1">Try refreshing or selecting a different index</p>
        </div>
      )}
    </div>
  );
} 