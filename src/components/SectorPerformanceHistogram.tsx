'use client';

import { useState } from 'react';
import { useSectorData } from '@/contexts/SectorDataContext';

interface SectorPerformanceHistogramProps {
  className?: string;
}

export function SectorPerformanceHistogram({ className = '' }: SectorPerformanceHistogramProps) {
  const { sectorData, isLoading } = useSectorData();
  const [timeRange, setTimeRange] = useState<'1D' | '7D' | '30D' | '90D' | '52W'>('1D');

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

