'use client';

import { useState, useEffect, useCallback } from 'react';
import type { SectorData } from '@/services/marketDataService';

interface SectorPerformanceHistogramProps {
  className?: string;
}

export function SectorPerformanceHistogram({ className = '' }: SectorPerformanceHistogramProps) {
  const [sectorData, setSectorData] = useState<SectorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'1D' | '7D' | '30D' | '90D' | '52W'>('1D');

  // Fetch sector data
  const fetchSectorData = useCallback(async () => {
    try {
      const response = await fetch('/api/sector-data', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(30000)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data && Array.isArray(result.data)) {
        // Sort from most positive to most negative - ensure proper number comparison
        const sortedData = [...result.data].sort((a, b) => {
          const aChange = typeof a.change === 'string' ? parseFloat(a.change) : a.change;
          const bChange = typeof b.change === 'string' ? parseFloat(b.change) : b.change;
          return bChange - aChange;
        });
        
        setSectorData(sortedData);
      } else {
        // Fallback data
        const fallbackData = [
          { name: 'Nifty Consumer Durables', change: 0.35, value: '₹37,200', lastUpdated: new Date() },
          { name: 'CONSUMER GOODS', change: 0.08, value: '₹54,918', lastUpdated: new Date() },
          { name: 'Consumption', change: 0.02, value: '₹12,209', lastUpdated: new Date() },
          { name: 'AUTOMOBILE', change: -0.01, value: '₹27,538', lastUpdated: new Date() },
          { name: 'MEDIA & ENTERTAINMENT', change: -0.22, value: '₹1,432', lastUpdated: new Date() },
          { name: 'Nifty Healthcare Index', change: -0.42, value: '₹14,662', lastUpdated: new Date() },
          { name: 'PHARMA', change: -0.47, value: '₹22,618', lastUpdated: new Date() },
          { name: 'Bank Nifty', change: -0.66, value: '₹59,052', lastUpdated: new Date() },
          { name: 'Nifty Financial Services', change: -0.66, value: '₹25,888', lastUpdated: new Date() },
          { name: 'Nifty Financial Services 25/50', change: -0.71, value: '₹27,415', lastUpdated: new Date() },
          { name: 'Energy', change: -0.82, value: '₹34,738', lastUpdated: new Date() },
          { name: 'Nifty Oil & Gas', change: -0.88, value: '₹35,746', lastUpdated: new Date() },
          { name: 'PSU Bank', change: -0.95, value: '₹55,459', lastUpdated: new Date() },
          { name: 'IT', change: -0.98, value: '₹38,024', lastUpdated: new Date() },
          { name: 'PVT Bank', change: -1.15, value: '₹56,273', lastUpdated: new Date() },
          { name: 'CONSTRUCTION', change: -1.21, value: '₹9,510', lastUpdated: new Date() },
          { name: 'METALS', change: -1.27, value: '₹10,406', lastUpdated: new Date() }
        ].sort((a, b) => b.change - a.change);
        setSectorData(fallbackData);
      }
    } catch (error) {
      console.error('Failed to fetch sector data:', error);
      // Use fallback data
      const fallbackData = [
        { name: 'Nifty Consumer Durables', change: 0.35, value: '₹37,200', lastUpdated: new Date() },
        { name: 'CONSUMER GOODS', change: 0.08, value: '₹54,918', lastUpdated: new Date() },
        { name: 'Consumption', change: 0.02, value: '₹12,209', lastUpdated: new Date() },
        { name: 'AUTOMOBILE', change: -0.01, value: '₹27,538', lastUpdated: new Date() },
        { name: 'MEDIA & ENTERTAINMENT', change: -0.22, value: '₹1,432', lastUpdated: new Date() },
        { name: 'Nifty Healthcare Index', change: -0.42, value: '₹14,662', lastUpdated: new Date() },
        { name: 'PHARMA', change: -0.47, value: '₹22,618', lastUpdated: new Date() },
        { name: 'Bank Nifty', change: -0.66, value: '₹59,052', lastUpdated: new Date() },
        { name: 'Nifty Financial Services', change: -0.66, value: '₹25,888', lastUpdated: new Date() },
        { name: 'Nifty Financial Services 25/50', change: -0.71, value: '₹27,415', lastUpdated: new Date() },
        { name: 'Energy', change: -0.82, value: '₹34,738', lastUpdated: new Date() },
        { name: 'Nifty Oil & Gas', change: -0.88, value: '₹35,746', lastUpdated: new Date() },
        { name: 'PSU Bank', change: -0.95, value: '₹55,459', lastUpdated: new Date() },
        { name: 'IT', change: -0.98, value: '₹38,024', lastUpdated: new Date() },
        { name: 'PVT Bank', change: -1.15, value: '₹56,273', lastUpdated: new Date() },
        { name: 'CONSTRUCTION', change: -1.21, value: '₹9,510', lastUpdated: new Date() },
        { name: 'METALS', change: -1.27, value: '₹10,406', lastUpdated: new Date() }
      ].sort((a, b) => b.change - a.change);
      setSectorData(fallbackData);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSectorData();
    const interval = setInterval(fetchSectorData, 5 * 60 * 1000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, [fetchSectorData]);

  // Calculate max absolute value for scaling
  const maxAbsValue = Math.max(
    ...sectorData.map(s => Math.abs(s.change)),
    1 // Minimum of 1 to avoid division by zero
  );

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-sm text-gray-500">Loading sector performance...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="bg-white rounded-lg border border-gray-200 p-3 -mx-6">
        {/* Title and Time Range Buttons */}
        <div className="flex items-center justify-between mb-3 relative pl-28" style={{ paddingLeft: '112px', marginLeft: '-112px' }}>
          <h3 className="text-sm font-semibold text-gray-900">
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
        
        {/* Horizontal Bar Chart Container */}
        <div className="relative pl-28 pr-6" style={{ minHeight: `${sectorData.length * 28}px` }}>
          {/* Bars */}
          <div className="space-y-1.5">
            {sectorData.map((sector) => {
              // Ensure change is a number for comparison
              const changeValue = typeof sector.change === 'string' ? parseFloat(sector.change) : sector.change;
              const isPositive = changeValue >= 0;
              const barWidthPercent = (Math.abs(changeValue) / maxAbsValue) * 80; // Max 80% width on each side for better visibility

              return (
                <div
                  key={sector.name}
                  className="relative flex items-center h-7"
                >
                  {/* Sector Name - Fixed Left Column */}
                  <div className="absolute left-0 w-26 text-xs font-medium text-gray-800 pr-1 truncate" style={{ left: '-112px' }}>
                    {sector.name}
                  </div>

                  {isPositive ? (
                    <>
                      {/* Positive Bar - Extends Right from Center */}
                      <div 
                        className="absolute h-6 bg-green-500 rounded flex items-center justify-start px-2"
                        style={{
                          left: '50%',
                          width: `${Math.max(barWidthPercent, 10)}%`,
                          minWidth: '60px',
                        }}
                      >
                        <span className="text-xs font-semibold text-white whitespace-nowrap">
                          +{changeValue.toFixed(2)}%
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Negative Bar - Extends Left from Center */}
                      <div 
                        className="absolute h-6 bg-red-500 rounded flex items-center justify-end px-2"
                        style={{
                          right: '50%',
                          width: `${Math.max(barWidthPercent, 10)}%`,
                          minWidth: '65px',
                        }}
                      >
                        <span className="text-xs font-semibold text-white whitespace-nowrap">
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
      </div>
    </div>
  );
}

