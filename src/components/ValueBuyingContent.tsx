'use client';

import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, AlertCircle, DollarSign } from 'lucide-react';

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

export function ValueBuyingContent() {
  const [stocks, setStocks] = useState<ValueStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchValueBuyingStocks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/value-buying');
      const result = await response.json();
      
      if (result.success) {
        setStocks(result.data || []);
      } else {
        throw new Error(result.error || 'Failed to fetch value buying opportunities');
      }
    } catch (err) {
      console.error('❌ Error fetching value buying opportunities:', err);
      setError(err instanceof Error ? err.message : 'Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  }, []);

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

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          💎 Value Buying Strategy
        </h3>
        <p className="text-sm text-gray-600 mb-1">
          Quality large-cap stocks with institutional backing at attractive valuations
        </p>
        <p className="text-xs text-gray-500">
          Fundamental Analysis • Quality Stocks • Attractive Valuations
        </p>
      </div>

      {/* Controls */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-4" />
          <p className="text-gray-600">Finding value opportunities...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-800">Error Loading Value Opportunities</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {!loading && !error && (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-1 mb-1">
                <DollarSign className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-blue-800">Total Stocks</span>
              </div>
              <div className="text-xl font-bold text-blue-700">
                {stocks.length}
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-1 mb-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-800">Gainers</span>
              </div>
              <div className="text-xl font-bold text-green-700">
                {stocks.filter(s => s.changePercent > 0).length}
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center gap-1 mb-1">
                <TrendingDown className="w-4 h-4 text-red-600" />
                <span className="text-xs font-medium text-red-800">Decliners</span>
              </div>
              <div className="text-xl font-bold text-red-700">
                {stocks.filter(s => s.changePercent < 0).length}
              </div>
            </div>
          </div>

          {/* Stocks Display */}
          {stocks.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <DollarSign className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-600 mb-1">No Value Opportunities</h3>
              <p className="text-sm text-gray-500">No value buying opportunities available at the moment</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {stocks.map((stock, index) => (
                <div key={stock.symbol || index} className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h4 className="text-lg font-bold text-gray-900">{stock.symbol}</h4>
                      <div className="text-sm text-gray-600">{stock.name}</div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold text-gray-900">₹{stock.price.toFixed(2)}</div>
                      <div className={`text-sm px-2 py-1 rounded ${getChangeColor(stock.changePercent)}`}>
                        {getChangeIcon(stock.changePercent)} {stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Market Cap</div>
                      <div className="font-medium text-gray-900">
                        ₹{(stock.marketCap / 10000).toFixed(0)}Cr
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Category</div>
                      <div className="font-medium text-gray-900">{stock.category}</div>
                    </div>
                    
                    {stock.pe && (
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">P/E Ratio</div>
                        <div className="font-medium text-gray-900">{stock.pe.toFixed(1)}</div>
                      </div>
                    )}
                    
                    {stock.pb && (
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">P/B Ratio</div>
                        <div className="font-medium text-gray-900">{stock.pb.toFixed(2)}</div>
                      </div>
                    )}
                  </div>

                  {stock.fullName && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-600">
                        <strong>Company:</strong> {stock.fullName}
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
