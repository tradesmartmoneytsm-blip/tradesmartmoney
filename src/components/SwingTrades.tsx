'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import NextImage from 'next/image';
import { TrendingUp, TrendingDown, Clock, Target, AlertCircle, RefreshCw, Calendar, Activity, Image, X, ZoomIn, BarChart3, Zap, TrendingUp as TrendingUpIcon, DollarSign } from 'lucide-react';
import { SwingTrade } from '@/app/api/swing-trades/route';
import { brandTokens } from '@/lib/design-tokens';
// Auto ads will handle all ad placement automatically

// Note: ValueBuying component is defined inline below for better performance

interface ValueStock {
  symbol: string;
  name: string;
  fullName?: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  category: string;
  high?: number;
  low?: number;
  previousClose?: number;
  imageUrl?: string;
  volume?: number;
  pe?: number;
  pb?: number;
}

interface GroupedTrades {
  [key: string]: SwingTrade[] | ValueStock[];
}

const ValueBuying = () => {
  const [stocks, setStocks] = useState<ValueStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const fetchValueBuyingStocks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setImageErrors(new Set()); // Reset image errors on refresh
      
      // Add client-side caching to avoid redundant calls
      const response = await fetch('/api/value-buying');
      const result = await response.json();
      
      if (result.success) {
        setStocks(result.data || []);
      } else {
        throw new Error(result.error || 'Failed to fetch value buying opportunities');
      }
    } catch (err) {
      console.error('Error fetching value buying opportunities:', err);
      setError(err instanceof Error ? err.message : 'Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array for stable reference

  useEffect(() => {
    fetchValueBuyingStocks();
  }, [fetchValueBuyingStocks]);



  const getChangeColor = (changePercent: number) => {
    if (changePercent > 2) return 'text-emerald-600 bg-emerald-50';
    if (changePercent > 0) return 'text-green-600 bg-green-50';
    if (changePercent > -2) return 'text-red-500 bg-red-50';
    return 'text-red-600 bg-red-100';
  };

  const getChangeIcon = (changePercent: number) => {
    if (changePercent > 0) return '📈';
    if (changePercent < 0) return '📉';
    return '➖';
  };

  if (loading) {
    return (
      <div className="min-h-[400px] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <RefreshCw className="w-12 h-12 mx-auto mb-4 animate-spin text-blue-600" />
            <div className="absolute inset-0 w-12 h-12 mx-auto border-4 border-blue-200 rounded-full animate-pulse"></div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Finding Value Opportunities</h3>
          <p className="text-gray-600">Analyzing market data for the best value picks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[300px] bg-gradient-to-br from-red-50 to-pink-50 rounded-xl flex items-center justify-center p-6">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Unable to Load Data</h3>
          <p className="text-red-600 mb-6 max-w-md">{error}</p>
          <button
            onClick={() => fetchValueBuyingStocks()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <RefreshCw className="w-4 h-4 inline-block mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">💎 Premium Value Opportunities</h2>
            <p className="text-blue-100">Quality large-cap stocks with institutional backing</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{stocks.length}</div>
            <div className="text-sm text-blue-200">Opportunities</div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Avg Change', value: `${(stocks.reduce((sum, stock) => sum + stock.changePercent, 0) / stocks.length || 0).toFixed(2)}%`, icon: '📊', color: 'from-blue-500 to-cyan-500' },
          { label: 'Positive Moves', value: `${stocks.filter(s => s.changePercent > 0).length}/${stocks.length}`, icon: '📈', color: 'from-green-500 to-emerald-500' },
          { label: 'Avg Price', value: `₹${(stocks.reduce((sum, stock) => sum + stock.price, 0) / stocks.length || 0).toFixed(0)}`, icon: '💰', color: 'from-purple-500 to-pink-500' },
          { label: 'Last Updated', value: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), icon: '🕐', color: 'from-orange-500 to-red-500' }
        ].map((stat, index) => (
          <div key={index} className={`bg-gradient-to-br ${stat.color} rounded-lg p-4 text-white shadow-md hover:shadow-lg transition-shadow`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold">{stat.value}</div>
                <div className="text-xs opacity-90">{stat.label}</div>
              </div>
              <div className="text-2xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Stocks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {stocks.map((stock, index) => (
          <div key={`${stock.symbol}-${index}`} className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
            {/* Gradient Border Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-[1px] bg-white rounded-xl"></div>
            
            {/* Card Content */}
            <div className="relative p-6">
              {/* Header with Logo and Symbol */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {stock.imageUrl && !imageErrors.has(stock.symbol) ? (
                    <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden shadow-sm">
                      <NextImage 
                        src={stock.imageUrl} 
                        alt={stock.symbol}
                        width={32}
                        height={32}
                        className="object-contain"
                        onError={() => {
                          setImageErrors(prev => new Set(prev).add(stock.symbol));
                        }}
                        unoptimized={false}
                        priority={false}
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-700">{stock.symbol.slice(0, 2)}</span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{stock.symbol}</h3>
                    <p className="text-sm text-gray-600 truncate max-w-[120px]" title={stock.fullName || stock.name}>
                      {stock.name}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">₹{stock.price.toFixed(2)}</div>
                  <div className={`text-sm font-medium px-2 py-1 rounded-full ${getChangeColor(stock.changePercent)}`}>
                    {getChangeIcon(stock.changePercent)} {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                {stock.high && stock.low && (
                  <>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-sm text-gray-600">Day High</div>
                      <div className="font-semibold text-green-700">₹{stock.high.toFixed(2)}</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-sm text-gray-600">Day Low</div>
                      <div className="font-semibold text-red-700">₹{stock.low.toFixed(2)}</div>
                    </div>
                  </>
                )}
                {stock.previousClose && (
                  <div className="col-span-2 text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-gray-600">Previous Close</div>
                    <div className="font-semibold text-blue-700">₹{stock.previousClose.toFixed(2)}</div>
                  </div>
                )}
              </div>

              {/* Category Badge */}
              <div className="flex justify-between items-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  💎 {stock.category.replace('_', ' ')}
                </span>
                {stock.changePercent > 0 ? (
                  <span className="text-xs text-green-600 font-medium">📈 Gaining</span>
                ) : (
                  <span className="text-xs text-red-600 font-medium">📉 Cooling</span>
                )}
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>

      {stocks.length === 0 && (
        <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Opportunities Available</h3>
          <p className="text-gray-600">We&apos;re constantly scanning for the best value opportunities.</p>
          <button
            onClick={fetchValueBuyingStocks}
            className="mt-4 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Data
          </button>
        </div>
      )}
    </div>
  );
};

export function SwingTrades() {
  const [trades, setTrades] = useState<SwingTrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setLastUpdated] = useState<Date | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ url: string; symbol: string } | null>(null);
  const [activeStrategy, setActiveStrategy] = useState<string>('BIT');

  const fetchTrades = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/swing-trades');
      const result = await response.json();
      
      if (result.success) {
        setTrades(result.data || []);
        setLastUpdated(new Date());
      } else {
        throw new Error(result.error || 'Failed to fetch swing trades');
      }
    } catch (err) {
      console.error('Error fetching swing trades:', err);
      setError(err instanceof Error ? err.message : 'Failed to load swing trades');
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array for stable reference

  useEffect(() => {
    fetchTrades();
  }, [fetchTrades]);

  // Group trades by strategy - memoized for performance
  const groupedTrades: GroupedTrades = useMemo(() => {
    return trades.reduce((acc, trade) => {
      if (!acc[trade.strategy]) {
        acc[trade.strategy] = [];
      }
      (acc[trade.strategy] as SwingTrade[]).push(trade);
      return acc;
    }, {} as GroupedTrades);
  }, [trades]); // Only recalculate when trades change

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Running':
        return 'text-blue-800 bg-gradient-to-r from-blue-100 to-blue-200 border-blue-300 ring-1 ring-blue-400/20';
      case 'Trade Successful':
        return 'text-emerald-800 bg-gradient-to-r from-emerald-100 to-green-200 border-emerald-300 ring-1 ring-emerald-400/20';
      case 'SL Hit':
        return 'text-red-800 bg-gradient-to-r from-red-100 to-red-200 border-red-300 ring-1 ring-red-400/20';
      case 'Cancelled':
        return 'text-slate-800 bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300 ring-1 ring-gray-400/20';
      default:
        return 'text-blue-800 bg-gradient-to-r from-blue-100 to-blue-200 border-blue-300 ring-1 ring-blue-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Running':
        return <Activity className="w-4 h-4" />;
      case 'Trade Successful':
        return <TrendingUp className="w-4 h-4" />;
      case 'SL Hit':
        return <TrendingDown className="w-4 h-4" />;
      case 'Cancelled':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getStrategyDescription = (strategy: string) => {
    switch (strategy) {
      case 'BIT':
        return 'Break Into Trend - Momentum breakout strategies with volume confirmation';
      case 'Swing Angle':
        return 'Swing Angle - Angular momentum analysis with technical indicators';
      case 'Bottom Formation':
        return 'Bottom Formation - Reversal patterns at key support levels';
      case 'Value Buying':
        return 'Value Buying - Identify oversold quality stocks and stocks gaining momentum for swing trading opportunities';
      default:
        return '';
    }
  };

  const getStrategyColor = (strategy: string) => {
    switch (strategy) {
      case 'BIT':
        return 'border-l-blue-500 bg-blue-50';
      case 'Swing Angle':
        return 'border-l-purple-500 bg-purple-50';
      case 'Bottom Formation':
        return 'border-l-green-500 bg-green-50';
      case 'Value Buying':
        return 'border-l-orange-500 bg-orange-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Calculate statistics for a group of trades
  const calculateStats = (trades: SwingTrade[] | ValueStock[], strategyName?: string) => {
    // Handle ValueStock arrays for Value Buying strategy
    if (strategyName === 'Value Buying' || (trades.length > 0 && 'marketCap' in trades[0] && !('strategy' in trades[0]))) {
      return {
        totalTrades: trades.length,
        runningTrades: trades.length, // For Value Buying, show all stocks as active
        successfulTrades: 0,
        slHitTrades: 0,
        completedTrades: 0,
        winningRatio: 0,
        totalProfitLoss: 0
      };
    }

    // Handle SwingTrade arrays
    const swingTrades = trades as SwingTrade[];
    const totalTrades = swingTrades.length;
    const runningTrades = swingTrades.filter(t => t.status === 'Running').length;
    const successfulTrades = swingTrades.filter(t => t.status === 'Trade Successful').length;
    const slHitTrades = swingTrades.filter(t => t.status === 'SL Hit').length;
    const completedTrades = successfulTrades + slHitTrades;
    
    const winningRatio = completedTrades > 0 ? (successfulTrades / completedTrades) * 100 : 0;
    
    // Calculate total profit/loss
    const totalProfitLoss = swingTrades.reduce((total, trade) => {
      if (trade.status === 'Trade Successful' && trade.exit_price && trade.entry_price) {
        return total + ((trade.exit_price - trade.entry_price) / trade.entry_price) * 100;
      } else if (trade.status === 'SL Hit' && trade.stop_loss && trade.entry_price) {
        return total + ((trade.stop_loss - trade.entry_price) / trade.entry_price) * 100;
      }
      return total;
    }, 0);

    return {
      totalTrades,
      runningTrades,
      successfulTrades,
      slHitTrades,
      completedTrades,
      winningRatio,
      totalProfitLoss
    };
  };

  // Sort trades by date and status
  const sortTrades = (trades: SwingTrade[] | ValueStock[]): SwingTrade[] => {
    // Handle ValueStock arrays (return empty array as they're handled separately)
    if (trades.length > 0 && 'opportunity' in trades[0]) {
      return [];
    }

    const swingTrades = trades as SwingTrade[];
    return swingTrades.sort((a, b) => {
      if (a.status === 'Running' && b.status !== 'Running') return -1;
      if (a.status !== 'Running' && b.status === 'Running') return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  };

  const strategies = [
    { 
      id: 'BIT', 
      label: 'BIT Strategy', 
      icon: <BarChart3 className="w-4 h-4" />, 
      description: 'Buyer Initiated Trades Analysis' 
    },
    { 
      id: 'Swing Angle', 
      label: 'Swing Angle', 
      icon: <Zap className="w-4 h-4" />, 
      description: 'Angular Momentum Strategy' 
    },
    { 
      id: 'Bottom Formation', 
      label: 'Bottom Formation', 
      icon: <TrendingUpIcon className="w-4 h-4" />, 
      description: 'Reversal Pattern Strategy' 
    },
    { 
      id: 'Value Buying', 
      label: 'Value Buying', 
      icon: <DollarSign className="w-4 h-4" />, 
      description: 'Oversold Quality Stocks' 
    }
  ];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Risk calculation based on stop loss distance and position size
  const calculateRiskLevel = (trade: SwingTrade) => {
    const riskPercent = ((trade.entry_price - trade.stop_loss) / trade.entry_price) * 100;
    if (riskPercent <= 5) return { level: 'Low', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-800', icon: '🟢' };
    if (riskPercent <= 10) return { level: 'Medium', color: 'yellow', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800', icon: '🟡' };
    return { level: 'High', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-800', icon: '🔴' };
  };

  // Calculate expected return from entry and exit/target prices
  const calculateExpectedReturn = (trade: SwingTrade): number => {
    // If trade has exit price (completed trade), calculate actual return
    if (trade.exit_price) {
      return ((trade.exit_price - trade.entry_price) / trade.entry_price) * 100;
    }
    // If trade is running, calculate potential return using target price
    if (trade.target_price) {
      return ((trade.target_price - trade.entry_price) / trade.entry_price) * 100;
    }
    // Fallback to stored potential_return if available
    return trade.potential_return || 0;
  };

  // Performance trend indicator
  const getPerformanceTrend = (trade: SwingTrade) => {
    const expectedReturn = calculateExpectedReturn(trade);
    if (expectedReturn > 10) return { icon: '🚀', label: 'High Potential', color: 'text-green-600' };
    if (expectedReturn > 5) return { icon: '📈', label: 'Good Potential', color: 'text-blue-600' };
    if (expectedReturn > 0) return { icon: '↗️', label: 'Moderate', color: 'text-yellow-600' };
    return { icon: '⚠️', label: 'Risk', color: 'text-red-600' };
  };

  const TradeCard = ({ trade }: { trade: SwingTrade }) => {
    const riskLevel = calculateRiskLevel(trade);
    const performanceTrend = getPerformanceTrend(trade);
    const expectedReturn = calculateExpectedReturn(trade);

  return (
    <div className="group bg-white rounded-lg shadow-md border border-gray-100 p-4 hover:shadow-xl hover:border-blue-200 transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white via-gray-50 to-white">
              <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-lg font-bold text-gray-800 group-hover:text-blue-900 transition-colors">{trade.stock_name}</h4>
            {performanceTrend && (
              <div className={`flex items-center gap-1 text-xs font-medium ${performanceTrend.color}`}>
                <span>{performanceTrend.icon}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-500 font-mono tracking-wider">{trade.stock_symbol}</p>
            <div className={`px-2 py-1 rounded-full text-xs font-semibold ${riskLevel.bgColor} ${riskLevel.textColor} flex items-center gap-1`}>
              <span>{riskLevel.icon}</span>
              <span>{riskLevel.level} Risk</span>
            </div>
          </div>
        </div>
        <div className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm ${getStatusColor(trade.status)}`}>
          {getStatusIcon(trade.status)}
          <span className="tracking-wide">{trade.status}</span>
        </div>
      </div>

      {trade.setup_description && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 mb-3 border-l-4 border-blue-400">
          <p className="text-sm text-blue-900 font-medium italic leading-relaxed">{trade.setup_description}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-3">
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Entry:</span>
            <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md text-sm">{formatCurrency(trade.entry_price)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Stop Loss:</span>
            <span className="font-bold text-red-700 bg-red-100 px-2 py-1 rounded-md text-sm">{formatCurrency(trade.stop_loss)}</span>
          </div>
          {trade.target_price && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Target:</span>
              <span className="font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded-md text-sm">{formatCurrency(trade.target_price)}</span>
            </div>
          )}
        </div>
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          {/* Current price hidden as it's not updated daily
          {trade.current_price && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Current:</span>
              <span className="font-semibold text-gray-900">{formatCurrency(trade.current_price)}</span>
            </div>
          )}
          */}
          {trade.exit_price && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Exit:</span>
              <span className="font-bold text-purple-700 bg-purple-100 px-2 py-1 rounded-md text-sm">{formatCurrency(trade.exit_price)}</span>
            </div>
          )}
          {(expectedReturn !== 0 || trade.target_price || trade.exit_price) && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {trade.exit_price ? 'Actual Return:' : 'Expected Return:'}
                </span>
                <div className="flex items-center gap-2">
                  {performanceTrend && (
                    <span className="text-xs">{performanceTrend.icon}</span>
                  )}
                  <span className={`font-bold px-3 py-1.5 rounded-lg text-sm ${expectedReturn >= 0 ? 'text-emerald-800 bg-gradient-to-r from-emerald-100 to-green-200' : 'text-red-800 bg-gradient-to-r from-red-100 to-red-200'}`}>
                    {expectedReturn.toFixed(1)}%
                  </span>
                </div>
              </div>
              {/* Mini Progress Bar for Expected Return */}
              <div className="w-full">
                <div className="bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-1000 ${expectedReturn >= 0 ? 'bg-gradient-to-r from-emerald-400 to-green-500' : 'bg-gradient-to-r from-red-400 to-red-500'}`}
                    style={{ width: `${Math.min(Math.abs(expectedReturn) * 10, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-600 pt-3 border-t border-gradient-to-r from-transparent via-gray-200 to-transparent bg-gradient-to-r from-gray-50 to-gray-100 rounded-md px-3 py-2 mt-3">
        <div className="flex items-center gap-1">
          <Calendar className="w-2.5 h-2.5" />
          <span>Entry: {formatDate(trade.entry_date)}</span>
        </div>
        {trade.risk_reward_ratio && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Target className="w-2.5 h-2.5" />
              <span>R:R {trade.risk_reward_ratio}</span>
            </div>
            {/* Risk-Reward Visual Indicator */}
            <div className="flex items-center gap-0.5">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <div className="w-px h-3 bg-gray-300"></div>
              {parseFloat(trade.risk_reward_ratio.split(':')[1] || '1') >= 2 ? (
                <>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </>
              ) : (
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              )}
            </div>
          </div>
        )}
        {trade.timeframe && (
          <div className="flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            <span>{trade.timeframe}</span>
          </div>
        )}
      </div>

      {trade.chart_image_url && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1.5">
            <div className="flex items-center gap-1.5">
              <Image className="w-3 h-3" aria-label="Chart icon" />
              <span>Chart Analysis</span>
            </div>
            <button
              onClick={() => setSelectedImage({ url: trade.chart_image_url!, symbol: trade.stock_symbol })}
              className="flex items-center gap-0.5 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ZoomIn className="w-2.5 h-2.5" />
              <span className="text-xs">Expand</span>
            </button>
          </div>
          <div 
            className="relative cursor-pointer group"
            onClick={() => setSelectedImage({ url: trade.chart_image_url!, symbol: trade.stock_symbol })}
          >
            <NextImage 
              src={trade.chart_image_url} 
              alt={`${trade.stock_symbol} chart`}
              width={400}
              height={144}
              className="w-full h-36 object-contain rounded border border-gray-200 group-hover:border-blue-300 transition-colors"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded flex items-center justify-center opacity-0 group-hover:opacity-100">
              <ZoomIn className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      )}

      {trade.notes && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-600">{trade.notes}</p>
        </div>
      )}
    </div>
  );
  };

  const StrategySection = ({ strategy, trades: strategyTrades }: { strategy: string; trades: SwingTrade[] | ValueStock[] }) => {
    // Handle Value Buying separately
    if (strategy === 'Value Buying') {
      return (
        <div className={`rounded-lg border-l-4 ${getStrategyColor(strategy)} p-4 mb-6`}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{strategy}</h3>
              <p className="text-xs text-gray-600">{getStrategyDescription(strategy)}</p>
            </div>
          </div>
          <ValueBuying />
        </div>
      );
    }

    // Handle regular swing trades
    const stats = calculateStats(strategyTrades);
    const sortedTrades = sortTrades(strategyTrades);

    return (
      <div className={`rounded-lg border-l-4 ${getStrategyColor(strategy)} p-4 mb-6`}>
        {/* Header with Strategy Name */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{strategy}</h3>
            <p className="text-xs text-gray-600">{getStrategyDescription(strategy)}</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-semibold text-gray-900">{stats.totalTrades}</div>
            <div className="text-xs text-gray-600">Total</div>
          </div>
            </div>

        {/* Statistics Dashboard */}
        {stats.totalTrades > 0 && (
          <div className="bg-gradient-to-r from-blue-50 via-white to-purple-50 rounded-xl shadow-lg border border-blue-100 px-6 py-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              <div className="group cursor-default">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-3 mb-2 shadow-md group-hover:shadow-lg transition-shadow">
                  <div className="text-xl font-black">{stats.runningTrades}</div>
                  <div className="flex items-center justify-center mt-1">
                    <span className="text-xs">⚡ Active</span>
                  </div>
                </div>
                <div className="text-sm font-semibold text-blue-700">Running</div>
              </div>
              <div className="group cursor-default">
                <div className="bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-lg p-3 mb-2 shadow-md group-hover:shadow-lg transition-shadow">
                  <div className="text-xl font-black">{stats.successfulTrades}</div>
                  <div className="flex items-center justify-center mt-1">
                    {stats.successfulTrades > 0 ? (
                      <span className="text-xs">🎯 Profitable</span>
                    ) : (
                      <span className="text-xs">🎲 Pending</span>
                    )}
                  </div>
                </div>
                <div className="text-sm font-semibold text-emerald-700">Success</div>
              </div>
              <div className="group cursor-default">
                <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg p-3 mb-2 shadow-md group-hover:shadow-lg transition-shadow">
                  <div className="text-xl font-black">{stats.slHitTrades}</div>
                  <div className="flex items-center justify-center mt-1">
                    {stats.slHitTrades > 0 ? (
                      <span className="text-xs">🛡️ Protected</span>
                    ) : (
                      <span className="text-xs">🎯 Clean</span>
                    )}
                  </div>
                </div>
                <div className="text-sm font-semibold text-red-700">SL Hit</div>
              </div>
              <div className="group cursor-default">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-3 mb-2 shadow-md group-hover:shadow-lg transition-shadow">
                  <div className="text-xl font-black">{stats.winningRatio.toFixed(0)}%</div>
                  {/* Progress Bar for Win Rate */}
                  <div className="mt-2 bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-white rounded-full h-2 transition-all duration-1000"
                      style={{ width: `${Math.min(stats.winningRatio, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="text-sm font-semibold text-purple-700">Win Rate</div>
              </div>
              <div className="group cursor-default">
                <div className={`text-white rounded-lg p-3 mb-2 shadow-md group-hover:shadow-lg transition-shadow ${stats.totalProfitLoss >= 0 ? 'bg-gradient-to-br from-emerald-500 to-green-600' : 'bg-gradient-to-br from-red-500 to-red-600'}`}>
                  <div className="text-xl font-black">
                    {stats.totalProfitLoss >= 0 ? '+' : ''}{stats.totalProfitLoss.toFixed(1)}%
                  </div>
                  {/* Performance Indicator */}
                  <div className="flex items-center justify-center mt-1">
                    {stats.totalProfitLoss > 10 ? (
                      <span className="text-xs">🚀 Excellent</span>
                    ) : stats.totalProfitLoss > 5 ? (
                      <span className="text-xs">📈 Good</span>
                    ) : stats.totalProfitLoss > 0 ? (
                      <span className="text-xs">↗️ Positive</span>
                    ) : (
                      <span className="text-xs">📉 Negative</span>
                    )}
              </div>
            </div>
                <div className={`text-sm font-semibold ${stats.totalProfitLoss >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>P&L</div>
              </div>
            </div>
          </div>
        )}

        {/* Trades Display */}
        {strategyTrades.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No trades available for this strategy</p>
          </div>
        ) : (
          <>
            {/* Running Trades Section */}
            {stats.runningTrades > 0 && (
              <div className="mb-4">
                <h4 className="text-base font-medium text-gray-900 mb-2 flex items-center">
                  <Activity className="w-4 h-4 mr-1 text-blue-600" />
                  Running ({stats.runningTrades})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {sortedTrades.filter(trade => trade.status === 'Running').map((trade) => (
                    <TradeCard key={trade.id} trade={trade} />
                  ))}
                </div>
              </div>
            )}

            {/* Completed Trades Section */}
            {stats.completedTrades > 0 && (
              <div>
                <h4 className="text-base font-medium text-gray-900 mb-2 flex items-center">
                  <Target className="w-4 h-4 mr-1 text-gray-600" />
                  Completed ({stats.completedTrades})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {sortedTrades.filter(trade => ['Trade Successful', 'SL Hit', 'Cancelled'].includes(trade.status)).map((trade) => (
                    <TradeCard key={trade.id} trade={trade} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  // Tab Navigation Component - optimized to avoid duplicate API calls
  const TabNavigation = ({ valueBuyingStocks }: { valueBuyingStocks: ValueStock[] }) => {

    return (
      <div className="mb-4">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-2 sm:p-3">
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {strategies.map((strategy) => {
              // Special handling for Value Buying strategy
              let strategyTrades, stats;
              if (strategy.id === 'Value Buying') {
                strategyTrades = valueBuyingStocks;
                stats = calculateStats(valueBuyingStocks, 'Value Buying');
              } else {
                strategyTrades = groupedTrades[strategy.id as keyof GroupedTrades] || [];
                stats = calculateStats(strategyTrades, strategy.id);
              }
              
              const isActive = activeStrategy === strategy.id;
            
            return (
              <button
                key={strategy.id}
                onClick={() => setActiveStrategy(strategy.id)}
                className={`
                  group flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-3 sm:py-4 rounded-lg transition-all duration-300 hover:-translate-y-0.5
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 text-white shadow-lg ring-2 ring-blue-400/20 transform scale-105' 
                    : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 hover:from-blue-50 hover:to-purple-50 hover:text-blue-800 hover:shadow-md'
                  }
                `}
              >
                <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-white shadow-sm'}`}>
                  <div className={`${isActive ? 'text-white' : 'text-blue-600 group-hover:text-blue-700'}`}>
                    {strategy.icon}
                  </div>
                </div>
                <div className="text-left flex-1">
                  <div className="font-bold text-xs sm:text-sm tracking-wide">{strategy.label}</div>
                  <div className={`text-xs font-medium ${isActive ? 'text-blue-100' : 'text-gray-600 group-hover:text-blue-700'} hidden sm:block`}>
                    {strategy.id === 'Value Buying' 
                      ? `${stats.runningTrades} stocks available`
                      : `${stats.totalTrades} trades • ${stats.runningTrades} active`
                    }
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-blue-600" />
            <p className="text-gray-600">Loading swing trading opportunities...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-600" />
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchTrades}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${brandTokens.spacing.page.fullWidthPadded} ${brandTokens.spacing.page.yCompact}`}>
      {/* Google Auto Ads will handle ad placement automatically */}
      
      {/* Header */}
        <div className="text-center mb-2">
          {/* Removed refresh button and updated time */}
        </div>

        {/* Tab Navigation */}
        <TabNavigation valueBuyingStocks={[]} />

        {/* Active Strategy Section */}
        <div className="space-y-4">
          <StrategySection
            strategy={activeStrategy}
            trades={groupedTrades[activeStrategy] || []}
          />
        </div>
        
        {/* Auto Ads will handle in-content placement */}

        {/* Trading Guidelines */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-4">Swing Trading Guidelines</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Risk Management</h4>
              <p className="text-sm text-gray-600">
                Never risk more than 2% of your capital per trade. Always use stop losses.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Position Sizing</h4>
              <p className="text-sm text-gray-600">
                Calculate position size based on stop loss distance and risk tolerance.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Time Frame</h4>
              <p className="text-sm text-gray-600">
                Hold positions for 5-15 days depending on strategy and market conditions.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-1">Investment Disclaimer</h4>
              <p className="text-sm text-yellow-700">
                These are educational swing trading setups and not investment advice. Past performance doesn&apos;t 
                guarantee future results. Always do your own research and consider consulting with a financial advisor 
                before making investment decisions. Trading involves risk of loss.
              </p>
            </div>
          </div>
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-5xl max-h-full w-full">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="bg-white rounded-lg p-2">
                <div className="flex items-center justify-between mb-2 px-2">
                  <h3 className="font-semibold text-gray-900">{selectedImage.symbol} Chart Analysis</h3>
                  <span className="text-sm text-gray-600">Click outside to close</span>
                </div>
                <NextImage
                  src={selectedImage.url}
                  alt={`${selectedImage.symbol} chart`}
                  width={800}
                  height={600}
                  className="w-full max-h-[80vh] object-contain rounded"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          </div>
        )}
    </div>
  );
} 