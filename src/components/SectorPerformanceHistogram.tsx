'use client';

import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown, ArrowLeft } from 'lucide-react';
import { useSectorData } from '@/contexts/SectorDataContext';

interface AdvanceDeclineData {
  advances: number;
  declines: number;
}

interface StockData {
  symbol: string;
  name: string;
  change: number;
  changePercent: number;
  price: number;
  volume: number;
  high: number;
  low: number;
  marketCap: number;
  pe: number;
}

interface SectorPerformanceHistogramProps {
  className?: string;
}

export function SectorPerformanceHistogram({ className = '' }: SectorPerformanceHistogramProps) {
  const { sectorData, isLoading, timeRange, setTimeRange } = useSectorData();
  const [advanceDeclineData, setAdvanceDeclineData] = useState<AdvanceDeclineData | null>(null);
  const [adLoading, setAdLoading] = useState(true);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [stocksData, setStocksData] = useState<StockData[]>([]);
  const [stocksLoading, setStocksLoading] = useState(false);

  // Fetch advance-decline data
  const fetchAdvanceDecline = useCallback(async () => {
    try {
      const response = await fetch('/api/advance-decline');
      const result = await response.json();
      
      if (result.success && result.data && result.data.length > 0) {
        // Get the latest data point
        const latest = result.data[result.data.length - 1];
        setAdvanceDeclineData({
          advances: latest.advances,
          declines: latest.declines
        });
      }
    } catch (error) {
      console.error('Failed to fetch advance-decline data:', error);
    } finally {
      setAdLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdvanceDecline();
    // Refresh every minute
    const interval = setInterval(fetchAdvanceDecline, 60000);
    return () => clearInterval(interval);
  }, [fetchAdvanceDecline]);

  // Fetch stocks for selected sector
  const fetchSectorStocks = useCallback(async (sectorName: string) => {
    setStocksLoading(true);
    try {
      const response = await fetch(`/api/sector-stocks?sector=${encodeURIComponent(sectorName)}&timeRange=${timeRange}`);
      const result = await response.json();
      
      if (result.success && result.data) {
        // Data is already sorted by changePercent (highest to lowest) from API
        setStocksData(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch sector stocks:', error);
      setStocksData([]);
    } finally {
      setStocksLoading(false);
    }
  }, [timeRange]);

  // Handle sector click
  const handleSectorClick = (sectorName: string) => {
    setSelectedSector(sectorName);
    fetchSectorStocks(sectorName);
  };

  // Handle back to sectors view
  const handleBackToSectors = () => {
    setSelectedSector(null);
    setStocksData([]);
  };

  // Refetch stocks when time range changes (if a sector is selected)
  useEffect(() => {
    if (selectedSector) {
      fetchSectorStocks(selectedSector);
    }
  }, [timeRange, selectedSector, fetchSectorStocks]);

  // Auto-refresh stocks every minute (only for 1D timeRange)
  useEffect(() => {
    if (!selectedSector || timeRange !== '1D') {
      return; // Don't auto-refresh for historical data or when no sector is selected
    }

    const interval = setInterval(() => {
      fetchSectorStocks(selectedSector);
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, [selectedSector, timeRange, fetchSectorStocks]);

  // Calculate max absolute value for scaling
  const maxAbsValue = Math.max(
    ...sectorData.map(s => Math.abs(s.change)),
    1 // Minimum of 1 to avoid division by zero
  );

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-3 sm:p-4 ${className}`}>
        <div className="flex items-center justify-center h-48 sm:h-64">
          <div className="text-xs sm:text-sm text-gray-500">Loading sector performance...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="bg-white rounded-lg border border-gray-200 p-3 -mx-6">
        {/* Advance-Decline Snapshot */}
        {!adLoading && advanceDeclineData && (
          <button
            onClick={() => {
              // Trigger the AdvanceDeclineWidget to open
              const adButton = document.querySelector('[aria-label="Advance-Decline Ratio"]') as HTMLButtonElement;
              if (adButton) {
                adButton.click();
              }
            }}
            className="w-full mb-4 pb-3 border-b border-gray-200 -mx-3 px-3 pt-8 hover:bg-gray-50 transition-all duration-200 cursor-pointer text-left group"
            title="Click to view detailed advance-decline chart"
          >
            <div className="flex items-center gap-6">
              {/* Market Breadth Title */}
              <div className="text-xs font-semibold text-gray-700 group-hover:text-blue-700 transition-colors flex items-center gap-2">
                Market Breadth
                <svg className="w-3 h-3 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              
              {/* Advancing Stocks */}
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-7 h-7 bg-green-100 rounded">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Advancing</div>
                  <div className="text-base font-bold text-green-600">
                    {advanceDeclineData.advances.toLocaleString()}
                  </div>
                </div>
              </div>
              
              {/* Declining Stocks */}
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-7 h-7 bg-red-100 rounded">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Declining</div>
                  <div className="text-base font-bold text-red-600">
                    {advanceDeclineData.declines.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </button>
        )}

        {/* Title and Time Range Buttons / Back Button */}
        <div className="mb-3 relative pl-28" style={{ paddingLeft: '112px', marginLeft: '-112px' }}>
          {selectedSector ? (
            <div className="flex items-center justify-between">
              {/* Back Button */}
              <button
                onClick={handleBackToSectors}
                className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sectors
              </button>
              <h3 className="text-sm font-semibold text-gray-900">
                {selectedSector} Stocks
              </h3>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Sector Performance
              </h3>
              
              {/* Time Range Buttons */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                {(['1D', '7D', '30D', '90D', '52W'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-2.5 py-1 text-xs font-medium rounded transition-all ${
                      timeRange === range
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Content Area - Either Sectors or Stocks */}
        {selectedSector ? (
          /* Stocks View */
          <div className="relative pl-3" style={{ minHeight: `${sectorData.length * 28}px` }}>
            {stocksLoading ? (
              <div className="flex items-center justify-center" style={{ minHeight: `${sectorData.length * 28}px` }}>
                <div className="text-sm text-gray-500">Loading stocks...</div>
              </div>
            ) : stocksData.length === 0 ? (
              <div className="flex items-center justify-center" style={{ minHeight: `${sectorData.length * 28}px` }}>
                <div className="text-sm text-gray-500">No stock data available</div>
              </div>
            ) : (
              <div className="space-y-1.5 overflow-y-auto" style={{ maxHeight: `${sectorData.length * 28}px` }}>
                {stocksData.map((stock) => {
                  const isPositive = stock.changePercent >= 0;
                  return (
                    <div
                      key={stock.symbol}
                      className="flex items-center gap-3 h-7 pl-2 pr-4 hover:bg-gray-50 transition-colors"
                    >
                      {/* Left: Symbol (clickable - links to TradingView) */}
                      <a
                        href={`https://www.tradingview.com/chart/?symbol=NSE:${stock.symbol}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-xs text-blue-600 hover:text-blue-800 hover:underline w-28 flex-shrink-0 truncate cursor-pointer"
                        title={`View ${stock.symbol} chart on TradingView`}
                      >
                        {stock.symbol}
                      </a>
                      
                      {/* Middle: Volume & Market Cap (stacked) */}
                      <div className="text-[9px] text-gray-500 flex-shrink-0 hidden sm:block leading-tight">
                        <div>Vol: {(stock.volume / 1000).toFixed(0)}K</div>
                        <div>₹{(stock.marketCap / 100).toFixed(0)}Cr</div>
                      </div>
                      
                      {/* Right: Change & Price (stacked) */}
                      <div className="ml-auto flex-shrink-0 text-right leading-tight">
                        <div className={`text-[11px] font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                          {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </div>
                        <div className="text-[10px] font-medium text-gray-900">₹{stock.price.toFixed(2)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Sectors View - Horizontal Bar Chart Container */
          <div className="relative pl-24 sm:pl-28 pr-2 sm:pr-6 overflow-hidden" style={{ minHeight: `${sectorData.length * 28}px` }}>
            {/* Bars */}
            <div className="space-y-1.5">
              {sectorData.map((sector) => {
              // Ensure change is a number for comparison
              const changeValue = typeof sector.change === 'string' ? parseFloat(sector.change) : sector.change;
              const isPositive = changeValue >= 0;
              const barWidthPercent = (Math.abs(changeValue) / maxAbsValue) * 70; // Reduced from 80 to 70 for mobile

              return (
                <div
                  key={sector.name}
                  className="relative flex items-center h-6 sm:h-7 cursor-pointer group"
                  onClick={() => handleSectorClick(sector.name)}
                  title={`Click to view ${sector.name} stocks`}
                >
                  {/* Sector Name - Fixed Left Column - Clickable */}
                  <div className="absolute left-0 w-24 sm:w-28 text-[10px] sm:text-xs font-medium text-gray-800 group-hover:text-blue-600 pr-1 truncate transition-colors -translate-x-24 sm:-translate-x-28">
                    {sector.name}
                  </div>

                  {isPositive ? (
                    <>
                      {/* Positive Bar - Extends Right from Center */}
                      <div 
                        className="absolute h-5 sm:h-6 bg-green-500 group-hover:bg-green-600 rounded flex items-center justify-start px-1.5 sm:px-2 transition-colors"
                        style={{
                          left: '50%',
                          width: `min(${Math.max(barWidthPercent, 10)}%, 45%)`,
                          minWidth: '50px',
                          maxWidth: '45%',
                        }}
                      >
                        <span className="text-[10px] sm:text-xs font-semibold text-white whitespace-nowrap">
                          +{changeValue.toFixed(2)}%
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Negative Bar - Extends Left from Center */}
                      <div 
                        className="absolute h-5 sm:h-6 bg-red-500 group-hover:bg-red-600 rounded flex items-center justify-end px-1.5 sm:px-2 transition-colors"
                        style={{
                          right: '50%',
                          width: `min(${Math.max(barWidthPercent, 10)}%, 45%)`,
                          minWidth: '55px',
                          maxWidth: '45%',
                        }}
                      >
                        <span className="text-[10px] sm:text-xs font-semibold text-white whitespace-nowrap">
                          {changeValue.toFixed(2)}%
                        </span>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
          </div>
        )}
      </div>
    </div>
  );
}

