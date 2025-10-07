'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Target, TrendingUp, TrendingDown, AlertTriangle, Shield, Clock, Zap } from 'lucide-react'

interface TradingSignal {
  symbol: string
  signal_type: 'BUY' | 'SELL' | 'HOLD' | 'AVOID'
  signal_strength: 'STRONG' | 'MODERATE' | 'WEAK'
  confidence: number
  entry_price: number
  target_1: number
  target_2: number
  stop_loss: number
  risk_reward_ratio: number
  timeframe: 'INTRADAY' | 'SWING' | 'POSITIONAL'
  reasoning: string
  score: number
  factors: {
    option_flow_score: number
    momentum_score: number
    volume_score: number
    technical_score: number
    risk_score: number
  }
  alerts: string[]
  sector: string
  market_cap_category: 'LARGE' | 'MID' | 'SMALL'
  liquidity_rating: 'HIGH' | 'MEDIUM' | 'LOW'
  analysis_timestamp: string
}

interface MarketSummary {
  total_signals: number
  buy_signals: number
  sell_signals: number
  strong_signals: number
  average_confidence: number
  market_bias: 'BULLISH' | 'BEARISH'
}

export default function TradingSignalsClient() {
  const [signals, setSignals] = useState<TradingSignal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [marketSummary, setMarketSummary] = useState<MarketSummary | null>(null)
  const [filters, setFilters] = useState({
    signal_type: 'ALL',
    min_confidence: 70,
    timeframe: 'ALL'
  })

  const fetchTradingSignals = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams({
        signal_type: filters.signal_type,
        min_confidence: filters.min_confidence.toString(),
        timeframe: filters.timeframe,
        limit: '50'
      })

      const response = await fetch(`/api/trading-signals?${params}`)
      const result = await response.json()

      if (result.success) {
        setSignals(result.data.signals || [])
        setMarketSummary(result.data.market_summary || null)
      } else {
        setError(result.error || 'Failed to fetch trading signals')
      }
    } catch (err) {
      setError('Error fetching trading signals')
      console.error('Trading signals error:', err)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchTradingSignals()
  }, [filters, fetchTradingSignals])

  const getSignalIcon = (signalType: string) => {
    switch (signalType) {
      case 'BUY': return <TrendingUp className="w-5 h-5 text-green-600" />
      case 'SELL': return <TrendingDown className="w-5 h-5 text-red-600" />
      case 'AVOID': return <AlertTriangle className="w-5 h-5 text-orange-600" />
      default: return <Shield className="w-5 h-5 text-gray-600" />
    }
  }

  const getSignalColor = (signalType: string, strength: string) => {
    const baseColors = {
      'BUY': 'green',
      'SELL': 'red',
      'AVOID': 'orange',
      'HOLD': 'gray'
    }
    
    const intensities = {
      'STRONG': '600',
      'MODERATE': '500', 
      'WEAK': '400'
    }

    const color = baseColors[signalType as keyof typeof baseColors] || 'gray'
    const intensity = intensities[strength as keyof typeof intensities] || '500'
    
    return `text-${color}-${intensity} bg-${color}-50 border-${color}-200`
  }

  const getTimeframeIcon = (timeframe: string) => {
    switch (timeframe) {
      case 'INTRADAY': return <Zap className="w-4 h-4" />
      case 'SWING': return <TrendingUp className="w-4 h-4" />
      case 'POSITIONAL': return <Target className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Target className="w-8 h-8 text-blue-600" />
                AI Trading Signals
              </h1>
              <p className="text-gray-600 mt-2">
                Advanced algorithm combining option flow, momentum, volume, and technical analysis
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Signal Type:</label>
              <select
                value={filters.signal_type}
                onChange={(e) => setFilters({...filters, signal_type: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Signals</option>
                <option value="BUY">Buy Signals</option>
                <option value="SELL">Sell Signals</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Min Confidence:</label>
              <select
                value={filters.min_confidence}
                onChange={(e) => setFilters({...filters, min_confidence: parseInt(e.target.value)})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="50">50%+</option>
                <option value="60">60%+</option>
                <option value="70">70%+</option>
                <option value="80">80%+</option>
                <option value="90">90%+</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Timeframe:</label>
              <select
                value={filters.timeframe}
                onChange={(e) => setFilters({...filters, timeframe: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Timeframes</option>
                <option value="INTRADAY">Intraday</option>
                <option value="SWING">Swing</option>
                <option value="POSITIONAL">Positional</option>
              </select>
            </div>

            <button
              onClick={fetchTradingSignals}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Signals
            </button>
          </div>
        </div>

        {/* Market Summary */}
        {marketSummary && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{marketSummary.total_signals}</div>
              <div className="text-sm text-gray-600">Total Signals</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{marketSummary.buy_signals}</div>
              <div className="text-sm text-gray-600">Buy Signals</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{marketSummary.sell_signals}</div>
              <div className="text-sm text-gray-600">Sell Signals</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{marketSummary.strong_signals}</div>
              <div className="text-sm text-gray-600">Strong Signals</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-gray-700">{marketSummary.average_confidence}%</div>
              <div className="text-sm text-gray-600">Avg Confidence</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 text-center">
              <div className={`text-2xl font-bold ${marketSummary.market_bias === 'BULLISH' ? 'text-green-600' : 'text-red-600'}`}>
                {marketSummary.market_bias === 'BULLISH' ? '📈' : '📉'}
              </div>
              <div className="text-sm text-gray-600">Market Bias</div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Generating trading signals...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-2 text-red-800 font-medium mb-2">
              <AlertTriangle className="w-5 h-5" />
              Error Loading Signals
            </div>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* No Signals */}
        {!loading && !error && signals.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-gray-400 mb-2">🎯 No Signals</div>
            <p className="text-gray-600">No trading signals found with current filters. Try adjusting your criteria.</p>
          </div>
        )}

        {/* Trading Signals */}
        {!loading && !error && signals.length > 0 && (
          <div className="space-y-4">
            {signals.map((signal, index) => (
              <div key={`${signal.symbol}-${index}`} className="bg-white rounded-lg shadow-sm border-l-4 border-l-blue-500 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getSignalIcon(signal.signal_type)}
                      <span className="text-2xl font-bold text-gray-900">{signal.symbol}</span>
                    </div>
                    
                    <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getSignalColor(signal.signal_type, signal.signal_strength)}`}>
                      {signal.signal_type} - {signal.signal_strength}
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      {getTimeframeIcon(signal.timeframe)}
                      {signal.timeframe}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{signal.confidence}%</div>
                    <div className="text-sm text-gray-600">Confidence</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                  {/* Trade Levels */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-600" />
                      Trade Levels
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Entry:</span>
                        <span className="font-medium">₹{signal.entry_price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Target 1:</span>
                        <span className="font-medium text-green-600">₹{signal.target_1.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Target 2:</span>
                        <span className="font-medium text-green-600">₹{signal.target_2.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Stop Loss:</span>
                        <span className="font-medium text-red-600">₹{signal.stop_loss.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-gray-600">R:R Ratio:</span>
                        <span className="font-bold text-blue-600">{signal.risk_reward_ratio.toFixed(1)}:1</span>
                      </div>
                    </div>
                  </div>

                  {/* Factor Analysis */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Factor Breakdown</h4>
                    <div className="space-y-2">
                      {Object.entries(signal.factors).map(([factor, score]) => (
                        <div key={factor} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 capitalize">
                            {factor.replace('_', ' ').replace(' score', '')}:
                          </span>
                          <div className="flex items-center gap-2">
                            <div className={`w-16 h-2 rounded-full ${score >= 0 ? 'bg-green-200' : 'bg-red-200'}`}>
                              <div 
                                className={`h-2 rounded-full ${score >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                                style={{ width: `${Math.min(Math.abs(score as number) / 50 * 100, 100)}%` }}
                              />
                            </div>
                            <span className="font-medium w-8 text-right">
                              {(score as number).toFixed(0)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stock Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Stock Info</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sector:</span>
                        <span className="font-medium">{signal.sector}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Market Cap:</span>
                        <span className="font-medium">{signal.market_cap_category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Liquidity:</span>
                        <span className={`font-medium ${
                          signal.liquidity_rating === 'HIGH' ? 'text-green-600' : 
                          signal.liquidity_rating === 'MEDIUM' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {signal.liquidity_rating}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Score:</span>
                        <span className="font-bold text-blue-600">{signal.score.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Alerts */}
                {signal.alerts.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Key Signals:</h4>
                    <div className="flex flex-wrap gap-2">
                      {signal.alerts.slice(0, 6).map((alert, alertIndex) => (
                        <span
                          key={alertIndex}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {alert.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reasoning */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Analysis & Reasoning:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">{signal.reasoning}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>
            🤖 AI-Powered Trading Signals • 📊 Multi-Factor Analysis • ⚠️ For Educational Purposes Only
          </p>
          <p className="mt-1">
            Risk Warning: Trading involves substantial risk. Past performance does not guarantee future results.
          </p>
        </div>
      </div>
    </div>
  )
}
