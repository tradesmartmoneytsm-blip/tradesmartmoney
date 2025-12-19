'use client';

import React, { useState, useEffect } from 'react';
import { Bell, User, Menu, X, TrendingUp, TrendingDown, BarChart3, Newspaper, Building2, Microscope, Bot, Activity, DollarSign } from 'lucide-react';
import { brandTokens } from '@/lib/design-tokens';

interface MarketIndex {
  name: string;
  displayName: string;
  current: number;
  change: number;
  changePercent: number;
}

export function Navigation({ 
  activeSection, 
  onSectionChange 
}: { 
  activeSection: string; 
  onSectionChange: (section: string, subSection?: string) => void;
}) {
  const [currentTime, setCurrentTime] = useState('');
  const [isMarketOpen, setIsMarketOpen] = useState(false);
  const [marketIndices, setMarketIndices] = useState<MarketIndex[]>([]);
  const [, setLastUpdated] = useState<Date | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Handle market index click - redirect to TradingView
  const handleIndexClick = (indexName: string) => {
    let symbol = indexName;
    
    // Map API names to TradingView symbols
    if (indexName === 'Nifty 50') symbol = 'NIFTY';
    if (indexName === 'Nifty Bank') symbol = 'BANKNIFTY';
    if (indexName === 'Finnifty') symbol = 'FINNIFTY';
    if (indexName === 'India VIX') symbol = 'INDIAVIX';
    
    console.log(`🔗 Opening TradingView for ${indexName} → ${symbol}`);
    
    // Open TradingView directly with 5-minute chart
    const tradingViewUrl = `https://www.tradingview.com/chart/?symbol=NSE:${symbol}&interval=5`;
    window.open(tradingViewUrl, '_blank', 'noopener,noreferrer');
  };

  // Fetch market indices data
  const fetchMarketIndices = async () => {
    try {
      const response = await fetch('/api/market-indices');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data && Array.isArray(data.data)) {
        setMarketIndices(data.data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error fetching market indices:', error);
    }
  };

  useEffect(() => {
    const updateTimeAndMarketStatus = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
      
      // Check if it's a weekday (Monday = 1, Friday = 5)
      const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
      
      // Check if it's within market hours (9:15 AM to 3:30 PM IST)
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const currentTimeMinutes = hours * 60 + minutes;
      const marketStart = 9 * 60 + 15; // 9:15 AM
      const marketEnd = 15 * 60 + 30; // 3:30 PM
      const isWithinHours = currentTimeMinutes >= marketStart && currentTimeMinutes <= marketEnd;
      
      // Market is open only if it's a weekday AND within trading hours
      setIsMarketOpen(isWeekday && isWithinHours);
    };

    updateTimeAndMarketStatus();
    const timer = setInterval(updateTimeAndMarketStatus, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch market indices on mount and every 15 minutes
  useEffect(() => {
    fetchMarketIndices(); // Initial fetch
    const indicesTimer = setInterval(fetchMarketIndices, 15 * 60 * 1000); // 15 minutes
    return () => clearInterval(indicesTimer);
  }, []);

  // Enhanced click outside handler for mobile menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      
      // Close mobile menu when clicking outside
      if (showMobileMenu && 
          !target.closest('.lg\\:hidden') && 
          !target.closest('[aria-label*="navigation menu"]')) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showMobileMenu]);

  const menuItems = [
    {
      id: 'market',
      label: 'Market',
      icon: <Building2 className={brandTokens.icons.sm} />,
      description: 'Live market data and analysis',
      subItems: [
        { 
          id: 'sector-performance', 
          label: 'Sector Performance', 
          icon: <BarChart3 className={brandTokens.icons.sm} />,
          description: 'Real-time sector analysis and performance metrics'
        },
        { 
          id: 'fii-dii-activity', 
          label: 'FII DII Activity', 
          icon: <Building2 className={brandTokens.icons.sm} />,
          description: 'Foreign and domestic institutional investment flows'
        },
        { 
          id: 'top-gainers', 
          label: 'Top Gainers', 
          icon: <TrendingUp className={brandTokens.icons.sm} />,
          description: 'Stocks with highest price appreciation'
        },
        { 
          id: 'top-losers', 
          label: 'Top Losers', 
          icon: <TrendingUp className={brandTokens.icons.sm} />,
          description: 'Stocks with significant price decline'
        },
        { 
          id: 'long-buildup', 
          label: 'Long Built Up', 
          icon: <TrendingUp className={brandTokens.icons.sm} />,
          description: 'Stocks showing long position accumulation'
        },
                { 
          id: 'short-buildup', 
          label: 'Short Built Up',
          icon: <TrendingUp className={brandTokens.icons.sm} />,
          description: 'Stocks with increasing short positions'
        },
        { 
          id: '52w-high', 
          label: '52W High',
          icon: <TrendingUp className={brandTokens.icons.sm} />,
          description: 'Stocks near their 52-week high prices'
        },
        { 
          id: '52w-low', 
          label: '52W Low',
          icon: <TrendingDown className={brandTokens.icons.sm} />,
          description: 'Stocks near their 52-week low prices'
        },
        { 
          id: 'market-sentiment', 
          label: 'Market Sentiment',
          icon: <Activity className={brandTokens.icons.sm} />,
          description: 'AI-powered Indian market sentiment analysis'
        },
      ]
    },
    {
      id: 'swing',
      label: 'Swing Trade',
      icon: <TrendingUp className={brandTokens.icons.sm} />,
      description: 'Multi-day trading examples and analysis',
      subItems: [
        { 
          id: 'momentum-strategy', 
          label: 'Momentum Strategy', 
          icon: <BarChart3 className={brandTokens.icons.sm} />,
          description: 'Momentum-Based Trading Analysis'
        },
        { 
          id: 'swing-angle', 
          label: 'Swing Angle', 
          icon: <TrendingUp className={brandTokens.icons.sm} />,
          description: 'Angular Momentum Strategy'
        },
        { 
          id: 'bottom-formation', 
          label: 'Bottom Formation', 
          icon: <TrendingUp className={brandTokens.icons.sm} />,
          description: 'Reversal Pattern Strategy'
        },
        { 
          id: 'value-buying', 
          label: 'Value Buying', 
          icon: <TrendingUp className={brandTokens.icons.sm} />,
          description: 'Oversold Quality Stocks'
        }
      ]
    },
    {
      id: 'fno',
      label: 'FNO',
      icon: <BarChart3 className={brandTokens.icons.sm} />,
      description: 'Futures & Options trading analysis',
      subItems: [
        { 
          id: 'option-analysis', 
          label: 'Option Analysis', 
          icon: <TrendingUp className={brandTokens.icons.sm} />,
          description: 'Advanced option chain analysis and institutional flow'
        },
        { 
          id: 'futures-analysis', 
          label: 'Futures Analysis', 
          icon: <BarChart3 className={brandTokens.icons.sm} />,
          description: 'Futures market analysis and OI buildup patterns'
        },
        { 
          id: 'most-active-calls-puts', 
          label: 'Most Active Calls/Puts', 
          icon: <Activity className={brandTokens.icons.sm} />,
          description: 'Most active options with highest trading activity'
        },
        { 
          id: 'pcr-storm', 
          label: 'PCR Storm', 
          icon: <Activity className={brandTokens.icons.sm} />,
          description: 'Put-Call Ratio storm detection and analysis'
        },
        { 
          id: 'heatmap', 
          label: 'Options Heatmap', 
          icon: <BarChart3 className={brandTokens.icons.sm} />,
          description: 'Live heatmap of price, OI, and volume changes'
        }
      ]
    },
    {
      id: 'equity',
      label: 'Equity',
      icon: <DollarSign className={brandTokens.icons.sm} />,
      description: 'Equity analysis and smart money flow',
      subItems: [
        { 
          id: 'smart-money-flow', 
          label: 'Intraday Smart Money Flow', 
          icon: <Activity className={brandTokens.icons.sm} />,
          description: 'Institutional Money Flow'
        }
      ]
    },
    {
      id: 'commodity',
      label: 'Commodity',
      icon: <BarChart3 className={brandTokens.icons.sm} />,
      description: 'Commodity trading analysis and signals',
      subItems: [
        { 
          id: 'coming-soon', 
          label: 'Coming Soon', 
          icon: <Activity className={brandTokens.icons.sm} />,
          description: 'Commodity analysis features coming soon'
        }
      ]
    },
    {
      id: 'us-stock-market',
      label: 'US Market',
      icon: <TrendingUp className={brandTokens.icons.sm} />,
      description: 'US equity market analysis and sector performance',
      subItems: [
        { 
          id: 'coming-soon', 
          label: 'Coming Soon', 
          icon: <Activity className={brandTokens.icons.sm} />,
          description: 'US market analysis features coming soon'
        }
      ]
    },
    {
      id: 'news',
      label: 'News',
      icon: <Newspaper className={brandTokens.icons.sm} />,
      description: 'Market news and stock-specific updates'
    },
    {
      id: 'eodscans',
      label: 'EOD Scans',
      icon: <Microscope className={brandTokens.icons.sm} />,
      description: 'End-of-day technical analysis',
      subItems: [
        { 
          id: 'relative-outperformance', 
          label: 'Relative Outperformance', 
          icon: <BarChart3 className={brandTokens.icons.sm} />,
          description: 'Stocks outperforming their sector/market'
        },
        { 
          id: 'technical-patterns', 
          label: 'Technical Patterns', 
          icon: <TrendingUp className={brandTokens.icons.sm} />,
          description: 'Chart pattern recognition and analysis'
        },
      ]
    },
    {
      id: 'algo-trading',
      label: 'Algo Trading',
      icon: <Bot className={brandTokens.icons.sm} />,
      description: 'Automated trading strategies',
      subItems: [
        { 
          id: 'strategy-basics', 
          label: 'Strategy Basics', 
          icon: <Bot className={brandTokens.icons.sm} />,
          description: 'Learn fundamental algorithmic trading concepts'
        },
        { 
          id: 'backtesting', 
          label: 'Backtesting', 
          icon: <BarChart3 className={brandTokens.icons.sm} />,
          description: 'Test strategies against historical data'
        },
        { 
          id: 'live-performance', 
          label: 'Live Performance', 
          icon: <TrendingUp className={brandTokens.icons.sm} />,
          description: 'Real-time strategy performance tracking'
        },
      ]
    }
  ];

  const handleMenuItemClick = (itemId: string, subItemId?: string) => {
    // Handle blog navigation differently as it's a separate page
    if (itemId === 'blog') {
      window.location.href = '/blog';
      return;
    }
    
    // Handle direct navigation for smart-money-flow to ensure it works consistently
    if (itemId === 'smart-money-flow') {
      // Force a page refresh to ensure clean loading
      window.location.href = '/smart-money-flow';
      return;
    }
    
    // Handle Market navigation - navigate to Market with sector performance as default
    if (itemId === 'market') {
      window.location.href = '/market/sector-performance';
      return;
    }
    
    // Handle Swing Trade navigation - navigate to Swing with Momentum strategy as default
    if (itemId === 'swing') {
      window.location.href = '/swing-trades/momentum-strategy';
      return;
    }
    
    // Handle FNO navigation - navigate to FNO with option analysis as default
    if (itemId === 'fno') {
      window.location.href = '/fno/option-analysis';
      return;
    }
    
    // Handle Equity navigation - navigate to Equity with smart money flow as default
    if (itemId === 'equity') {
      window.location.href = '/equity/smart-money-flow';
      return;
    }
    
    // Handle Commodity navigation - navigate to Commodity with coming soon as default
    if (itemId === 'commodity') {
      window.location.href = '/commodity';
      return;
    }
    
    // Handle US Stock Market navigation - navigate to US Stock Market with coming soon as default
    if (itemId === 'us-stock-market') {
      window.location.href = '/us-stock-market';
      return;
    }
    
    // Handle submenu clicks
    if (subItemId) {
      // Handle market submenus - navigate to separate pages
      if (itemId === 'market') {
        window.location.href = `/market/${subItemId}`;
        return;
      }
      
      // Handle Swing Trade submenus - navigate to Swing subpages
      if (itemId === 'swing') {
        window.location.href = `/swing-trades/${subItemId}`;
        return;
      }
      
      // Handle FNO submenus - navigate to FNO subpages
      if (itemId === 'fno') {
        window.location.href = `/fno/${subItemId}`;
        return;
      }
      
      // Handle Equity submenus - navigate to Equity subpages
      if (itemId === 'equity') {
        window.location.href = `/equity/${subItemId}`;
        return;
      }
      
      // Handle US Stock Market submenus - navigate to US Stock Market subpages
      if (itemId === 'us-stock-market') {
        window.location.href = `/us-stock-market/${subItemId}`;
        return;
      }
      
      onSectionChange(itemId, subItemId);
      setShowMobileMenu(false);
      return;
    }
    
    onSectionChange(itemId, subItemId);
    setShowMobileMenu(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatChange = (change: number, changePercent: number) => {
    const sign = change >= 0 ? '+' : '';
    const color = change >= 0 ? 'text-green-400' : 'text-red-400';
    return (
      <span className={`${color} font-medium text-sm`}>
        {sign}{change.toFixed(2)} ({sign}{changePercent.toFixed(2)}%)
      </span>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-lg navigation-compact">
      {/* Top Status Bar - Very Thin */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white py-0.5 px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="w-full flex items-center justify-between text-xs">
          {/* Market Status & Time */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5">
              {isMarketOpen ? (
                <div className="flex items-center space-x-1.5">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-medium text-xs">Market Open</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1.5">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                  <span className="text-red-400 font-medium text-xs">Market Closed</span>
                </div>
              )}
              <span className="text-white/70">•</span>
              <span className="text-white/90 font-mono text-xs">{currentTime || '--:--:--'}</span>
            </div>
          </div>

          {/* Market Indices - Compact Horizontal Layout */}
          <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
            {marketIndices.length > 0 ? (
              marketIndices.map((index, idx) => (
                <button
                  key={idx}
                  onClick={() => handleIndexClick(index.name)}
                  className="flex items-center space-x-1.5 hover:bg-white/10 rounded px-2 py-0.5 transition-all duration-200 cursor-pointer group relative"
                  title={`Click to view ${index.displayName} 5-minute chart on TradingView`}
                  aria-label={`Click to view ${index.displayName} 5-minute chart`}
                >
                  <span className="text-white font-semibold text-xs whitespace-nowrap group-hover:text-blue-200">
                      {index.displayName}
                    </span>
                  <span className="text-white/90 font-mono text-xs group-hover:text-white">
                      {formatCurrency(index.current)}
                    </span>
                    {formatChange(index.change, index.changePercent)}
                  {/* Custom Tooltip */}
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50">
                    Click for 5min chart
                    <span className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></span>
                  </span>
                </button>
              ))
            ) : (
              <div className="flex items-center space-x-2">
                <div className="loading-shimmer w-20 h-3 rounded"></div>
                <div className="loading-shimmer w-16 h-3 rounded"></div>
              </div>
            )}
          </div>

                  {/* User Actions */}
          <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleMenuItemClick('blog')}
              className="hidden sm:flex items-center space-x-1.5 px-2 py-1 bg-white/10 text-white hover:bg-white/20 hover:text-white rounded transition-all duration-200 text-xs font-semibold"
                      aria-label="Blog"
                      title="Trading Blog & Market Insights"
                    >
              <Newspaper className="w-3 h-3" />
                      <span className="hidden md:inline">Blog</span>
                    </button>
                    <button
              className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
                      aria-label="Notifications"
                      title="Notifications"
                    >
              <Bell className="w-3.5 h-3.5" />
                    </button>
                    <button
              className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
                      aria-label="User menu"
                      title="User menu"
                    >
              <User className="w-3.5 h-3.5" />
                    </button>
                  </div>
        </div>
      </div>

      {/* Mobile Market Indices Bar - Show all indices */}
      <div className="lg:hidden bg-slate-800 text-white py-2 px-3">
        <div className="flex justify-between items-center">
          {/* Remove redundant market status since it's already shown above */}
          
          {/* Show Nifty, Bank Nifty, and Finnifty on mobile */}
          {marketIndices.length > 0 && (
            <div className="flex items-center space-x-3 overflow-x-auto scrollbar-thin w-full justify-between px-2">
              {marketIndices.slice(0, 3).map((index, idx) => (
                <div key={idx} className="text-center flex-shrink-0 min-w-0">
                  <div className="text-xs text-white/90 font-semibold whitespace-nowrap">{index.displayName}</div>
                  <div className="flex items-center space-x-1 text-xs justify-center">
                    <span className="text-white font-mono text-xs">{formatCurrency(index.current)}</span>
                    {formatChange(index.change, index.changePercent)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

              {/* Main Navigation with Integrated Branding - Medium Thickness */}
              <div className="w-full px-2 sm:px-3 md:px-4 lg:px-5 xl:px-6 py-1.5 sm:py-2 bg-white border-b border-gray-100 shadow-sm">
                <div className="flex items-center">
                  {/* TradeSmartMoney Branding - Left Side */}
                  <div className="flex items-center">
                    <button
                      onClick={() => handleMenuItemClick('home')}
                      className="flex items-center space-x-2 sm:space-x-2.5 hover:opacity-80 transition-opacity"
                      aria-label="Go to homepage"
                      title="TradeSmartMoney - Go to homepage"
                    >
                      <div className="w-8 h-8 sm:w-9 md:w-10 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                        <TrendingUp className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div className="hidden sm:block">
                        <h1 className="text-sm sm:text-base md:text-lg font-bold text-gray-900">TradeSmartMoney</h1>
                        <p className="text-xs text-gray-600 hidden lg:block">Professional Trading Platform</p>
                      </div>
                    </button>
                  </div>

                  {/* Desktop Navigation - Immediately After Branding */}
                  <div className="hidden lg:flex items-center space-x-1 xl:space-x-2 flex-wrap ml-2 lg:ml-3 xl:ml-5 menu-container">
                    {menuItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleMenuItemClick(item.id)}
                        className={`menu-item flex items-center space-x-1 px-2.5 py-1 rounded-lg font-medium transition-all duration-300 group text-xs sm:text-sm whitespace-nowrap ${
                          activeSection === item.id
                            ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 text-white shadow-lg'
                            : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        <div className={`p-1 rounded ${
                          activeSection === item.id
                            ? 'bg-white/20'
                            : 'bg-gray-100 group-hover:bg-blue-100'
                        }`}>
                          <div className="w-4 h-4 flex items-center justify-center">
                            {React.cloneElement(item.icon, { className: 'w-4 h-4' })}
                          </div>
                        </div>
                        <span className="whitespace-nowrap">{item.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Mobile Menu Button - Push to Right */}
                  <div className="ml-auto">
                    <button
                      onClick={() => setShowMobileMenu(!showMobileMenu)}
                      className="lg:hidden p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      aria-label={showMobileMenu ? "Close navigation menu" : "Open navigation menu"}
                      aria-expanded={showMobileMenu}
                      title={showMobileMenu ? "Close menu" : "Open menu"}
                    >
                      {showMobileMenu ? (
                        <X className={brandTokens.icons.md} />
                      ) : (
                        <Menu className={brandTokens.icons.md} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

      {/* Clean Mobile Navigation Menu */}
      {showMobileMenu && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-xl">
          <div className="px-3 py-3 space-y-1 max-h-[60vh] overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuItemClick(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl font-medium transition-colors ${
                  activeSection === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  activeSection === item.id 
                    ? 'bg-white/20' 
                    : 'bg-blue-50'
                }`}>
                  {item.icon}
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold text-sm">{item.label}</div>
                </div>
                <div className="text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
            
            {/* Mobile-specific Blog Access */}
            <button
              onClick={() => handleMenuItemClick('blog')}
              className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl font-medium text-gray-700 hover:bg-gray-100 active:bg-gray-200 border-t border-gray-100 mt-2 pt-4"
            >
              <div className="p-2 rounded-lg bg-blue-50">
                <Newspaper className="w-4 h-4" />
              </div>
              <div className="text-left flex-1">
                <div className="font-semibold text-sm">Blog</div>
              </div>
              <div className="text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      )}

    </nav>
  );
} 