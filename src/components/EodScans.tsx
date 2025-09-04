'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, BarChart2, Search } from 'lucide-react';

interface EodSubSection {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

interface EodScansProps {
  initialSubSection?: string;
}

export function EodScans({ initialSubSection }: EodScansProps) {
  const [activeSubSection, setActiveSubSection] = useState(initialSubSection || 'relative-outperformance');

  // Update active subsection when initialSubSection prop changes
  useEffect(() => {
    if (initialSubSection) {
      setActiveSubSection(initialSubSection);
    }
  }, [initialSubSection]);

  const subSections: EodSubSection[] = [
    { id: 'relative-outperformance', label: 'Relative Outperformance', icon: <TrendingUp className="w-4 h-4" />, description: 'Sector comparison' },
    { id: 'candlestick-scans', label: 'Candlestick Scans', icon: <BarChart2 className="w-4 h-4" />, description: 'Pattern analysis' },
    { id: 'chart-patterns', label: 'Chart Patterns', icon: <Search className="w-4 h-4" />, description: 'Technical patterns' },
  ];

  // Mock data for different scans
  const relativeOutperformanceData = [
    { symbol: 'RELIANCE', rsRating: 95, sectorRank: 1, priceChange: 4.5 },
    { symbol: 'TCS', rsRating: 88, sectorRank: 2, priceChange: 3.2 },
    { symbol: 'INFY', rsRating: 82, sectorRank: 3, priceChange: 2.8 },
    { symbol: 'HDFC', rsRating: 79, sectorRank: 1, priceChange: 2.1 },
    { symbol: 'ICICI', rsRating: 76, sectorRank: 2, priceChange: 1.9 },
  ];

  const candlestickData = [
    { symbol: 'WIPRO', pattern: 'Bullish Engulfing', strength: 'Strong', probability: 85 },
    { symbol: 'BAJFINANCE', pattern: 'Morning Star', strength: 'Moderate', probability: 72 },
    { symbol: 'MARUTI', pattern: 'Hammer', strength: 'Weak', probability: 65 },
    { symbol: 'SUNPHARMA', pattern: 'Doji', strength: 'Neutral', probability: 55 },
    { symbol: 'LT', pattern: 'Spinning Top', strength: 'Weak', probability: 48 },
  ];

  const chartPatternsData = [
    { symbol: 'NESTLEIND', pattern: 'Cup & Handle', timeframe: '1W', breakout: 'Pending' },
    { symbol: 'HDFCBANK', pattern: 'Ascending Triangle', timeframe: '1D', breakout: 'Confirmed' },
    { symbol: 'BHARTIARTL', pattern: 'Double Bottom', timeframe: '4H', breakout: 'Pending' },
    { symbol: 'KOTAKBANK', pattern: 'Bull Flag', timeframe: '1H', breakout: 'Confirmed' },
    { symbol: 'AXISBANK', pattern: 'Head & Shoulders', timeframe: '1D', breakout: 'Failed' },
  ];

  const renderSubSection = () => {
    switch (activeSubSection) {
      case 'relative-outperformance':
        return (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 lg:p-6">
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 font-serif">Relative Outperformance</h3>
            <div className="space-y-2 lg:space-y-3">
              {relativeOutperformanceData.map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between p-3 lg:p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300">
                  <div className="flex items-center space-x-3 lg:space-x-4">
                    <div>
                      <h4 className="font-bold text-sm lg:text-base text-gray-900 font-serif">{stock.symbol}</h4>
                      <p className="text-xs lg:text-sm text-gray-600">RS Rating: {stock.rsRating}%</p>
                      <p className="text-xs lg:text-sm text-gray-600">Sector Rank: {stock.sectorRank}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm lg:text-base text-gray-900">Price Change: {stock.priceChange}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'candlestick-scans':
        return (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 lg:p-6">
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 font-serif">Candlestick Pattern Analysis</h3>
            <div className="space-y-2 lg:space-y-3">
              {candlestickData.map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between p-3 lg:p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300">
                  <div className="flex items-center space-x-3 lg:space-x-4">
                    <div>
                      <h4 className="font-bold text-sm lg:text-base text-gray-900 font-serif">{stock.symbol}</h4>
                      <p className="text-xs lg:text-sm text-blue-600 font-medium">{stock.pattern}</p>
                      <p className="text-xs lg:text-sm text-gray-600">Strength: {stock.strength}</p>
                      <p className="text-xs lg:text-sm text-gray-600">Probability: {stock.probability}%</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {/* No price or change for candlestick scans in this mock data */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'chart-patterns':
        return (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 lg:p-6">
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 font-serif">Chart Pattern Analysis</h3>
            <div className="space-y-2 lg:space-y-3">
              {chartPatternsData.map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between p-3 lg:p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300">
                  <div className="flex items-center space-x-3 lg:space-x-4">
                    <div>
                      <h4 className="font-bold text-sm lg:text-base text-gray-900 font-serif">{stock.symbol}</h4>
                      <p className="text-xs lg:text-sm text-purple-600 font-medium">{stock.pattern}</p>
                      <p className="text-xs lg:text-sm text-gray-600">Timeframe: {stock.timeframe}</p>
                      <p className="text-xs lg:text-sm text-gray-600">Breakout: {stock.breakout}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {/* No price or target for chart patterns in this mock data */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return <div>Select a scan type to view results</div>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 lg:py-6">
      {/* Compact Page Header */}
      <div className="mb-6 lg:mb-8">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2 font-serif">End-of-Day Scans</h2>
        <p className="text-sm lg:text-base text-gray-600">
          Advanced technical analysis and pattern recognition for trading opportunities.
        </p>
      </div>

      {/* Compact Professional Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
        {/* Compact Left Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
            <h3 className="text-sm lg:text-base font-bold text-gray-900 mb-4 font-serif">Scan Types</h3>
            <nav className="space-y-1">
              {subSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSubSection(section.id)}
                  className={`w-full flex items-center space-x-2 px-3 py-2 lg:py-3 rounded-lg font-medium transition-all duration-300 text-left ${
                    activeSubSection === section.id
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm'
                  }`}
                >
                  <div className={`${activeSubSection === section.id ? 'text-blue-200' : 'text-gray-500'}`}>
                    {section.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-xs lg:text-sm">{section.label}</div>
                    <div className={`text-xs ${
                      activeSubSection === section.id ? 'text-blue-200' : 'text-gray-500'
                    }`}>
                      {section.description}
                    </div>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Compact Right Content Area */}
        <div className="lg:col-span-4">
          {renderSubSection()}
        </div>
      </div>

      {/* Compact Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mt-6 lg:mt-8">
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4 lg:p-6 text-center">
          <TrendingUp className="w-6 h-6 lg:w-8 lg:h-8 text-green-600 mx-auto mb-2 lg:mb-3" />
          <h3 className="text-sm lg:text-lg font-bold text-green-800 mb-1">Bullish Signals</h3>
          <p className="text-xs lg:text-sm text-green-700 font-semibold">24</p>
          <p className="text-xs text-green-600 mt-1">Strong patterns</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-4 lg:p-6 text-center">
          <TrendingUp className="w-6 h-6 lg:w-8 lg:h-8 text-red-600 mx-auto mb-2 lg:mb-3 rotate-180" />
          <h3 className="text-sm lg:text-lg font-bold text-red-800 mb-1">Bearish Signals</h3>
          <p className="text-xs lg:text-sm text-red-700 font-semibold">12</p>
          <p className="text-xs text-red-600 mt-1">Reversal patterns</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 lg:p-6 text-center">
          <BarChart2 className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600 mx-auto mb-2 lg:mb-3" />
          <h3 className="text-sm lg:text-lg font-bold text-blue-800 mb-1">Patterns</h3>
          <p className="text-xs lg:text-sm text-blue-700 font-semibold">18</p>
          <p className="text-xs text-blue-600 mt-1">Active formations</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4 lg:p-6 text-center">
          <Search className="w-6 h-6 lg:w-8 lg:h-8 text-purple-600 mx-auto mb-2 lg:mb-3" />
          <h3 className="text-sm lg:text-lg font-bold text-purple-800 mb-1">Scanned</h3>
          <p className="text-xs lg:text-sm text-purple-700 font-semibold">1,245</p>
          <p className="text-xs text-purple-600 mt-1">Stocks analyzed</p>
        </div>
      </div>
    </div>
  );
} 