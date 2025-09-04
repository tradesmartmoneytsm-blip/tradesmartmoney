'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, Building2, Users, BarChart3, RefreshCw } from 'lucide-react';
import type { SectorData } from '@/services/marketDataService';
import { formatTimeAgo, formatNextUpdate } from '@/lib/utils';

interface MarketSubSection {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

interface MarketProps {
  initialSubSection?: string;
}

export function Market({ initialSubSection }: MarketProps) {
  const [activeSubSection, setActiveSubSection] = useState(initialSubSection || 'sector-performance');
  const [sectorData, setSectorData] = useState<SectorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Update active subsection when initialSubSection prop changes
  useEffect(() => {
    if (initialSubSection) {
      setActiveSubSection(initialSubSection);
    }
  }, [initialSubSection]);

  // Fetch sector data directly from API
  const fetchSectorData = async () => {
    try {
      setIsRefreshing(true);
      console.log('📡 Fetching sector data from API...');
      
      const response = await fetch('/api/sector-data');
      const result = await response.json();
      
      if (result.success && result.data) {
        console.log('✅ Received sector data:', result.data.length, 'sectors');
        setSectorData(result.data);
        setLastUpdated(new Date());
      } else {
        throw new Error(result.error || 'Failed to fetch sector data');
      }
    } catch (error) {
      console.error('❌ Failed to fetch sector data:', error);
      setSectorData([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial data load and auto-refresh setup
  useEffect(() => {
    fetchSectorData();
    
    // Set up auto-refresh every 5 minutes
    const intervalId = setInterval(fetchSectorData, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  const subSections: MarketSubSection[] = [
    { id: 'sector-performance', label: 'Sector Performance', icon: <BarChart3 className="w-4 h-4" />, description: 'Real-time sector analysis' },
    { id: 'fii-dii-activity', label: 'FII DII Activity', icon: <Users className="w-4 h-4" />, description: 'Institutional flows' },
    { id: 'top-gainers', label: 'Top Gainers', icon: <TrendingUp className="w-4 h-4" />, description: 'Best performers' },
    { id: 'top-losers', label: 'Top Losers', icon: <TrendingDown className="w-4 h-4" />, description: 'Worst performers' },
    { id: 'long-buildup', label: 'Long Built Up', icon: <Activity className="w-4 h-4" />, description: 'Bullish positions' },
    { id: 'short-buildup', label: 'Short Build Up', icon: <Building2 className="w-4 h-4" />, description: 'Bearish positions' },
  ];

  // Manual refresh function
  const handleManualRefresh = async () => {
    await fetchSectorData();
  };

  const fiiDiiData = [
    { date: '2024-01-31', fii: -1250.5, dii: 890.3 },
    { date: '2024-01-30', fii: 750.2, dii: -456.8 },
    { date: '2024-01-29', fii: -890.7, dii: 1200.5 },
    { date: '2024-01-28', fii: 1450.3, dii: -678.9 },
    { date: '2024-01-27', fii: -567.8, dii: 345.6 },
  ];

  const gainersData = [
    { symbol: 'RELIANCE', ltp: 2450.80, change: 4.56, volume: '2.3M' },
    { symbol: 'TCS', ltp: 3680.45, change: 3.89, volume: '1.8M' },
    { symbol: 'INFY', ltp: 1590.25, change: 3.12, volume: '3.1M' },
    { symbol: 'HDFC', ltp: 1680.90, change: 2.98, volume: '2.7M' },
    { symbol: 'ICICI', ltp: 990.55, change: 2.45, volume: '4.2M' },
  ];

  const losersData = [
    { symbol: 'YES BANK', ltp: 18.45, change: -5.67, volume: '8.9M' },
    { symbol: 'ADANIPORTS', ltp: 680.25, change: -4.32, volume: '3.4M' },
    { symbol: 'NTPC', ltp: 195.80, change: -3.89, volume: '5.1M' },
    { symbol: 'POWERGRID', ltp: 245.30, change: -3.45, volume: '2.8M' },
    { symbol: 'ONGC', ltp: 178.90, change: -2.98, volume: '6.2M' },
  ];

  const longBuildupData = [
    { symbol: 'BAJFINANCE', price: 6420.30, oi_change: 12.5, volume_change: 18.7 },
    { symbol: 'MARUTI', price: 8950.75, oi_change: 15.3, volume_change: 22.1 },
    { symbol: 'WIPRO', price: 445.80, oi_change: 8.9, volume_change: 14.5 },
    { symbol: 'TATAMOTORS', price: 890.25, oi_change: 11.2, volume_change: 19.8 },
    { symbol: 'TECHM', price: 1680.45, oi_change: 9.7, volume_change: 16.3 },
  ];

  const shortBuildupData = [
    { symbol: 'ZOMATO', price: 145.30, oi_change: 14.8, volume_change: 21.5 },
    { symbol: 'PAYTM', price: 890.25, oi_change: 18.2, volume_change: 25.7 },
    { symbol: 'NYKAA', price: 1890.75, oi_change: 12.4, volume_change: 17.9 },
    { symbol: 'POLICYBZR', price: 1245.60, oi_change: 16.1, volume_change: 23.8 },
    { symbol: 'ASIANPAINT', price: 3450.25, oi_change: 9.8, volume_change: 15.3 },
  ];

  const renderSubSection = () => {
    switch (activeSubSection) {
      case 'sector-performance':
        return (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 lg:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 font-serif">Sector Performance</h3>
              <div className="flex items-center gap-4">
                {lastUpdated && (
                  <span className="text-xs text-gray-500">
                    Updated {formatTimeAgo(lastUpdated)}
                  </span>
                )}
                <button
                  onClick={handleManualRefresh}
                  disabled={isRefreshing}
                  className="flex items-center gap-2 px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-2 text-gray-500">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Loading sector data...
                </div>
              </div>
            ) : sectorData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="text-gray-500 text-center">
                  <p className="text-lg mb-2">No sector data available</p>
                  <p className="text-sm mb-4">Unable to fetch live NSE sector indices</p>
                  <button
                    onClick={handleManualRefresh}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Try Again
                  </button>
                </div>
              </div>
            ) : (
              <>
                                                            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
                        {[...sectorData].sort((a, b) => b.change - a.change).map((sector) => (
                    <div key={sector.name} className="border border-gray-200 rounded-lg p-3 lg:p-4 hover:shadow-md transition-all duration-300">
                      <div className="flex flex-col space-y-1">
                        <h4 className="text-sm lg:text-base font-semibold text-gray-900 font-serif">{sector.name}</h4>
                        <p className="text-xs lg:text-sm text-gray-600">{sector.value}</p>
                        <div className={`text-right ${sector.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          <span className="font-bold text-sm lg:text-base">
                            {sector.change >= 0 ? '+' : ''}{sector.change}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    📊 Live NSE sector indices data • Refreshes every 5 minutes
                    {lastUpdated && (
                      <span className="ml-2">
                        • Next update: {formatNextUpdate(lastUpdated)}
                      </span>
                    )}
                  </p>
                </div>
              </>
            )}
          </div>
        );

      case 'fii-dii-activity':
        return (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 lg:p-6">
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 font-serif">FII DII Activity</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-2 lg:py-3 px-3 lg:px-4 font-semibold text-gray-900 font-serif">Date</th>
                    <th className="text-right py-2 lg:py-3 px-3 lg:px-4 font-semibold text-gray-900 font-serif">FII (₹Cr)</th>
                    <th className="text-right py-2 lg:py-3 px-3 lg:px-4 font-semibold text-gray-900 font-serif">DII (₹Cr)</th>
                  </tr>
                </thead>
                <tbody>
                  {fiiDiiData.map((item) => (
                    <tr key={item.date} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-2 lg:py-3 px-3 lg:px-4 text-gray-900 font-medium">{new Date(item.date).toLocaleDateString()}</td>
                      <td className={`py-2 lg:py-3 px-3 lg:px-4 text-right font-semibold ${item.fii >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.fii >= 0 ? '+' : ''}{item.fii}
                      </td>
                      <td className={`py-2 lg:py-3 px-3 lg:px-4 text-right font-semibold ${item.dii >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.dii >= 0 ? '+' : ''}{item.dii}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'top-gainers':
        return (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 lg:p-6">
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 font-serif">Top Gainers</h3>
            <div className="space-y-2 lg:space-y-3">
              {gainersData.map((stock, index) => (
                <div key={stock.symbol} className="flex items-center justify-between p-3 lg:p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300">
                  <div className="flex items-center space-x-3 lg:space-x-4">
                    <span className="text-lg lg:text-xl font-bold text-green-600 w-6">#{index + 1}</span>
                    <div>
                      <h4 className="font-bold text-sm lg:text-base text-gray-900 font-serif">{stock.symbol}</h4>
                      <p className="text-xs lg:text-sm text-gray-600">Vol: {stock.volume}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm lg:text-base text-gray-900">₹{stock.ltp}</p>
                    <p className="text-green-600 font-bold text-xs lg:text-sm">+{stock.change}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'top-losers':
        return (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 lg:p-6">
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 font-serif">Top Losers</h3>
            <div className="space-y-2 lg:space-y-3">
              {losersData.map((stock, index) => (
                <div key={stock.symbol} className="flex items-center justify-between p-3 lg:p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300">
                  <div className="flex items-center space-x-3 lg:space-x-4">
                    <span className="text-lg lg:text-xl font-bold text-red-600 w-6">#{index + 1}</span>
                    <div>
                      <h4 className="font-bold text-sm lg:text-base text-gray-900 font-serif">{stock.symbol}</h4>
                      <p className="text-xs lg:text-sm text-gray-600">Vol: {stock.volume}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm lg:text-base text-gray-900">₹{stock.ltp}</p>
                    <p className="text-red-600 font-bold text-xs lg:text-sm">{stock.change}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'long-buildup':
        return (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 lg:p-6">
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 font-serif">Long Built Up</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-2 lg:py-3 px-3 lg:px-4 font-semibold text-gray-900 font-serif">Symbol</th>
                    <th className="text-right py-2 lg:py-3 px-3 lg:px-4 font-semibold text-gray-900 font-serif">LTP</th>
                    <th className="text-right py-2 lg:py-3 px-3 lg:px-4 font-semibold text-gray-900 font-serif">OI Change %</th>
                    <th className="text-right py-2 lg:py-3 px-3 lg:px-4 font-semibold text-gray-900 font-serif">Volume %</th>
                  </tr>
                </thead>
                <tbody>
                  {longBuildupData.map((item) => (
                    <tr key={item.symbol} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-2 lg:py-3 px-3 lg:px-4 font-bold text-gray-900 font-serif">{item.symbol}</td>
                      <td className="py-2 lg:py-3 px-3 lg:px-4 text-right text-gray-900 font-semibold">₹{item.price}</td>
                      <td className="py-2 lg:py-3 px-3 lg:px-4 text-right font-bold text-green-600">+{item.oi_change}%</td>
                      <td className="py-2 lg:py-3 px-3 lg:px-4 text-right font-bold text-green-600">+{item.volume_change}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'short-buildup':
        return (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 lg:p-6">
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 font-serif">Short Build Up</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-2 lg:py-3 px-3 lg:px-4 font-semibold text-gray-900 font-serif">Symbol</th>
                    <th className="text-right py-2 lg:py-3 px-3 lg:px-4 font-semibold text-gray-900 font-serif">LTP</th>
                    <th className="text-right py-2 lg:py-3 px-3 lg:px-4 font-semibold text-gray-900 font-serif">OI Change %</th>
                    <th className="text-right py-2 lg:py-3 px-3 lg:px-4 font-semibold text-gray-900 font-serif">Volume %</th>
                  </tr>
                </thead>
                <tbody>
                  {shortBuildupData.map((item) => (
                    <tr key={item.symbol} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-2 lg:py-3 px-3 lg:px-4 font-bold text-gray-900 font-serif">{item.symbol}</td>
                      <td className="py-2 lg:py-3 px-3 lg:px-4 text-right text-gray-900 font-semibold">₹{item.price}</td>
                      <td className="py-2 lg:py-3 px-3 lg:px-4 text-right font-bold text-red-600">+{item.oi_change}%</td>
                      <td className="py-2 lg:py-3 px-3 lg:px-4 text-right font-bold text-red-600">+{item.volume_change}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return <div>Select a sub-section to view data</div>;
    }
  };

  return (
    <article className="max-w-7xl mx-auto px-4 lg:px-6 py-4 lg:py-6">
      {/* Compact Page Header */}
      <header className="mb-6 lg:mb-8">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2 font-serif">Market Analysis</h1>
        <p className="text-sm lg:text-base text-gray-600">
          Real-time market data, sector performance analysis, and institutional investment flows.
        </p>
      </header>

      {/* Compact Professional Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
        {/* Compact Left Sidebar Navigation */}
        <aside className="lg:col-span-1" role="navigation" aria-label="Market sections">
          <nav className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
            <h2 className="text-sm lg:text-base font-bold text-gray-900 mb-4 font-serif">Market Sections</h2>
            <ul className="space-y-1" role="menu">
              {subSections.map((section) => (
                <li key={section.id} role="none">
                  <button
                    onClick={() => setActiveSubSection(section.id)}
                    className={`w-full flex items-center space-x-2 px-3 py-2 lg:py-3 rounded-lg font-medium transition-all duration-300 text-left ${
                      activeSubSection === section.id
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm'
                    }`}
                    role="menuitem"
                    aria-current={activeSubSection === section.id ? 'page' : undefined}
                    aria-label={`View ${section.label} - ${section.description}`}
                  >
                    <div className={`${activeSubSection === section.id ? 'text-blue-200' : 'text-gray-500'}`} aria-hidden="true">
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
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Compact Right Content Area */}
        <section className="lg:col-span-4" role="main" aria-live="polite">
          {renderSubSection()}
        </section>
      </div>

      {/* Compact Summary Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mt-6 lg:mt-8" aria-label="Market summary">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 lg:p-6 text-center">
          <Building2 className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600 mx-auto mb-2 lg:mb-3" aria-hidden="true" />
          <h3 className="text-sm lg:text-lg font-bold text-blue-800 mb-1">Total Sectors</h3>
          <p className="text-xs lg:text-sm text-blue-700 font-semibold">11</p>
          <p className="text-xs text-blue-600 mt-1">Being tracked</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4 lg:p-6 text-center">
          <TrendingUp className="w-6 h-6 lg:w-8 lg:h-8 text-green-600 mx-auto mb-2 lg:mb-3" aria-hidden="true" />
          <h3 className="text-sm lg:text-lg font-bold text-green-800 mb-1">Market Trend</h3>
          <p className="text-xs lg:text-sm text-green-700 font-semibold">Bullish</p>
          <p className="text-xs text-green-600 mt-1">Strong momentum</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4 lg:p-6 text-center">
          <Activity className="w-6 h-6 lg:w-8 lg:h-8 text-purple-600 mx-auto mb-2 lg:mb-3" aria-hidden="true" />
          <h3 className="text-sm lg:text-lg font-bold text-purple-800 mb-1">Active Stocks</h3>
          <p className="text-xs lg:text-sm text-purple-700 font-semibold">2,847</p>
          <p className="text-xs text-purple-600 mt-1">In analysis</p>
        </div>
      </section>
    </article>
  );
} 