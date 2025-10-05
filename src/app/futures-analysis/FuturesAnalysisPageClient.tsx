'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Filter, 
  RefreshCw, 
  BarChart3, 
  Target, 
  Shield,
  Clock,
  Activity,
  AlertTriangle,
  ArrowUpDown,
  Calendar,
  DollarSign
} from 'lucide-react';

interface FuturesAnalysisResult {
  id: number;
  symbol: string;
  analysis_timestamp: string;
  trading_date: string;
  current_month_expiry: string;
  current_price: number;
  current_open_interest: number;
  current_volume: number;
  current_change_in_oi: number;
  next_month_expiry: string;
  next_month_price: number;
  next_month_oi: number;
  spot_price: number;
  basis: number;
  basis_percentage: number;
  annualized_basis: number;
  oi_buildup_type: 'LONG_BUILDUP' | 'SHORT_BUILDUP' | 'LONG_UNWINDING' | 'SHORT_COVERING' | 'NEUTRAL';
  oi_strength: 'STRONG' | 'MODERATE' | 'WEAK';
  oi_change_percentage: number;
  days_to_expiry: number;
  rollover_pressure: 'HIGH' | 'MEDIUM' | 'LOW';
  rollover_cost: number;
  market_structure: 'CONTANGO' | 'BACKWARDATION' | 'NEUTRAL';
  signal_type: 'BULLISH' | 'BEARISH' | 'NEUTRAL' | 'ARBITRAGE';
  signal_strength: number;
  confidence: number;
  target_1: number;
  target_2: number;
  stop_loss: number;
  risk_reward_ratio: number;
  reasoning: string;
  key_levels: number[];
  volume_profile: any;
  institutional_activity: any;
}

type FilterType = 'ALL' | 'BULLISH' | 'BEARISH' | 'NEUTRAL' | 'ARBITRAGE';
type OIFilterType = 'ALL' | 'LONG_BUILDUP' | 'SHORT_BUILDUP' | 'LONG_UNWINDING' | 'SHORT_COVERING';
type SortType = 'STRENGTH_DESC' | 'STRENGTH_ASC' | 'SYMBOL' | 'EXPIRY' | 'BASIS';

export function FuturesAnalysisPageClient() {
  const [data, setData] = useState<FuturesAnalysisResult[]>([]);
  const [filteredData, setFilteredData] = useState<FuturesAnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [oiFilter, setOiFilter] = useState<OIFilterType>('ALL');
  const [sortBy, setSortBy] = useState<SortType>('STRENGTH_DESC');
  const [minStrength, setMinStrength] = useState<number>(20);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/futures-analysis?min_strength=${minStrength}&limit=100`);
      const result = await response.json();
      
      if (result.success) {
        const analysisData = result.data?.results || result.data || [];
        setData(Array.isArray(analysisData) ? analysisData : []);
        setLastUpdated(new Date().toLocaleString());
      } else {
        // Handle no data gracefully without throwing errors
        console.log('ℹ️ No futures analysis data available yet');
        setData([]);
        setError('No futures data available. Run the Python script to collect data.');
      }
    } catch (err) {
      console.log('ℹ️ Futures analysis data not available:', err);
      setData([]);
      setError('Futures analysis data not available. Please run the Python script to collect data.');
    } finally {
      setLoading(false);
    }
  }, [minStrength]);

  useEffect(() => {
    fetchData();
    
    // Auto-refresh every 5 minutes during market hours
    const interval = setInterval(() => {
      const now = new Date();
      const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
      const hours = istTime.getHours();
      const minutes = istTime.getMinutes();
      const isWeekday = istTime.getDay() >= 1 && istTime.getDay() <= 5;
      const isMarketHours = hours >= 9 && hours < 15 && (hours > 9 || minutes >= 15) && (hours < 15 || minutes <= 30);
      
      if (isWeekday && isMarketHours && autoRefreshEnabled) {
        console.log('🔄 Auto-refreshing Futures Analysis data...');
        fetchData();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchData, autoRefreshEnabled]);

  useEffect(() => {
    if (!Array.isArray(data)) {
      setFilteredData([]);
      return;
    }
    
    let filtered = [...data];
    
    // Apply signal type filter
    if (filter !== 'ALL') {
      filtered = filtered.filter(item => item.signal_type === filter);
    }
    
    // Apply OI buildup filter
    if (oiFilter !== 'ALL') {
      filtered = filtered.filter(item => item.oi_buildup_type === oiFilter);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'STRENGTH_DESC':
          return b.signal_strength - a.signal_strength;
        case 'STRENGTH_ASC':
          return a.signal_strength - b.signal_strength;
        case 'SYMBOL':
          return a.symbol.localeCompare(b.symbol);
        case 'EXPIRY':
          return a.days_to_expiry - b.days_to_expiry;
        case 'BASIS':
          return Math.abs(b.basis_percentage) - Math.abs(a.basis_percentage);
        default:
          return b.signal_strength - a.signal_strength;
      }
    });
    
    setFilteredData(filtered);
  }, [data, filter, oiFilter, sortBy]);

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'BULLISH':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'BEARISH':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'ARBITRAGE':
        return <ArrowUpDown className="w-4 h-4 text-purple-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'BULLISH':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'BEARISH':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'ARBITRAGE':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getOIBuildupColor = (buildup: string) => {
    switch (buildup) {
      case 'LONG_BUILDUP':
        return 'text-green-700 bg-green-100 border-green-300';
      case 'SHORT_BUILDUP':
        return 'text-red-700 bg-red-100 border-red-300';
      case 'LONG_UNWINDING':
        return 'text-orange-700 bg-orange-100 border-orange-300';
      case 'SHORT_COVERING':
        return 'text-blue-700 bg-blue-100 border-blue-300';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const getBasisColor = (basis: number) => {
    if (basis > 1) return 'text-red-600 font-semibold'; // High premium
    if (basis > 0) return 'text-orange-600'; // Premium
    if (basis < -1) return 'text-green-600 font-semibold'; // High discount
    return 'text-blue-600'; // Discount
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const signalOptions = [
    { value: 'ALL', label: 'All Signals', count: Array.isArray(data) ? data.length : 0 },
    { value: 'BULLISH', label: 'Bullish', count: Array.isArray(data) ? data.filter(d => d.signal_type === 'BULLISH').length : 0 },
    { value: 'BEARISH', label: 'Bearish', count: Array.isArray(data) ? data.filter(d => d.signal_type === 'BEARISH').length : 0 },
    { value: 'ARBITRAGE', label: 'Arbitrage', count: Array.isArray(data) ? data.filter(d => d.signal_type === 'ARBITRAGE').length : 0 },
    { value: 'NEUTRAL', label: 'Neutral', count: Array.isArray(data) ? data.filter(d => d.signal_type === 'NEUTRAL').length : 0 },
  ];

  const oiOptions = [
    { value: 'ALL', label: 'All OI Patterns', count: Array.isArray(data) ? data.length : 0 },
    { value: 'LONG_BUILDUP', label: 'Long Buildup', count: Array.isArray(data) ? data.filter(d => d.oi_buildup_type === 'LONG_BUILDUP').length : 0 },
    { value: 'SHORT_BUILDUP', label: 'Short Buildup', count: Array.isArray(data) ? data.filter(d => d.oi_buildup_type === 'SHORT_BUILDUP').length : 0 },
    { value: 'LONG_UNWINDING', label: 'Long Unwinding', count: Array.isArray(data) ? data.filter(d => d.oi_buildup_type === 'LONG_UNWINDING').length : 0 },
    { value: 'SHORT_COVERING', label: 'Short Covering', count: Array.isArray(data) ? data.filter(d => d.oi_buildup_type === 'SHORT_COVERING').length : 0 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📈 Futures Analysis
          </h1>
          <p className="text-lg text-gray-600 mb-1">
            Live Open Interest Buildup & Basis Analysis
          </p>
          <p className="text-xs text-gray-500">
            Enhanced with OI Patterns • Rollover Intelligence • Updated Every 5 Minutes
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* Signal Filters */}
            <div className="flex flex-wrap gap-2">
              {signalOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value as FilterType)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    filter === option.value
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label} ({option.count})
                </button>
              ))}
            </div>
          </div>

          {/* OI Pattern Filters */}
          <div className="flex flex-wrap gap-2 mt-3">
            {oiOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setOiFilter(option.value as OIFilterType)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  oiFilter === option.value
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label} ({option.count})
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex gap-2 items-center mt-3">
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  viewMode === 'cards' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  viewMode === 'table' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Table
              </button>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortType)}
              className="px-2 py-1 border border-gray-300 rounded-md text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="STRENGTH_DESC">Strength ↓</option>
              <option value="STRENGTH_ASC">Strength ↑</option>
              <option value="SYMBOL">A-Z</option>
              <option value="EXPIRY">Expiry</option>
              <option value="BASIS">Basis</option>
            </select>

            <input
              type="number"
              value={minStrength}
              onChange={(e) => setMinStrength(Number(e.target.value))}
              placeholder="Min"
              className="px-2 py-1 border border-gray-300 rounded-md text-xs w-16 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <button
              onClick={fetchData}
              disabled={loading}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1 text-xs"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {lastUpdated && (
            <div className="mt-3 flex items-center justify-between">
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Last updated: {lastUpdated}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Auto-refresh (5min):</span>
                <button
                  onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    autoRefreshEnabled 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}
                >
                  {autoRefreshEnabled ? '✅ ON' : '⏸️ OFF'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-4" />
            <p className="text-gray-600">Loading futures analysis...</p>
          </div>
        )}

        {/* No Data State */}
        {error && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-800">Futures Data Collection</h3>
                <p className="text-blue-600">{error}</p>
                <div className="mt-3 text-sm text-blue-700">
                  <p className="font-medium mb-2">To start collecting futures data:</p>
                  <code className="bg-blue-100 px-2 py-1 rounded text-xs">
                    python3 scripts/futures_analyzer.py
                  </code>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && !error && (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-1 mb-1">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-medium text-green-800">Bullish</span>
                </div>
                <div className="text-xl font-bold text-green-700">
                  {Array.isArray(data) ? data.filter(d => d.signal_type === 'BULLISH').length : 0}
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center gap-1 mb-1">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  <span className="text-xs font-medium text-red-800">Bearish</span>
                </div>
                <div className="text-xl font-bold text-red-700">
                  {Array.isArray(data) ? data.filter(d => d.signal_type === 'BEARISH').length : 0}
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <div className="flex items-center gap-1 mb-1">
                  <ArrowUpDown className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-medium text-purple-800">Arbitrage</span>
                </div>
                <div className="text-xl font-bold text-purple-700">
                  {Array.isArray(data) ? data.filter(d => d.signal_type === 'ARBITRAGE').length : 0}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-1 mb-1">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-medium text-blue-800">Total</span>
                </div>
                <div className="text-xl font-bold text-blue-700">
                  {Array.isArray(data) ? data.length : 0}
                </div>
              </div>
            </div>

            {/* Results Display */}
            {filteredData.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg shadow-md">
                <Filter className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-600 mb-1">No Results Found</h3>
                <p className="text-sm text-gray-500">Try adjusting your filters or minimum strength threshold</p>
              </div>
            ) : viewMode === 'table' ? (
              /* Table View */
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">Symbol</th>
                        <th className="px-4 py-3 text-center font-medium text-gray-700">Signal</th>
                        <th className="px-4 py-3 text-center font-medium text-gray-700">OI Pattern</th>
                        <th className="px-4 py-3 text-center font-medium text-gray-700">Basis</th>
                        <th className="px-4 py-3 text-center font-medium text-gray-700">Strength</th>
                        <th className="px-4 py-3 text-center font-medium text-gray-700">Expiry</th>
                        <th className="px-4 py-3 text-center font-medium text-gray-700">Target</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredData.map((item, index) => (
                        <tr key={item.id || `${item.symbol}-${index}`} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="font-bold text-gray-900">{item.symbol}</div>
                            <div className="text-xs text-gray-500">₹{item.current_price.toFixed(2)}</div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getSignalColor(item.signal_type)}`}>
                              {getSignalIcon(item.signal_type)}
                              {item.signal_type}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className={`inline-flex px-2 py-1 rounded-md text-xs font-medium border ${getOIBuildupColor(item.oi_buildup_type)}`}>
                              {item.oi_buildup_type.replace('_', ' ')}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className={`font-medium ${getBasisColor(item.basis)}`}>
                              {item.basis > 0 ? '+' : ''}{item.basis.toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {item.basis_percentage > 0 ? '+' : ''}{item.basis_percentage.toFixed(2)}%
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="font-bold text-blue-600">{item.signal_strength.toFixed(1)}</div>
                            <div className="text-xs text-gray-500">{item.confidence}%</div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="font-medium">{item.days_to_expiry}d</div>
                            <div className={`text-xs ${
                              item.rollover_pressure === 'HIGH' ? 'text-red-600' : 
                              item.rollover_pressure === 'MEDIUM' ? 'text-orange-600' : 'text-green-600'
                            }`}>
                              {item.rollover_pressure}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center font-medium text-green-600">₹{item.target_1.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* Card View */
              <div className="grid gap-4">
                {filteredData.map((item, index) => (
                  <div key={item.id || `${item.symbol}-${index}`} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold text-gray-900">{item.symbol}</h3>
                          <div className={`px-2 py-1 rounded-md text-xs font-medium border ${getSignalColor(item.signal_type)}`}>
                            <div className="flex items-center gap-1">
                              {getSignalIcon(item.signal_type)}
                              {item.signal_type}
                            </div>
                          </div>
                          <div className={`px-2 py-1 rounded-md text-xs font-medium border ${getOIBuildupColor(item.oi_buildup_type)}`}>
                            {item.oi_buildup_type.replace('_', ' ')}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">
                            {item.signal_strength.toFixed(1)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.confidence}% Confidence
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-gray-600 mb-2">
                        {item.reasoning}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(item.analysis_timestamp)}
                        </span>
                        <span>Futures: ₹{item.current_price.toFixed(2)}</span>
                        <span>Spot: ₹{item.spot_price.toFixed(2)}</span>
                        <span className={`font-medium ${getBasisColor(item.basis)}`}>
                          Basis: {item.basis > 0 ? '+' : ''}{item.basis.toFixed(2)}
                        </span>
                        <span>{item.days_to_expiry}d to expiry</span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-4">
                      <div className="grid md:grid-cols-4 gap-4">
                        {/* OI Analysis */}
                        <div className="bg-gray-50 rounded-lg p-3">
                          <h4 className="font-medium text-gray-800 mb-2 text-sm flex items-center gap-1">
                            <Activity className="w-3 h-3" />
                            OI Analysis
                          </h4>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span>Current OI:</span>
                              <span className="font-medium">{(item.current_open_interest / 100000).toFixed(1)}L</span>
                            </div>
                            <div className="flex justify-between">
                              <span>OI Change:</span>
                              <span className={`font-medium ${item.current_change_in_oi > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {item.current_change_in_oi > 0 ? '+' : ''}{(item.current_change_in_oi / 100000).toFixed(1)}L
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Volume:</span>
                              <span className="font-medium">{(item.current_volume / 100000).toFixed(1)}L</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Strength:</span>
                              <span className={`font-medium ${
                                item.oi_strength === 'STRONG' ? 'text-green-600' : 
                                item.oi_strength === 'MODERATE' ? 'text-orange-600' : 'text-gray-600'
                              }`}>
                                {item.oi_strength}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Basis Analysis */}
                        <div className="bg-gray-50 rounded-lg p-3">
                          <h4 className="font-medium text-gray-800 mb-2 text-sm flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            Basis Analysis
                          </h4>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span>Basis:</span>
                              <span className={`font-medium ${getBasisColor(item.basis)}`}>
                                {item.basis > 0 ? '+' : ''}{item.basis.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Basis %:</span>
                              <span className={`font-medium ${getBasisColor(item.basis)}`}>
                                {item.basis_percentage > 0 ? '+' : ''}{item.basis_percentage.toFixed(2)}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Annualized:</span>
                              <span className={`font-medium ${getBasisColor(item.annualized_basis)}`}>
                                {item.annualized_basis > 0 ? '+' : ''}{item.annualized_basis.toFixed(1)}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Structure:</span>
                              <span className={`font-medium ${
                                item.market_structure === 'CONTANGO' ? 'text-red-600' : 
                                item.market_structure === 'BACKWARDATION' ? 'text-green-600' : 'text-gray-600'
                              }`}>
                                {item.market_structure}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Risk-Reward */}
                        <div className="bg-gray-50 rounded-lg p-3">
                          <h4 className="font-medium text-gray-800 mb-2 text-sm flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            Risk-Reward
                          </h4>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span>Entry:</span>
                              <span className="font-medium">₹{item.current_price.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Target:</span>
                              <span className="font-medium text-green-600">₹{item.target_1.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Stop:</span>
                              <span className="font-medium text-red-600">₹{item.stop_loss.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>R:R:</span>
                              <span className="font-medium">{item.risk_reward_ratio.toFixed(1)}:1</span>
                            </div>
                          </div>
                        </div>

                        {/* Rollover Info */}
                        <div className="bg-gray-50 rounded-lg p-3">
                          <h4 className="font-medium text-gray-800 mb-2 text-sm flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Rollover
                          </h4>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span>Days Left:</span>
                              <span className={`font-medium ${
                                item.days_to_expiry <= 3 ? 'text-red-600' : 
                                item.days_to_expiry <= 7 ? 'text-orange-600' : 'text-green-600'
                              }`}>
                                {item.days_to_expiry}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Pressure:</span>
                              <span className={`font-medium ${
                                item.rollover_pressure === 'HIGH' ? 'text-red-600' : 
                                item.rollover_pressure === 'MEDIUM' ? 'text-orange-600' : 'text-green-600'
                              }`}>
                                {item.rollover_pressure}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Cost:</span>
                              <span className="font-medium">₹{item.rollover_cost.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Next Month:</span>
                              <span className="font-medium">₹{item.next_month_price.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>
            🤖 Enhanced Futures Algorithm • 📊 NSE API • ⚠️ Educational Only
          </p>
        </div>
      </div>
    </div>
  );
}
