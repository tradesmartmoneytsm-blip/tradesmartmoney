'use client';

import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, RefreshCw, Clock, Activity, ChevronUp, ChevronDown, BarChart3 } from 'lucide-react';

interface IntradaySignal {
  id: string;
  symbol: string;
  m30_1: number;
  m30_2: number;
  m30_3: number;
  m60_1: number;
  scan_time: string;
  scan_date: string;
  rank_position: number;
}

interface IntradaySignalsResponse {
  success: boolean;
  data: IntradaySignal[];
  timestamp: string;
  error?: string;
}

type SortColumn = 'symbol' | 'm30_1' | 'm30_2' | 'm30_3' | 'm60_1' | 'rank_position';
type SortDirection = 'asc' | 'desc';

export default function IntradaySignals() {
  const [signals, setSignals] = useState<IntradaySignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<SortColumn>('m30_1');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Format large numbers
  const formatNumber = (num: number): string => {
    if (num >= 10000000) { // 1 crore
      return `${(num / 10000000).toFixed(1)}Cr`;
    } else if (num >= 100000) { // 1 lakh
      return `${(num / 100000).toFixed(1)}L`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return `${num.toFixed(0)}`;
  };

  // Get momentum indicator color based on value
  const getMomentumColor = (value: number): string => {
    if (value >= 1000000) return 'text-red-600 font-bold'; // Very High
    if (value >= 500000) return 'text-orange-600 font-semibold'; // High
    if (value >= 100000) return 'text-yellow-600 font-medium'; // Medium
    if (value >= 10000) return 'text-blue-600'; // Low
    return 'text-gray-500'; // Very Low
  };

  // Sort signals
  const sortSignals = useCallback((signals: IntradaySignal[], column: SortColumn, direction: SortDirection) => {
    return [...signals].sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      
      const aNum = Number(aValue) || 0;
      const bNum = Number(bValue) || 0;
      
      return direction === 'asc' ? aNum - bNum : bNum - aNum;
    });
  }, []);

  // Handle column sort
  const handleSort = (column: SortColumn) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  // Update sorted signals when signals, sort column, or direction changes
  useEffect(() => {
    setSignals(sortSignals(signals, sortColumn, sortDirection));
  }, [signals, sortColumn, sortDirection, sortSignals]);

  // Fetch signals from API
  const fetchSignals = useCallback(async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        limit: '50',
      });
      
      const response = await fetch(`/api/intraday-signals?${params}`);
      const data: IntradaySignalsResponse = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch signals');
      }
      
      if (data.success) {
        setSignals(data.data);
        setLastUpdated(data.timestamp);
      } else {
        throw new Error(data.error || 'Failed to load signals');
      }
      
    } catch (err) {
      console.error('Error fetching intraday signals:', err);
      // setError(err instanceof Error ? err.message : 'Unknown error occurred'); // This line was removed
    } finally {
      setLoading(false);
      // setIsRefreshing(false); // This line was removed
    }
  }, []); // Removed selectedSession from dependencies

  // Refresh signals
  const handleRefresh = useCallback(() => {
    // setIsRefreshing(true); // This line was removed
    fetchSignals();
  }, [fetchSignals]);

  // Initial load
  useEffect(() => {
    fetchSignals();
  }, [fetchSignals]);

  // Render sort icon
  const renderSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) {
      return <ChevronUp className="w-4 h-4 text-gray-400 opacity-50" />;
    }
    return sortDirection === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-blue-600" />
      : <ChevronDown className="w-4 h-4 text-blue-600" />;
  };

  // Render table header with sorting
  const renderTableHeader = (column: SortColumn, label: string, className: string = '') => (
    <th 
      className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 select-none ${className}`}
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        {renderSortIcon(column)}
      </div>
    </th>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Activity className="w-6 h-6 text-blue-600 mr-3" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Intraday Momentum Signals</h2>
              <p className="text-sm text-gray-600">Real-time buyer/seller momentum analysis</p>
            </div>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Updating...' : 'Refresh'}
          </button>
        </div>

        {/* Filter Controls - Removed session filtering */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          {/* Manual Refresh */}
          <button
            onClick={fetchSignals}
            disabled={loading}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          <div className="text-sm text-gray-600">
            <span className="font-medium text-green-600">
              ⬆ Highest values indicate high momentum activity
            </span>
          </div>
        </div>

        {/* Last Updated */}
        {lastUpdated && (
          <div className="flex items-center text-xs text-gray-500 mt-2">
            <Clock className="w-3 h-3 mr-1" />
            Last updated: {new Date(lastUpdated).toLocaleTimeString()}
          </div>
        )}

        {/* Momentum Note */}
        <div className="flex items-center text-sm text-blue-600 mt-2 p-2 bg-blue-50 rounded-lg">
          <BarChart3 className="w-4 h-4 mr-2" />
          <span className="font-medium">Note:</span>
          <span className="ml-1">Highest values indicate high momentum activity</span>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-4">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading signals...</span>
          </div>
        ) : // Removed error check
        signals.length === 0 ? (
          <div className="text-center py-12">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No signals available</p>
            <p className="text-gray-400">
              Signals are scanned between 9:25 AM - 10:25 AM IST
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {renderTableHeader('rank_position', '#', 'w-16')}
                  {renderTableHeader('symbol', 'Symbol', 'w-24')}
                  {renderTableHeader('m30_1', 'M30-1', 'w-24')}
                  {renderTableHeader('m30_2', 'M30-2', 'w-24')}
                  {renderTableHeader('m30_3', 'M30-3', 'w-24')}
                  {renderTableHeader('m60_1', 'M60-1', 'w-24')}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {signals.map((signal) => (
                  <tr key={signal.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {signal.rank_position}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-bold text-blue-600">{signal.symbol}</span>
                      </div>
                    </td>
                    <td className={`px-4 py-4 whitespace-nowrap text-sm ${getMomentumColor(signal.m30_1)}`}>
                      {formatNumber(signal.m30_1)}
                    </td>
                    <td className={`px-4 py-4 whitespace-nowrap text-sm ${getMomentumColor(signal.m30_2)}`}>
                      {formatNumber(signal.m30_2)}
                    </td>
                    <td className={`px-4 py-4 whitespace-nowrap text-sm ${getMomentumColor(signal.m30_3)}`}>
                      {formatNumber(signal.m30_3)}
                    </td>
                    <td className={`px-4 py-4 whitespace-nowrap text-sm ${getMomentumColor(signal.m60_1)}`}>
                      {formatNumber(signal.m60_1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 