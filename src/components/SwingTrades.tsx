'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Clock, Target, AlertCircle, RefreshCw, Calendar, DollarSign, Activity, Image } from 'lucide-react';
import { SwingTrade } from '@/app/api/swing-trades/route';

interface GroupedTrades {
  'BIT': SwingTrade[];
  'Swing Angle': SwingTrade[];
  'Bottom Formation': SwingTrade[];
}

export function SwingTrades() {
  const [trades, setTrades] = useState<SwingTrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchTrades = async () => {
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
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  // Group trades by strategy
  const groupedTrades: GroupedTrades = trades.reduce((acc, trade) => {
    if (!acc[trade.strategy]) {
      acc[trade.strategy] = [];
    }
    acc[trade.strategy].push(trade);
    return acc;
  }, {} as GroupedTrades);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Running':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Trade Successful':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'SL Hit':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'Cancelled':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const TradeCard = ({ trade }: { trade: SwingTrade }) => (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="text-lg font-bold text-gray-900">{trade.stock_name}</h4>
          <p className="text-sm text-gray-600 font-mono">{trade.stock_symbol}</p>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(trade.status)}`}>
          {getStatusIcon(trade.status)}
          {trade.status}
        </div>
      </div>

      {trade.setup_description && (
        <p className="text-sm text-gray-700 mb-3 italic">{trade.setup_description}</p>
      )}

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Entry:</span>
            <span className="font-semibold text-green-600">{formatCurrency(trade.entry_price)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Stop Loss:</span>
            <span className="font-semibold text-red-600">{formatCurrency(trade.stop_loss)}</span>
          </div>
          {trade.target_price && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Target:</span>
              <span className="font-semibold text-blue-600">{formatCurrency(trade.target_price)}</span>
            </div>
          )}
        </div>
        <div className="space-y-2">
          {trade.current_price && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Current:</span>
              <span className="font-semibold text-gray-900">{formatCurrency(trade.current_price)}</span>
            </div>
          )}
          {trade.exit_price && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Exit:</span>
              <span className="font-semibold text-purple-600">{formatCurrency(trade.exit_price)}</span>
            </div>
          )}
          {trade.potential_return && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Return:</span>
              <span className={`font-semibold ${trade.potential_return >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trade.potential_return.toFixed(2)}%
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>Entry: {formatDate(trade.entry_date)}</span>
        </div>
        {trade.risk_reward_ratio && (
          <div className="flex items-center gap-1">
            <Target className="w-3 h-3" />
            <span>R:R {trade.risk_reward_ratio}</span>
          </div>
        )}
        {trade.timeframe && (
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{trade.timeframe}</span>
          </div>
        )}
      </div>

      {trade.chart_image_url && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Image className="w-4 h-4" />
            <span>Chart Analysis</span>
          </div>
          <img 
            src={trade.chart_image_url} 
            alt={`${trade.stock_symbol} chart`}
            className="w-full h-32 object-cover rounded border border-gray-200"
            loading="lazy"
          />
        </div>
      )}

      {trade.notes && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-600">{trade.notes}</p>
        </div>
      )}
    </div>
  );

  const StrategySection = ({ strategy, trades: strategyTrades }: { strategy: keyof GroupedTrades; trades: SwingTrade[] }) => (
    <div className={`rounded-lg border-l-4 ${getStrategyColor(strategy)} p-6 mb-8`}>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{strategy}</h3>
          <p className="text-sm text-gray-600">{getStrategyDescription(strategy)}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{strategyTrades.length}</div>
          <div className="text-sm text-gray-600">
            {strategyTrades.length === 1 ? 'Trade' : 'Trades'}
          </div>
        </div>
      </div>

      {strategyTrades.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No trades available for this strategy</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {strategyTrades.map((trade) => (
            <TradeCard key={trade.id} trade={trade} />
          ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
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
      <div className="min-h-screen bg-gray-50 px-4 py-8">
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
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Swing Trading Strategies</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-4">
            Professional swing trading opportunities across three proven strategies with detailed analysis and risk management.
          </p>
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={fetchTrades}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            {lastUpdated && (
              <p className="text-sm text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString('en-IN')}
              </p>
            )}
          </div>
        </div>

        {/* Strategy Sections */}
        <div className="space-y-8">
          {(['BIT', 'Swing Angle', 'Bottom Formation'] as const).map((strategy) => (
            <StrategySection
              key={strategy}
              strategy={strategy}
              trades={groupedTrades[strategy] || []}
            />
          ))}
        </div>

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
      </div>
    </div>
  );
} 