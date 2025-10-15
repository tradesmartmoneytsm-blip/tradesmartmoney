'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { 
  Clock, 
  Target, 
  Activity,
  RefreshCw,
  Filter,
  Calendar,
  BarChart3
} from 'lucide-react';

interface OptionAnalysisData {
  symbol: string;
  analysis_timestamp: string;
  score: number;
  institutional_sentiment: string;
  current_price: number;
  overall_pcr: number;
  confidence: number;
  reasoning: string;
}

interface ChartDataPoint {
  time: string;
  timestamp: number;
  [key: string]: number | string; // Dynamic keys for each stock symbol
}

export default function StockProgressionChart() {
  const [allData, setAllData] = useState<OptionAnalysisData[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('2025-10-10'); // Set to date with full day data
  const [minScore, setMinScore] = useState<number>(100);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [selectedStocks, setSelectedStocks] = useState<Set<string>>(new Set());
  const [scoreFilter, setScoreFilter] = useState<number>(50); // Default to 50+ filter

  const fetchProgressionData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch ALL option analysis data using pagination to get around Supabase limits
      let allRawData: OptionAnalysisData[] = [];
      let offset = 0;
      const batchSize = 1000;
      
      while (true) {
        const response = await fetch(
          `https://ejnuocizpsfcobhyxgrd.supabase.co/rest/v1/option_chain_analysis?trading_date=eq.${selectedDate}&order=analysis_timestamp.asc&limit=${batchSize}&offset=${offset}`,
          {
            headers: {
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqbnVvY2l6cHNmY29iaHl4Z3JkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzAxMjAyMCwiZXhwIjoyMDcyNTg4MDIwfQ.VvnrQCXDcya-pHhKn7Jp9bUgzj61eLFrdO8r-0fZhmY',
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqbnVvY2l6cHNmY29iaHl4Z3JkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzAxMjAyMCwiZXhwIjoyMDcyNTg4MDIwfQ.VvnrQCXDcya-pHhKn7Jp9bUgzj61eLFrdO8r-0fZhmY'
            }
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const batchData = await response.json();
        
        if (!batchData || batchData.length === 0) {
          break; // No more data
        }
        
        allRawData = allRawData.concat(batchData);
        offset += batchSize;
        
        // Safety check to prevent infinite loops
        if (offset > 20000) {
          console.warn('Reached maximum offset, stopping pagination');
          break;
        }
      }

      if (allRawData.length > 0) {
        const rawData = allRawData;
        
        if (rawData && rawData.length > 0) {
          // Debug: Log data range
          const timestamps = rawData.map((item: OptionAnalysisData) => item.analysis_timestamp);
          const firstTimestamp = new Date(Math.min(...timestamps.map((t: string) => new Date(t).getTime())));
          const lastTimestamp = new Date(Math.max(...timestamps.map((t: string) => new Date(t).getTime())));
          const timeRangeText = `${firstTimestamp.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })} to ${lastTimestamp.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })}`;
          console.log(`🕐 Raw Data Time Range: ${timeRangeText}`);
          console.log(`📊 Total raw data points: ${rawData.length}`);
          console.log(`📅 Selected Date: ${selectedDate}`);
          console.log(`🔍 Sample timestamps:`, timestamps.slice(0, 10));
          
          // Log data range for debugging (removed alert)
          console.log(`📊 Data Summary: ${timeRangeText} | Points: ${rawData.length} | Date: ${selectedDate}`);
          
          setAllData(rawData);
          
          // Group data by time intervals for chart visualization
          const timeGroups: Record<string, Record<string, string | number>> = {};
          
          rawData.forEach((item: OptionAnalysisData) => {
            const timestamp = new Date(item.analysis_timestamp);
            // Group by minute for better chart readability
            const timeKey = timestamp.toLocaleTimeString('en-IN', {
              timeZone: 'Asia/Kolkata',
              hour: '2-digit',
              minute: '2-digit'
            });
            
            if (!timeGroups[timeKey]) {
              timeGroups[timeKey] = {
                time: timeKey,
                timestamp: timestamp.getTime()
              };
            }
            
            // Add this stock's score to this time point
            timeGroups[timeKey][item.symbol] = item.score;
          });

          // Convert to chart format
          const chartDataPoints = Object.values(timeGroups)
            .sort((a, b) => (a.timestamp as number) - (b.timestamp as number)) as ChartDataPoint[];

          // Debug: Log time range and grouping
          if (chartDataPoints.length > 0) {
            const firstTime = chartDataPoints[0].time;
            const lastTime = chartDataPoints[chartDataPoints.length - 1].time;
            console.log(`📊 Chart Time Range: ${firstTime} to ${lastTime} (${chartDataPoints.length} chart points)`);
            console.log(`🔢 Raw data: ${rawData.length} records → ${Object.keys(timeGroups).length} time groups → ${chartDataPoints.length} chart points`);
            console.log('📈 First 10 time points:', chartDataPoints.slice(0, 10).map(d => d.time));
            console.log('📈 Last 10 time points:', chartDataPoints.slice(-10).map(d => d.time));
          }

          setChartData(chartDataPoints);
          setLastUpdated(new Date().toLocaleString());
          
          // Auto-select top 5 stocks by peak score if no stocks are selected (from ALL data)
          if (selectedStocks.size === 0) {
            const topStocks = uniqueSymbols
              .map(symbol => {
                const symbolData = rawData.filter((item: OptionAnalysisData) => item.symbol === symbol);
                const scores = symbolData.map((item: OptionAnalysisData) => item.score);
                return {
                  symbol,
                  peakScore: scores.length > 0 ? Math.max(...scores) : -Infinity,
                  minScore: scores.length > 0 ? Math.min(...scores) : Infinity,
                  dataPoints: scores.length
                };
              })
              .filter(item => item.dataPoints > 0) // Only stocks with data
              .sort((a, b) => b.peakScore - a.peakScore)
              .slice(0, 5) // Top 5 for better visibility
              .map(item => item.symbol);
            
            setSelectedStocks(new Set(topStocks));
          }
        } else {
          setAllData([]);
          setChartData([]);
          setError(`No option analysis data found for ${selectedDate}`);
        }
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (err) {
      console.error('Error fetching progression data:', err);
      setError('Failed to fetch progression data. Please try again.');
      setAllData([]);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, minScore]);

  useEffect(() => {
    fetchProgressionData();
  }, [fetchProgressionData]);

  // Auto-refresh every 5 minutes during market hours
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      const now = new Date();
      const istHour = now.getUTCHours() + 5.5;
      const isMarketHours = istHour >= 9.25 && istHour <= 15.5;
      
      if (isMarketHours) {
        fetchProgressionData();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [fetchProgressionData, autoRefresh]);

  // Get unique symbols for line colors
  const uniqueSymbols = [...new Set(allData.map(item => item.symbol))];
  
  // Enhanced color palette for better visibility and distinction
  const colors = [
    '#2563eb', '#dc2626', '#16a34a', '#f59e0b', '#8b5cf6',
    '#ef4444', '#06b6d4', '#84cc16', '#f97316', '#ec4899',
    '#6366f1', '#10b981', '#f43f5e', '#14b8a6', '#a855f7',
    '#3b82f6', '#ef4444', '#22c55e', '#eab308', '#8b5cf6',
    '#06b6d4', '#f97316', '#ec4899', '#6366f1', '#10b981'
  ];

  // Stock selection handlers
  const toggleStock = (symbol: string) => {
    const newSelected = new Set(selectedStocks);
    if (newSelected.has(symbol)) {
      newSelected.delete(symbol);
    } else {
      newSelected.add(symbol);
    }
    setSelectedStocks(newSelected);
  };

  const selectAllStocks = () => {
    // Select all filtered stocks based on current score filter
    const filteredStocks = uniqueSymbols.filter((symbol) => {
      const symbolData = allData.filter(item => item.symbol === symbol);
      const peakScore = symbolData.length > 0 ? Math.max(...symbolData.map(item => item.score)) : 0;
      
      if (scoreFilter === 999) {
        return peakScore > 500; // Above 500
      }
      return peakScore >= scoreFilter;
    });
    
    setSelectedStocks(new Set(filteredStocks));
  };

  const clearAllStocks = () => {
    setSelectedStocks(new Set());
  };

  const selectTopStocks = (count: number) => {
    // Get filtered stocks based on current score filter
    const filteredStocks = uniqueSymbols.filter((symbol) => {
      const symbolData = allData.filter(item => item.symbol === symbol);
      const peakScore = symbolData.length > 0 ? Math.max(...symbolData.map(item => item.score)) : 0;
      
      if (scoreFilter === 999) {
        return peakScore > 500; // Above 500
      }
      return peakScore >= scoreFilter;
    });

    const topStocks = filteredStocks
      .map(symbol => {
        const symbolData = allData.filter(item => item.symbol === symbol);
        const scores = symbolData.map(item => item.score);
        return {
          symbol,
          peakScore: scores.length > 0 ? Math.max(...scores) : -Infinity,
          dataPoints: scores.length
        };
      })
      .filter(item => item.dataPoints > 0) // Only stocks with data
      .sort((a, b) => b.peakScore - a.peakScore)
      .slice(0, count)
      .map(item => item.symbol);
    
    setSelectedStocks(new Set(topStocks));
  };

  // Get current stats
  const currentStats = {
    totalStocks: uniqueSymbols.length,
    totalDataPoints: allData.length,
    avgScore: allData.length > 0 ? Math.round(allData.reduce((sum, item) => sum + item.score, 0) / allData.length) : 0,
    peakScore: allData.length > 0 ? Math.max(...allData.map(item => item.score)) : 0,
    timeRange: allData.length > 0 ? {
      start: new Date(Math.min(...allData.map(item => new Date(item.analysis_timestamp).getTime()))).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }),
      end: new Date(Math.max(...allData.map(item => new Date(item.analysis_timestamp).getTime()))).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }),
      chartPoints: chartData.length
    } : null
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">Stock Score Progression Chart</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Interactive timeline showing complete daily score evolution for selected stocks - entire trading day progression
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Y-axis: Score • X-axis: Time • Lines: Individual Stocks • Complete Daily Timeline • Updated Every 5 Minutes
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <label className="text-sm font-medium text-gray-700">Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              />
            </div>


            <button
              onClick={fetchProgressionData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <label className="text-sm font-medium text-gray-700">Score Filter:</label>
              <select
                value={scoreFilter}
                onChange={(e) => setScoreFilter(parseInt(e.target.value))}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              >
                <option value={50}>50+</option>
                <option value={80}>80+</option>
                <option value={100}>100+</option>
                <option value={130}>130+</option>
                <option value={180}>180+</option>
                <option value={200}>200+</option>
                <option value={230}>230+</option>
                <option value={250}>250+</option>
                <option value={280}>280+</option>
                <option value={300}>300+</option>
                <option value={330}>330+</option>
                <option value={350}>350+</option>
                <option value={380}>380+</option>
                <option value={400}>400+</option>
                <option value={430}>430+</option>
                <option value={450}>450+</option>
                <option value={480}>480+</option>
                <option value={500}>500+</option>
                <option value={999}>Above 500</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="autoRefresh"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="autoRefresh" className="text-sm text-gray-600">
                Auto-refresh (5min)
              </label>
            </div>

            {currentStats.timeRange && (
              <div className="text-sm text-gray-500 ml-auto">
                📊 Data: {currentStats.timeRange.start} - {currentStats.timeRange.end} ({currentStats.timeRange.chartPoints} points)
              </div>
            )}
          </div>

          {/* Stock Selection Controls */}
          {uniqueSymbols.length > 0 && (
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700">Select Stocks to Display:</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => selectTopStocks(3)}
                    className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-md hover:bg-green-200 font-medium"
                  >
                    Top 3 📊
                  </button>
                  <button
                    onClick={() => selectTopStocks(5)}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 font-medium"
                  >
                    Top 5 📈
                  </button>
                  <button
                    onClick={() => selectTopStocks(10)}
                    className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 font-medium"
                  >
                    Top 10 📉
                  </button>
                  <button
                    onClick={selectAllStocks}
                    className="px-3 py-1 text-xs bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 font-medium"
                  >
                    All ({uniqueSymbols.filter((symbol) => {
                      const symbolData = allData.filter(item => item.symbol === symbol);
                      const peakScore = symbolData.length > 0 ? Math.max(...symbolData.map(item => item.score)) : 0;
                      if (scoreFilter === 999) return peakScore > 500;
                      return peakScore >= scoreFilter;
                    }).length}) ⚠️
                  </button>
                  <button
                    onClick={clearAllStocks}
                    className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 font-medium"
                  >
                    Clear 🗑️
                  </button>
                </div>
              </div>

              {/* Stock Selection Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
                {uniqueSymbols
                  .filter((symbol) => {
                    // Filter stocks by score
                    const symbolData = allData.filter(item => item.symbol === symbol);
                    const peakScore = symbolData.length > 0 ? Math.max(...symbolData.map(item => item.score)) : 0;
                    
                    if (scoreFilter === 999) {
                      return peakScore > 500; // Above 500
                    }
                    return peakScore >= scoreFilter;
                  })
                  .sort((a, b) => {
                    const aData = allData.filter(item => item.symbol === a);
                    const bData = allData.filter(item => item.symbol === b);
                    const aScore = aData.length > 0 ? Math.max(...aData.map(item => item.score)) : -Infinity;
                    const bScore = bData.length > 0 ? Math.max(...bData.map(item => item.score)) : -Infinity;
                    return bScore - aScore;
                  })
                  .map((symbol, index) => {
                    const isSelected = selectedStocks.has(symbol);
                    const symbolData = allData.filter(item => item.symbol === symbol);
                    const peakScore = symbolData.length > 0 ? Math.max(...symbolData.map(item => item.score)) : 0;
                    
                    return (
                      <div
                        key={symbol}
                        onClick={() => toggleStock(symbol)}
                        className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-blue-100 border-2 border-blue-300 shadow-sm' 
                            : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                        }`}
                      >
                        <div 
                          className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: isSelected ? colors[index % colors.length] : '#d1d5db' }}
                        ></div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-gray-800 truncate">{symbol}</div>
                          <div className="text-xs text-gray-500">{peakScore.toFixed(0)}</div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              <div className="mt-3 text-xs text-gray-500 text-center">
                Selected: {selectedStocks.size} stocks • Click to toggle • Sorted by peak score
              </div>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Total Stocks</span>
            </div>
            <div className="text-2xl font-bold text-blue-700">{currentStats.totalStocks}</div>
            <div className="text-xs text-blue-600">All analyzed stocks</div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">Peak Score</span>
            </div>
            <div className="text-2xl font-bold text-green-700">{currentStats.peakScore}</div>
            <div className="text-xs text-green-600">Highest today</div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">Avg Score</span>
            </div>
            <div className="text-2xl font-bold text-purple-700">{currentStats.avgScore}</div>
            <div className="text-xs text-purple-600">All stocks average</div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">Time Range</span>
            </div>
            <div className="text-lg font-bold text-orange-700">
              {currentStats.timeRange ? `${currentStats.timeRange.start} - ${currentStats.timeRange.end}` : 'No Data'}
            </div>
            <div className="text-xs text-orange-600">
              {currentStats.totalDataPoints} data points • {currentStats.timeRange?.chartPoints || 0} chart points
            </div>
          </div>
        </div>

        {/* Interactive Chart */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6 w-full max-w-none">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Score Progression Timeline</h2>
            <div className="text-sm text-gray-500">
              Last updated: {lastUpdated} • Auto-refresh: {autoRefresh ? '✅ ON' : '❌ OFF'}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                <span className="text-gray-600">Loading progression data...</span>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="text-red-500 mb-2">⚠️ {error}</div>
                <button
                  onClick={fetchProgressionData}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="text-gray-500 mb-2">📊 No strong bullish stocks found</div>
                <div className="text-sm text-gray-400">
                  No stocks with score ≥ {minScore} found for {selectedDate}
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  Try lowering the minimum score or selecting a different date
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[800px]"> {/* Increased height from 600px to 800px */}
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 30, right: 30, left: 30, bottom: 100 }}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#e5e7eb" strokeOpacity={0.5} />
                  <XAxis 
                    dataKey="time" 
                    stroke="#374151"
                    fontSize={10}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    interval={0} // Show ALL time points
                    tick={{ fontSize: 10 }}
                    minTickGap={5} // Minimum gap between ticks
                  />
                  <YAxis 
                    stroke="#374151"
                    fontSize={12}
                    label={{ value: 'Score', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                    domain={['dataMin - 50', 'dataMax + 50']}
                    tick={{ fontSize: 11 }}
                    width={70}
                    tickCount={15}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '13px',
                      maxWidth: '320px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }}
                    labelStyle={{ color: '#1f2937', fontWeight: 'bold', marginBottom: '8px' }}
                    formatter={(value: number, name: string) => [
                      <span style={{ fontWeight: 'bold', color: colors[uniqueSymbols.indexOf(name) % colors.length] }}>
                        {value.toFixed(1)}
                      </span>, 
                      <span style={{ fontWeight: 'bold' }}>{name}</span>
                    ]}
                  />
                  <Legend 
                    wrapperStyle={{ 
                      paddingTop: '30px',
                      fontSize: '12px'
                    }}
                    iconType="line"
                    layout="horizontal"
                    align="center"
                  />
                  
                  {/* Enhanced Reference lines */}
                  <ReferenceLine 
                    y={100} 
                    stroke="#f59e0b" 
                    strokeDasharray="8 4" 
                    strokeWidth={2}
                    label={{ value: "Strong (100)", position: "topRight", style: { fontSize: '11px', fill: '#f59e0b' } }}
                  />
                  <ReferenceLine 
                    y={200} 
                    stroke="#ef4444" 
                    strokeDasharray="6 3" 
                    strokeWidth={2}
                    label={{ value: "Explosive (200)", position: "topRight", style: { fontSize: '11px', fill: '#ef4444' } }}
                  />
                  <ReferenceLine 
                    y={300} 
                    stroke="#dc2626" 
                    strokeDasharray="4 2" 
                    strokeWidth={2}
                    label={{ value: "Extreme (300)", position: "topRight", style: { fontSize: '11px', fill: '#dc2626' } }}
                  />
                  <ReferenceLine 
                    y={0} 
                    stroke="#6b7280" 
                    strokeWidth={1} 
                    strokeOpacity={0.5}
                    label={{ value: "Neutral", position: "topLeft", style: { fontSize: '10px', fill: '#6b7280' } }}
                  />
                  
                  {/* Enhanced lines for SELECTED stocks only */}
                  {Array.from(selectedStocks).map((symbol) => {
                    const symbolIndex = uniqueSymbols.indexOf(symbol);
                    const stockColor = colors[symbolIndex % colors.length];
                    
                    return (
                      <Line
                        key={symbol}
                        type="monotone"
                        dataKey={symbol}
                        stroke={stockColor}
                        strokeWidth={3} // Thicker lines for better visibility
                        dot={{ 
                          r: 5, 
                          strokeWidth: 2, 
                          fill: stockColor,
                          stroke: '#fff'
                        }}
                        connectNulls={false}
                        name={symbol}
                        activeDot={{ 
                          r: 8, 
                          strokeWidth: 3,
                          fill: stockColor,
                          stroke: '#fff'
                        }}
                      />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Chart Selection Info & Visibility Warnings */}
          {selectedStocks.size > 15 && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="text-sm text-red-800 font-medium">
                ⚠️ Too Many Lines! ({selectedStocks.size} stocks selected)
              </div>
              <div className="text-xs text-red-600 mt-1">
                For better visibility, consider selecting fewer stocks (recommended: 3-10). Complete daily progression may be difficult to read with {selectedStocks.size} lines.
              </div>
            </div>
          )}
          
          {selectedStocks.size > 5 && selectedStocks.size <= 15 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="text-sm text-yellow-800">
                📊 Displaying complete daily progression for {selectedStocks.size} stocks - Chart may be crowded
              </div>
              <div className="text-xs text-yellow-600 mt-1">
                For optimal visibility of daily trends, try selecting 3-5 stocks
              </div>
            </div>
          )}
          
          {selectedStocks.size > 0 && selectedStocks.size <= 5 && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="text-sm text-green-800">
                ✅ Optimal visibility - Complete daily progression for {selectedStocks.size} selected stocks
              </div>
              <div className="text-xs text-green-600 mt-1">
                Selected: {Array.from(selectedStocks).sort().join(', ')} • Full day timeline displayed
              </div>
            </div>
          )}
          
          {selectedStocks.size === 0 && uniqueSymbols.length > 0 && (
            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
              <div className="text-sm text-orange-800">
                ⚠️ No stocks selected for display. Choose stocks above to see their complete daily score progression.
              </div>
            </div>
          )}
        </div>

        {/* Stock Performance Summary */}
        {allData.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Strong Stock Performance Summary</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uniqueSymbols.slice(0, 12).map((symbol) => {
                const stockData = allData.filter(item => item.symbol === symbol);
                const latestData = stockData[stockData.length - 1];
                const firstData = stockData[0];
                const scoreChange = latestData.score - firstData.score;
                const priceChange = ((latestData.current_price - firstData.current_price) / firstData.current_price) * 100;
                
                return (
                  <div key={symbol} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: colors[uniqueSymbols.indexOf(symbol) % colors.length] }}
                        ></div>
                        <span className="font-bold text-gray-800">{symbol}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        latestData.institutional_sentiment === 'STRONGLY_BULLISH' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {latestData.institutional_sentiment.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Latest Score:</span>
                        <span className="font-bold text-green-600">{latestData.score.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Score Change:</span>
                        <span className={`font-medium ${scoreChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {scoreChange >= 0 ? '+' : ''}{scoreChange.toFixed(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price Change:</span>
                        <span className={`font-medium ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Data Points:</span>
                        <span className="text-gray-800">{stockData.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">PCR:</span>
                        <span className="text-gray-800">{latestData.overall_pcr.toFixed(3)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>
            📊 Strong Bullish Progression Analysis • ⏱️ Real-time Tracking • 🎯 Score ≥ {minScore} Filter • 🔒 Internal Use Only
          </p>
        </div>
      </div>
    </div>
  );
}
