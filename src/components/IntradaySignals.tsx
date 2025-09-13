'use client';

import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, RefreshCw, Clock, Activity, Eye, BarChart3, Target, AlertTriangle } from 'lucide-react';

interface IntradaySignal {
  id: string;
  symbol: string;
  bit_sit_score: number;
  bit_sit1: number;
  bit_sit2: number;
  current_price: number | null;
  volume: number | null;
  scan_time: string;
  scan_date: string;
  market_session: string;
  rank_position: number;
  is_active: boolean;
}

interface IntradaySignalsResponse {
  success: boolean;
  data: IntradaySignal[];
  timestamp: string;
  session: string;
  error?: string;
}

export function IntradaySignals() {
  const [signals, setSignals] = useState<IntradaySignal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<'all' | 'opening_hour' | 'intraday'>('all');

  // Format large numbers
  const formatNumber = (num: number): string => {
    if (num >= 10000000) { // 1 crore
      return `₹${(num / 10000000).toFixed(1)}Cr`;
    } else if (num >= 100000) { // 1 lakh
      return `₹${(num / 100000).toFixed(1)}L`;
    } else if (num >= 1000) {
      return `₹${(num / 1000).toFixed(1)}K`;
    }
    return `₹${num.toFixed(0)}`;
  };

  // Format volume numbers
  const formatVolume = (volume: number | null): string => {
    if (!volume) return 'N/A';
    if (volume >= 10000000) {
      return `${(volume / 10000000).toFixed(1)}Cr`;
    } else if (volume >= 100000) {
      return `${(volume / 100000).toFixed(1)}L`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  // Format time
  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-IN', { 
      timeZone: 'Asia/Kolkata',
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Fetch signals from API
  const fetchSignals = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }
      setError(null);

      const response = await fetch(`/api/intraday-signals?session=${selectedSession}&limit=10`);
      const data: IntradaySignalsResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch signals');
      }

      if (data.success) {
        setSignals(data.data);
        setLastUpdated(new Date());
      } else {
        throw new Error(data.error || 'API returned unsuccessful response');
      }
    } catch (err) {
      console.error('Error fetching intraday signals:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch signals');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedSession]);

  // Initial load and auto-refresh setup
  useEffect(() => {
    fetchSignals();
    
    // Auto-refresh every 30 seconds during market hours (9:00 AM to 3:30 PM IST)
    const interval = setInterval(() => {
      const now = new Date();
      const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
      const hour = istTime.getHours();
      const isMarketHours = hour >= 9 && hour <= 15;
      
      if (isMarketHours) {
        fetchSignals(false); // Refresh without showing loader
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [fetchSignals]);

  // Manual refresh
  const handleManualRefresh = () => {
    fetchSignals(false);
  };

  // Get signal strength color
  const getSignalStrength = (score: number): { label: string; color: string; bgColor: string } => {
    if (score >= 1000000) {
      return { label: 'VERY HIGH', color: 'text-green-700', bgColor: 'bg-green-100' };
    } else if (score >= 500000) {
      return { label: 'HIGH', color: 'text-blue-700', bgColor: 'bg-blue-100' };
    } else if (score >= 250000) {
      return { label: 'MEDIUM', color: 'text-yellow-700', bgColor: 'bg-yellow-100' };
    } else {
      return { label: 'LOW', color: 'text-gray-700', bgColor: 'bg-gray-100' };
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading intraday signals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-red-200 p-8">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-700 mb-2">Error Loading Signals</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => fetchSignals()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Activity className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Intraday Signals</h2>
          </div>
          
          <div className="flex items-center gap-4">
            {lastUpdated && (
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                Updated {formatTime(lastUpdated.toISOString())}
              </div>
            )}
            
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Session Filter */}
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'All Signals' },
            { value: 'opening_hour', label: 'Opening Hour' },
            { value: 'intraday', label: 'Intraday' }
          ].map((session) => (
            <button
              key={session.value}
              onClick={() => setSelectedSession(session.value as 'all' | 'opening_hour' | 'intraday')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedSession === session.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {session.label}
            </button>
          ))}
        </div>
      </div>

      {/* Signals List */}
      <div className="p-6">
        {signals.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Signals Available</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {selectedSession === 'opening_hour' 
                ? 'Opening hour signals are generated between 9:25-10:25 AM IST'
                : 'Intraday signals will appear here when market activity is detected'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {signals.map((signal) => {
              const strength = getSignalStrength(signal.bit_sit_score);
              
              return (
                <div
                  key={signal.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <div className="flex items-center mr-4">
                        <Target className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="text-lg font-bold text-gray-900">
                          {signal.symbol}
                        </span>
                      </div>
                      
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${strength.bgColor} ${strength.color}`}>
                        #{signal.rank_position} • {strength.label}
                      </div>
                    </div>

                    <div className="text-right">
                      {signal.current_price && (
                        <div className="text-lg font-semibold text-gray-900">
                          ₹{signal.current_price.toFixed(2)}
                        </div>
                      )}
                      <div className="text-xs text-gray-500">
                        {signal.market_session.replace('_', ' ')}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Total Score:</span>
                      <div className="font-semibold text-blue-600">
                        {formatNumber(signal.bit_sit_score)}
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-500">BIT+SIT (1):</span>
                      <div className="font-semibold text-green-600">
                        {formatNumber(signal.bit_sit1 || 0)}
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-500">BIT+SIT (2):</span>
                      <div className="font-semibold text-orange-600">
                        {formatNumber(signal.bit_sit2 || 0)}
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-500">Volume:</span>
                      <div className="font-semibold text-purple-600">
                        {formatVolume(signal.volume)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                    <div className="flex items-center">
                      <Eye className="w-3 h-3 mr-1" />
                      Scanned at {formatTime(signal.scan_time)}
                    </div>
                    
                    <div className="flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Institutional Activity
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Info Footer */}
      <div className="p-4 bg-gray-50 rounded-b-xl border-t border-gray-200">
        <div className="text-xs text-gray-600 space-y-1">
          <p><strong>BIT+SIT:</strong> Buyer + Seller Initiated Trades (indicates institutional activity)</p>
          <p><strong>Opening Hour:</strong> Signals from 9:25-10:25 AM IST (most important trading window)</p>
          <p><strong>Auto-refresh:</strong> Every 30 seconds during market hours (9:00 AM - 3:30 PM IST)</p>
        </div>
      </div>
    </div>
  );
} 