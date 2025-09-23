'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Activity, AlertTriangle, Target, BarChart3 } from 'lucide-react';

interface IndianMarketSentiment {
  overall: 'Strongly Bullish' | 'Bullish' | 'Neutral' | 'Bearish' | 'Strongly Bearish';
  score: number;
  confidence: number;
  summary: string;
  indicators: {
    niftyTrend: { value: number; signal: string; weight: number };
    vixLevel: { value: number; signal: string; weight: number };
    fiiActivity: { value: number; signal: string; weight: number };
    sectorBreadth: { value: number; signal: string; weight: number };
    marketCap: { value: number; signal: string; weight: number };
    advanceDecline: { value: number; signal: string; weight: number };
  };
  timeframeAnalysis: {
    daily: {
      trend: 'Bullish' | 'Bearish' | 'Neutral';
      strength: number;
      signal: string;
      keyLevels: { support: number; resistance: number };
    };
    weekly: {
      trend: 'Bullish' | 'Bearish' | 'Neutral';
      strength: number;
      signal: string;
      keyLevels: { support: number; resistance: number };
    };
    shortTerm: {
      outlook: 'Positive' | 'Negative' | 'Neutral';
      confidence: number;
      recommendation: string;
      riskLevel: 'Low' | 'Medium' | 'High';
    };
  };
  marketData: {
    nifty: { current: number; change: number; changePercent: number };
    bankNifty: { current: number; change: number; changePercent: number };
    vix: { current: number; change: number };
    fiiNet: number;
    diiNet: number;
  };
  lastUpdated: string;
  nextUpdate: string;
}

interface IndianMarketSentimentProps {
  className?: string;
}

export function IndianMarketSentiment({ className = '' }: IndianMarketSentimentProps) {
  const [sentiment, setSentiment] = useState<IndianMarketSentiment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const fetchSentiment = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/indian-market-sentiment');
      const result = await response.json();
      
      if (result.success) {
        setSentiment(result.data);
        setError('');
      } else {
        setError('Failed to load Indian market sentiment');
      }
    } catch (err) {
      console.error('Error fetching Indian market sentiment:', err);
      setError('Failed to load market data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSentiment();
    // Fetch once on component mount - no auto-refresh or manual refresh
  }, []);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Strongly Bullish': return 'text-green-700 bg-green-100 border-green-300';
      case 'Bullish': return 'text-green-600 bg-green-50 border-green-200';
      case 'Neutral': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Bearish': return 'text-red-600 bg-red-50 border-red-200';
      case 'Strongly Bearish': return 'text-red-700 bg-red-100 border-red-300';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'Strongly Bullish': return <TrendingUp className="w-8 h-8" />;
      case 'Bullish': return <TrendingUp className="w-7 h-7" />;
      case 'Neutral': return <Minus className="w-6 h-6" />;
      case 'Bearish': return <TrendingDown className="w-7 h-7" />;
      case 'Strongly Bearish': return <TrendingDown className="w-8 h-8" />;
      default: return <Activity className="w-6 h-6" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 60) return 'text-green-700';
    if (score >= 20) return 'text-green-600';
    if (score >= -20) return 'text-yellow-600';
    if (score >= -60) return 'text-red-600';
    return 'text-red-700';
  };

  // Removed unused helper functions

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(Math.round(num));
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div className="h-7 bg-gray-200 rounded w-48"></div>
            <div className="h-5 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !sentiment) {
    return (
      <div className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-400" />
          <h3 className="text-lg font-semibold mb-2">Unable to Load Market Sentiment</h3>
          <p className="mb-4">{error || 'Failed to fetch Indian market data'}</p>
          <button 
            onClick={() => fetchSentiment()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            🇮🇳 Indian Market Sentiment
          </h2>
          <p className="text-sm text-gray-600 mt-1">Real-time analysis of NSE & BSE markets</p>
        </div>
      </div>

      {/* Main Sentiment Display */}
      <div className={`rounded-xl border-2 p-6 mb-6 ${getSentimentColor(sentiment.overall)}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            {getSentimentIcon(sentiment.overall)}
            <div>
              <div className="text-2xl font-bold">{sentiment.overall}</div>
              <div className="text-sm opacity-80">Current Market Sentiment</div>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${getScoreColor(sentiment.score)}`}>
              {sentiment.score > 0 ? '+' : ''}{sentiment.score}
            </div>
            <div className="text-sm opacity-80">{sentiment.confidence}% confidence</div>
          </div>
        </div>
        <p className="text-sm opacity-90 leading-relaxed">{sentiment.summary}</p>
      </div>

      {/* Market Data Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-xs text-blue-600 font-medium mb-1">NIFTY 50</div>
          <div className="text-lg font-bold text-blue-900">{formatNumber(sentiment.marketData.nifty.current)}</div>
          <div className={`text-sm font-medium ${sentiment.marketData.nifty.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatChange(sentiment.marketData.nifty.change)} ({formatChange(sentiment.marketData.nifty.changePercent)}%)
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-xs text-purple-600 font-medium mb-1">BANK NIFTY</div>
          <div className="text-lg font-bold text-purple-900">{formatNumber(sentiment.marketData.bankNifty.current)}</div>
          <div className={`text-sm font-medium ${sentiment.marketData.bankNifty.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatChange(sentiment.marketData.bankNifty.change)} ({formatChange(sentiment.marketData.bankNifty.changePercent)}%)
          </div>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-4 text-center">
          <div className="text-xs text-yellow-600 font-medium mb-1">INDIA VIX</div>
          <div className="text-lg font-bold text-yellow-900">{sentiment.marketData.vix.current.toFixed(2)}</div>
          <div className={`text-sm font-medium ${sentiment.marketData.vix.change >= 0 ? 'text-red-600' : 'text-green-600'}`}>
            {formatChange(sentiment.marketData.vix.change)}
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-xs text-green-600 font-medium mb-1">FII+DII NET</div>
          <div className="text-lg font-bold text-green-900">₹{Math.round(sentiment.marketData.fiiNet + sentiment.marketData.diiNet)}Cr</div>
          <div className="text-xs text-gray-600">
            FII: ₹{Math.round(sentiment.marketData.fiiNet)}Cr | DII: ₹{Math.round(sentiment.marketData.diiNet)}Cr
          </div>
        </div>
      </div>


      {/* Timeframe Analysis */}
      <div className="space-y-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          📊 Timeframe Analysis
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {/* Daily Analysis */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-blue-800 flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Daily Trend
              </h4>
              <div className={`px-2 py-1 rounded text-xs font-medium ${
                sentiment.timeframeAnalysis.daily.trend === 'Bullish' ? 'bg-green-100 text-green-800' :
                sentiment.timeframeAnalysis.daily.trend === 'Bearish' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {sentiment.timeframeAnalysis.daily.trend}
              </div>
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span>Strength</span>
                <span>{sentiment.timeframeAnalysis.daily.strength}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    sentiment.timeframeAnalysis.daily.strength >= 70 ? 'bg-green-500' :
                    sentiment.timeframeAnalysis.daily.strength >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${sentiment.timeframeAnalysis.daily.strength}%` }}
                ></div>
              </div>
            </div>
            <p className="text-xs text-blue-700 mb-2">{sentiment.timeframeAnalysis.daily.signal}</p>
            <div className="text-xs text-gray-600">
              <div>Support: {sentiment.timeframeAnalysis.daily.keyLevels.support.toLocaleString()}</div>
              <div>Resistance: {sentiment.timeframeAnalysis.daily.keyLevels.resistance.toLocaleString()}</div>
            </div>
          </div>

          {/* Weekly Analysis */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-purple-800 flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Weekly Trend
              </h4>
              <div className={`px-2 py-1 rounded text-xs font-medium ${
                sentiment.timeframeAnalysis.weekly.trend === 'Bullish' ? 'bg-green-100 text-green-800' :
                sentiment.timeframeAnalysis.weekly.trend === 'Bearish' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {sentiment.timeframeAnalysis.weekly.trend}
              </div>
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span>Strength</span>
                <span>{sentiment.timeframeAnalysis.weekly.strength}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    sentiment.timeframeAnalysis.weekly.strength >= 70 ? 'bg-green-500' :
                    sentiment.timeframeAnalysis.weekly.strength >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${sentiment.timeframeAnalysis.weekly.strength}%` }}
                ></div>
              </div>
            </div>
            <p className="text-xs text-purple-700 mb-2">{sentiment.timeframeAnalysis.weekly.signal}</p>
            <div className="text-xs text-gray-600">
              <div>Support: {sentiment.timeframeAnalysis.weekly.keyLevels.support.toLocaleString()}</div>
              <div>Resistance: {sentiment.timeframeAnalysis.weekly.keyLevels.resistance.toLocaleString()}</div>
            </div>
          </div>
        </div>

      </div>

      {/* Reference Guide */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          📚 Reference Guide
        </h3>
        
        {/* Score Range Guide */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Sentiment Score Range:</h4>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 text-xs">
            <div className="bg-red-100 text-red-800 px-2 py-1 rounded text-center">
              <div className="font-semibold">-100 to -50</div>
              <div>Strongly Bearish</div>
            </div>
            <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-center">
              <div className="font-semibold">-49 to -20</div>
              <div>Bearish</div>
            </div>
            <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-center">
              <div className="font-semibold">-19 to +19</div>
              <div>Neutral</div>
            </div>
            <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-center">
              <div className="font-semibold">+20 to +49</div>
              <div>Bullish</div>
            </div>
            <div className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-center">
              <div className="font-semibold">+50 to +100</div>
              <div>Strongly Bullish</div>
            </div>
          </div>
        </div>

        {/* Confidence Level Guide */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Confidence Level Meaning:</h4>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 text-xs">
            <div className="bg-red-50 border border-red-200 px-2 py-1 rounded">
              <div className="font-semibold text-red-700">0-25%: Low</div>
              <div className="text-red-600">Conflicting signals</div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 px-2 py-1 rounded">
              <div className="font-semibold text-yellow-700">26-50%: Moderate</div>
              <div className="text-yellow-600">Some uncertainty</div>
            </div>
            <div className="bg-blue-50 border border-blue-200 px-2 py-1 rounded">
              <div className="font-semibold text-blue-700">51-75%: Good</div>
              <div className="text-blue-600">Clear trend emerging</div>
            </div>
            <div className="bg-green-50 border border-green-200 px-2 py-1 rounded">
              <div className="font-semibold text-green-700">76-100%: High</div>
              <div className="text-green-600">Strong consensus</div>
            </div>
          </div>
        </div>

        {/* Current Analysis */}
        <div className="bg-white rounded border border-gray-200 p-3">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Current Analysis:</h4>
          <div className="text-xs text-gray-600 space-y-1">
            <div>• <strong>Score {sentiment.score > 0 ? '+' : ''}{sentiment.score}:</strong> {sentiment.overall} sentiment (
              {sentiment.score >= 50 ? 'Very Strong Bullish' :
               sentiment.score >= 20 ? 'Clear Bullish Trend' :
               sentiment.score >= -19 ? 'Consolidation/Mixed Signals' :
               sentiment.score >= -49 ? 'Clear Bearish Trend' : 'Very Strong Bearish'} signals)</div>
            <div>• <strong>{sentiment.confidence}% Confidence:</strong> {
              sentiment.confidence >= 76 ? 'High confidence - Strong consensus across indicators' :
              sentiment.confidence >= 51 ? 'Good confidence - Clear trend with minor conflicting signals' :
              sentiment.confidence >= 26 ? 'Moderate confidence - Some uncertainty in market direction' :
              'Low confidence - Highly conflicting signals, exercise caution'
            }</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>Last updated: {new Date(sentiment.lastUpdated).toLocaleTimeString('en-IN')}</span>
          <span>Next update: {new Date(sentiment.nextUpdate).toLocaleTimeString('en-IN')}</span>
        </div>
        
        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-xs text-amber-800">
            <strong>⚠️ Disclaimer:</strong> This sentiment analysis is for educational purposes only and should not be considered as investment advice. 
            Indian stock markets are subject to various risks. Please consult with SEBI registered investment advisors before making any investment decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
