'use client';

import { useState, useEffect } from 'react';
import { Brain, TrendingUp, TrendingDown, Target, Zap, BarChart3, Users, Eye, Play, Loader2, AlertTriangle } from 'lucide-react';

interface AdvancedResult {
  symbol: string;
  score: number;
  strength_signals: string[];
  options_flow: {
    net_call_buildup: number;
    net_put_buildup: number;
    pcr_trend: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
    unusual_activity: string[];
    max_pain: number;
    support_levels: number[];
    resistance_levels: number[];
  };
  risk_reward: {
    entry_price: number;
    target_1: number;
    target_2: number;
    stop_loss: number;
    risk_reward_ratio: number;
    probability: number;
  };
  institutional_sentiment: 'STRONGLY_BULLISH' | 'BULLISH' | 'NEUTRAL' | 'BEARISH' | 'STRONGLY_BEARISH';
  reasoning: string;
  timeframe: string;
  confidence: number;
}

interface AdvancedScannerResponse {
  success: boolean;
  data: {
    results: AdvancedResult[];
    analysis_type: string;
    total_analyzed: number;
    qualifying_results: number;
    min_score: number;
    timestamp: string;
    processing_stats: {
      processed: number;
      errors: number;
      success_rate: string;
    };
  };
  error?: string;
}

export function AdvancedScanner() {
  const [minScore, setMinScore] = useState(75);
  const [analysisType, setAnalysisType] = useState('COMPREHENSIVE');
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<AdvancedResult[]>([]);
  const [summary, setSummary] = useState<AdvancedScannerResponse['data'] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastScan, setLastScan] = useState<string | null>(null);
  const [availableSymbols, setAvailableSymbols] = useState<string[]>([]);

  // Fetch available symbols from API
  const fetchSymbols = async () => {
    try {
      const response = await fetch('/api/advanced-scanner');
      const data = await response.json();
      
      if (data.success && data.data.available_symbols) {
        setAvailableSymbols(data.data.available_symbols);
      } else {
        setAvailableSymbols([]); // No fallback symbols
        setError('Unable to fetch symbol list from database');
      }
    } catch (error) {
      console.error('Failed to fetch symbols:', error);
      setAvailableSymbols([]); // No fallback symbols
      setError('Failed to connect to symbol database');
    }
  };

  // Fetch symbols on component mount
  useEffect(() => {
    fetchSymbols();
  }, []);

  const analysisTypes = [
    { id: 'COMPREHENSIVE', name: 'Comprehensive Analysis', description: 'Full options flow + institutional analysis' },
    { id: 'BULLISH_SETUPS', name: 'Bullish Setups', description: 'Strong call buildup and bullish sentiment' },
    { id: 'BEARISH_SETUPS', name: 'Bearish Setups', description: 'Put buildup and bearish institutional flow' },
    { id: 'UNUSUAL_ACTIVITY', name: 'Unusual Activity', description: 'Large block trades and abnormal flows' }
  ];

  const runAdvancedScanner = async () => {
    if (isScanning) return;

    // Check if symbols are available
    if (availableSymbols.length === 0) {
      setError('No symbols available for analysis. Please check database connection.');
      return;
    }

    setIsScanning(true);
    setError(null);
    setResults([]);
    setSummary(null);

    try {
      const response = await fetch('/api/advanced-scanner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symbols: availableSymbols,
          analysis_type: analysisType,
          min_score: minScore
        }),
      });

      const data: AdvancedScannerResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Advanced scanner failed');
      }

      setResults(data.data?.results || []);
      setSummary(data.data || null);
      setLastScan(new Date().toLocaleTimeString());
      

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to run advanced scanner';
      console.error('❌ Advanced scanner error:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsScanning(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'STRONGLY_BULLISH': return 'text-green-800 bg-green-100 border-green-300';
      case 'BULLISH': return 'text-green-700 bg-green-50 border-green-200';
      case 'NEUTRAL': return 'text-gray-700 bg-gray-100 border-gray-300';
      case 'BEARISH': return 'text-red-700 bg-red-50 border-red-200';
      case 'STRONGLY_BEARISH': return 'text-red-800 bg-red-100 border-red-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'STRONGLY_BULLISH': return <TrendingUp className="w-4 h-4" />;
      case 'BULLISH': return <TrendingUp className="w-4 h-4" />;
      case 'NEUTRAL': return <BarChart3 className="w-4 h-4" />;
      case 'BEARISH': return <TrendingDown className="w-4 h-4" />;
      case 'STRONGLY_BEARISH': return <TrendingDown className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  const getStrengthBadge = (signal: string) => {
    const signalMap: { [key: string]: { label: string; color: string } } = {
      'STRONG_CALL_BUILDUP': { label: 'Call Buildup', color: 'bg-green-100 text-green-800' },
      'STRONG_PUT_BUILDUP': { label: 'Put Buildup', color: 'bg-red-100 text-red-800' },
      'UNUSUAL_ACTIVITY': { label: 'Unusual Activity', color: 'bg-purple-100 text-purple-800' },
      'PCR_BULLISH': { label: 'PCR Bullish', color: 'bg-blue-100 text-blue-800' },
      'PCR_BEARISH': { label: 'PCR Bearish', color: 'bg-orange-100 text-orange-800' },
      'NEAR_SUPPORT_LEVEL': { label: 'Near Support', color: 'bg-cyan-100 text-cyan-800' },
      'NEAR_RESISTANCE_LEVEL': { label: 'Near Resistance', color: 'bg-yellow-100 text-yellow-800' },
      'INSTITUTIONAL_FLOW': { label: 'Inst. Flow', color: 'bg-indigo-100 text-indigo-800' }
    };
    
    const badge = signalMap[signal] || { label: signal.replace(/_/g, ' '), color: 'bg-gray-100 text-gray-800' };
    return (
      <span key={signal} className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
    return `₹${amount.toLocaleString()}`;
  };


  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">Advanced Options Scanner</h3>
          <p className="text-sm text-gray-600">Real institutional data analysis with risk-reward optimization</p>
        </div>
      </div>

      {/* Scanner Configuration */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 mb-6 border border-purple-100">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
          {/* Analysis Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Brain className="w-4 h-4 inline mr-1" />
              Analysis Type
            </label>
            <select
              value={analysisType}
              onChange={(e) => setAnalysisType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              disabled={isScanning}
            >
              {analysisTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {analysisTypes.find(t => t.id === analysisType)?.description}
            </p>
          </div>

          {/* Time Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
            <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600">
              9:15 AM - 3:30 PM (Market Hours)
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Min Score</label>
            <select
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              disabled={isScanning}
            >
              <option value={70}>70 - More Results</option>
              <option value={75}>75 - Quality (Default)</option>
              <option value={80}>80 - High Quality</option>
              <option value={85}>85 - Premium Only</option>
            </select>
          </div>


          {/* Run Scanner */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2 opacity-0">Action</label>
            <button
              onClick={runAdvancedScanner}
              disabled={isScanning || availableSymbols.length === 0}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Run Analysis</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Scanner Summary */}
      {summary && (
        <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{summary.qualifying_results}</div>
              <div className="text-gray-600">Opportunities</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{summary.processing_stats.success_rate}</div>
              <div className="text-gray-600">Avg Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">{summary.processing_stats.errors}</div>
              <div className="text-gray-600">Errors</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{summary.total_analyzed}</div>
              <div className="text-gray-600">Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{lastScan || '--'}</div>
              <div className="text-gray-600">Last Updated</div>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className="text-red-700 font-medium">Scanner Error</span>
          </div>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Results Display */}
      {results && results.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-800">
              Advanced Analysis Results ({results.length})
            </h4>
            <div className="text-xs text-gray-500">
              Sorted by score × confidence
            </div>
          </div>
          
          <div className="space-y-6">
            {results.map((result, index) => (
              <div key={result.symbol} className="bg-gradient-to-r from-white via-purple-50 to-blue-50 rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
                {/* Header Section */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div>
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-xl text-gray-900">{result.symbol}</span>
                        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full border text-sm font-medium ${getSentimentColor(result.institutional_sentiment)}`}>
                          {getSentimentIcon(result.institutional_sentiment)}
                          <span>{result.institutional_sentiment.replace('_', ' ')}</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        #{index + 1} • {result.timeframe} • {result.confidence}% Confidence
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">{result.score}</div>
                    <div className="text-xs text-gray-500">Strength Score</div>
                  </div>
                </div>

                {/* Options Flow Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
                  <div className="bg-white/70 rounded-xl p-4">
                    <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <Users className="w-4 h-4 mr-2 text-purple-600" />
                      Options Flow Analysis
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Call Buildup:</span>
                        <span className="font-medium text-green-600">
                          {formatCurrency(result.options_flow.net_call_buildup)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Put Buildup:</span>
                        <span className="font-medium text-red-600">
                          {formatCurrency(result.options_flow.net_put_buildup)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">PCR Trend:</span>
                        <span className={`font-medium ${
                          result.options_flow.pcr_trend === 'BULLISH' ? 'text-green-600' :
                          result.options_flow.pcr_trend === 'BEARISH' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {result.options_flow.pcr_trend}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Max Pain:</span>
                        <span className="font-medium">₹{result.options_flow.max_pain}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/70 rounded-xl p-4">
                    <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <Target className="w-4 h-4 mr-2 text-blue-600" />
                      Risk-Reward Analysis
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Entry Price:</span>
                        <span className="font-medium">₹{result.risk_reward.entry_price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Target 1:</span>
                        <span className="font-medium text-blue-600">₹{result.risk_reward.target_1}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Target 2:</span>
                        <span className="font-medium text-blue-600">₹{result.risk_reward.target_2}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Stop Loss:</span>
                        <span className="font-medium text-red-600">₹{result.risk_reward.stop_loss}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-gray-600">R:R Ratio:</span>
                        <span className="font-bold text-green-600">{result.risk_reward.risk_reward_ratio}:1</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Probability:</span>
                        <span className="font-medium">{result.risk_reward.probability}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Support/Resistance Levels */}
                {(result.options_flow.support_levels.length > 0 || result.options_flow.resistance_levels.length > 0) && (
                  <div className="bg-white/70 rounded-xl p-4 mb-4">
                    <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <BarChart3 className="w-4 h-4 mr-2 text-indigo-600" />
                      Key Levels from Options Data
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 font-medium">Support Levels:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {result.options_flow.support_levels.map((level, i) => (
                            <span key={i} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                              ₹{level}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600 font-medium">Resistance Levels:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {result.options_flow.resistance_levels.map((level, i) => (
                            <span key={i} className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                              ₹{level}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Strength Signals */}
                <div className="mb-4">
                  <h5 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <Zap className="w-4 h-4 mr-2 text-yellow-600" />
                    Strength Signals
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {result.strength_signals.map(signal => getStrengthBadge(signal))}
                  </div>
                </div>

                {/* Unusual Activity */}
                {result.options_flow.unusual_activity.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-semibold text-gray-800 mb-2 flex items-center">
                      <Eye className="w-4 h-4 mr-2 text-purple-600" />
                      Unusual Activity Detected
                    </h5>
                    <div className="bg-purple-50 rounded-lg p-3">
                      <ul className="text-sm space-y-1">
                        {result.options_flow.unusual_activity.map((activity, i) => (
                          <li key={i} className="text-purple-800">• {activity}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* AI Reasoning */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <Brain className="w-4 h-4 mr-2 text-blue-600" />
                    AI Analysis Summary
                  </h5>
                  <p className="text-sm text-gray-700 italic leading-relaxed">
                    {result.reasoning}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        !isScanning && !error && summary && (
          <div className="text-center py-12 text-gray-500">
            <Brain className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No High-Strength Opportunities Found</p>
            <p className="text-sm">Try lowering the minimum score or changing the analysis type.</p>
          </div>
        )
      )}

      {/* Information Footer */}
      <div className="mt-8 pt-4 border-t border-gray-200">
        <div className="flex items-start space-x-2 text-xs text-gray-500">
          <Brain className="w-4 h-4 mt-0.5 flex-shrink-0" />
                     <div>
             <p><strong>Advanced Algorithm:</strong> Real-time analysis of options flow, institutional sentiment, PCR trends, and unusual activity using live data.</p>
           </div>
        </div>
      </div>
    </div>
  );
} 