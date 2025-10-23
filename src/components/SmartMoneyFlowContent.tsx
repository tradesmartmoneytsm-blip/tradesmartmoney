'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  AlertCircle,
  Clock,
  Filter
} from 'lucide-react';

interface MidSmallCapStock {
  symbol: string;
  company_name: string;
  index_name: string;
  current_price: number;
  day_change: number;
  day_change_percent: number;
  total_traded_value: number;
  total_traded_volume: number;
  analysis_timestamp: string;
  category: 'MIDCAP' | 'SMALLCAP';
}

type FilterType = 'ALL' | 'MIDCAP' | 'SMALLCAP';

export function SmartMoneyFlowContent() {
  const [stocks, setStocks] = useState<MidSmallCapStock[]>([]);
  const [filteredStocks, setFilteredStocks] = useState<MidSmallCapStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [filter, setFilter] = useState<FilterType>('ALL');

  const fetchMidSmallCapStocks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch stocks from both NIFTY MIDCAP 50 and NIFTY SMALLCAP 50
      const response = await fetch('/api/equity/smart-money-flow');
      const result = await response.json();
      
      if (result.success) {
        setStocks(result.data || []);
        setLastUpdated(new Date().toLocaleString());
      } else {
        setError('Failed to fetch midcap/smallcap stocks data');
      }
    } catch {
      setError('Error loading midcap/smallcap stocks data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMidSmallCapStocks();
    
    // Auto-refresh every 15 minutes during market hours
    const interval = setInterval(() => {
      const now = new Date();
      const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
      const hours = istTime.getHours();
      const minutes = istTime.getMinutes();
      const isWeekday = istTime.getDay() >= 1 && istTime.getDay() <= 5;
      const isMarketHours = hours >= 9 && hours < 15 && (hours > 9 || minutes >= 30);
      
      if (isWeekday && isMarketHours) {
        console.log('🔄 Auto-refreshing SmartMoneyFlow data...');
        fetchMidSmallCapStocks();
      }
    }, 15 * 60 * 1000); // 15 minutes

    return () => clearInterval(interval);
  }, [fetchMidSmallCapStocks]);

  // Filter stocks based on selected filter
  useEffect(() => {
    let filtered = [...stocks];
    
    if (filter !== 'ALL') {
      filtered = filtered.filter(stock => stock.category === filter);
    }
    
    // Sort by turnover (total_traded_value) descending
    filtered.sort((a, b) => b.total_traded_value - a.total_traded_value);
    
    setFilteredStocks(filtered);
  }, [stocks, filter]);

  const formatTurnover = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)}Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    } else {
      return `₹${(value / 1000).toFixed(1)}K`;
    }
  };

  const getChangeColor = (change: number) => {
    if (change > 2) return 'text-green-700 bg-green-100 border-green-300';
    if (change > 0) return 'text-green-600 bg-green-50 border-green-200';
    if (change < -2) return 'text-red-700 bg-red-100 border-red-300';
    if (change < 0) return 'text-red-600 bg-red-50 border-red-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const filterOptions = [
    { value: 'ALL', label: 'All Stocks', count: stocks.length },
    { value: 'MIDCAP', label: 'MIDCAP', count: stocks.filter(s => s.category === 'MIDCAP').length },
    { value: 'SMALLCAP', label: 'SMALLCAP', count: stocks.filter(s => s.category === 'SMALLCAP').length },
  ];

  return (
    <div className="modern-card p-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-h3 mb-3">
          <span className="text-gradient">💰 SmartMoneyFlow Analysis</span>
        </h3>
      </div>

      {/* Filters and Controls */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value as FilterType)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filter === option.value
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex gap-2 items-center">
            <button
              onClick={fetchMidSmallCapStocks}
              disabled={loading}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1 text-xs"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {lastUpdated && (
          <div className="mt-3 text-xs text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Last updated: {lastUpdated}
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-4" />
          <p className="text-gray-600">Loading smart money flow data...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-800">Error Loading SmartMoneyFlow Data</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {!loading && !error && (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-1 mb-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-800">Gainers</span>
              </div>
              <div className="text-xl font-bold text-green-700">
                {filteredStocks.filter(s => s.day_change_percent > 0).length}
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center gap-1 mb-1">
                <TrendingDown className="w-4 h-4 text-red-600" />
                <span className="text-xs font-medium text-red-800">Decliners</span>
              </div>
              <div className="text-xl font-bold text-red-700">
                {filteredStocks.filter(s => s.day_change_percent < 0).length}
              </div>
            </div>
          </div>

          {/* Stocks Display */}
          {filteredStocks.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Filter className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-600 mb-1">No Stocks Found</h3>
              <p className="text-sm text-gray-500">No stocks available for the selected filter</p>
            </div>
          ) : (
            <div className="data-table">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Stock</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-700">Price</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-700">Change %</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-700">SmartMoney</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-700">Volume</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredStocks.map((stock, index) => (
                      <tr key={`${stock.symbol}-${index}`} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="font-bold text-gray-900">{stock.symbol}</div>
                          <div className="text-xs text-gray-500 truncate max-w-32">{stock.company_name}</div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="font-medium text-gray-900">₹{stock.current_price.toFixed(2)}</div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getChangeColor(stock.day_change_percent)}`}>
                            {stock.day_change_percent > 0 ? (
                              <TrendingUp className="w-3 h-3" />
                            ) : (
                              <TrendingDown className="w-3 h-3" />
                            )}
                            {stock.day_change_percent > 0 ? '+' : ''}{stock.day_change_percent.toFixed(2)}%
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="font-bold text-blue-600">
                            {formatTurnover(stock.total_traded_value)}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="font-medium text-gray-600">
                            {(stock.total_traded_volume / 100000).toFixed(1)}L
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
