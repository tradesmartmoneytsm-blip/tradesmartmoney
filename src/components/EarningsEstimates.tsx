'use client';

import { useEffect, useState, useCallback } from 'react';
import { Clock, Filter, BarChart3, Target, ChevronDown, RefreshCw } from 'lucide-react';

// Interfaces
interface EarningsEstimate {
  id: string;
  companyName: string;
  symbol: string;
  sector: string;
  quarter: string;
  reportDate: string;
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  marketCap: number;
  
  actualRevenue: number;
  estimatedRevenue: number;
  actualNetProfit: number;
  estimatedNetProfit: number;
  actualEPS: number;
  estimatedEPS: number;
  
  revenueVariance: number;
  profitVariance: number;
  epsVariance: number;
  overallPerformance: 'Beat' | 'Missed' | 'Met';
  performancePercent: number;
  resultType: 'Consolidated' | 'Standalone';
}

interface FilterOptions {
  sector?: string;
  performance?: 'all' | 'beat' | 'missed' | 'met';
  sortBy?: 'date' | 'performance' | 'marketCap' | 'variance';
}

interface EarningsResponse {
  success: boolean;
  data: EarningsEstimate[];
  filters: {
    sectors: string[];
    appliedFilters: FilterOptions;
  };
  summary: {
    total: number;
    beat: number;
    missed: number;
    met: number;
  };
  lastUpdated: string;
}

export function EarningsEstimates() {
  const [earningsData, setEarningsData] = useState<EarningsEstimate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [sectors, setSectors] = useState<string[]>([]);
  const [summary, setSummary] = useState({ total: 0, beat: 0, missed: 0, met: 0 });
  const [lastUpdated, setLastUpdated] = useState<string>('');
  
  // Filter state
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedPerformance, setSelectedPerformance] = useState<'all' | 'beat' | 'missed' | 'met'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'performance' | 'marketCap' | 'variance'>('date');
  
  // UI state
  const [showFilters, setShowFilters] = useState(false);

  const fetchEarningsData = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const params = new URLSearchParams();
      if (selectedSector !== 'all') params.append('sector', selectedSector);
      if (selectedPerformance !== 'all') params.append('performance', selectedPerformance);
      params.append('sortBy', sortBy);

      const response = await fetch(`/api/earnings-estimates?${params.toString()}`);
      const result: EarningsResponse = await response.json();

      if (result.success) {
        setEarningsData(result.data);
        setSectors(result.filters.sectors);
        setSummary(result.summary);
        setLastUpdated(new Date(result.lastUpdated).toLocaleString());
      } else {
        setError('Failed to load earnings estimates');
      }
    } catch (err) {
      console.error('Error fetching earnings estimates:', err);
      setError('Failed to load earnings estimates');
    } finally {
      setLoading(false);
    }
  }, [selectedSector, selectedPerformance, sortBy]);

  useEffect(() => {
    fetchEarningsData();
  }, [fetchEarningsData]);

  const formatCurrency = (amount: number): string => {
    if (amount >= 10000) return `₹${(amount / 10000).toFixed(1)}L Cr`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K Cr`;
    return `₹${amount.toFixed(0)} Cr`;
  };

  const formatPrice = (price: number): string => {
    return `₹${price.toFixed(2)}`;
  };

  const formatPercentage = (percent: number): string => {
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent.toFixed(2)}%`;
  };

  const getPerformanceColor = (performance: string): string => {
    switch (performance) {
      case 'Beat': return 'text-green-600 bg-green-50';
      case 'Missed': return 'text-red-600 bg-red-50';
      case 'Met': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getVarianceColor = (variance: number): string => {
    if (variance > 0) return 'text-green-600';
    if (variance < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {/* Loading header */}
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
        </div>
        
        {/* Loading cards */}
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="animate-pulse border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-48"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <Target className="h-6 w-6 text-purple-600 mr-2" />
            Earnings Estimates vs Actuals
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            Compare actual quarterly results with analyst estimates • Last updated: {lastUpdated}
          </p>
        </div>
        
        <button 
          onClick={fetchEarningsData}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span className="text-sm font-medium">Refresh</span>
        </button>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{summary.total}</div>
          <div className="text-sm text-gray-600">Total Results</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{summary.beat}</div>
          <div className="text-sm text-gray-600">Beat Estimates</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{summary.missed}</div>
          <div className="text-sm text-gray-600">Missed Estimates</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{summary.met}</div>
          <div className="text-sm text-gray-600">Met Estimates</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 mb-4"
        >
          <Filter className="h-4 w-4" />
          <span className="font-medium">Filters</span>
          <ChevronDown className={`h-4 w-4 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
        
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Sector Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sector</label>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Sectors</option>
                {sectors.map(sector => (
                  <option key={sector} value={sector}>{sector}</option>
                ))}
              </select>
            </div>

            {/* Performance Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Performance</label>
              <select
                value={selectedPerformance}
                onChange={(e) => setSelectedPerformance(e.target.value as 'all' | 'beat' | 'missed' | 'met')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Results</option>
                <option value="beat">Beat Expectations</option>
                <option value="missed">Missed Expectations</option>
                <option value="met">Met Expectations</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'performance' | 'marketCap' | 'variance')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="date">Report Date</option>
                <option value="performance">Performance %</option>
                <option value="marketCap">Market Cap</option>
                <option value="variance">Variance %</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Earnings Data */}
      <div className="space-y-4">
        {earningsData.map((earnings) => (
          <div key={earnings.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            {/* Company Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                    {earnings.symbol}
                    <span className="ml-2 text-sm text-gray-600">({earnings.companyName})</span>
                  </h4>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {earnings.sector}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                      {earnings.quarter}
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                      {earnings.resultType}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">
                  {formatPrice(earnings.currentPrice)}
                </div>
                <div className={`text-sm ${earnings.priceChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {earnings.priceChangePercent >= 0 ? '+' : ''}{earnings.priceChange.toFixed(2)} ({formatPercentage(earnings.priceChangePercent)})
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  MCap: {formatCurrency(earnings.marketCap)}
                </div>
              </div>
            </div>

            {/* Financial Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Revenue */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-2">Revenue (₹ Cr.)</div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Actual:</span>
                    <span className="font-semibold">{formatCurrency(earnings.actualRevenue)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Estimates:</span>
                    <span className="text-gray-700">{formatCurrency(earnings.estimatedRevenue)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className={`text-sm font-medium ${getVarianceColor(earnings.revenueVariance)}`}>
                      Variance: {formatPercentage(earnings.revenueVariance)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Profit */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-2">Net Profit (₹ Cr.)</div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Actual:</span>
                    <span className="font-semibold">{formatCurrency(earnings.actualNetProfit)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Estimates:</span>
                    <span className="text-gray-700">{formatCurrency(earnings.estimatedNetProfit)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className={`text-sm font-medium ${getVarianceColor(earnings.profitVariance)}`}>
                      Variance: {formatPercentage(earnings.profitVariance)}
                    </div>
                  </div>
                </div>
              </div>

              {/* EPS */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-2">EPS (₹)</div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Actual:</span>
                    <span className="font-semibold">₹{earnings.actualEPS.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Estimates:</span>
                    <span className="text-gray-700">₹{earnings.estimatedEPS.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className={`text-sm font-medium ${getVarianceColor(earnings.epsVariance)}`}>
                      Variance: {formatPercentage(earnings.epsVariance)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Overall Performance */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Reported on {new Date(earnings.reportDate).toLocaleDateString('en-IN', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPerformanceColor(earnings.overallPerformance)}`}>
                  {earnings.overallPerformance} Expectations: {formatPercentage(earnings.performancePercent)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!loading && earningsData.length === 0 && (
        <div className="text-center py-12">
          <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No earnings data found</h3>
          <p className="text-gray-500">
            No earnings results match your current filters. Try adjusting your selection.
          </p>
        </div>
      )}
    </div>
  );
} 