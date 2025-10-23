'use client';

import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, AlertCircle, RefreshCw, BarChart3 } from 'lucide-react';

// Extended interface for momentum stocks
interface MomentumStock {
  id: string;
  symbol: string;
  stock_symbol: string;
  strategy: string;
  entry_date: string;
  entry_price: number;
  current_price: number;
  target_price: number;
  stop_loss: number;
  status: string;
  market_cap: number;
  performance_1month: number;
  pe_ratio: number;
  roce: number;
}

type FilterType = 'ALL' | 'HIGH_PERFORMANCE' | 'LARGE_CAP';

export function BitStrategyContent() {
  const [trades, setTrades] = useState<MomentumStock[]>([]);
  const [filteredTrades, setFilteredTrades] = useState<MomentumStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [selectedDate, setSelectedDate] = useState<string>('ALL');
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  const fetchBitTrades = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use Next.js API route (should work after server restart)
      const response = await fetch('/api/momentum-stocks?limit=100');
      const result = await response.json();
      
      if (response.ok && result.success && Array.isArray(result.data)) {
        // Transform momentum stocks data to match SwingTrade interface
        interface ApiMomentumStock {
          id: number;
          symbol: string;
          current_price: number;
          market_cap: number;
          price_change_1month: number;
          pe_ratio: number;
          roce: number;
          analysis_date?: string;
          created_at: string;
        }
        
        const momentumStocks = result.data.map((stock: ApiMomentumStock) => ({
          id: stock.id,
          symbol: stock.symbol,
          stock_symbol: stock.symbol, // Add this field that the template expects
          strategy: 'MOMENTUM',
          entry_date: stock.analysis_date || stock.created_at,
          entry_price: Number(stock.current_price) || 0,
          current_price: Number(stock.current_price) || 0,
          target_price: (Number(stock.current_price) || 0) * 1.1, // 10% target
          stop_loss: (Number(stock.current_price) || 0) * 0.95, // 5% stop loss
          status: 'RUNNING',
          market_cap: Number(stock.market_cap) || 0,
          performance_1month: Number(stock.price_change_1month) || 0,
          pe_ratio: Number(stock.pe_ratio) || 0,
          roce: Number(stock.roce) || 0
        }));
        setTrades(momentumStocks);
        
        // Extract available dates
        const uniqueDates = [...new Set(momentumStocks.map((stock: MomentumStock) => stock.entry_date))].sort().reverse() as string[];
        setAvailableDates(uniqueDates);
      } else {
        setError('No momentum stocks available. Data updates daily at 3:00 PM.');
      }
    } catch {
      setError('Error loading momentum stocks data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBitTrades();
  }, [fetchBitTrades]);

  // Filter and sort trades
  useEffect(() => {
    if (!Array.isArray(trades)) {
      setFilteredTrades([]);
      return;
    }
    
    let filtered = [...trades];
    
    // Apply date filter first
    if (selectedDate !== 'ALL') {
      filtered = filtered.filter(trade => trade.entry_date === selectedDate);
    }
    
    // Apply other filters
    if (filter === 'HIGH_PERFORMANCE') {
      filtered = filtered.filter(trade => trade.performance_1month >= 10);
    } else if (filter === 'LARGE_CAP') {
      filtered = filtered.filter(trade => trade.market_cap >= 500000); // 50K CR
    }
    
    // Default sorting by market cap (descending)
    filtered.sort((a, b) => (b.market_cap || 0) - (a.market_cap || 0));
    
    setFilteredTrades(filtered);
  }, [trades, filter, selectedDate]);


  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleChartClick = (symbol: string) => {
    // Open TradingView chart in new tab
    const tradingViewUrl = `https://in.tradingview.com/chart/?symbol=NSE%3A${symbol}`;
    window.open(tradingViewUrl, '_blank');
  };

  const runningTrades = filteredTrades.filter(trade => trade.status.toLowerCase() === 'running');

  return (
    <div className="modern-card p-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-h3 mb-3">
          <span className="text-gradient">📈 Momentum Strategy</span>
        </h3>
        <p className="text-body mb-2">
          High-momentum stocks with strong institutional flow and technical breakouts
        </p>
        <p className="text-caption text-muted">
          Market Cap &gt; 10,000 CR • Price &gt; ₹200 • Updated Daily at 3:00 PM
        </p>
      </div>

      {/* Date Selection */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-blue-800">📅 Entry Date:</span>
            <select 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-blue-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="ALL">All Dates ({trades.length})</option>
              {availableDates.map(date => {
                const stocksOnDate = trades.filter(t => t.entry_date === date).length;
                return (
                  <option key={date} value={date}>
                    {formatDate(date)} ({stocksOnDate} stocks)
                  </option>
                );
              })}
            </select>
          </div>
          
          <div className="flex gap-2">
            {availableDates.slice(0, 3).map(date => {
              const stocksOnDate = trades.filter(t => t.entry_date === date).length;
              return (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    selectedDate === date
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-blue-700 hover:bg-blue-100 border border-blue-300'
                  }`}
                >
                  {formatDate(date)} ({stocksOnDate})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === 'ALL'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              All Stocks ({filteredTrades.length})
            </button>
            <button 
              onClick={() => setFilter('HIGH_PERFORMANCE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === 'HIGH_PERFORMANCE'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              High Performance (&gt;10%) ({(selectedDate === 'ALL' ? trades : trades.filter(t => t.entry_date === selectedDate)).filter(t => t.performance_1month >= 10).length})
            </button>
            <button 
              onClick={() => setFilter('LARGE_CAP')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === 'LARGE_CAP'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Large Cap (&gt;50K CR) ({(selectedDate === 'ALL' ? trades : trades.filter(t => t.entry_date === selectedDate)).filter(t => t.market_cap >= 500000).length})
            </button>
          </div>

          {/* Refresh Control */}
          <div className="flex gap-2 items-center">
            <button 
              onClick={fetchBitTrades}
              disabled={loading}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1 text-xs"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>


      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-4" />
          <p className="text-gray-600">Loading BIT strategy trades...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-800">Error Loading BIT Strategy</h3>
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
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-1 mb-1">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-blue-800">Total Stocks</span>
              </div>
              <div className="text-xl font-bold text-blue-700">
                {filteredTrades.length}
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-1 mb-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-800">Active</span>
              </div>
              <div className="text-xl font-bold text-green-700">
                {runningTrades.length}
              </div>
            </div>
          </div>

          {/* Trades Display */}
          {filteredTrades.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <BarChart3 className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-600 mb-1">No Momentum Stocks</h3>
              <p className="text-sm text-gray-500">No momentum stocks available for the selected filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* High Performers Column */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <h3 className="font-bold text-green-800">🚀 High Performers</h3>
                  <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-bold">
                    {filteredTrades.filter(t => t.performance_1month >= 10).length}
                  </span>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredTrades.filter(t => t.performance_1month >= 10).map((trade, index) => (
                    <div key={trade.id || index} className="bg-white rounded-lg border border-green-200 p-3 hover:shadow-md transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-gray-900 text-sm">{trade.stock_symbol || trade.symbol}</h4>
                        <div className="text-xs text-green-600 font-bold">
                          {trade.performance_1month > 0 ? '+' : ''}{trade.performance_1month.toFixed(1)}%
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 mb-2">
                        ₹{trade.current_price.toFixed(2)} • MCap: ₹{(trade.market_cap / 10000).toFixed(0)}K CR
                      </div>
                      <div className="text-xs text-gray-500 mb-2">
                        P/E: {trade.pe_ratio > 0 ? trade.pe_ratio.toFixed(1) : 'N/A'} • Entry: {formatDate(trade.entry_date)}
                      </div>
                      <button 
                        onClick={() => handleChartClick(trade.stock_symbol || trade.symbol)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-1 rounded text-xs font-medium transition-colors"
                      >
                        📈 Chart
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Large Caps Column */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <h3 className="font-bold text-blue-800">💎 Large Caps</h3>
                  <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs font-bold">
                    {filteredTrades.filter(t => t.market_cap >= 500000).length}
                  </span>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredTrades.filter(t => t.market_cap >= 500000 && t.performance_1month < 10).map((trade, index) => (
                    <div key={trade.id || index} className="bg-white rounded-lg border border-blue-200 p-3 hover:shadow-md transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-gray-900 text-sm">{trade.stock_symbol || trade.symbol}</h4>
                        <div className="text-xs text-blue-600 font-bold">
                          ₹{(trade.market_cap / 10000).toFixed(0)}K CR
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 mb-2">
                        ₹{trade.current_price.toFixed(2)} • 1M: {trade.performance_1month > 0 ? '+' : ''}{trade.performance_1month.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500 mb-2">
                        P/E: {trade.pe_ratio > 0 ? trade.pe_ratio.toFixed(1) : 'N/A'} • Entry: {formatDate(trade.entry_date)}
                      </div>
                      <button 
                        onClick={() => handleChartClick(trade.stock_symbol || trade.symbol)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1 rounded text-xs font-medium transition-colors"
                      >
                        📈 Chart
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mid/Small Caps Column */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <h3 className="font-bold text-purple-800">⭐ Mid/Small Caps</h3>
                  <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded-full text-xs font-bold">
                    {filteredTrades.filter(t => t.market_cap < 500000).length}
                  </span>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredTrades.filter(t => t.market_cap < 500000).map((trade, index) => (
                    <div key={trade.id || index} className="bg-white rounded-lg border border-purple-200 p-3 hover:shadow-md transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-gray-900 text-sm">{trade.stock_symbol || trade.symbol}</h4>
                        <div className={`text-xs font-bold ${trade.performance_1month >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {trade.performance_1month > 0 ? '+' : ''}{trade.performance_1month.toFixed(1)}%
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 mb-2">
                        ₹{trade.current_price.toFixed(2)} • MCap: ₹{(trade.market_cap / 10000).toFixed(0)}K CR
                      </div>
                      <div className="text-xs text-gray-500 mb-2">
                        P/E: {trade.pe_ratio > 0 ? trade.pe_ratio.toFixed(1) : 'N/A'} • Entry: {formatDate(trade.entry_date)}
                      </div>
                      <button 
                        onClick={() => handleChartClick(trade.stock_symbol || trade.symbol)}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-1 rounded text-xs font-medium transition-colors"
                      >
                        📈 Chart
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
