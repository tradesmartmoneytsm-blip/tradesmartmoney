'use client';

import { useState, useEffect, useCallback } from 'react';
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
}

type FilterType = 'ALL' | 'STRONGLY_BULLISH' | 'BULLISH' | 'NEUTRAL' | 'BEARISH' | 'STRONGLY_BEARISH';
type SortType = 'SCORE_DESC' | 'SCORE_ASC' | 'SYMBOL' | 'TIMESTAMP';

export function OptionAnalysisContent() {
  const [data, setData] = useState<OptionAnalysisResult[]>([]);
  const [filteredData, setFilteredData] = useState<OptionAnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [sortBy, setSortBy] = useState<SortType>('SCORE_DESC');
  const [minScore, setMinScore] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/option-analysis?min_score=${minScore}&limit=1000`);
      const result = await response.json();
      
      if (result.success) {
        // Handle nested data structure - API returns data.results array
        const analysisData = result.data?.results || result.data || [];
        setData(Array.isArray(analysisData) ? analysisData : []);
        setLastUpdated(new Date().toLocaleString());
      } else {
        // Handle no data gracefully without throwing errors
        console.log('ℹ️ No option analysis data available yet');
        setData([]);
        setError('No option data available. Run the Python script to collect data.');
      }
    } catch (err) {
      console.log('ℹ️ Option analysis data not available:', err);
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
      
      if (isWeekday && isMarketHours && autoRefreshEnabled) {
        console.log('🔄 Auto-refreshing Option Analysis data...');
        fetchData();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [fetchData, autoRefreshEnabled]);

  useEffect(() => {
    // Ensure data is an array before processing
    if (!Array.isArray(data)) {
      setFilteredData([]);
      return;
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
    
    setFilteredData(filtered);
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


  const filterOptions = [
    { value: 'ALL', label: 'All Signals', count: Array.isArray(data) ? data.length : 0 },
    { value: 'STRONGLY_BULLISH', label: 'Strongly Bullish', count: Array.isArray(data) ? data.filter(d => d.institutional_sentiment === 'STRONGLY_BULLISH').length : 0 },
    { value: 'BULLISH', label: 'Bullish', count: Array.isArray(data) ? data.filter(d => d.institutional_sentiment === 'BULLISH').length : 0 },
    { value: 'NEUTRAL', label: 'Neutral', count: Array.isArray(data) ? data.filter(d => d.institutional_sentiment === 'NEUTRAL').length : 0 },
    { value: 'BEARISH', label: 'Bearish', count: Array.isArray(data) ? data.filter(d => d.institutional_sentiment === 'BEARISH').length : 0 },
    { value: 'STRONGLY_BEARISH', label: 'Strongly Bearish', count: Array.isArray(data) ? data.filter(d => d.institutional_sentiment === 'STRONGLY_BEARISH').length : 0 },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      {/* Compact Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          🎯 Option Chain Analysis
        </h3>
        <p className="text-sm text-gray-600 mb-1">
          Live Institutional Flow & Smart Money Analysis
        </p>
        <p className="text-xs text-gray-500">
          Enhanced with Indian Market Intelligence • Updated Every 5 Minutes
        </p>
      </div>

      {/* Compact Controls */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
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
                      <tr key={item.id || `${item.symbol}-${index}`} className="hover:bg-gray-50">
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
                <div key={item.id || `${item.symbol}-${index}`} className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                  {/* Card content - truncated for brevity, includes all the detailed card view from original */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-bold text-gray-900">{item.symbol}</h4>
                        <div className={`px-2 py-1 rounded-md text-xs font-medium border ${getSentimentColor(item.institutional_sentiment)}`}>
                          <div className="flex items-center gap-1">
                            {getSentimentIcon(item.institutional_sentiment)}
                            {item.institutional_sentiment.replace('_', ' ')}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-xl font-bold ${getScoreColor(item.score)}`}>
                          {item.score.toFixed(1)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.confidence}% Confidence
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-600 mb-3">
                      {item.reasoning}
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-gray-500">Entry: </span>
                        <span className="font-medium">₹{item.current_price.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Target: </span>
                        <span className="font-medium text-green-600">₹{item.target_1.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Stop: </span>
                        <span className="font-medium text-red-600">₹{item.stop_loss.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
