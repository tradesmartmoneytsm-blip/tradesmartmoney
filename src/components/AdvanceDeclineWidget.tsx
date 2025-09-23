'use client';

import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown, X, BarChart3 } from 'lucide-react';

interface AdvanceDeclineData {
  date: string;
  advances: number;
  declines: number;
}

interface AdvanceDeclineResponse {
  success: boolean;
  data: AdvanceDeclineData[];
  count: number;
  lastUpdated: string;
  timestamp: string;
  message?: string;
  error?: string;
}

export function AdvanceDeclineWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<AdvanceDeclineData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/advance-decline');
      const result: AdvanceDeclineResponse = await response.json();

      if (result.success && result.data) {
        setData(result.data);
        setLastUpdated(result.lastUpdated);
      } else {
        setError(result.message || 'Failed to fetch advance-decline data');
        // Still set data if available (fallback scenario)
        if (result.data) {
          setData(result.data);
          setLastUpdated(result.lastUpdated);
        }
      }
    } catch (err) {
      console.error('Error fetching advance-decline data:', err);
      setError('Network error while fetching data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && data.length === 0) {
      fetchData();
    }
  }, [isOpen, data.length, fetchData]);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getLatestData = () => {
    if (data.length === 0) return null;
    return data[data.length - 1];
  };

  const getAdvanceDeclineRatio = () => {
    const latest = getLatestData();
    if (!latest) return 0;
    return (latest.advances / (latest.advances + latest.declines)) * 100;
  };

  const getSentiment = () => {
    const ratio = getAdvanceDeclineRatio();
    if (ratio > 60) return { text: 'Bullish', color: 'text-green-600', bg: 'bg-green-100' };
    if (ratio < 40) return { text: 'Bearish', color: 'text-red-600', bg: 'bg-red-100' };
    return { text: 'Neutral', color: 'text-yellow-600', bg: 'bg-yellow-100' };
  };

  const latest = getLatestData();
  const sentiment = getSentiment();

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group"
          title="Advance-Decline Ratio"
        >
          <BarChart3 className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            // Close modal when clicking on the backdrop
            if (e.target === e.currentTarget) {
              setIsOpen(false);
            }
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  📊 Advance-Decline Ratio
                </h2>
                <p className="text-sm text-gray-600 mt-1">Real-time market breadth analysis</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Loading data...</span>
                </div>
              ) : error && data.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-red-500 mb-2">❌ {error}</div>
                  <button
                    onClick={fetchData}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <>
                  {/* Summary Cards */}
                  {latest && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                        <div className="text-xs text-green-600 font-medium mb-1">ADVANCED</div>
                        <div className="text-2xl font-bold text-green-800">{latest.advances.toLocaleString()}</div>
                        <TrendingUp className="w-4 h-4 text-green-600 mx-auto mt-1" />
                      </div>
                      
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                        <div className="text-xs text-red-600 font-medium mb-1">DECLINED</div>
                        <div className="text-2xl font-bold text-red-800">{latest.declines.toLocaleString()}</div>
                        <TrendingDown className="w-4 h-4 text-red-600 mx-auto mt-1" />
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                        <div className="text-xs text-blue-600 font-medium mb-1">RATIO</div>
                        <div className="text-2xl font-bold text-blue-800">{getAdvanceDeclineRatio().toFixed(1)}%</div>
                        <div className="text-xs text-blue-600 mt-1">Advances/Total</div>
                      </div>
                      
                      <div className={`${sentiment.bg} border rounded-lg p-4 text-center`}>
                        <div className="text-xs font-medium mb-1 text-gray-600">SENTIMENT</div>
                        <div className={`text-2xl font-bold ${sentiment.color}`}>{sentiment.text}</div>
                        <div className="text-xs text-gray-600 mt-1">Market Breadth</div>
                      </div>
                    </div>
                  )}

                  {/* Chart Container */}
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Intraday Trend</h3>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                          <span>Advances</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                          <span>Declines</span>
                        </div>
                      </div>
                    </div>

                    {/* Simple Chart */}
                    <div className="relative h-64 bg-white rounded border">
                      <svg width="100%" height="100%" className="overflow-visible">
                        {data.length > 0 && (
                          <>
                            {/* Chart Lines */}
                            {data.map((item, index) => {
                              if (index === 0) return null;
                              
                              const prevItem = data[index - 1];
                              const x1 = ((index - 1) / (data.length - 1)) * 100;
                              const x2 = (index / (data.length - 1)) * 100;
                              
                              const maxValue = Math.max(...data.map(d => Math.max(d.advances, d.declines)));
                              const minValue = Math.min(...data.map(d => Math.min(d.advances, d.declines)));
                              const range = maxValue - minValue || 1;
                              
                              const y1Advances = 90 - ((prevItem.advances - minValue) / range) * 80;
                              const y2Advances = 90 - ((item.advances - minValue) / range) * 80;
                              const y1Declines = 90 - ((prevItem.declines - minValue) / range) * 80;
                              const y2Declines = 90 - ((item.declines - minValue) / range) * 80;
                              
                              return (
                                <g key={index}>
                                  {/* Advances Line */}
                                  <line
                                    x1={`${x1}%`}
                                    y1={`${y1Advances}%`}
                                    x2={`${x2}%`}
                                    y2={`${y2Advances}%`}
                                    stroke="#10b981"
                                    strokeWidth="2"
                                  />
                                  {/* Declines Line */}
                                  <line
                                    x1={`${x1}%`}
                                    y1={`${y1Declines}%`}
                                    x2={`${x2}%`}
                                    y2={`${y2Declines}%`}
                                    stroke="#ef4444"
                                    strokeWidth="2"
                                  />
                                </g>
                              );
                            })}
                            
                            {/* Data Points */}
                            {data.map((item, index) => {
                              const x = (index / (data.length - 1)) * 100;
                              const maxValue = Math.max(...data.map(d => Math.max(d.advances, d.declines)));
                              const minValue = Math.min(...data.map(d => Math.min(d.advances, d.declines)));
                              const range = maxValue - minValue || 1;
                              
                              const yAdvances = 90 - ((item.advances - minValue) / range) * 80;
                              const yDeclines = 90 - ((item.declines - minValue) / range) * 80;
                              
                              return (
                                <g key={index}>
                                  <circle
                                    cx={`${x}%`}
                                    cy={`${yAdvances}%`}
                                    r="3"
                                    fill="#10b981"
                                  />
                                  <circle
                                    cx={`${x}%`}
                                    cy={`${yDeclines}%`}
                                    r="3"
                                    fill="#ef4444"
                                  />
                                </g>
                              );
                            })}
                          </>
                        )}
                      </svg>
                      
                      {/* Time Labels */}
                      <div className="absolute bottom-2 left-0 right-0 flex justify-between px-4 text-xs text-gray-500">
                        {data.length > 0 && (
                          <>
                            <span>{formatTime(data[0].date)}</span>
                            <span>{formatTime(data[Math.floor(data.length / 2)].date)}</span>
                            <span>{formatTime(data[data.length - 1].date)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Summary Section */}
                  {latest && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Market Summary</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">As on: <span className="font-medium">{formatDate(lastUpdated)} {formatTime(lastUpdated)}</span></div>
                          <div className="mt-2">
                            <div className="text-gray-600">Advanced: <span className="font-bold text-green-600">{latest.advances.toLocaleString()}</span></div>
                            <div className="text-gray-600">Declined: <span className="font-bold text-red-600">{latest.declines.toLocaleString()}</span></div>
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600">Total Stocks: <span className="font-medium">{(latest.advances + latest.declines).toLocaleString()}</span></div>
                          <div className="mt-2">
                            <div className="text-gray-600">Advance Ratio: <span className="font-bold">{getAdvanceDeclineRatio().toFixed(1)}%</span></div>
                            <div className="text-gray-600">Market Breadth: <span className={`font-bold ${sentiment.color}`}>{sentiment.text}</span></div>
                          </div>
                        </div>
                      </div>
                      
                      {error && (
                        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                          ⚠️ {error}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Refresh Button */}
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={fetchData}
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
                    >
                      {loading ? 'Refreshing...' : 'Refresh Data'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
