'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, CheckCircle2, XCircle, Clock, RefreshCw, Target, AlertTriangle, DollarSign, Calendar, BarChart3 } from 'lucide-react';

interface Trade {
  id: number;
  stock_symbol: string;
  entry_date: string;
  entry_price: number;
  stop_loss: number | null;
  target_price: number | null;
  exit_date: string | null;
  exit_price: number | null;
  result: 'SL' | 'Target' | 'Running';
  percentage_change: number | null;
  notes: string | null;
}

interface Statistics {
  totalTrades: number;
  runningCount: number;
  closedCount: number;
  targetHitsCount: number;
  stopLossHitsCount: number;
  winRate: number;
  totalPnL: number;
  avgPnL: number;
}

interface ApiResponse {
  success: boolean;
  data: {
    all: Trade[];
    running: Trade[];
    closed: Trade[];
  };
  statistics: Statistics;
}

export function FutureSwingsEliteContent() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [runningTrades, setRunningTrades] = useState<Trade[]>([]);
  const [closedTrades, setClosedTrades] = useState<Trade[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'running' | 'closed'>('running');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/future-swings-elite');
      const result: ApiResponse = await response.json();

      if (result.success) {
        setTrades(result.data.all);
        setRunningTrades(result.data.running);
        setClosedTrades(result.data.closed);
        setStatistics(result.statistics);
        setError(null);
      } else {
        setError('Failed to fetch data');
      }
    } catch (err) {
      setError('Error loading data');
      console.error('Error fetching future swings elite:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatPrice = (price: number | null) => {
    if (price === null) return '-';
    return `₹${price.toFixed(2)}`;
  };

  const formatPercentage = (percentage: number | null) => {
    if (percentage === null) return '-';
    const sign = percentage >= 0 ? '+' : '';
    return `${sign}${percentage.toFixed(2)}%`;
  };

  const getResultBadge = (result: string) => {
    switch (result) {
      case 'Target':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[10px] font-bold rounded-full shadow-sm">
            <CheckCircle2 className="w-3 h-3" />
            TARGET
          </span>
        );
      case 'SL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-red-500 to-rose-500 text-white text-[10px] font-bold rounded-full shadow-sm">
            <XCircle className="w-3 h-3" />
            SL HIT
          </span>
        );
      case 'Running':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-[10px] font-bold rounded-full shadow-sm animate-pulse">
            <Activity className="w-3 h-3" />
            ACTIVE
          </span>
        );
      default:
        return null;
    }
  };

  const getCurrentTrades = () => {
    switch (activeTab) {
      case 'running':
        return runningTrades;
      case 'closed':
        return closedTrades;
      default:
        return trades;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-xl border border-gray-200 shadow-lg">
        <div className="relative">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-200"></div>
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600 absolute top-0 left-0"></div>
        </div>
        <p className="mt-3 text-gray-600 text-sm font-medium">Loading Futures...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border-2 border-red-200 shadow-lg">
        <AlertTriangle className="w-10 h-10 text-red-500 mb-3" />
        <p className="text-red-700 font-bold text-sm mb-1">Oops! Something went wrong</p>
        <p className="text-red-600 text-xs mb-4">{error}</p>
        <button
          onClick={fetchData}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-md"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white rounded-2xl shadow-xl border border-gray-100 p-5">
      <div className="space-y-4">
        {/* Header Section - Light & Modern */}
        <div className="relative overflow-hidden bg-white border-2 border-blue-100 rounded-2xl shadow-lg p-4">
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1 flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-md">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  Futures Swing
                </h1>
                <p className="text-gray-600 text-xs mb-1.5">Advanced swing trading strategy for futures market</p>
                <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-100 to-purple-100 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-blue-200">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <p className="text-blue-700 text-xs font-semibold">
                    Short-term strategy • 5-15 days timeframe
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative corner accents */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full -mr-12 -mt-12 opacity-50 blur-xl"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-pink-100 to-purple-100 rounded-full -ml-10 -mb-10 opacity-50 blur-xl"></div>
        </div>

        {/* Statistics Cards - Enhanced */}
        {statistics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Total Trades */}
            <div className="group relative overflow-hidden bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 border border-blue-100 p-3">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-1.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
                    <BarChart3 className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">{statistics.totalTrades}</span>
                </div>
                <h3 className="text-gray-700 font-bold text-xs mb-1.5">Total Trades</h3>
                <div className="flex items-center gap-2 text-[10px] text-gray-600">
                  <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-blue-50 rounded-md">
                    <Activity className="w-2.5 h-2.5 text-blue-600" />
                    {statistics.runningCount} Active
                  </span>
                  <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-gray-100 rounded-md">
                    <CheckCircle2 className="w-2.5 h-2.5 text-gray-600" />
                    {statistics.closedCount} Closed
                  </span>
                </div>
              </div>
            </div>

            {/* Win Rate */}
            <div className="group relative overflow-hidden bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 border border-green-100 p-3">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-1.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-md">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">{statistics.winRate.toFixed(1)}%</span>
                </div>
                <h3 className="text-gray-700 font-bold text-xs mb-1.5">Win Rate</h3>
                <div className="flex items-center gap-2 text-[10px] text-gray-600">
                  <span className="px-1.5 py-0.5 bg-green-50 rounded-md font-semibold text-green-700">{statistics.targetHitsCount} Wins</span>
                  <span className="opacity-70">•</span>
                  <span className="px-1.5 py-0.5 bg-red-50 rounded-md font-semibold text-red-700">{statistics.stopLossHitsCount} Loss</span>
                </div>
              </div>
            </div>

            {/* Total P&L */}
            <div className={`group relative overflow-hidden bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 border ${
              statistics.totalPnL >= 0 ? 'border-emerald-100' : 'border-red-100'
            } p-3`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${
                statistics.totalPnL >= 0 ? 'from-emerald-500/5 to-teal-600/10' : 'from-red-500/5 to-rose-600/10'
              } opacity-0 group-hover:opacity-100 transition-opacity`}></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-1.5 bg-gradient-to-br ${
                    statistics.totalPnL >= 0 ? 'from-emerald-500 to-teal-600' : 'from-red-500 to-rose-600'
                  } rounded-lg shadow-md`}>
                    {statistics.totalPnL >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-white" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className={`text-2xl font-bold bg-gradient-to-r ${
                    statistics.totalPnL >= 0 ? 'from-emerald-600 to-teal-700' : 'from-red-600 to-rose-700'
                  } bg-clip-text text-transparent`}>
                    {formatPercentage(statistics.totalPnL)}
                  </span>
                </div>
                <h3 className="text-gray-700 font-bold text-xs mb-1.5">Total P&L</h3>
                <p className="text-[10px] text-gray-600">
                  Cumulative from {statistics.closedCount} trades
                </p>
              </div>
            </div>

            {/* Average P&L */}
            <div className={`group relative overflow-hidden bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 border ${
              statistics.avgPnL >= 0 ? 'border-purple-100' : 'border-orange-100'
            } p-3`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${
                statistics.avgPnL >= 0 ? 'from-purple-500/5 to-pink-600/10' : 'from-orange-500/5 to-red-600/10'
              } opacity-0 group-hover:opacity-100 transition-opacity`}></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-1.5 bg-gradient-to-br ${
                    statistics.avgPnL >= 0 ? 'from-purple-500 to-pink-600' : 'from-orange-500 to-red-600'
                  } rounded-lg shadow-md`}>
                    <DollarSign className="w-4 h-4 text-white" />
                  </div>
                  <span className={`text-2xl font-bold bg-gradient-to-r ${
                    statistics.avgPnL >= 0 ? 'from-purple-600 to-pink-700' : 'from-orange-600 to-red-700'
                  } bg-clip-text text-transparent`}>
                    {formatPercentage(statistics.avgPnL)}
                  </span>
                </div>
                <h3 className="text-gray-700 font-bold text-xs mb-1.5">Average P&L</h3>
                <p className="text-[10px] text-gray-600">
                  Per trade performance
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Trades Section - Enhanced with Modern Design */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Enhanced Tabs */}
          <div className="bg-gradient-to-r from-gray-100 to-gray-50 border-b border-gray-200 p-3">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('running')}
                className={`flex-1 px-4 py-2.5 text-xs font-bold rounded-xl transition-all transform ${
                  activeTab === 'running'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Active ({runningTrades.length})</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('closed')}
                className={`flex-1 px-4 py-2.5 text-xs font-bold rounded-xl transition-all transform ${
                  activeTab === 'closed'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Closed ({closedTrades.length})</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`flex-1 px-4 py-2.5 text-xs font-bold rounded-xl transition-all transform ${
                  activeTab === 'all'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>All ({trades.length})</span>
                </div>
              </button>
            </div>
          </div>

          {/* Enhanced Trades List */}
          <div className="p-4 bg-white">
            {getCurrentTrades().length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-4">
                  <Activity className="w-8 h-8 text-blue-500" />
                </div>
                <p className="text-gray-700 font-bold text-sm mb-1">No trades found</p>
                <p className="text-gray-500 text-xs">Start trading to see your positions here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {getCurrentTrades().map((trade) => (
                  <div
                    key={trade.id}
                    className="group relative bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-blue-200 transition-all duration-300"
                  >
                    {/* Stock Symbol & Status Badge */}
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                      <h3 className="text-base font-bold text-gray-900">{trade.stock_symbol}</h3>
                      {getResultBadge(trade.result)}
                    </div>

                    {/* Trade Details */}
                    <div className="space-y-3">
                      {/* Entry Date */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-medium text-gray-500">Entry Date</span>
                        <span className="text-xs font-semibold text-gray-900">{formatDate(trade.entry_date)}</span>
                      </div>

                      {/* Entry Price */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-medium text-gray-500">Entry Price</span>
                        <span className="text-xs font-semibold text-gray-900">{formatPrice(trade.entry_price)}</span>
                      </div>

                      {/* Stop Loss */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-medium text-gray-500">Stop Loss</span>
                        <span className="text-xs font-semibold text-red-600">{formatPrice(trade.stop_loss)}</span>
                      </div>

                      {/* Target */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-medium text-gray-500">Target</span>
                        <span className="text-xs font-semibold text-green-600">{formatPrice(trade.target_price)}</span>
                      </div>

                      {/* Running P&L - Highlighted */}
                      <div className={`flex items-center justify-between p-2 rounded-lg ${
                        trade.percentage_change === null 
                          ? 'bg-gray-50'
                          : trade.percentage_change >= 0 
                          ? 'bg-green-50' 
                          : 'bg-red-50'
                      }`}>
                        <span className="text-[10px] font-semibold text-gray-700">Running P&L</span>
                        <span className={`text-sm font-bold ${
                          trade.percentage_change === null 
                            ? 'text-gray-500'
                            : trade.percentage_change >= 0 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {formatPercentage(trade.percentage_change)}
                        </span>
                      </div>
                    </div>

                    {/* Exit Info (if closed) */}
                    {trade.exit_date && (
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-medium text-gray-500">Exit Date</span>
                          <span className="text-xs font-semibold text-gray-900">{formatDate(trade.exit_date)}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[10px] font-medium text-gray-500">Exit Price</span>
                          <span className="text-xs font-semibold text-gray-900">{formatPrice(trade.exit_price)}</span>
                        </div>
                      </div>
                    )}

                    {/* Notes (if available) */}
                    {trade.notes && (
                      <div className="mt-3 p-2.5 bg-blue-50 border border-blue-100 rounded-lg">
                        <p className="text-[10px] text-gray-700">
                          {trade.notes}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
