'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Filter, 
  RefreshCw, 
  BarChart3, 
  Clock,
  Activity,
  AlertTriangle
} from 'lucide-react';

interface OptionAnalysisResult {
  id: number;
  symbol: string;
  analysis_timestamp: string;
  trading_date: string;
  score: number;
  institutional_sentiment: 'STRONGLY_BULLISH' | 'BULLISH' | 'NEUTRAL' | 'BEARISH' | 'STRONGLY_BEARISH';
  reasoning: string;
  confidence: number;
  current_price: number;
  overall_pcr: number;
  max_pain: number;
  support_levels: number[];
  resistance_levels: number[];
  unusual_activity: string[];
  strength_signals: string[];
  net_call_buildup: number;
  net_put_buildup: number;
  target_1: number;
  target_2: number;
  stop_loss: number;
  risk_reward_ratio: number;
  institutional_bullish_flow: number;
  institutional_bearish_flow: number;
  net_institutional_flow: number;
  detailed_analysis: string[];
  
  // NEW HUMAN-LIKE ALGORITHM FIELDS
  human_bias?: string;
  human_confidence?: number;
  current_zone?: string;
  zone_bias?: string;
  nearest_resistance?: {
    level: number;
    strength: number;
    type: string;
  } | null;
  nearest_support?: {
    level: number;
    strength: number;
    type: string;
  } | null;
  resistance_distance_pct?: number;
  support_distance_pct?: number;
  risk_reward_ratio_new?: number;
  institutional_activities?: {
    type: string;
    strike: number;
    sentiment: string;
    strength: number;
    explanation: string;
  }[];
  hedging_ratio?: number;
  speculation_ratio?: number;
  enhanced_resistance_levels?: {
    level: number;
    strength: number;
    type: string;
    oi: number;
    oi_change: number;
    volume: number;
  }[];
  enhanced_support_levels?: {
    level: number;
    strength: number;
    type: string;
    oi: number;
    oi_change: number;
    volume: number;
  }[];
}

type FilterType = 'ALL' | 'STRONGLY_BULLISH' | 'BULLISH' | 'NEUTRAL' | 'BEARISH' | 'STRONGLY_BEARISH';
type SortType = 'SCORE_DESC' | 'SCORE_ASC' | 'SYMBOL' | 'TIMESTAMP';

export function OptionAnalysisContent() {
  const [data, setData] = useState<OptionAnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [sortBy, setSortBy] = useState<SortType>('SCORE_DESC');
  const [minScore, setMinScore] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState<boolean>(true);
  const [selectedStock, setSelectedStock] = useState<OptionAnalysisResult | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/option-analysis?min_score=${minScore}&limit=500`);
      const result = await response.json();
      
      if (result.success) {
        // Handle nested data structure - API returns data.results array
        const analysisData = result.data?.results || result.data || [];
        setData(Array.isArray(analysisData) ? analysisData : []);
        setLastUpdated(new Date().toLocaleString());
      } else {
        // Handle no data gracefully without throwing errors
        setData([]);
        setError('No option data available. Run the Python script to collect data.');
      }
    } catch {
      setData([]);
      setError('Option analysis data not available. Please run the Python script to collect data.');
    } finally {
      setLoading(false);
    }
  }, [minScore]);

  useEffect(() => {
    fetchData();
    
    // Auto-refresh every 5 minutes (300,000 ms) during market hours
    const interval = setInterval(() => {
      const now = new Date();
      const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000)); // Convert to IST
      const hours = istTime.getHours();
      const minutes = istTime.getMinutes();
      const isWeekday = istTime.getDay() >= 1 && istTime.getDay() <= 5; // Monday to Friday
      const isMarketHours = hours >= 9 && hours < 15 && (hours > 9 || minutes >= 15) && (hours < 15 || minutes <= 30);
      
      if (isWeekday && isMarketHours && autoRefreshEnabled && !showDetailModal) {
        fetchData();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [fetchData, autoRefreshEnabled, showDetailModal]);

  // Optimize filtering and sorting with useMemo
  const filteredData = useMemo(() => {
    // Ensure data is an array before processing
    if (!Array.isArray(data)) {
      return [];
    }
    
    let filtered = [...data];
    
    // Apply sentiment filter
    if (filter !== 'ALL') {
      filtered = filtered.filter(item => item.institutional_sentiment === filter);
    }
    
    // Apply sorting with special handling for bearish stocks
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'SCORE_DESC':
          // For bearish filters, show most negative scores first
          if (filter === 'BEARISH' || filter === 'STRONGLY_BEARISH') {
            return a.score - b.score; // Ascending for bearish (most negative first)
          }
          return b.score - a.score; // Descending for bullish (highest first)
        case 'SCORE_ASC':
          // For bearish filters, show least negative scores first  
          if (filter === 'BEARISH' || filter === 'STRONGLY_BEARISH') {
            return b.score - a.score; // Descending for bearish (least negative first)
          }
          return a.score - b.score; // Ascending for bullish (lowest first)
        case 'SYMBOL':
          return a.symbol.localeCompare(b.symbol);
        case 'TIMESTAMP':
          return new Date(b.analysis_timestamp).getTime() - new Date(a.analysis_timestamp).getTime();
        default:
          // Default: For bearish filters, show most negative first
          if (filter === 'BEARISH' || filter === 'STRONGLY_BEARISH') {
            return a.score - b.score; // Most negative first
          }
          return b.score - a.score; // Highest first for bullish
      }
    });
    
    return filtered;
  }, [data, filter, sortBy]);

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'STRONGLY_BULLISH':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'BULLISH':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'NEUTRAL':
        return <Minus className="w-5 h-5 text-gray-500" />;
      case 'BEARISH':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      case 'STRONGLY_BEARISH':
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      default:
        return <Minus className="w-5 h-5 text-gray-400" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'STRONGLY_BULLISH':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'BULLISH':
        return 'text-green-500 bg-green-50 border-green-200';
      case 'NEUTRAL':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'BEARISH':
        return 'text-red-500 bg-red-50 border-red-200';
      case 'STRONGLY_BEARISH':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 200) return 'text-green-700 font-bold';
    if (score >= 100) return 'text-green-600 font-semibold';
    if (score >= 50) return 'text-green-500';
    if (score >= 0) return 'text-gray-600';
    if (score >= -50) return 'text-red-500';
    if (score >= -100) return 'text-red-600 font-semibold';
    return 'text-red-700 font-bold';
  };

  const showDetailedAnalysis = (stock: OptionAnalysisResult) => {
    // Prevent multiple rapid clicks
    if (showDetailModal) return;
    
    setSelectedStock(stock);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedStock(null);
  };


  const filterOptions = useMemo(() => [
    { value: 'ALL', label: 'All Signals', count: Array.isArray(data) ? data.length : 0 },
    { value: 'STRONGLY_BULLISH', label: 'Strongly Bullish', count: Array.isArray(data) ? data.filter(d => d.institutional_sentiment === 'STRONGLY_BULLISH').length : 0 },
    { value: 'BULLISH', label: 'Bullish', count: Array.isArray(data) ? data.filter(d => d.institutional_sentiment === 'BULLISH').length : 0 },
    { value: 'NEUTRAL', label: 'Neutral', count: Array.isArray(data) ? data.filter(d => d.institutional_sentiment === 'NEUTRAL').length : 0 },
    { value: 'BEARISH', label: 'Bearish', count: Array.isArray(data) ? data.filter(d => d.institutional_sentiment === 'BEARISH').length : 0 },
    { value: 'STRONGLY_BEARISH', label: 'Strongly Bearish', count: Array.isArray(data) ? data.filter(d => d.institutional_sentiment === 'STRONGLY_BEARISH').length : 0 },
  ], [data]);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      {/* Compact Header */}
      <div className="mb-6">
        <h3 className="text-h3 mb-3">
          <span className="text-gradient">🎯 Option Chain Analysis</span>
        </h3>
        <p className="text-body mb-2">
          Live Institutional Flow & Smart Money Analysis
        </p>
        <p className="text-caption text-muted">
          Enhanced with Indian Market Intelligence • Updated Every 5 Minutes • Algo starts running from 9:20 AM
        </p>
      </div>

      {/* Compact Controls */}
      <div className="bg-gray-50 rounded-lg compact-padding mb-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value as FilterType)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filter === option.value
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {option.label} ({option.count})
              </button>
            ))}
          </div>

          {/* Sort & Controls */}
          <div className="flex gap-2 items-center">
            <div className="flex gap-1 bg-white rounded-lg p-1 border border-gray-200">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                  viewMode === 'cards' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                  viewMode === 'table' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-800'
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
              <option value="SCORE_DESC">Score ↓</option>
              <option value="SCORE_ASC">Score ↑</option>
              <option value="SYMBOL">A-Z</option>
              <option value="TIMESTAMP">Latest</option>
            </select>

            <input
              type="number"
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
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
          <p className="text-gray-600">Loading option chain analysis...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-800">Error Loading Data</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {!loading && !error && (
        <>
          {/* Compact Summary Stats */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-1 mb-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-800">Bullish</span>
              </div>
              <div className="text-xl font-bold text-green-700">
                {Array.isArray(data) ? data.filter(d => d.institutional_sentiment === 'STRONGLY_BULLISH' || d.institutional_sentiment === 'BULLISH').length : 0}
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center gap-1 mb-1">
                <TrendingDown className="w-4 h-4 text-red-600" />
                <span className="text-xs font-medium text-red-800">Bearish</span>
              </div>
              <div className="text-xl font-bold text-red-700">
                {Array.isArray(data) ? data.filter(d => d.institutional_sentiment === 'STRONGLY_BEARISH' || d.institutional_sentiment === 'BEARISH').length : 0}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-1 mb-1">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-blue-800">Avg Score</span>
              </div>
              <div className="text-xl font-bold text-blue-700">
                {Array.isArray(data) && data.length > 0 ? Math.round(data.reduce((sum, d) => sum + d.score, 0) / data.length) : 0}
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <div className="flex items-center gap-1 mb-1">
                <Activity className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-medium text-purple-800">Total</span>
              </div>
              <div className="text-xl font-bold text-purple-700">
                {Array.isArray(data) ? data.length : 0}
              </div>
            </div>
          </div>

          {/* Results Display */}
          {filteredData.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Filter className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-600 mb-1">No Results Found</h3>
              <p className="text-sm text-gray-500">Try adjusting your filters or minimum score threshold</p>
            </div>
          ) : viewMode === 'table' ? (
            /* Compact Table View */
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Symbol</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-700">Score</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-700">Sentiment</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-700">PCR</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-700">Entry</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-700">Target</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-700">Stop</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-700">Signals</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredData.map((item, index) => (
                      <tr 
                        key={item.id || `${item.symbol}-${index}`} 
                        className="hover:bg-blue-50 cursor-pointer transition-colors"
                        onClick={() => showDetailedAnalysis(item)}
                      >
                        <td className="px-4 py-3">
                          <div className="font-bold text-gray-900">{item.symbol}</div>
                          <div className="text-xs text-gray-500">₹{item.current_price.toFixed(2)}</div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className={`font-bold ${getScoreColor(item.score)}`}>
                            {item.score.toFixed(1)}
                          </div>
                          <div className="text-xs text-gray-500">{item.confidence}%</div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getSentimentColor(item.institutional_sentiment)}`}>
                            {getSentimentIcon(item.institutional_sentiment)}
                            {item.institutional_sentiment.replace('_', ' ').replace('STRONGLY ', '').replace('VERY ', '')}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className={`font-medium ${item.overall_pcr > 1.5 ? 'text-red-600' : item.overall_pcr < 0.8 ? 'text-green-600' : 'text-gray-600'}`}>
                            {item.overall_pcr.toFixed(3)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.overall_pcr < 1.0 ? 'Bullish' : 'Bearish'}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center font-medium">₹{item.current_price.toFixed(2)}</td>
                        <td className="px-4 py-3 text-center font-medium text-green-600">₹{item.target_1.toFixed(2)}</td>
                        <td className="px-4 py-3 text-center font-medium text-red-600">₹{item.stop_loss.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {item.strength_signals.slice(0, 2).map((signal, idx) => (
                              <span
                                key={`signal-${item.symbol}-${idx}`}
                                className={`px-1 py-0.5 rounded text-xs ${
                                  signal.includes('BULLISH') 
                                    ? 'bg-green-100 text-green-700'
                                    : signal.includes('BEARISH')
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {signal.replace(/_/g, ' ').replace('VERY ', '').replace('STRONG ', '').replace('INSTITUTIONAL ', '')}
                              </span>
                            ))}
                          </div>
                        </td>
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
                <div 
                  key={item.id || `${item.symbol}-${index}`} 
                  className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all cursor-pointer hover:border-blue-300"
                  onClick={() => showDetailedAnalysis(item)}
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <h4 className="text-xl font-bold text-gray-900">{item.symbol}</h4>
                        <div className={`px-3 py-1 rounded-lg text-sm font-medium border ${getSentimentColor(item.institutional_sentiment)}`}>
                          <div className="flex items-center gap-1">
                            {getSentimentIcon(item.institutional_sentiment)}
                            {item.institutional_sentiment.replace('_', ' ')}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getScoreColor(item.score)}`}>
                          {item.score.toFixed(1)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.confidence}% Confidence
                        </div>
                      </div>
                    </div>

                    {/* Zone Analysis (NEW) */}
                    {item.current_zone && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-sm font-medium text-blue-800 mb-1">
                          🎯 Position Analysis
                        </div>
                        <div className="text-sm text-blue-700">
                          Zone: <span className="font-medium">{item.current_zone}</span>
                          {item.resistance_distance_pct && item.resistance_distance_pct < 5 && (
                            <span className="ml-2 text-red-600">
                              ⚠️ {item.resistance_distance_pct.toFixed(1)}% from resistance
                            </span>
                          )}
                          {item.support_distance_pct && item.support_distance_pct < 5 && (
                            <span className="ml-2 text-green-600">
                              🎯 {item.support_distance_pct.toFixed(1)}% from support
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Reasoning */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-800 mb-2">
                        🧠 Analysis Reasoning
                      </div>
                      <div className="text-sm text-gray-700 leading-relaxed">
                        {item.reasoning}
                      </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">Current Price</div>
                        <div className="font-bold text-gray-900">₹{item.current_price.toFixed(2)}</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">Target</div>
                        <div className="font-bold text-green-600">₹{item.target_1.toFixed(2)}</div>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">Stop Loss</div>
                        <div className="font-bold text-red-600">₹{item.stop_loss.toFixed(2)}</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">PCR</div>
                        <div className={`font-bold ${item.overall_pcr > 1.5 ? 'text-red-600' : item.overall_pcr < 0.8 ? 'text-green-600' : 'text-gray-600'}`}>
                          {item.overall_pcr.toFixed(3)}
                        </div>
                      </div>
                    </div>

                    {/* Institutional Flow */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="text-center p-2 bg-green-50 rounded">
                        <div className="text-xs text-gray-500">Bullish Flow</div>
                        <div className="font-medium text-green-600">+{item.institutional_bullish_flow.toFixed(1)}</div>
                      </div>
                      <div className="text-center p-2 bg-red-50 rounded">
                        <div className="text-xs text-gray-500">Bearish Flow</div>
                        <div className="font-medium text-red-600">-{item.institutional_bearish_flow.toFixed(1)}</div>
                      </div>
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <div className="text-xs text-gray-500">Net Flow</div>
                        <div className={`font-medium ${item.net_institutional_flow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {item.net_institutional_flow > 0 ? '+' : ''}{item.net_institutional_flow.toFixed(1)}
                        </div>
                      </div>
                    </div>

                    {/* Strength Signals */}
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">Key Signals</div>
                      <div className="flex flex-wrap gap-2">
                        {item.strength_signals.slice(0, 4).map((signal, idx) => (
                          <span
                            key={`signal-${item.symbol}-${idx}`}
                            className={`px-2 py-1 rounded-md text-xs font-medium ${
                              signal.includes('BULLISH') 
                                ? 'bg-green-100 text-green-700 border border-green-200'
                                : signal.includes('BEARISH')
                                ? 'bg-red-100 text-red-700 border border-red-200'
                                : 'bg-gray-100 text-gray-700 border border-gray-200'
                            }`}
                          >
                            {signal.replace(/_/g, ' ').replace('VERY ', '').replace('STRONG ', '').replace('INSTITUTIONAL ', '')}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Click to view more */}
                    <div className="text-center pt-3 border-t border-gray-200">
                      <span className="text-sm text-blue-600 font-medium">
                        Click for detailed analysis →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Detailed Analysis Modal */}
      {showDetailModal && selectedStock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedStock.symbol}</h2>
                  <div className={`px-3 py-1 rounded-lg text-sm font-medium border ${getSentimentColor(selectedStock.institutional_sentiment)}`}>
                    <div className="flex items-center gap-1">
                      {getSentimentIcon(selectedStock.institutional_sentiment)}
                      {selectedStock.institutional_sentiment.replace('_', ' ')}
                    </div>
                  </div>
                  <div className={`text-xl font-bold ${getScoreColor(selectedStock.score)}`}>
                    {selectedStock.score.toFixed(1)}
                  </div>
                </div>
                <button
                  onClick={closeDetailModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Human-Like Analysis Section */}
              {selectedStock.current_zone && (
                <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">🧠 Human-Like Analysis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-blue-700 mb-2">
                        <span className="font-medium">Current Zone:</span> {selectedStock.current_zone}
                      </div>
                      <div className="text-sm text-blue-700 mb-2">
                        <span className="font-medium">Zone Bias:</span> {selectedStock.zone_bias || 'N/A'}
                      </div>
                      {selectedStock.resistance_distance_pct !== undefined && (
                        <div className="text-sm text-blue-700 mb-2">
                          <span className="font-medium">Distance to Resistance:</span> {selectedStock.resistance_distance_pct.toFixed(1)}%
                        </div>
                      )}
                    </div>
                    <div>
                      {selectedStock.support_distance_pct !== undefined && (
                        <div className="text-sm text-blue-700 mb-2">
                          <span className="font-medium">Distance to Support:</span> {selectedStock.support_distance_pct.toFixed(1)}%
                        </div>
                      )}
                      {selectedStock.hedging_ratio !== undefined && (
                        <div className="text-sm text-blue-700 mb-2">
                          <span className="font-medium">Hedging Ratio:</span> {(selectedStock.hedging_ratio * 100).toFixed(1)}%
                        </div>
                      )}
                      {selectedStock.speculation_ratio !== undefined && (
                        <div className="text-sm text-blue-700 mb-2">
                          <span className="font-medium">Speculation Ratio:</span> {(selectedStock.speculation_ratio * 100).toFixed(1)}%
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Reasoning */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">📝 Analysis Reasoning</h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {selectedStock.reasoning}
                </div>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-xl text-center">
                  <div className="text-sm text-gray-500 mb-1">Current Price</div>
                  <div className="text-xl font-bold text-gray-900">₹{selectedStock.current_price.toFixed(2)}</div>
                </div>
                <div className="p-4 bg-green-50 rounded-xl text-center">
                  <div className="text-sm text-gray-500 mb-1">Target 1</div>
                  <div className="text-xl font-bold text-green-600">₹{selectedStock.target_1.toFixed(2)}</div>
                </div>
                <div className="p-4 bg-green-50 rounded-xl text-center">
                  <div className="text-sm text-gray-500 mb-1">Target 2</div>
                  <div className="text-xl font-bold text-green-600">₹{selectedStock.target_2.toFixed(2)}</div>
                </div>
                <div className="p-4 bg-red-50 rounded-xl text-center">
                  <div className="text-sm text-gray-500 mb-1">Stop Loss</div>
                  <div className="text-xl font-bold text-red-600">₹{selectedStock.stop_loss.toFixed(2)}</div>
                </div>
              </div>

              {/* Enhanced Support & Resistance Levels */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="p-4 bg-red-50 rounded-xl">
                  <h4 className="text-lg font-semibold text-red-900 mb-3">🚧 Resistance Levels</h4>
                  <div className="space-y-3">
                    {/* Enhanced resistance levels first */}
                    {selectedStock.enhanced_resistance_levels && selectedStock.enhanced_resistance_levels.slice(0, 3).map((resistance, idx) => (
                      <div key={`enhanced-resistance-${idx}`} className="bg-red-100 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-red-700 font-medium">₹{resistance.level.toFixed(2)}</span>
                          <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded">
                            Strength: {resistance.strength.toFixed(1)}
                          </span>
                        </div>
                        <div className="text-xs text-red-600">
                          {resistance.type.replace(/_/g, ' ')} • OI: {resistance.oi.toLocaleString()} • Vol: {resistance.volume.toLocaleString()}
                        </div>
                      </div>
                    ))}
                    {/* Fallback to basic resistance levels if enhanced not available */}
                    {(!selectedStock.enhanced_resistance_levels || selectedStock.enhanced_resistance_levels.length === 0) && 
                     selectedStock.resistance_levels && selectedStock.resistance_levels.slice(0, 3).map((level, idx) => (
                      <div key={`basic-resistance-${idx}`} className="flex justify-between items-center">
                        <span className="text-red-700">Level {idx + 1}:</span>
                        <span className="font-bold text-red-800">₹{typeof level === 'number' ? level.toFixed(2) : level}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-xl">
                  <h4 className="text-lg font-semibold text-green-900 mb-3">🎯 Support Levels</h4>
                  <div className="space-y-3">
                    {/* Enhanced support levels first */}
                    {selectedStock.enhanced_support_levels && selectedStock.enhanced_support_levels.slice(0, 3).map((support, idx) => (
                      <div key={`enhanced-support-${idx}`} className="bg-green-100 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-green-700 font-medium">₹{support.level.toFixed(2)}</span>
                          <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">
                            Strength: {support.strength.toFixed(1)}
                          </span>
                        </div>
                        <div className="text-xs text-green-600">
                          {support.type.replace(/_/g, ' ')} • OI: {support.oi.toLocaleString()} • Vol: {support.volume.toLocaleString()}
                        </div>
                      </div>
                    ))}
                    {/* Fallback to basic support levels if enhanced not available */}
                    {(!selectedStock.enhanced_support_levels || selectedStock.enhanced_support_levels.length === 0) && 
                     selectedStock.support_levels && selectedStock.support_levels.slice(0, 3).map((level, idx) => (
                      <div key={`basic-support-${idx}`} className="flex justify-between items-center">
                        <span className="text-green-700">Level {idx + 1}:</span>
                        <span className="font-bold text-green-800">₹{typeof level === 'number' ? level.toFixed(2) : level}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Institutional Activities (NEW) */}
              {selectedStock.institutional_activities && selectedStock.institutional_activities.length > 0 && (
                <div className="mb-6 p-4 bg-indigo-50 rounded-xl">
                  <h3 className="text-lg font-semibold text-indigo-900 mb-3">🏛️ Institutional Activities</h3>
                  <div className="space-y-3">
                    {selectedStock.institutional_activities.slice(0, 5).map((activity, idx) => (
                      <div key={`activity-${idx}`} className="bg-indigo-100 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-indigo-800 font-medium">{activity.type.replace(/_/g, ' ')}</span>
                          <span className="text-xs bg-indigo-200 text-indigo-800 px-2 py-1 rounded">
                            ₹{activity.strike} • Strength: {activity.strength.toFixed(1)}
                          </span>
                        </div>
                        <div className="text-xs text-indigo-600">
                          {activity.explanation}
                        </div>
                        <div className="text-xs text-indigo-500 mt-1">
                          Sentiment: {activity.sentiment.replace(/_/g, ' ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Institutional Flow Analysis */}
              <div className="mb-6 p-4 bg-purple-50 rounded-xl">
                <h3 className="text-lg font-semibold text-purple-900 mb-3">💰 Institutional Flow Analysis</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-green-100 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Bullish Flow</div>
                    <div className="text-xl font-bold text-green-600">+{selectedStock.institutional_bullish_flow.toFixed(1)}</div>
                  </div>
                  <div className="text-center p-3 bg-red-100 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Bearish Flow</div>
                    <div className="text-xl font-bold text-red-600">-{selectedStock.institutional_bearish_flow.toFixed(1)}</div>
                  </div>
                  <div className="text-center p-3 bg-blue-100 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Net Flow</div>
                    <div className={`text-xl font-bold ${selectedStock.net_institutional_flow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedStock.net_institutional_flow > 0 ? '+' : ''}{selectedStock.net_institutional_flow.toFixed(1)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Analysis Points */}
              {selectedStock.detailed_analysis && selectedStock.detailed_analysis.length > 0 && (
                <div className="mb-6 p-4 bg-yellow-50 rounded-xl">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-3">🔍 Detailed Analysis</h3>
                  <div className="space-y-2">
                    {selectedStock.detailed_analysis.slice(0, 10).map((analysis, idx) => (
                      <div key={`analysis-${idx}`} className="text-sm text-yellow-800 bg-yellow-100 p-2 rounded">
                        {analysis}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Unusual Activity */}
              {selectedStock.unusual_activity && selectedStock.unusual_activity.length > 0 && (
                <div className="mb-6 p-4 bg-orange-50 rounded-xl">
                  <h3 className="text-lg font-semibold text-orange-900 mb-3">⚡ Unusual Activity</h3>
                  <div className="space-y-2">
                    {selectedStock.unusual_activity.slice(0, 5).map((activity, idx) => (
                      <div key={`activity-${idx}`} className="text-sm text-orange-800 bg-orange-100 p-2 rounded">
                        {activity}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All Strength Signals */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">🎯 All Strength Signals</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedStock.strength_signals.map((signal, idx) => (
                    <span
                      key={`all-signal-${idx}`}
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        signal.includes('BULLISH') 
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : signal.includes('BEARISH')
                          ? 'bg-red-100 text-red-700 border border-red-200'
                          : 'bg-gray-100 text-gray-700 border border-gray-200'
                      }`}
                    >
                      {signal.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>

              {/* Additional Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="text-xs text-gray-500 mb-1">PCR</div>
                  <div className={`font-bold ${selectedStock.overall_pcr > 1.5 ? 'text-red-600' : selectedStock.overall_pcr < 0.8 ? 'text-green-600' : 'text-gray-600'}`}>
                    {selectedStock.overall_pcr.toFixed(3)}
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="text-xs text-gray-500 mb-1">Max Pain</div>
                  <div className="font-bold text-gray-700">₹{selectedStock.max_pain.toFixed(2)}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="text-xs text-gray-500 mb-1">Risk:Reward</div>
                  <div className="font-bold text-blue-600">{selectedStock.risk_reward_ratio.toFixed(2)}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="text-xs text-gray-500 mb-1">Confidence</div>
                  <div className="font-bold text-purple-600">{selectedStock.confidence}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
