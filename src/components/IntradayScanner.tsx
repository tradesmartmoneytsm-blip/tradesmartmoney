'use client';

import { useState } from 'react';
import { Search, TrendingUp, TrendingDown, Activity, BarChart3, Target, Shield, AlertTriangle, Play, Loader2 } from 'lucide-react';

interface ScannerResult {
  symbol: string;
  score: number;
  signals: string[];
  technicals: {
    ltp: number;
    changePercent: number;
    relativeVolume: number;
    rsi: number;
    breakoutType?: string;
    target?: number;
    stopLoss?: number;
  };
  reasoning: string;
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  timeframe: 'IMMEDIATE' | 'MORNING' | 'AFTERNOON' | 'LATE';
}

interface ScannerResponse {
  success: boolean;
  results: ScannerResult[];
  summary: {
    total_scanned: number;
    opportunities_found: number;
    processed: number;
    errors: number;
    scan_type: string;
    min_score: number;
    top_score: number;
  };
  timestamp: string;
  error?: string;
}

export function IntradayScanner() {
  const [scanType, setScanType] = useState('BREAKOUT');
  const [minScore, setMinScore] = useState(70);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [maxResults, _setMaxResults] = useState(20);
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<ScannerResult[]>([]);
  const [summary, setSummary] = useState<ScannerResponse['summary'] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastScan, setLastScan] = useState<string | null>(null);

  const scanTypes = [
    { id: 'BREAKOUT', name: 'Breakout Stocks', description: 'Stocks breaking key resistance/support levels' },
    { id: 'HIGH_VOLUME', name: 'Volume Surge', description: 'Unusual volume activity indicating interest' },
    { id: 'MOMENTUM', name: 'Momentum Plays', description: 'Strong directional price movement' },
    { id: 'ALL', name: 'All Opportunities', description: 'Comprehensive scan across all patterns' }
  ];

  const runScanner = async () => {
    if (isScanning) return;

    setIsScanning(true);
    setError(null);
    setResults([]);
    setSummary(null);

    try {
      console.log(`🔍 Starting intraday scan: ${scanType}`);
      
      const response = await fetch('/api/intraday-scanner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scanType,
          minScore,
          maxResults
        }),
      });

      const data: ScannerResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Scanner failed');
      }

      setResults(data.results);
      setSummary(data.summary);
      setLastScan(new Date().toLocaleTimeString());
      
      console.log(`🎯 Scan completed: ${data.results.length} opportunities found`);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to run scanner';
      console.error('❌ Scanner error:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsScanning(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return 'text-green-600 bg-green-100';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100';
      case 'HIGH': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSignalBadge = (signal: string) => {
    const signalMap: { [key: string]: { label: string; color: string } } = {
      'HIGH_VOLUME': { label: 'Volume', color: 'bg-purple-100 text-purple-700' },
      'ELEVATED_VOLUME': { label: 'Volume+', color: 'bg-purple-100 text-purple-700' },
      'STRONG_MOMENTUM': { label: 'Momentum', color: 'bg-blue-100 text-blue-700' },
      'MODERATE_MOMENTUM': { label: 'Momentum+', color: 'bg-blue-100 text-blue-700' },
      'RESISTANCE_BREAKOUT': { label: 'Breakout', color: 'bg-green-100 text-green-700' },
      'SUPPORT_BREAKDOWN': { label: 'Breakdown', color: 'bg-red-100 text-red-700' },
      'RSI_REVERSAL': { label: 'RSI Rev', color: 'bg-orange-100 text-orange-700' },
      'MA_BULLISH': { label: 'MA Bull', color: 'bg-green-100 text-green-700' },
      'MA_BEARISH': { label: 'MA Bear', color: 'bg-red-100 text-red-700' }
    };
    
    const badge = signalMap[signal] || { label: signal, color: 'bg-gray-100 text-gray-700' };
    return (
      <span key={signal} className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
          <Search className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">Intraday Scanner</h3>
          <p className="text-sm text-gray-600">AI-powered stock movement prediction</p>
        </div>
      </div>

      {/* Scanner Configuration */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Scan Type */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Activity className="w-4 h-4 inline mr-1" />
              Scan Type
            </label>
            <select
              value={scanType}
              onChange={(e) => setScanType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              disabled={isScanning}
            >
              {scanTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {scanTypes.find(t => t.id === scanType)?.description}
            </p>
          </div>

          {/* Min Score */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Target className="w-4 h-4 inline mr-1" />
              Min Score
            </label>
            <select
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              disabled={isScanning}
            >
              <option value={50}>50 - More Results</option>
              <option value={60}>60 - Balanced</option>
              <option value={70}>70 - Quality</option>
              <option value={80}>80 - High Quality</option>
            </select>
          </div>

          {/* Run Scanner */}
          <div className="flex items-end">
            <button
              onClick={runScanner}
              disabled={isScanning}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Run Scanner</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Scanner Summary */}
      {summary && (
        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{summary.opportunities_found}</div>
              <div className="text-gray-600">Opportunities</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{summary.total_scanned}</div>
              <div className="text-gray-600">Stocks Scanned</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{summary.top_score}</div>
              <div className="text-gray-600">Top Score</div>
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
      {results.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-800">
              Scanner Results ({results.length})
            </h4>
            <div className="text-xs text-gray-500">
              Sorted by highest opportunity score
            </div>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {results.map((result, index) => (
              <div key={result.symbol} className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-lg text-gray-800">{result.symbol}</span>
                        {result.technicals.changePercent >= 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div className="text-xs text-gray-500">#{index + 1} • {result.timeframe}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(result.risk)}`}>
                      {result.risk} RISK
                    </span>
                    <div className="text-right">
                      <div className="font-bold text-green-600">{result.score}/100</div>
                      <div className="text-xs text-gray-500">Score</div>
                    </div>
                  </div>
                </div>
                
                {/* Technical Data */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-sm">
                  <div>
                    <div className="text-gray-600 text-xs">LTP</div>
                    <div className="font-medium">₹{result.technicals.ltp.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 text-xs">Change</div>
                    <div className={`font-medium ${
                      result.technicals.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {result.technicals.changePercent >= 0 ? '+' : ''}{result.technicals.changePercent}%
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 text-xs">Volume</div>
                    <div className="font-medium">{result.technicals.relativeVolume}x</div>
                  </div>
                  <div>
                    <div className="text-gray-600 text-xs">RSI</div>
                    <div className="font-medium">{result.technicals.rsi}</div>
                  </div>
                </div>

                {/* Targets & Stops */}
                {(result.technicals.target || result.technicals.stopLoss) && (
                  <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                    {result.technicals.target && (
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-blue-600" />
                        <div>
                          <span className="text-xs text-gray-600">Target: </span>
                          <span className="font-medium text-blue-600">₹{result.technicals.target}</span>
                        </div>
                      </div>
                    )}
                    {result.technicals.stopLoss && (
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-red-600" />
                        <div>
                          <span className="text-xs text-gray-600">Stop: </span>
                          <span className="font-medium text-red-600">₹{result.technicals.stopLoss}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Signals */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {result.signals.map(signal => getSignalBadge(signal))}
                </div>

                {/* Reasoning */}
                <div className="text-sm text-gray-700 italic bg-white/50 p-2 rounded">
                  {result.reasoning}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        !isScanning && !error && summary && (
          <div className="text-center py-8 text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg font-medium">No Opportunities Found</p>
            <p className="text-sm">Try lowering the minimum score or changing the scan type.</p>
          </div>
        )
      )}

      {/* Information Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-start space-x-2 text-xs text-gray-500">
          <BarChart3 className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <p><strong>Algorithm:</strong> Multi-factor analysis combining volume, momentum, breakouts, RSI, and moving averages to identify high-probability intraday moves.</p>
            <p className="mt-1"><strong>Score:</strong> Higher scores indicate stronger confluence of bullish/bearish signals. Minimum 30 points required.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 