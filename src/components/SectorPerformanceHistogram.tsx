'use client';

import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown, ArrowLeft, ChevronRight } from 'lucide-react';
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
  onCollapse?: () => void;
}

export function SectorPerformanceHistogram({ className = '', onCollapse }: SectorPerformanceHistogramProps) {
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

  // Show message when no data available (e.g., 1D scraping failed)
  if (!isLoading && sectorData.length === 0) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-3 sm:p-4 ${className}`}>
        <div className="flex flex-col items-center justify-center h-48 sm:h-64 gap-3">
          <div className="text-xs sm:text-sm text-gray-600 font-medium">
            Sector data temporarily unavailable
          </div>
          <div className="text-xs text-gray-500 text-center max-w-md">
            The data source is currently unavailable. Please try selecting a different time range (7D, 30D, 90D, 52W) or check back later.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Market Outlook Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-2.5 py-2 flex items-center justify-between rounded-t-lg">
        <h3 className="text-white font-semibold text-xs">Market Outlook</h3>
        {onCollapse && (
          <button
            onClick={onCollapse}
            className="p-1 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
          >
            <ChevronRight className="w-3.5 h-3.5 text-white" />
          </button>
        )}
      </div>
      
      <div className="bg-white rounded-b-lg border border-gray-200 pl-2 pt-2 pb-2 pr-0">
        {/* Advance-Decline Snapshot */}
        {!adLoading && advanceDeclineData && (() => {
          const ratio = advanceDeclineData.advances / advanceDeclineData.declines;
          let sentiment: 'Bullish' | 'Bearish' | 'Neutral' = 'Neutral';
          let sentimentColor = 'text-gray-600';
          
          if (ratio > 1) {
            sentiment = 'Bullish';
            sentimentColor = 'text-green-600';
          } else if (ratio < 1) {
            sentiment = 'Bearish';
            sentimentColor = 'text-red-600';
          }
          
          return (
            <button
              onClick={() => {
                // Trigger the AdvanceDeclineWidget to open
                const adButton = document.querySelector('[aria-label="Advance-Decline Ratio"]') as HTMLButtonElement;
                if (adButton) {
                  adButton.click();
                }
              }}
              className="w-full mb-2 pb-2 border-b border-gray-200 hover:bg-gray-50 transition-all duration-200 cursor-pointer text-left group"
              title="Click to view detailed advance-decline chart"
            >
              <div className="flex items-center gap-3">
                {/* Advancing Stocks */}
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center justify-center w-5 h-5 bg-green-100 rounded">
                    <TrendingUp className="w-3 h-3 text-green-600" />
                  </div>
                  <div>
                    <div className="text-[11px] text-gray-500">Advancing</div>
                    <div className="text-xs font-bold text-green-600">
                      {advanceDeclineData.advances.toLocaleString()}
                    </div>
                  </div>
                </div>
                
                {/* Declining Stocks */}
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center justify-center w-5 h-5 bg-red-100 rounded">
                    <TrendingDown className="w-3 h-3 text-red-600" />
                  </div>
                  <div>
                    <div className="text-[11px] text-gray-500">Declining</div>
                    <div className="text-xs font-bold text-red-600">
                      {advanceDeclineData.declines.toLocaleString()}
                    </div>
                  </div>
                </div>
                
                {/* Sentiment Indicator */}
                <div className="ml-3">
                  <div className={`text-sm font-bold ${sentimentColor}`}>
                    {sentiment}
                  </div>
                </div>
              </div>
            </button>
          );
        })()}

        {/* Title and Time Range Buttons / Back Button */}
        <div className="mb-2">
          {selectedSector ? (
            <div className="flex items-center gap-2">
              {/* Back Button */}
              <button
                onClick={handleBackToSectors}
                className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 transition-colors flex-shrink-0"
              >
                <ArrowLeft className="w-3 h-3" />
                Back to Sectors
              </button>
              {/* Sector Name - Centered in remaining space */}
              <h3 className="flex-1 text-center text-[11px] font-semibold text-gray-900">
                {selectedSector} Stocks
              </h3>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <h3 className="text-xs font-semibold text-gray-900 mb-1.5">
                Sector Performance
              </h3>
              
              {/* Time Range Buttons */}
              <div className="flex items-center gap-0.5 bg-gray-100 rounded-md p-0.5">
                {(['1D', '7D', '30D', '90D', '52W'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-2 py-0.5 text-[11px] font-medium rounded-sm transition-all ${
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
          <div className="relative pl-0" style={{ minHeight: `${sectorData.length * 28}px` }}>
            {stocksLoading ? (
              <div className="flex items-center justify-center" style={{ minHeight: `${sectorData.length * 28}px` }}>
                <div className="text-sm text-gray-500 max-md:text-xs">Loading stocks...</div>
              </div>
            ) : stocksData.length === 0 ? (
              <div className="flex items-center justify-center" style={{ minHeight: `${sectorData.length * 28}px` }}>
                <div className="text-sm text-gray-500 max-md:text-xs">No stock data available</div>
              </div>
            ) : (
              <div className="space-y-1.5 overflow-y-auto max-md:space-y-1" style={{ maxHeight: `${sectorData.length * 28}px` }}>
                {stocksData.map((stock, index) => {
                  const isPositive = stock.changePercent >= 0;
                  return (
                    <div
                      key={`${stock.symbol}-${index}`}
                      className="flex items-center gap-3 h-7 pr-4 hover:bg-gray-50 transition-colors"
                    >
                      {/* Left: Symbol (clickable - links to TradingView) */}
                      <a
                        href={`https://www.tradingview.com/chart/?symbol=NSE:${stock.symbol}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-xs text-blue-600 hover:text-blue-800 hover:underline w-28 flex-shrink-0 truncate cursor-pointer lg:text-xs lg:w-28 md:text-[11px] md:w-24 max-md:text-[10px] max-md:w-20"
                        title={`View ${stock.symbol} chart on TradingView`}
                      >
                        {stock.symbol}
                      </a>
                      
                      {/* Middle: Volume & Market Cap (stacked) */}
                      <div className="text-[9px] text-gray-500 flex-shrink-0 hidden md:block leading-tight max-md:text-[8px]">
                        <div>Vol: {(stock.volume / 1000).toFixed(0)}K</div>
                        <div>₹{(stock.marketCap / 100).toFixed(0)}Cr</div>
                      </div>
                      
                      {/* Right: Change & Price (stacked) */}
                      <div className="ml-auto flex-shrink-0 text-right leading-tight">
                        <div className={`text-[11px] font-bold lg:text-[11px] md:text-[10px] max-md:text-[10px] ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                          {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </div>
                        <div className="text-[10px] font-medium text-gray-900 lg:text-[10px] md:text-[9px] max-md:text-[9px]">₹{stock.price.toFixed(2)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Sectors View - Horizontal Bar Chart Container */
          <div className="relative pl-24 pr-0 overflow-hidden" style={{ minHeight: `${sectorData.length * 22}px` }}>
            {/* Bars */}
            <div className="space-y-1.5">
              {sectorData.map((sector, index) => {
              // Ensure change is a number for comparison
              const changeValue = typeof sector.change === 'string' ? parseFloat(sector.change) : sector.change;
              const isPositive = changeValue >= 0;
              const barWidthPercent = (Math.abs(changeValue) / maxAbsValue) * 100;

              return (
                <div
                  key={`${sector.name}-${index}`}
                  className="relative flex items-center h-5 cursor-pointer group"
                  onClick={() => handleSectorClick(sector.name)}
                  title={`Click to view ${sector.name} stocks`}
                >
                  {/* Sector Name - Fixed Left Column - Clickable */}
                  <div className="absolute left-0 w-24 font-semibold text-xs leading-tight text-blue-600 group-hover:text-blue-800 group-hover:underline pr-1 truncate transition-colors -translate-x-24">
                    {sector.name}
                  </div>

                  {isPositive ? (
                    <>
                      {/* Positive Bar - Extends Right from Center */}
                      <div 
                        className="absolute h-4 bg-green-500 group-hover:bg-green-600 rounded flex items-center justify-start px-1 transition-colors"
                        style={{
                          left: '50%',
                          width: `min(${Math.max(barWidthPercent, 10)}%, 40%)`,
                          minWidth: '40px',
                          maxWidth: '40%',
                        }}
                      >
                        <span className="text-[11px] font-medium text-white whitespace-nowrap">
                          +{changeValue.toFixed(2)}%
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Negative Bar - Extends Left from Center */}
                      <div 
                        className="absolute h-4 bg-red-500 group-hover:bg-red-600 rounded flex items-center justify-end px-1 transition-colors"
                        style={{
                          right: '50%',
                          width: `min(${Math.max(barWidthPercent, 10)}%, 40%)`,
                          minWidth: '45px',
                          maxWidth: '40%',
                        }}
                      >
                        <span className="text-[11px] font-medium text-white whitespace-nowrap">
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

