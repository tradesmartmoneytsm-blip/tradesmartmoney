'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Filter, Info } from 'lucide-react';

interface HeatmapStock {
  symbol: string;
  price_change: number;
  oi_change: number;
  volume: number;
  ltp: number;
  buildup_type?: string;
}

type ViewType = 'price' | 'oi' | 'volume';
type BuildupType = 'all' | 'long' | 'short' | 'long_unwind' | 'short_cover';

export default function FNOHeatmapClient() {
  const [viewType, setViewType] = useState<ViewType>('price');
  const [heatmapData, setHeatmapData] = useState<HeatmapStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [expiry, setExpiry] = useState('current');
  const [buildup, setBuildup] = useState<BuildupType>('all');
  const [sector, setSector] = useState('all');
  const [index, setIndex] = useState('all');
  
  useEffect(() => {
    fetchHeatmapData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewType, expiry, buildup, sector, index]);
  
  const fetchHeatmapData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ftype: viewType,
        explist: expiry === 'current' ? getCurrentExpiry() : expiry,
        bulist: buildup,
        sectorfno: sector,
        indexlist: index
      });
      
      const response = await fetch(`/api/fno-heatmap?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setHeatmapData(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching heatmap:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const getCurrentExpiry = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    let daysUntilThursday = 4 - dayOfWeek;
    if (daysUntilThursday <= 0) daysUntilThursday += 7;
    
    const expiryDate = new Date(now);
    expiryDate.setDate(now.getDate() + daysUntilThursday);
    
    const day = expiryDate.getDate();
    const month = expiryDate.toLocaleString('en-US', { month: 'short' });
    const year = expiryDate.getFullYear();
    
    return `${day}-${month}-${year}`;
  };
  
  const getColor = (value: number, type: ViewType) => {
    if (type === 'price' || type === 'oi') {
      // Green for positive, red for negative
      if (value > 3) return 'bg-green-600 text-white';
      if (value > 2) return 'bg-green-500 text-white';
      if (value > 1) return 'bg-green-400 text-gray-900';
      if (value > 0.5) return 'bg-green-300 text-gray-900';
      if (value > 0) return 'bg-green-200 text-gray-900';
      if (value > -0.5) return 'bg-gray-200 text-gray-900';
      if (value > -1) return 'bg-red-200 text-gray-900';
      if (value > -2) return 'bg-red-300 text-gray-900';
      if (value > -3) return 'bg-red-400 text-white';
      return 'bg-red-600 text-white';
    } else {
      // Volume - all green shades
      if (value > 20000) return 'bg-green-700 text-white';
      if (value > 15000) return 'bg-green-600 text-white';
      if (value > 10000) return 'bg-green-500 text-white';
      if (value > 5000) return 'bg-green-400 text-gray-900';
      if (value > 2000) return 'bg-green-300 text-gray-900';
      return 'bg-green-200 text-gray-900';
    }
  };
  
  const formatValue = (value: number, type: ViewType) => {
    if (type === 'volume') {
      if (value > 1000) return `${(value / 1000).toFixed(1)}K`;
      return value.toFixed(0);
    }
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            F&O Options Heatmap
          </h1>
          <p className="text-gray-600">
            Live visualization of price changes, open interest, and volume across all F&O stocks
          </p>
        </div>
        
        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* View Type Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewType('price')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewType === 'price'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Price
              </button>
              <button
                onClick={() => setViewType('oi')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewType === 'oi'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                OI
              </button>
              <button
                onClick={() => setViewType('volume')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewType === 'volume'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Volume
              </button>
            </div>
            
            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filter
              </button>
              <button
                onClick={fetchHeatmapData}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
          
          {/* Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry
                </label>
                <select
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="current">Current Week</option>
                  <option value="next">Next Week</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buildup
                </label>
                <select
                  value={buildup}
                  onChange={(e) => setBuildup(e.target.value as BuildupType)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All</option>
                  <option value="long">Long</option>
                  <option value="short">Short</option>
                  <option value="long_unwind">Long Unwind</option>
                  <option value="short_cover">Short Cover</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sector
                </label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Sectors</option>
                  <option value="banking">Banking</option>
                  <option value="it">IT</option>
                  <option value="pharma">Pharma</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Index
                </label>
                <select
                  value={index}
                  onChange={(e) => setIndex(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Indices</option>
                  <option value="nifty50">Nifty 50</option>
                  <option value="banknifty">Bank Nifty</option>
                  <option value="finnifty">Fin Nifty</option>
                </select>
              </div>
            </div>
          )}
        </div>
        
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-medium mb-1">How to read this heatmap:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li><span className="font-medium">Green tiles</span>: Positive price change / OI increase / High volume</li>
              <li><span className="font-medium">Red tiles</span>: Negative price change / OI decrease / Low volume</li>
              <li><span className="font-medium">Darker colors</span>: Stronger intensity</li>
              <li>Click on any stock to see detailed option chain analysis</li>
            </ul>
          </div>
        </div>
        
        {/* Heatmap Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
              <p className="text-gray-600">Loading heatmap data...</p>
            </div>
          </div>
        ) : heatmapData.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 mb-4">No data available for selected filters</p>
            <button
              onClick={fetchHeatmapData}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Try refreshing
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
              {heatmapData.map((stock, index) => {
                const value = viewType === 'price' ? stock.price_change :
                              viewType === 'oi' ? stock.oi_change :
                              stock.volume;
                
                return (
                  <div
                    key={index}
                    className={`p-3 rounded-lg cursor-pointer transition-transform hover:scale-105 ${getColor(value, viewType)}`}
                    onClick={() => window.open(`/option-analysis?symbol=${stock.symbol}`, '_blank')}
                    title={`${stock.symbol}: ${formatValue(value, viewType)}`}
                  >
                    <div className="font-bold text-sm mb-1">{stock.symbol}</div>
                    <div className="text-xs opacity-90">
                      {viewType === 'price' && `P ${stock.price_change >= 0 ? '+' : ''}${stock.price_change.toFixed(2)}%`}
                      {viewType === 'oi' && `OI: ${stock.oi_change >= 0 ? '+' : ''}${stock.oi_change.toFixed(2)}%`}
                      {viewType === 'volume' && `V: ${formatValue(stock.volume, 'volume')}`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Legend */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-4">
          <h3 className="font-medium text-gray-900 mb-3">Color Scale</h3>
          <div className="flex items-center gap-2 flex-wrap">
            {viewType !== 'volume' ? (
              <>
                <div className="flex items-center gap-1">
                  <div className="w-12 h-6 bg-red-600 rounded"></div>
                  <span className="text-xs text-gray-600">&lt;-3%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-12 h-6 bg-red-400 rounded"></div>
                  <span className="text-xs text-gray-600">-2%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-12 h-6 bg-red-200 rounded"></div>
                  <span className="text-xs text-gray-600">-1%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-12 h-6 bg-gray-200 rounded"></div>
                  <span className="text-xs text-gray-600">0%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-12 h-6 bg-green-200 rounded"></div>
                  <span className="text-xs text-gray-600">+1%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-12 h-6 bg-green-400 rounded"></div>
                  <span className="text-xs text-gray-600">+2%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-12 h-6 bg-green-600 rounded"></div>
                  <span className="text-xs text-gray-600">&gt;+3%</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1">
                  <div className="w-12 h-6 bg-green-200 rounded"></div>
                  <span className="text-xs text-gray-600">Low</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-12 h-6 bg-green-400 rounded"></div>
                  <span className="text-xs text-gray-600">Medium</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-12 h-6 bg-green-600 rounded"></div>
                  <span className="text-xs text-gray-600">High</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-12 h-6 bg-green-700 rounded"></div>
                  <span className="text-xs text-gray-600">Very High</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

