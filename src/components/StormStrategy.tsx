'use client';

import { useState } from 'react';
import { Zap, Clock, TrendingUp, TrendingDown, Activity, Play, Loader2 } from 'lucide-react';

interface StormResult {
  symbol: string;
  start_time: string;
  trigger_time: string;
  start_pcr: number;
  changed_pcr: number;
  change_percent: number;
  direction: 'increase' | 'decrease';
  timestamp: string;
}

interface StormAnalysisResponse {
  success: boolean;
  results: StormResult[];
  summary: {
    total_symbols: number;
    storms_found: number;
    processed: number;
    errors: number;
    start_time: string;
    end_time: string;
    threshold_percent: number;
  };
  timestamp: string;
  error?: string;
}

export function StormStrategy() {
  const [startTime, setStartTime] = useState('09:15');
  const [endTime, setEndTime] = useState('15:30');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<StormResult[]>([]);
  const [summary, setSummary] = useState<StormAnalysisResponse['summary'] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastAnalysis, setLastAnalysis] = useState<string | null>(null);

  const runStormAnalysis = async () => {
    if (!startTime || !endTime) {
      setError('Please select both start and end times');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResults([]);
    setSummary(null);

    try {
      console.log(`🌪️ Starting Storm analysis: ${startTime} to ${endTime}`);
      
      const response = await fetch('/api/storm-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startTime,
          endTime,
          thresholdPercent: 10
        }),
      });

      const data: StormAnalysisResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Storm analysis failed');
      }

      setResults(data.results);
      setSummary(data.summary);
      setLastAnalysis(new Date().toLocaleTimeString());
      
      console.log(`⚡ Storm analysis completed: ${data.results.length} storms found`);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to run storm analysis';
      console.error('❌ Storm analysis error:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 9; hour <= 15; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        if (hour === 15 && minute > 30) break; // Market closes at 15:30
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(timeStr);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
          <Zap className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">Storm Strategy</h3>
          <p className="text-sm text-gray-600">High Money Flow Activity Detection</p>
        </div>
      </div>

      {/* Time Selection */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Start Time
            </label>
            <select
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              disabled={isAnalyzing}
            >
              {timeOptions.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              End Time
            </label>
            <select
              id="endTime"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              disabled={isAnalyzing}
            >
              {timeOptions.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>

          <button
            onClick={runStormAnalysis}
            disabled={isAnalyzing}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Run Storm</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Summary */}
      {summary && (
        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{summary.storms_found}</div>
              <div className="text-gray-600">Storms Found</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{summary.total_symbols}</div>
              <div className="text-gray-600">Symbols Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{summary.threshold_percent}%</div>
              <div className="text-gray-600">PCR Threshold</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{lastAnalysis || '--'}</div>
              <div className="text-gray-600">Last Updated</div>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-red-500" />
            <span className="text-red-700 font-medium">Analysis Error</span>
          </div>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Results Display */}
      {results.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-800">Storm Alerts ({results.length})</h4>
            <div className="text-xs text-gray-500">
              Sorted by most recent PCR change
            </div>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {results.map((result, index) => (
              <div key={`${result.symbol}-${result.trigger_time}`} className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-lg text-gray-800">{result.symbol}</span>
                      {result.direction === 'increase' ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div className="text-xs text-gray-500">Rank #{index + 1}</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    result.change_percent >= 20 
                      ? 'bg-red-100 text-red-700' 
                      : result.change_percent >= 15 
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {result.change_percent}% Change
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <div className="text-gray-600 text-xs">Trigger Time</div>
                    <div className="font-medium text-purple-600">{result.trigger_time}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 text-xs">Start PCR</div>
                    <div className="font-medium">{result.start_pcr}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 text-xs">Changed PCR</div>
                    <div className={`font-medium ${
                      result.direction === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {result.changed_pcr}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 text-xs">Direction</div>
                    <div className={`font-medium capitalize ${
                      result.direction === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {result.direction}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        !isAnalyzing && !error && summary && (
          <div className="text-center py-8 text-gray-500">
            <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg font-medium">No Storms Detected</p>
            <p className="text-sm">No symbols showed PCR changes above 10% in the selected time range.</p>
          </div>
        )
      )}

      {/* Information Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-start space-x-2 text-xs text-gray-500">
          <Activity className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <p><strong>Storm Strategy:</strong> Detects high money flow activity by monitoring Put-Call Ratio (PCR) changes above 10% within your selected time range.</p>
            <p className="mt-1"><strong>Filter:</strong> Only analyzes symbols with starting PCR below 0.49 for better accuracy.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 