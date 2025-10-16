'use client';

import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, RefreshCw, Zap, AlertCircle } from 'lucide-react';
import { SwingTrade } from '@/app/api/swing-trades/route';

export function SwingAngleContent() {
  const [trades, setTrades] = useState<SwingTrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSwingAngleTrades = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/swing-trades');
      const result = await response.json();
      
      if (result.success) {
        const swingAngleTrades = result.data.filter((trade: SwingTrade) => trade.strategy === 'Swing Angle');
        setTrades(swingAngleTrades);
      } else {
        setError('Failed to fetch Swing Angle strategy trades');
      }
    } catch {
      setError('Error loading Swing Angle strategy data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSwingAngleTrades();
  }, [fetchSwingAngleTrades]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'running': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'stopped': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          ⚡ Swing Angle Strategy
        </h3>
        <p className="text-sm text-gray-600 mb-1">
          Angular momentum analysis with technical indicators
        </p>
        <p className="text-xs text-gray-500">
          Momentum Direction • Angular Analysis • Technical Confirmation
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <button
          onClick={fetchSwingAngleTrades}
          disabled={loading}
          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1 text-xs"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {loading && (
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-4" />
          <p className="text-gray-600">Loading Swing Angle trades...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-800">Error Loading Swing Angle Strategy</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-1 mb-1">
                <Zap className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-blue-800">Total Trades</span>
              </div>
              <div className="text-xl font-bold text-blue-700">{trades.length}</div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-1 mb-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-800">Running</span>
              </div>
              <div className="text-xl font-bold text-green-700">
                {trades.filter(t => t.status.toLowerCase() === 'running').length}
              </div>
            </div>
          </div>

          {trades.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Zap className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-600 mb-1">No Swing Angle Trades</h3>
              <p className="text-sm text-gray-500">No Swing Angle strategy trades available at the moment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {trades.map((trade, index) => (
                <div key={trade.id || index} className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h4 className="text-lg font-bold text-gray-900">{trade.stock_symbol}</h4>
                      <div className={`px-3 py-1 rounded-lg text-sm font-medium border ${getStatusColor(trade.status)}`}>
                        {trade.status}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Entry Date</div>
                      <div className="font-medium text-gray-900">
                        {formatDate(trade.entry_date)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Entry Price</div>
                      <div className="font-bold text-gray-900">₹{trade.entry_price.toFixed(2)}</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Current Price</div>
                      <div className="font-medium text-gray-900">₹{(trade.current_price || 0).toFixed(2)}</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Target</div>
                      <div className="font-medium text-green-600">₹{(trade.target_price || 0).toFixed(2)}</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Stop Loss</div>
                      <div className="font-medium text-red-600">₹{trade.stop_loss.toFixed(2)}</div>
                    </div>
                  </div>

                  {trade.notes && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-600">
                        <strong>Analysis:</strong> {trade.notes}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
