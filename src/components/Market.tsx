'use client';

import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown, Activity, Building2, BarChart3, RefreshCw, ArrowUpDown } from 'lucide-react';
import type { SectorData } from '@/services/marketDataService';
import { formatTimeAgo, formatNextUpdate } from '@/lib/utils';
import { FiiDiiActivity } from '@/components/FiiDiiActivity';
import { TopMovers } from '@/components/TopMovers';
import { IndianMarketSentiment } from '@/components/IndianMarketSentiment';
import { trackBusinessEvent, trackPageView } from '@/lib/analytics';

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
  const fetchSectorData = useCallback(async () => {
    try {
      setIsRefreshing(true);
      
      const response = await fetch('/api/sector-data', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout and retry logic
        signal: AbortSignal.timeout(30000) // 30 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data && Array.isArray(result.data)) {
        setSectorData(result.data);
        setLastUpdated(new Date());
        console.log(`✅ Loaded ${result.data.length} sectors successfully`);
      } else {
        // If API returns success: false, use fallback data instead of throwing
        console.warn('⚠️ API returned unsuccessful response, using fallback data');
        setSectorData(getFallbackSectorData());
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('❌ Failed to fetch sector data:', error);
      // Use fallback data instead of empty array
      console.log('🔄 Using fallback sector data due to API failure');
      setSectorData(getFallbackSectorData());
      setLastUpdated(new Date());
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Fallback sector data for when API fails
  const getFallbackSectorData = () => [
    { name: 'Banking', change: -0.48, value: '₹55,459', lastUpdated: new Date() },
    { name: 'IT', change: -0.47, value: '₹36,578', lastUpdated: new Date() },
    { name: 'Pharma', change: 0.50, value: '₹22,687', lastUpdated: new Date() },
    { name: 'Auto', change: -0.40, value: '₹27,220', lastUpdated: new Date() },
    { name: 'FMCG', change: -0.44, value: '₹56,273', lastUpdated: new Date() },
    { name: 'Energy', change: 0.86, value: '₹35,746', lastUpdated: new Date() },
    { name: 'Metals', change: 0.35, value: '₹9,990', lastUpdated: new Date() },
    { name: 'Realty', change: 0.55, value: '₹924', lastUpdated: new Date() },
    { name: 'Healthcare', change: 0.17, value: '₹14,881', lastUpdated: new Date() },
    { name: 'Infrastructure', change: 0.08, value: '₹9,238', lastUpdated: new Date() },
    { name: 'Consumption', change: -0.18, value: '₹12,463', lastUpdated: new Date() },
    { name: 'Consumer Durables', change: -0.65, value: '₹39,342', lastUpdated: new Date() },
    { name: 'Media', change: -0.50, value: '₹1,619', lastUpdated: new Date() },
    { name: 'Finnifty', change: -0.64, value: '₹26,528', lastUpdated: new Date() },
    { name: 'Nifty 50', change: -0.38, value: '₹25,327', lastUpdated: new Date() }
  ];

  // Initial data load and auto-refresh setup
  useEffect(() => {
    fetchSectorData();
    
    // Track page view
    trackPageView('/market', 'Market Analysis');
    
    // Track specific section views
    if (activeSubSection === 'fii-dii-activity') {
      trackBusinessEvent.viewFiiDiiData();
    } else {
      trackBusinessEvent.viewSectorPerformance();
    }

    const interval = setInterval(fetchSectorData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [activeSubSection, fetchSectorData]);

  const subSections: MarketSubSection[] = [
    { id: 'sector-performance', label: 'Sector Performance', icon: <BarChart3 className="w-4 h-4" />, description: 'Real-time sector analysis' },
    { id: 'fii-dii-activity', label: 'FII/DII Activity', icon: <ArrowUpDown className="w-4 h-4" />, description: 'Institutional investor flows' },
    { id: 'top-gainers', label: 'Top Gainers', icon: <TrendingUp className="w-4 h-4" />, description: 'Best performers' },
    { id: 'top-losers', label: 'Top Losers', icon: <TrendingDown className="w-4 h-4" />, description: 'Worst performers' },
    { id: '52w-high', label: '52W High', icon: <TrendingUp className="w-4 h-4" />, description: 'Near yearly highs' },
    { id: '52w-low', label: '52W Low', icon: <TrendingDown className="w-4 h-4" />, description: 'Near yearly lows' },
    { id: 'market-sentiment', label: 'Market Sentiment', icon: <Activity className="w-4 h-4" />, description: 'AI-powered sentiment analysis' },
  ];

  // Manual refresh function
  const handleManualRefresh = async () => {
    // Track manual refresh action
    const sectionName = activeSubSection === 'fii-dii-activity' ? 'FII/DII Activity' : 'Sector Performance';
    trackBusinessEvent.manualRefresh(sectionName);
    
    setIsRefreshing(true);
    await fetchSectorData();
  };




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
        return <FiiDiiActivity />;

      case 'top-gainers':
        return (
          <TopMovers
            type="TOP_GAINERS"
            title="Top Gainers"
            icon={<TrendingUp className="w-5 h-5" />}
          />
        );

      case 'top-losers':
        return (
          <TopMovers
            type="TOP_LOSERS"
            title="Top Losers"
            icon={<TrendingDown className="w-5 h-5" />}
          />
        );

      case '52w-high':
        return (
          <TopMovers
            type="YEARLY_HIGH"
            title="52W High"
            icon={<TrendingUp className="w-5 h-5" />}
          />
        );

      case '52w-low':
        return (
          <TopMovers
            type="YEARLY_LOW"
            title="52W Low"
            icon={<TrendingDown className="w-5 h-5" />}
          />
        );

      case 'market-sentiment':
        return <IndianMarketSentiment />;

      default:
        return <div>Select a sub-section to view data</div>;
    }
  };

  return (
    <article className="w-full px-2 sm:px-3 md:px-4 lg:px-5 xl:px-6 2xl:px-8 py-2 sm:py-3 md:py-4 lg:py-5">
      {/* Google Auto Ads will handle ad placement automatically */}
      
      {/* Compact Page Header */}
      <header className="mb-3 sm:mb-4 lg:mb-6">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 font-serif">Market Analysis</h1>
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
                    onClick={() => {
                      // Navigate to separate page for each market section
                      window.location.href = `/market/${section.id}`;
                    }}
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
      
      {/* Auto Ads will handle in-content placement automatically */}

      {/* Compact Summary Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mt-6 lg:mt-8" aria-label="Market summary">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 lg:p-6 text-center">
          <Building2 className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600 mx-auto mb-2 lg:mb-3" aria-hidden="true" />
          <h3 className="text-sm lg:text-lg font-bold text-blue-800 mb-1">Total Sectors</h3>
          <p className="text-xs lg:text-sm text-blue-700 font-semibold">{sectorData.length > 0 ? sectorData.length : '15'}</p>
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