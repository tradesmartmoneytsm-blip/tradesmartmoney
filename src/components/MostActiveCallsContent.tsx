'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Activity,
  AlertCircle,
  Clock,
  BarChart3
} from 'lucide-react';

interface MostActiveData {
  id: number;
  symbol: string;
  percentage_change: number;
  session_id: string;
  timestamp: string;
  created_at: string;
}

export function MostActiveCallsContent() {
  const [callsData, setCallsData] = useState<MostActiveData[]>([]);
  const [putsData, setPutsData] = useState<MostActiveData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'calls' | 'puts'>('calls');

  const fetchMostActiveData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch both calls and puts data
      const [callsResponse, putsResponse] = await Promise.all([
        fetch('/api/intraday-insights/most-active-calls?type=calls&limit=20'),
        fetch('/api/intraday-insights/most-active-calls?type=puts&limit=20')
      ]);
      
      const callsResult = await callsResponse.json();
      const putsResult = await putsResponse.json();
      
      if (callsResult.success && putsResult.success) {
        setCallsData(callsResult.data || []);
        setPutsData(putsResult.data || []);
        setLastUpdated(new Date().toLocaleString());
      } else {
        setError('Failed to fetch most active options data');
      }
    } catch {
      setError('Error loading most active options data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMostActiveData();
    
    // Auto-refresh every 5 minutes during market hours
    const interval = setInterval(() => {
      const now = new Date();
      const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
      const hours = istTime.getHours();
      const minutes = istTime.getMinutes();
      const isWeekday = istTime.getDay() >= 1 && istTime.getDay() <= 5;
      const isMarketHours = hours >= 9 && hours < 15 && (hours > 9 || minutes >= 20);
      
      if (isWeekday && isMarketHours) {
        console.log('🔄 Auto-refreshing Most Active Options data...');
        fetchMostActiveData();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchMostActiveData]);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getChangeColor = (change: number) => {
    if (change > 5) return 'text-green-700 bg-green-100 border-green-300';
    if (change > 0) return 'text-green-600 bg-green-50 border-green-200';
    if (change < -5) return 'text-red-700 bg-red-100 border-red-300';
    if (change < 0) return 'text-red-600 bg-red-50 border-red-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const currentData = activeTab === 'calls' ? callsData : putsData;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          📊 Most Active Options
        </h3>
        <p className="text-sm text-gray-600 mb-1">
          Most active stock calls and puts with highest trading activity
        </p>
        <p className="text-xs text-gray-500">
          Real-time Options Activity • Updated Every 5 Minutes • Algo starts running from 9:20 AM
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setActiveTab('calls')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'calls'
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            📈 Most Active Calls ({callsData.length})
          </button>
          <button
            onClick={() => setActiveTab('puts')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'puts'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            📉 Most Active Puts ({putsData.length})
          </button>
        </div>

        <div className="flex gap-2 items-center">
          <button
            onClick={fetchMostActiveData}
            disabled={loading}
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1 text-xs"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
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
          <p className="text-gray-600">Loading most active options...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-800">Error Loading Most Active Options</h3>
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
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-1 mb-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-800">Active Calls</span>
              </div>
              <div className="text-xl font-bold text-green-700">
                {callsData.length}
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center gap-1 mb-1">
                <TrendingDown className="w-4 h-4 text-red-600" />
                <span className="text-xs font-medium text-red-800">Active Puts</span>
              </div>
              <div className="text-xl font-bold text-red-700">
                {putsData.length}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-1 mb-1">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-blue-800">Total Active</span>
              </div>
              <div className="text-xl font-bold text-blue-700">
                {callsData.length + putsData.length}
              </div>
            </div>
          </div>

          {/* Data Display */}
          {currentData.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Activity className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-600 mb-1">No Active {activeTab === 'calls' ? 'Calls' : 'Puts'}</h3>
              <p className="text-sm text-gray-500">No most active {activeTab} data available at the moment</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Symbol</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-700">Change %</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-700">Type</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-700">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentData.map((item, index) => (
                      <tr key={item.id || `${item.symbol}-${index}`} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="font-bold text-gray-900">{item.symbol}</div>
                          <div className="text-xs text-gray-500">Session: {item.session_id.slice(-8)}</div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getChangeColor(item.percentage_change)}`}>
                            {item.percentage_change > 0 ? (
                              <TrendingUp className="w-3 h-3" />
                            ) : (
                              <TrendingDown className="w-3 h-3" />
                            )}
                            {item.percentage_change > 0 ? '+' : ''}{item.percentage_change.toFixed(2)}%
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className={`inline-flex px-2 py-1 rounded-md text-xs font-medium border ${
                            activeTab === 'calls' 
                              ? 'text-green-700 bg-green-100 border-green-300' 
                              : 'text-red-700 bg-red-100 border-red-300'
                          }`}>
                            {activeTab === 'calls' ? 'CALL' : 'PUT'}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center text-xs text-gray-500">
                          {formatTimestamp(item.timestamp)}
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
