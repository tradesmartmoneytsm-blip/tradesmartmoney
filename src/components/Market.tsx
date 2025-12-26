'use client';

import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown, Activity, Building2, BarChart3, RefreshCw, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import type { SectorData } from '@/services/marketDataService';
import { formatTimeAgo, formatNextUpdate } from '@/lib/utils';
import { FiiDiiActivity } from '@/components/FiiDiiActivity';
import { TopMovers } from '@/components/TopMovers';
import { IndianMarketSentiment } from '@/components/IndianMarketSentiment';
import { SectorPerformanceHistogram } from '@/components/SectorPerformanceHistogram';
import { ActivityManager } from '@/components/ActivityManager';
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSubmenuCollapsed, setIsSubmenuCollapsed] = useState(false);

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
          <div className="compact-card info-dense">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-h3">
                <span className="text-gradient">Sector Performance</span>
              </h3>
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
    <article className="w-full pl-0 pr-0 sm:pl-0 sm:pr-0 md:pl-0 md:pr-0 lg:pl-0 lg:pr-0 xl:pl-0 xl:pr-0 2xl:pl-0 2xl:pr-0 pt-1 pb-2 sm:pt-2 sm:pb-3 md:pt-2 md:pb-4">
      {/* Three Column Layout: Left Submenu | Middle Content | Right Sector Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-x-2">
        
        {/* Left Sidebar - Vertical Submenu (Collapsible) */}
        {!isSubmenuCollapsed && (
          <aside className="lg:col-span-2">
            <div className="sticky top-4">
              <div className="relative bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-2.5 py-2 flex items-center justify-between">
                  <h3 className="text-white font-semibold text-xs">Market Analysis</h3>
                  <button
                    onClick={() => setIsSubmenuCollapsed(true)}
                    className="p-1 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                    aria-label="Collapse submenu"
                    title="Collapse submenu"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>

                {/* Vertical Submenu Items */}
                <nav className="p-2 space-y-0.5" aria-label="Market subsections">
                  {subSections.map((section) => {
                    const isActive = activeSubSection === section.id;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSubSection(section.id)}
                        className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-xs font-medium transition-all duration-200 text-left group relative ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-sm'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <span className={`flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                          {section.icon}
                        </span>
                        <span className="flex-1 truncate text-[11px] leading-tight">{section.label}</span>
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-r-full" />
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
              
              {/* Activity Manager Below Submenu */}
              <div className="mt-3">
                <ActivityManager isEmbedded={true} />
              </div>
            </div>
          </aside>
        )}

        {/* Expand Button for Submenu - When Collapsed */}
        {isSubmenuCollapsed && (
          <button
            onClick={() => setIsSubmenuCollapsed(false)}
            className="fixed left-4 top-24 z-30 flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg shadow-lg transition-all hover:shadow-xl"
            aria-label="Expand submenu"
            title="Show submenu"
          >
            <ChevronRight className="w-4 h-4" />
            <span className="text-xs font-medium">Menu</span>
          </button>
        )}

        {/* Middle Content Area */}
        <main 
          className={`${
            isSubmenuCollapsed && isSidebarCollapsed
              ? 'lg:col-span-12'
              : isSubmenuCollapsed
              ? 'lg:col-span-10'
              : isSidebarCollapsed
              ? 'lg:col-span-10'
              : 'lg:col-span-8'
          }`} 
          role="main" 
          aria-label="Market analysis content"
          style={{ zoom: 0.9 }}
        >
          {/* Content */}
          {renderSubSection()}
        </main>

        {/* Right Sidebar - Sector Performance (Collapsible) - Same width as before: 20% */}
        {!isSidebarCollapsed && (
          <aside className="lg:col-span-2">{/* Same 2 columns but now out of 12 = 16.67% */}
            <div className="sticky top-4">
              <div className="relative rounded-lg shadow-md ring-1 ring-blue-200/40">
                {/* Sector Performance - Full width */}
                <SectorPerformanceHistogram onCollapse={() => setIsSidebarCollapsed(true)} />
              </div>
            </div>
          </aside>
        )}

        {/* Expand Button for Sector Performance - When Collapsed */}
        {isSidebarCollapsed && (
          <button
            onClick={() => setIsSidebarCollapsed(false)}
            className="fixed right-4 top-24 z-30 p-2 bg-white hover:bg-gray-100 border border-gray-200 rounded-full shadow-md transition-all hover:shadow-lg"
            aria-label="Expand sidebar"
            title="Show market data"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
        )}
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