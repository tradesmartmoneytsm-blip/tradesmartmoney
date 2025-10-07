'use client'

import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Activity, Clock, BarChart3 } from 'lucide-react'

interface ProgressionData {
  analysis_timestamp: string
  score: number
  institutional_sentiment: string
  overall_pcr: number
  current_price: number
  reasoning: string
}

interface StockOption {
  symbol: string
  label: string
}

interface OptionAnalysisResult {
  symbol: string
  score: number
  institutional_sentiment: string
  // Add other properties as needed
}

export default function StockProgressionClient() {
  const [selectedStock, setSelectedStock] = useState<string>('ABCAPITAL')
  const [progressionData, setProgressionData] = useState<ProgressionData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [availableStocks, setAvailableStocks] = useState<StockOption[]>([])

  // Fetch available stocks on component mount
  useEffect(() => {
    fetchAvailableStocks()
  }, [])

  // Fetch progression data when stock changes
  useEffect(() => {
    if (selectedStock) {
      fetchProgressionData(selectedStock)
    }
  }, [selectedStock])

  const fetchAvailableStocks = async () => {
    try {
      const response = await fetch('/api/option-analysis?limit=200&min_score=-500')
      const result = await response.json()
      
      if (result.success && result.data?.results) {
        const results = result.data.results as OptionAnalysisResult[]
        const uniqueStocks: StockOption[] = [...new Set(results.map(item => item.symbol))]
          .sort()
          .map(symbol => ({ symbol, label: symbol }))
        
        setAvailableStocks(uniqueStocks)
      }
    } catch (err) {
      console.error('Error fetching stocks:', err)
    }
  }

  const fetchProgressionData = async (symbol: string) => {
    setLoading(true)
    setError(null)
    
    try {
      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0]
      
      const response = await fetch(
        `https://ejnuocizpsfcobhyxgrd.supabase.co/rest/v1/option_chain_analysis?symbol=eq.${symbol}&trading_date=eq.${today}&order=analysis_timestamp.asc`,
        {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqbnVvY2l6cHNmY29iaHl4Z3JkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzAxMjAyMCwiZXhwIjoyMDcyNTg4MDIwfQ.VvnrQCXDcya-pHhKn7Jp9bUgzj61eLFrdO8r-0fZhmY',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqbnVvY2l6cHNmY29iaHl4Z3JkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzAxMjAyMCwiZXhwIjoyMDcyNTg4MDIwfQ.VvnrQCXDcya-pHhKn7Jp9bUgzj61eLFrdO8r-0fZhmY'
          }
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        setProgressionData(data)
      } else {
        setError(`Failed to fetch data for ${symbol}`)
      }
    } catch (err) {
      setError(`Error fetching progression data: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'STRONGLY_BULLISH': return 'text-green-600 bg-green-50'
      case 'BULLISH': return 'text-green-500 bg-green-50'
      case 'BEARISH': return 'text-red-500 bg-red-50'
      case 'STRONGLY_BEARISH': return 'text-red-600 bg-red-50'
      default: return 'text-gray-500 bg-gray-50'
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'STRONGLY_BULLISH': return <TrendingUp className="w-4 h-4 text-green-600" />
      case 'BULLISH': return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'BEARISH': return <TrendingDown className="w-4 h-4 text-red-500" />
      case 'STRONGLY_BEARISH': return <TrendingDown className="w-4 h-4 text-red-600" />
      default: return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  const renderScoreChart = () => {
    if (progressionData.length === 0) return null

    const chartWidth = 800
    const chartHeight = 300
    const padding = 60

    // Get score range
    const scores = progressionData.map(d => d.score)
    const minScore = Math.min(...scores)
    const maxScore = Math.max(...scores)
    const scoreRange = maxScore - minScore || 100
    
    // Create points for the line chart
    const points = progressionData.map((data, index) => {
      const x = padding + (index / (progressionData.length - 1)) * (chartWidth - 2 * padding)
      const y = padding + ((maxScore - data.score) / scoreRange) * (chartHeight - 2 * padding)
      return { x, y, data }
    })

    // Create the path string for the line
    const pathData = points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ')

    // Create gradient for positive/negative areas
    const zeroY = padding + ((maxScore - 0) / scoreRange) * (chartHeight - 2 * padding)

    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          {selectedStock} - Score Progression Chart
        </h3>
        
        <div className="overflow-x-auto">
          <svg width={chartWidth} height={chartHeight} className="border rounded">
            {/* Background grid */}
            <defs>
              <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#f0f0f0" strokeWidth="1"/>
              </pattern>
              <linearGradient id="positiveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.1"/>
              </linearGradient>
              <linearGradient id="negativeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.1"/>
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.3"/>
              </linearGradient>
            </defs>
            
            <rect width={chartWidth} height={chartHeight} fill="url(#grid)" />
            
            {/* Zero line */}
            {minScore < 0 && maxScore > 0 && (
              <line 
                x1={padding} 
                y1={zeroY} 
                x2={chartWidth - padding} 
                y2={zeroY} 
                stroke="#6b7280" 
                strokeWidth="2" 
                strokeDasharray="5,5"
              />
            )}
            
            {/* Area fill */}
            {points.length > 1 && (
              <path
                d={`${pathData} L ${points[points.length - 1].x} ${zeroY} L ${points[0].x} ${zeroY} Z`}
                fill={minScore >= 0 ? "url(#positiveGradient)" : maxScore <= 0 ? "url(#negativeGradient)" : "url(#positiveGradient)"}
              />
            )}
            
            {/* Main line */}
            <path
              d={pathData}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Data points */}
            {points.map((point, index) => (
              <g key={index}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill={point.data.score >= 0 ? "#10b981" : "#ef4444"}
                  stroke="white"
                  strokeWidth="2"
                />
                {/* Tooltip on hover */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="8"
                  fill="transparent"
                  className="cursor-pointer"
                >
                  <title>
                    {formatTime(point.data.analysis_timestamp)}: {point.data.score.toFixed(1)} ({point.data.institutional_sentiment})
                  </title>
                </circle>
              </g>
            ))}
            
            {/* Y-axis labels */}
            {[maxScore, (maxScore + minScore) / 2, minScore].map((value, index) => {
              const y = padding + (index / 2) * (chartHeight - 2 * padding)
              return (
                <g key={index}>
                  <text
                    x={padding - 10}
                    y={y + 4}
                    textAnchor="end"
                    className="text-xs fill-gray-600"
                  >
                    {value.toFixed(0)}
                  </text>
                  <line
                    x1={padding - 5}
                    y1={y}
                    x2={padding}
                    y2={y}
                    stroke="#6b7280"
                    strokeWidth="1"
                  />
                </g>
              )
            })}
            
            {/* X-axis labels (time) */}
            {points.filter((_, index) => index % Math.ceil(points.length / 6) === 0).map((point, index) => (
              <g key={index}>
                <text
                  x={point.x}
                  y={chartHeight - padding + 20}
                  textAnchor="middle"
                  className="text-xs fill-gray-600"
                >
                  {formatTime(point.data.analysis_timestamp)}
                </text>
                <line
                  x1={point.x}
                  y1={chartHeight - padding}
                  x2={point.x}
                  y2={chartHeight - padding + 5}
                  stroke="#6b7280"
                  strokeWidth="1"
                />
              </g>
            ))}
            
            {/* Chart title and legend */}
            <text x={chartWidth / 2} y={30} textAnchor="middle" className="text-sm font-medium fill-gray-700">
              Score: {minScore.toFixed(1)} to {maxScore.toFixed(1)} | Range: {scoreRange.toFixed(1)} points
            </text>
          </svg>
        </div>
        
        {/* Chart legend */}
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Bullish Score</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Bearish Score</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-blue-500"></div>
            <span>Score Trend</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-gray-400 border-dashed border-t"></div>
            <span>Zero Line</span>
          </div>
        </div>
      </div>
    )
  }

  const getScoreBar = (score: number) => {
    const maxScore = Math.max(...progressionData.map(d => Math.abs(d.score)), 100)
    const width = Math.min((Math.abs(score) / maxScore) * 100, 100)
    const isPositive = score >= 0
    
    return (
      <div className="flex items-center w-full">
        <div className="w-16 text-right text-sm font-mono mr-2">
          {score > 0 ? '+' : ''}{score.toFixed(1)}
        </div>
        <div className="flex-1 bg-gray-100 rounded-full h-3 relative">
          <div 
            className={`h-3 rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}
            style={{ width: `${width}%` }}
          />
        </div>
      </div>
    )
  }

  const stats = progressionData.length > 0 ? {
    totalPoints: progressionData.length,
    scoreRange: {
      min: Math.min(...progressionData.map(d => d.score)),
      max: Math.max(...progressionData.map(d => d.score))
    },
    currentTrend: progressionData[progressionData.length - 1]?.score > progressionData[0]?.score ? 'BULLISH' : 'BEARISH',
    biggestSwing: Math.max(...progressionData.map(d => d.score)) - Math.min(...progressionData.map(d => d.score))
  } : null

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                Stock Sentiment Progression
              </h1>
              <p className="text-gray-600 mt-1">Internal analysis tool - Track intraday sentiment changes</p>
            </div>
            
            {/* Stock Selector */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Select Stock:</label>
              <select
                value={selectedStock}
                onChange={(e) => setSelectedStock(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[150px]"
              >
                {availableStocks.map(stock => (
                  <option key={stock.symbol} value={stock.symbol}>
                    {stock.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="text-sm text-gray-600">Total Data Points</div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalPoints}</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="text-sm text-gray-600">Score Range</div>
              <div className="text-lg font-bold text-gray-900">
                {stats.scoreRange.min.toFixed(1)} to {stats.scoreRange.max.toFixed(1)}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="text-sm text-gray-600">Biggest Swing</div>
              <div className="text-2xl font-bold text-gray-900">{stats.biggestSwing.toFixed(1)}</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="text-sm text-gray-600">Current Trend</div>
              <div className={`text-lg font-bold ${stats.currentTrend === 'BULLISH' ? 'text-green-600' : 'text-red-600'}`}>
                {stats.currentTrend === 'BULLISH' ? '📈 BULLISH' : '📉 BEARISH'}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm">
          {loading && (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading progression data for {selectedStock}...</p>
            </div>
          )}

          {error && (
            <div className="p-8 text-center">
              <div className="text-red-600 mb-2">⚠️ Error</div>
              <p className="text-gray-600">{error}</p>
            </div>
          )}

          {!loading && !error && progressionData.length === 0 && (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-2">📊 No Data</div>
              <p className="text-gray-600">No progression data found for {selectedStock} today.</p>
            </div>
          )}

          {!loading && !error && progressionData.length > 0 && (
            <>
              {/* Score Chart */}
              {renderScoreChart()}
              
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  {selectedStock} - Detailed Timeline ({new Date().toLocaleDateString()})
                </h2>

              <div className="space-y-3">
                {progressionData.map((data, index) => {
                  const isFirstEntry = index === 0
                  const isLastEntry = index === progressionData.length - 1
                  const prevData = index > 0 ? progressionData[index - 1] : null
                  const isMajorChange = prevData && Math.abs(data.score - prevData.score) > 100

                  return (
                    <div key={index}>
                      {isMajorChange && (
                        <div className="flex items-center justify-center py-2">
                          <div className="flex-1 border-t border-dashed border-orange-300"></div>
                          <span className="px-3 text-xs font-medium text-orange-600 bg-orange-50 rounded-full">
                            MAJOR CHANGE
                          </span>
                          <div className="flex-1 border-t border-dashed border-orange-300"></div>
                        </div>
                      )}
                      
                      <div className={`p-4 rounded-lg border-l-4 ${
                        isFirstEntry ? 'border-l-blue-500 bg-blue-50' :
                        isLastEntry ? 'border-l-purple-500 bg-purple-50' :
                        'border-l-gray-300 bg-gray-50'
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="text-sm font-mono text-gray-600 bg-white px-2 py-1 rounded">
                              {formatTime(data.analysis_timestamp)}
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getSentimentColor(data.institutional_sentiment)}`}>
                              {getSentimentIcon(data.institutional_sentiment)}
                              {data.institutional_sentiment.replace('_', ' ')}
                            </div>
                            {isFirstEntry && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">FIRST</span>}
                            {isLastEntry && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">LATEST</span>}
                          </div>
                          
                          <div className="text-right">
                            <div className="text-sm text-gray-600">
                              PCR: {data.overall_pcr.toFixed(3)} | Price: ₹{data.current_price.toFixed(2)}
                            </div>
                          </div>
                        </div>

                        <div className="mb-3">
                          {getScoreBar(data.score)}
                        </div>

                        <div className="text-sm text-gray-700 bg-white p-3 rounded border">
                          <strong>Analysis:</strong> {data.reasoning}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>🔒 Internal Analysis Tool • Real-time Option Chain Data • For Research Purposes Only</p>
        </div>
      </div>
    </div>
  )
}
