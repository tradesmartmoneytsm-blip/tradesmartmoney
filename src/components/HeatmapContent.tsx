'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';

type ViewType = 'price' | 'oi' | 'volume';
type BuildupType = 'all' | 'long' | 'short' | 'long_unwind' | 'short_cover';

interface HeatmapStock {
  symbol: string;
  sector: string;
  index_name: string;
  price_change?: number;  // Absolute change in rupees
  price_change_percent?: number;  // Percentage change
  oi_change?: number;  // Absolute OI change
  oi_change_percent?: number;  // OI percentage change
  volume?: number;
  buildup_type: string;
  ltp?: number;
  last_updated?: string;
}

export function HeatmapContent() {
  const router = useRouter();
  const [heatmapData, setHeatmapData] = useState<HeatmapStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState<ViewType>('price');
  const [buildup, setBuildup] = useState<BuildupType>('all');
  const [sector, setSector] = useState('all');
  const [index, setIndex] = useState('all');
  
  const getValue = (stock: HeatmapStock, type: ViewType): number => {
    if (type === 'price') return stock.price_change_percent || 0;  // Use PERCENT not absolute!
    if (type === 'oi') return stock.oi_change_percent || 0;  // Use PERCENT not absolute!
    return stock.volume || 0;
  };
  
  const fetchHeatmapData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        view_type: viewType,
        buildup: buildup,
        sector: sector,
        index: index
      });
      
      const response = await fetch(`/api/fno-heatmap?${params}`);
      const result = await response.json();
      
      if (result.success && result.data) {
        // Sort data to match Research360's behavior:
        // 1. Positive values first (sorted high to low)
        // 2. Then negative values (sorted high to low, i.e., least negative first)
        const sortedData = [...result.data].sort((a, b) => {
          const aValue = getValue(a, viewType);
          const bValue = getValue(b, viewType);
          
          // Both positive or both negative: sort descending
          if ((aValue >= 0 && bValue >= 0) || (aValue < 0 && bValue < 0)) {
            return bValue - aValue;
          }
          
          // One positive, one negative: positive comes first
          return aValue >= 0 ? -1 : 1;
        });
        setHeatmapData(sortedData);
      }
    } catch (error) {
      console.error('Error fetching heatmap:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchHeatmapData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewType, buildup, sector, index]);
  
  const getMotilalOswalColor = (value: number, type: ViewType) => {
    if (type === 'price' || type === 'oi') {
      // Terminal style: Green/Red on dark background
      if (value > 4) return 'bg-[#00ff41]/30 text-[#00ff41] border border-[#00ff41]/50'; // Bright green
      if (value > 2.5) return 'bg-[#00ff41]/25 text-[#00ff41] border border-[#00ff41]/40'; // Green
      if (value > 1.5) return 'bg-[#00ff41]/20 text-[#00ff41] border border-[#00ff41]/30'; // Light green
      if (value > 0.5) return 'bg-[#00ff41]/15 text-[#00ff41] border border-[#00ff41]/20'; // Very light green
      if (value > 0) return 'bg-[#00ff41]/10 text-[#00ff41] border border-[#00ff41]/15'; // Pale green
      if (value > -0.5) return 'bg-[#333333] text-[#888888] border border-[#666666]/30'; // Gray/neutral
      if (value > -1) return 'bg-[#ff4444]/10 text-[#ff4444] border border-[#ff4444]/15'; // Pale red
      if (value > -1.5) return 'bg-[#ff4444]/15 text-[#ff4444] border border-[#ff4444]/20'; // Light red
      if (value > -2.5) return 'bg-[#ff4444]/25 text-[#ff4444] border border-[#ff4444]/40'; // Red
      return 'bg-[#ff4444]/30 text-[#ff4444] border border-[#ff4444]/50'; // Dark red
    } else {
      // Volume - Cyan shades for terminal
      if (value > 50000) return 'bg-[#00d4ff]/30 text-[#00d4ff] border border-[#00d4ff]/50';
      if (value > 20000) return 'bg-[#00d4ff]/25 text-[#00d4ff] border border-[#00d4ff]/40';
      if (value > 10000) return 'bg-[#00d4ff]/20 text-[#00d4ff] border border-[#00d4ff]/30';
      if (value > 5000) return 'bg-[#00d4ff]/15 text-[#00d4ff] border border-[#00d4ff]/20';
      if (value > 2000) return 'bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/15';
      return 'bg-[#333333] text-[#888888] border border-[#666666]/30';
    }
  };
  
  const formatValue = (value: number | undefined, type: ViewType) => {
    if (value === undefined) return 'N/A';
    if (type === 'volume') {
      if (value > 100000) return `${(value / 100000).toFixed(1)}L`;
      if (value > 1000) return `${(value / 1000).toFixed(1)}K`;
      return value.toFixed(0);
    }
    return `${value >= 0 ? '' : ''}${value.toFixed(2)}%`;
  };
  
  return (
    <article className="w-full px-2 sm:px-3 md:px-4 lg:px-5 xl:px-6 2xl:px-8 py-2 sm:py-3 md:py-4 lg:py-5">
      <header className="mb-3 sm:mb-4 lg:mb-6">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#00ff41] mb-2 font-mono uppercase tracking-wider">OPTIONS_HEATMAP</h1>
        <p className="text-sm lg:text-base text-[#cccccc] font-mono">
          Visual representation of F&O stocks by Price, Open Interest, and Volume changes.
        </p>
      </header>

      <div className="bg-[#111111] rounded-sm shadow-[0_0_20px_rgba(0,255,65,0.1)] border border-[#00ff41]/30 p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          {/* View Type Selector */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-[#00ff41] font-mono uppercase">VIEW:</label>
            <select
              value={viewType}
              onChange={(e) => setViewType(e.target.value as ViewType)}
              className="block w-full pl-3 pr-10 py-2 text-base bg-[#1a1a1a] text-[#cccccc] border-[#00ff41]/30 focus:outline-none focus:ring-[#00ff41]/50 focus:border-[#00ff41]/50 sm:text-sm rounded-sm font-mono"
            >
              <option value="price">Price</option>
              <option value="oi">Open Interest</option>
              <option value="volume">Volume</option>
            </select>
          </div>

          {/* Buildup Filter */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-[#00ff41] font-mono uppercase">BUILDUP:</label>
            <select
              value={buildup}
              onChange={(e) => setBuildup(e.target.value as BuildupType)}
              className="block w-full pl-3 pr-10 py-2 text-base bg-[#1a1a1a] text-[#cccccc] border-[#00ff41]/30 focus:outline-none focus:ring-[#00ff41]/50 focus:border-[#00ff41]/50 sm:text-sm rounded-sm font-mono"
            >
              <option value="all">All</option>
              <option value="long">Long Buildup</option>
              <option value="short">Short Buildup</option>
              <option value="long_unwind">Long Unwind</option>
              <option value="short_cover">Short Cover</option>
            </select>
          </div>

          {/* Sector Filter */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-[#00ff41] font-mono uppercase">SECTOR:</label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base bg-[#1a1a1a] text-[#cccccc] border-[#00ff41]/30 focus:outline-none focus:ring-[#00ff41]/50 focus:border-[#00ff41]/50 sm:text-sm rounded-sm font-mono"
            >
              <option value="all">All Sector</option>
              <option value="Utilities">Utilities</option>
              <option value="Metals & Mining">Metals & Mining</option>
              <option value="Food, Beverages & Tobacco">Food, Beverages & Tobacco</option>
              <option value="Oil & Gas">Oil & Gas</option>
              <option value="Banking and Finance">Banking and Finance</option>
              <option value="Cement and Construction">Cement and Construction</option>
              <option value="General Industrials">General Industrials</option>
              <option value="Commercial Services & Supplies">Commercial Services & Supplies</option>
              <option value="Biotechnology">Biotechnology</option>
              <option value="Chemicals & Petrochemicals">Chemicals & Petrochemicals</option>
              <option value="Realty">Realty</option>
              <option value="Diversified Consumer Services">Diversified Consumer Services</option>
              <option value="Automobiles & Auto Components">Automobiles & Auto Components</option>
              <option value="Textiles Apparels & Accessories">Textiles Apparels & Accessories</option>
              <option value="Retailing">Retailing</option>
              <option value="Telecom Services">Telecom Services</option>
              <option value="Healthcare">Healthcare</option>
            </select>
          </div>

          {/* Index Filter */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-[#00ff41] font-mono uppercase">INDEX:</label>
            <select
              value={index}
              onChange={(e) => setIndex(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base bg-[#1a1a1a] text-[#cccccc] border-[#00ff41]/30 focus:outline-none focus:ring-[#00ff41]/50 focus:border-[#00ff41]/50 sm:text-sm rounded-sm font-mono"
            >
              <option value="all">All FNO</option>
              <option value="NIFTY">NIFTY</option>
              <option value="Bank NIFTY">Bank NIFTY</option>
            </select>
          </div>

          <button
            onClick={fetchHeatmapData}
            className="inline-flex items-center px-4 py-2 border border-[#00ff41]/50 text-sm font-medium rounded-sm shadow-[0_0_10px_rgba(0,255,65,0.2)] text-[#00ff41] bg-[#00ff41]/10 hover:bg-[#00ff41]/15 hover:shadow-[0_0_20px_rgba(0,255,65,0.4)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00ff41]/50 font-mono uppercase"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00ff41] mx-auto"></div>
          <p className="mt-4 text-[#00ff41] font-mono">LOADING_HEATMAP_DATA...</p>
        </div>
      )}

      {!loading && heatmapData.length === 0 && (
        <div className="text-center py-8 bg-[#111111] rounded-sm shadow-[0_0_20px_rgba(0,255,65,0.1)] border border-[#00ff41]/30">
          <Info className="h-12 w-12 text-[#00ff41] mx-auto mb-4" />
          <h3 className="mt-2 text-lg font-medium text-[#00ff41] font-mono uppercase">NO_HEATMAP_DATA_AVAILABLE</h3>
          <p className="mt-1 text-sm text-[#cccccc] font-mono">
            Data is typically available during market hours (9:15 AM - 3:30 PM IST). Please refresh later.
          </p>
        </div>
      )}

      {!loading && heatmapData.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3">
          {heatmapData
            .filter((stock) => {
              // Exclude index symbols, show only individual stocks
              const indicesToExclude = ['NIFTY', 'BANKNIFTY', 'FINNIFTY', 'MIDCPNIFTY', 'NIFTYNXT50', 'SENSEX', 'BANKEX'];
              return !indicesToExclude.includes(stock.symbol);
            })
            .map((stock) => {
              const value = getValue(stock, viewType);
              const colorClass = getMotilalOswalColor(value, viewType);
              
              return (
                <div
                  key={stock.symbol}
                  className={`relative p-3 rounded-sm shadow-[0_0_10px_rgba(0,255,65,0.1)] flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,255,65,0.2)] font-mono ${colorClass}`}
                  onClick={() => router.push(`/fno/option-analysis?symbol=${stock.symbol}`)}
                  title={`${stock.symbol} - ${viewType === 'price' ? 'Price' : viewType === 'oi' ? 'OI' : 'Volume'} Change: ${formatValue(value, viewType)}`}
                >
                  <span className="font-bold text-sm sm:text-base">{stock.symbol}</span>
                  <span className="text-xs sm:text-sm mt-1">{formatValue(value, viewType)}</span>
                  {stock.sector && (
                    <span className="text-[0.6rem] sm:text-xs opacity-80 mt-1">{stock.sector}</span>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </article>
  );
}
