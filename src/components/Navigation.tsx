'use client';

import { useState, useEffect } from 'react';
import { Bell, User, Menu, X, TrendingUp, BarChart3, Newspaper, Building2, Microscope, Bot } from 'lucide-react';
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
      setIsMarketOpen(isWeekday);
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
      ]
    },
    {
      id: 'swing',
      label: 'Swing Trades',
      icon: <TrendingUp className={brandTokens.icons.sm} />,
      description: 'Multi-day trading opportunities'
    },
    {
      id: 'intraday',
      label: 'Intraday',
      icon: <BarChart3 className={brandTokens.icons.sm} />,
      description: 'Same-day trading signals'
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
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-lg">
      {/* Top Status Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white py-2 px-4">
        <div className={`${brandTokens.spacing.page.container} flex items-center justify-between text-sm`}>
          {/* Market Status & Time */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {isMarketOpen ? (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-medium">Market Open</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-red-400 font-medium">Market Closed</span>
                </div>
              )}
              <span className="text-white/70">•</span>
              <span className="text-white/90 font-mono">{currentTime}</span>
            </div>
          </div>

          {/* Market Indices - Desktop Only */}
          <div className="hidden lg:flex items-center space-x-6 scrollbar-thin overflow-x-auto">
            {marketIndices.length > 0 ? (
              marketIndices.map((index, idx) => (
                <div key={idx} className="flex flex-col items-center min-w-0">
                  <span className="text-white font-medium text-sm whitespace-nowrap">{index.displayName}</span>
                  <div className="flex items-center space-x-1 text-xs">
                    <span className="text-white/90 font-mono">{formatCurrency(index.current)}</span>
                    {formatChange(index.change, index.changePercent)}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center space-x-2">
                <div className="loading-shimmer w-20 h-4 rounded"></div>
                <div className="loading-shimmer w-16 h-3 rounded"></div>
              </div>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            <button 
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell className={brandTokens.icons.sm} />
            </button>
            <button 
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="User menu"
              title="User menu"
            >
              <User className={brandTokens.icons.sm} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Market Indices Bar */}
      <div className="lg:hidden bg-slate-800 text-white py-2 px-4 overflow-x-auto scrollbar-thin">
        <div className="flex space-x-4 min-w-max">
          {marketIndices.length > 0 ? (
            marketIndices.map((index, idx) => (
              <div key={idx} className="flex items-center space-x-2 min-w-0">
                <span className="text-white font-medium text-xs whitespace-nowrap">{index.displayName}</span>
                <div className="flex flex-col text-xs">
                  <span className="text-white/90 font-mono">{formatCurrency(index.current)}</span>
                  {formatChange(index.change, index.changePercent)}
                </div>
              </div>
            ))
          ) : (
            <div className="flex space-x-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="loading-shimmer w-16 h-3 rounded"></div>
                  <div className="loading-shimmer w-12 h-3 rounded"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <div className={`${brandTokens.spacing.page.container} ${brandTokens.spacing.page.x} py-4`}>
        <div className="flex items-center justify-between">
                     {/* Logo - Clickable to go home */}
           <button
             onClick={() => handleMenuItemClick('home')}
             className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
             aria-label="Go to homepage"
             title="TradeSmartMoney - Go to homepage"
           >
             <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
               <TrendingUp className="w-6 h-6 text-white" />
             </div>
             <div className="hidden sm:block">
               <h1 className={`${brandTokens.typography.heading.sm} brand-text`}>TradeSmartMoney</h1>
               <p className={`${brandTokens.typography.body.sm} text-gray-600`}>Professional Trading Platform</p>
             </div>
           </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuItemClick(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 group ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${
                  activeSection === item.id 
                    ? 'bg-white/20' 
                    : 'bg-gray-100 group-hover:bg-blue-100'
                }`}>
                  {item.icon}
                </div>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
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

      {/* Improved Mobile Navigation Menu */}
      {showMobileMenu && (
        <div className="lg:hidden bg-white border-t border-gray-200/50 shadow-lg">
          <div className="px-4 py-4 space-y-1 max-h-[70vh] overflow-y-auto scrollbar-thin">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuItemClick(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 active:scale-[0.98] ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600 active:bg-blue-100'
                }`}
              >
                <div className={`p-2 rounded-lg transition-colors ${
                  activeSection === item.id 
                    ? 'bg-white/20' 
                    : 'bg-gray-100 group-hover:bg-blue-100'
                }`}>
                  {item.icon}
                </div>
                <div className="text-left">
                  <div className="font-semibold">{item.label}</div>
                  <div className="text-xs opacity-75">{item.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
} 