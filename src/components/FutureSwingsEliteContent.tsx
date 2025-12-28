'use client';

import { useState, useEffect } from 'react';
import { Activity, RefreshCw, Target, DollarSign, BarChart3, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';

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
          <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
            Target
          </span>
        );
      case 'SL':
        return (
          <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">
            Stop Loss
          </span>
        );
      case 'Running':
        return (
          <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
            Running
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
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-gray-600 text-sm">Loading trades...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
          <p className="text-red-600 font-semibold mb-2">{error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="compact-card info-dense">
      {/* Header */}
      <div className="compact-margin">
        <h3 className="text-h3 mb-3">
          <span className="text-gradient">📊 Futures Swing</span>
        </h3>
        <p className="text-body mb-2">
          Advanced swing trading strategy for futures market
        </p>
        <p className="text-caption text-muted">
          Short-term strategy • 5-15 days timeframe • Updated Daily
        </p>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {/* Total Trades */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-blue-700 font-semibold">Total Trades</span>
              <BarChart3 className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-800">{statistics.totalTrades}</p>
            <p className="text-xs text-blue-600 mt-1">
              Running: {statistics.runningCount} | Closed: {statistics.closedCount}
            </p>
          </div>

          {/* Win Rate */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-green-700 font-semibold">Win Rate</span>
              <Target className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-800">{statistics.winRate.toFixed(1)}%</p>
            <p className="text-xs text-green-600 mt-1">
              Targets: {statistics.targetHitsCount} | SL: {statistics.stopLossHitsCount}
            </p>
          </div>

          {/* Total P&L */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-purple-700 font-semibold">Total P&L</span>
              <TrendingUp className="w-4 h-4 text-purple-600" />
            </div>
            <p className={`text-2xl font-bold ${
              statistics.totalPnL >= 0 ? 'text-green-800' : 'text-red-800'
            }`}>
              {formatPercentage(statistics.totalPnL)}
            </p>
            <p className="text-xs text-purple-600 mt-1">Cumulative performance</p>
          </div>

          {/* Avg P&L */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-orange-700 font-semibold">Avg P&L</span>
              <DollarSign className="w-4 h-4 text-orange-600" />
            </div>
            <p className={`text-2xl font-bold ${
              statistics.avgPnL >= 0 ? 'text-green-800' : 'text-red-800'
            }`}>
              {formatPercentage(statistics.avgPnL)}
            </p>
            <p className="text-xs text-orange-600 mt-1">Per trade average</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-blue-700 hover:bg-blue-100'
              }`}
            >
              All ({trades.length})
            </button>
            <button
              onClick={() => setActiveTab('running')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === 'running'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-blue-700 hover:bg-blue-100'
              }`}
            >
              <Activity className="w-4 h-4 inline mr-1" />
              Running ({runningTrades.length})
            </button>
            <button
              onClick={() => setActiveTab('closed')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === 'closed'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-blue-700 hover:bg-blue-100'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 inline mr-1" />
              Closed ({closedTrades.length})
            </button>
          </div>
          <button
            onClick={fetchData}
            disabled={refreshing}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-md transition-colors disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Trades Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entry Date
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entry Price
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stop Loss
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Target
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  P&L %
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getCurrentTrades().length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Activity className="w-12 h-12 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">No trades found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                getCurrentTrades().map((trade) => (
                  <tr key={trade.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{trade.stock_symbol}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{formatDate(trade.entry_date)}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className="text-sm text-gray-900">{formatPrice(trade.entry_price)}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className="text-sm text-red-600 font-medium">{formatPrice(trade.stop_loss)}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className="text-sm text-green-600 font-medium">{formatPrice(trade.target_price)}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className={`text-sm font-semibold ${
                        trade.percentage_change === null 
                          ? 'text-gray-500'
                          : trade.percentage_change >= 0 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {formatPercentage(trade.percentage_change)}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      {getResultBadge(trade.result)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
