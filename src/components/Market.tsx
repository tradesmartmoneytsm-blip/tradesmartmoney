'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, Building2, BarChart3, RefreshCw, ArrowUpDown } from 'lucide-react';
import type { SectorData } from '@/services/marketDataService';
import { formatTimeAgo, formatNextUpdate } from '@/lib/utils';
import { FiiDiiActivity } from '@/components/FiiDiiActivity';
import { TopMovers } from '@/components/TopMovers';
import { trackBusinessEvent, trackPageView } from '@/lib/analytics';
// Auto ads will handle all ad placement automatically

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
  }, [activeSubSection]);

  const subSections: MarketSubSection[] = [
    { id: 'sector-performance', label: 'Sector Performance', icon: <BarChart3 className="w-4 h-4" />, description: 'Real-time sector analysis' },
    { id: 'fii-dii-activity', label: 'FII/DII Activity', icon: <ArrowUpDown className="w-4 h-4" />, description: 'Institutional investor flows' },
    { id: 'top-gainers', label: 'Top Gainers', icon: <TrendingUp className="w-4 h-4" />, description: 'Best performers' },
    { id: 'top-losers', label: 'Top Losers', icon: <TrendingDown className="w-4 h-4" />, description: 'Worst performers' },
    { id: '52w-high', label: '52W High', icon: <TrendingUp className="w-4 h-4" />, description: 'Near yearly highs' },
    { id: '52w-low', label: '52W Low', icon: <TrendingDown className="w-4 h-4" />, description: 'Near yearly lows' },
    { id: 'long-buildup', label: 'Long Built Up', icon: <Activity className="w-4 h-4" />, description: 'Bullish positions' },
    { id: 'short-buildup', label: 'Short Build Up', icon: <Building2 className="w-4 h-4" />, description: 'Bearish positions' },
  ];

  // Manual refresh function
  const handleManualRefresh = async () => {
    // Track manual refresh action
    const sectionName = activeSubSection === 'fii-dii-activity' ? 'FII/DII Activity' : 'Sector Performance';
    trackBusinessEvent.manualRefresh(sectionName);
    
    setIsRefreshing(true);
    await fetchSectorData();
  };



  // Coming soon component for future features
  const ComingSoonCard = ({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) => (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 lg:p-8">
      <div className="text-center py-8 lg:py-12">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-4">
          <div className="text-blue-600 w-8 h-8">
            {icon}
          </div>
        </div>
        <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2 font-serif">{title}</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-full">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
          <span className="text-blue-700 font-semibold text-sm">Coming Soon</span>
        </div>
        <div className="mt-4 text-xs text-gray-500">
          Feature under development • Stay tuned for updates
        </div>
      </div>
    </div>
  );

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

      case 'long-buildup':
        return (
          <ComingSoonCard
            title="Long Built Up"
            description="Advanced analysis of stocks with increasing long positions and bullish momentum indicators."
            icon={<Activity className="w-8 h-8" />}
          />
        );

      case 'short-buildup':
        return (
          <ComingSoonCard
            title="Short Build Up"
            description="Detailed tracking of stocks with growing short positions and bearish sentiment analysis."
            icon={<Building2 className="w-8 h-8" />}
          />
        );

      default:
        return <div>Select a sub-section to view data</div>;
    }
  };

  return (
    <article className="max-w-7xl mx-auto px-4 lg:px-6 py-4 lg:py-6">
      {/* Google Auto Ads will handle ad placement automatically */}
      
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
      
      {/* Auto Ads will handle in-content placement automatically */}

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