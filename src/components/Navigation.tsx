'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Bell, User, Menu, X, TrendingUp, BarChart3, Newspaper, Building2, Microscope, Bot } from 'lucide-react';

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
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMarketMenu, setShowMarketMenu] = useState(false);
  const [showEodScansMenu, setShowEodScansMenu] = useState(false);
  const [showAlgoTradingMenu, setShowAlgoTradingMenu] = useState(false);

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

  useEffect(() => {
    setShowMarketMenu(false);
    setShowEodScansMenu(false);
    setShowAlgoTradingMenu(false);
  }, [activeSection]);

  // Close all dropdowns when clicking outside (for mobile)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target.closest('.dropdown-container')) {
        setShowMarketMenu(false);
        setShowEodScansMenu(false);
        setShowAlgoTradingMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const menuItems = [
    {
      id: 'market',
      label: 'Market',
      icon: <Building2 className="w-4 h-4" />,
      description: 'Live market data and analysis',
      hasDropdown: true,
      dropdownItems: [
        { id: 'sector-performance', label: 'Sector Performance', description: 'Sector-wise performance analysis' },
        { id: 'fii-dii-activity', label: 'FII DII Activity', description: 'Foreign and domestic investment flows' },
        { id: 'top-gainers', label: 'Top Gainers', description: 'Best performing stocks today' },
        { id: 'top-losers', label: 'Top Losers', description: 'Worst performing stocks today' },
        { id: 'long-buildup', label: 'Long Built Up', description: 'Stocks with increasing long positions' },
        { id: 'short-buildup', label: 'Short Build Up', description: 'Stocks with increasing short positions' }
      ]
    },
    {
      id: 'swing',
      label: 'Swing Trades',
      icon: <TrendingUp className="w-4 h-4" />,
      description: 'Multi-day trading opportunities',
      hasDropdown: false
    },
    {
      id: 'intraday',
      label: 'Intraday Trades',
      icon: <BarChart3 className="w-4 h-4" />,
      description: 'Same-day trading signals',
      hasDropdown: false
    },
    {
      id: 'eodscans',
      label: 'EodScans',
      icon: <Microscope className="w-4 h-4" />,
      description: 'End-of-day technical analysis',
      hasDropdown: true,
      dropdownItems: [
        { id: 'relative-outperformance', label: 'Relative Outperformance', description: 'Stocks outperforming indices' },
        { id: 'candlestick-scans', label: 'CandlestickScans', description: 'Pattern-based analysis' },
        { id: 'chart-patterns', label: 'ChartPatterns', description: 'Technical chart formations' }
      ]
    },
    {
      id: 'algo-trading',
      label: 'Algo Trading',
      icon: <Bot className="w-4 h-4" />,
      description: 'Algorithmic trading education',
      hasDropdown: true,
      dropdownItems: [
        { id: 'strategy-basics', label: 'Strategy Basics', description: 'Fundamental algo concepts' },
        { id: 'backtesting', label: 'Backtesting', description: 'Test strategies on historical data' },
        { id: 'live-strategies', label: 'Live Strategies', description: 'Currently running algorithms' },
        { id: 'performance-analytics', label: 'Performance Analytics', description: 'Strategy performance analysis' },
        { id: 'risk-management', label: 'Risk Management', description: 'Automated risk controls' },
        { id: 'code-examples', label: 'Code Examples', description: 'Sample trading algorithms' }
      ]
    },
    {
      id: 'news',
      label: 'News',
      icon: <Newspaper className="w-4 h-4" />,
      description: 'Latest market updates',
      hasDropdown: false
    }
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50 py-4" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto">
        {/* Top Status Bar */}
        <div className="flex items-center justify-between px-4 lg:px-6 py-2 border-b border-gray-100 mb-4" role="banner">
          <div className="flex items-center space-x-4 lg:space-x-6 text-xs lg:text-sm text-gray-600">
            <div className="flex items-center space-x-1 lg:space-x-2" aria-label="Market status">
              <div 
                className={`w-2 h-2 rounded-full ${
                  isMarketOpen 
                    ? 'bg-green-500 animate-pulse' 
                    : 'bg-red-500'
                }`} 
                aria-hidden="true"
              ></div>
              <span className="font-medium">
                {isMarketOpen ? 'Market Open' : 'Market Closed'}
              </span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-3 lg:space-x-4 overflow-x-auto scrollbar-hide" role="group" aria-label="Market indices">
              {marketIndices.length > 0 ? (
                marketIndices.map((index) => {
                  const isPositive = index.changePercent >= 0;
                  // Show different indices based on screen size
                  let visibilityClass = '';
                  
                  if (index.displayName === 'Sensex') {
                    // Sensex: hidden on mobile, visible on sm+
                    visibilityClass = 'hidden sm:inline';
                  } else if (index.displayName === 'Finnifty') {
                    // Finnifty: hidden on mobile and tablet, visible on md+
                    visibilityClass = 'hidden md:inline';
                  }
                  // Nifty and Bank Nifty: always visible (no class needed)
                  
                  return (
                    <span key={index.name} className={`flex-shrink-0 text-xs sm:text-sm ${visibilityClass}`}>
                      <span className="font-medium">{index.displayName}</span>
                      <span className="mx-1">:</span>
                      <span className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        <span className="hidden sm:inline">
                          {index.current.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({isPositive ? '+' : ''}{index.changePercent.toFixed(2)}%)
                        </span>
                        <span className="sm:hidden">
                          {index.current.toLocaleString('en-IN', { maximumFractionDigits: 0 })} ({isPositive ? '+' : ''}{index.changePercent.toFixed(1)}%)
                        </span>
                      </span>
                    </span>
                  );
                })
              ) : (
                // Fallback while loading - responsive
                <>
                  <span className="flex-shrink-0 text-xs sm:text-sm">
                    <span className="font-medium">Nifty</span>
                    <span className="mx-1">:</span>
                    <span className="font-semibold text-gray-500">Loading...</span>
                  </span>
                  <span className="flex-shrink-0 text-xs sm:text-sm hidden sm:inline">
                    <span className="font-medium">Sensex</span>
                    <span className="mx-1">:</span>
                    <span className="font-semibold text-gray-500">Loading...</span>
                  </span>
                  <span className="flex-shrink-0 text-xs sm:text-sm">
                    <span className="font-medium">Bank Nifty</span>
                    <span className="mx-1">:</span>
                    <span className="font-semibold text-gray-500">Loading...</span>
                  </span>
                  <span className="flex-shrink-0 text-xs sm:text-sm hidden md:inline">
                    <span className="font-medium">Finnifty</span>
                    <span className="mx-1">:</span>
                    <span className="font-semibold text-gray-500">Loading...</span>
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="text-right text-xs lg:text-sm">
            <span className="hidden sm:inline text-gray-600">Last Updated: </span>
            <span className="font-medium text-gray-800">{currentTime}</span>
          </div>
        </div>

        {/* Main Header with Logo and Desktop Menu */}
        <header className="grid grid-cols-3 items-center px-4 lg:px-6">
          {/* Left spacer */}
          <div></div>
          
          {/* Centered Logo */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 lg:space-x-3 mb-1">
              <div className="relative">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-lg flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-white" aria-hidden="true" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-400 to-green-600 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <h1 className="text-xl lg:text-2xl xl:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent font-serif tracking-tight">
                TradeSmartMoney
              </h1>
            </div>
            <p className="text-xs lg:text-sm text-gray-600 mt-1 font-light tracking-wide uppercase">Professional Trading Platform</p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-2">
            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <button 
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4 lg:w-5 lg:h-5" aria-hidden="true" />
              </button>
              <button 
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                aria-label="User account"
              >
                <User className="w-4 h-4 lg:w-5 lg:h-5" aria-hidden="true" />
              </button>
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              aria-label={showMobileMenu ? "Close mobile menu" : "Open mobile menu"}
              aria-expanded={showMobileMenu}
            >
              {showMobileMenu ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
        </header>

        {/* Desktop Navigation Menu */}
        <div className="hidden lg:flex items-center justify-center p-2 mt-4">
          <div className="flex items-center space-x-1 bg-white rounded-xl p-3 shadow-lg border border-gray-300 backdrop-blur-sm">
            {menuItems.map((item) => (
              <div 
                key={item.id} 
                className="relative dropdown-container group"
              >
                <button
                  onClick={() => {
                    if (!item.hasDropdown) {
                      onSectionChange(item.id);
                      setShowMarketMenu(false);
                      setShowEodScansMenu(false);
                      setShowAlgoTradingMenu(false);
                    }
                  }}
                  onMouseEnter={() => {
                    if (item.hasDropdown) {
                      if (item.id === 'market') {
                        setShowMarketMenu(true);
                        setShowEodScansMenu(false);
                        setShowAlgoTradingMenu(false);
                      } else if (item.id === 'eodscans') {
                        setShowEodScansMenu(true);
                        setShowMarketMenu(false);
                        setShowAlgoTradingMenu(false);
                      } else if (item.id === 'algo-trading') {
                        setShowAlgoTradingMenu(true);
                        setShowMarketMenu(false);
                        setShowEodScansMenu(false);
                      }
                    }
                  }}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 group relative overflow-hidden ${
                    activeSection === item.id
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform hover:scale-105'
                      : 'text-gray-700 hover:text-blue-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-md hover:scale-105'
                  }`}
                >
                  <div className={`transition-colors duration-300 ${
                    activeSection === item.id ? 'text-blue-200' : 'text-gray-500 group-hover:text-blue-600'
                  }`}>
                    {item.icon}
                  </div>
                  <span className="text-base font-semibold font-serif">{item.label}</span>
                  {item.hasDropdown && (
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                      (item.id === 'market' && showMarketMenu) || 
                      (item.id === 'eodscans' && showEodScansMenu) ||
                      (item.id === 'algo-trading' && showAlgoTradingMenu)
                        ? 'rotate-180' : ''
                    }`} />
                  )}
                  
                  {/* Animated underline */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-purple-400 transform transition-transform duration-300 ${
                    activeSection === item.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}></div>
                </button>

                {/* Invisible bridge to eliminate gap */}
                {item.hasDropdown && (
                  <div className="absolute top-full left-0 w-full h-2 bg-transparent"></div>
                )}

                {/* Market Dropdown */}
                {item.id === 'market' && (
                  <div 
                    className={`absolute top-full left-0 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 py-4 px-5 z-50 transition-all duration-300 ${
                      showMarketMenu ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                    }`}
                    onMouseEnter={() => setShowMarketMenu(true)}
                    onMouseLeave={() => setShowMarketMenu(false)}
                  >
                    <h3 className="text-base font-bold text-gray-900 mb-3 font-serif">Market Analysis</h3>
                    <div className="space-y-1">
                      {item.dropdownItems?.map((dropdownItem) => (
                        <a
                          key={dropdownItem.id}
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            onSectionChange('market', dropdownItem.id);
                            setShowMarketMenu(false);
                          }}
                          className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors duration-200"
                        >
                          <div className="font-semibold text-sm">{dropdownItem.label}</div>
                          <div className="text-xs text-gray-500 mt-1">{dropdownItem.description}</div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* EodScans Dropdown */}
                {item.id === 'eodscans' && (
                  <div 
                    className={`absolute top-full left-0 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 py-4 px-5 z-50 transition-all duration-300 ${
                      showEodScansMenu ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                    }`}
                    onMouseEnter={() => setShowEodScansMenu(true)}
                    onMouseLeave={() => setShowEodScansMenu(false)}
                  >
                    <h3 className="text-base font-bold text-gray-900 mb-3 font-serif">Technical Scans</h3>
                    <div className="space-y-1">
                      {item.dropdownItems?.map((dropdownItem) => (
                        <a
                          key={dropdownItem.id}
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            onSectionChange('eodscans', dropdownItem.id);
                            setShowEodScansMenu(false);
                          }}
                          className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors duration-200"
                        >
                          <div className="font-semibold text-sm">{dropdownItem.label}</div>
                          <div className="text-xs text-gray-500 mt-1">{dropdownItem.description}</div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Algo Trading Dropdown */}
                {item.id === 'algo-trading' && (
                  <div 
                    className={`absolute top-full left-0 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 py-4 px-5 z-50 transition-all duration-300 ${
                      showAlgoTradingMenu ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                    }`}
                    onMouseEnter={() => setShowAlgoTradingMenu(true)}
                    onMouseLeave={() => setShowAlgoTradingMenu(false)}
                  >
                    <h3 className="text-base font-bold text-gray-900 mb-3 font-serif">Algorithmic Trading</h3>
                    <div className="space-y-1">
                      {item.dropdownItems?.map((dropdownItem) => (
                        <a
                          key={dropdownItem.id}
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            onSectionChange('algo-trading', dropdownItem.id);
                            setShowAlgoTradingMenu(false);
                          }}
                          className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors duration-200"
                        >
                          <div className="font-semibold text-sm">{dropdownItem.label}</div>
                          <div className="text-xs text-gray-500 mt-1">{dropdownItem.description}</div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden bg-white border-t border-gray-200 mt-4">
            <div className="px-4 py-2 space-y-1">
              {menuItems.map((item) => (
                <div key={item.id}>
                  <button
                    onClick={() => {
                      if (item.hasDropdown) {
                        if (item.id === 'market') {
                          setShowMarketMenu(!showMarketMenu);
                        } else if (item.id === 'eodscans') {
                          setShowEodScansMenu(!showEodScansMenu);
                        } else if (item.id === 'algo-trading') {
                          setShowAlgoTradingMenu(!showAlgoTradingMenu);
                        }
                      } else {
                        onSectionChange(item.id);
                        setShowMobileMenu(false);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors border ${
                      activeSection === item.id
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'text-gray-700 hover:bg-blue-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.hasDropdown && (
                      <ChevronDown className={`w-4 h-4 transition-transform ${
                        (item.id === 'market' && showMarketMenu) || 
                        (item.id === 'eodscans' && showEodScansMenu) ||
                        (item.id === 'algo-trading' && showAlgoTradingMenu)
                          ? 'rotate-180' : ''
                      }`} />
                    )}
                  </button>
                  
                  {/* Mobile Dropdowns */}
                  {item.hasDropdown && (
                    <>
                      {item.id === 'market' && showMarketMenu && (
                        <div className="ml-4 mt-2 space-y-1">
                          {item.dropdownItems?.map((dropdownItem) => (
                            <button
                              key={dropdownItem.id}
                              onClick={() => {
                                onSectionChange('market', dropdownItem.id);
                                setShowMobileMenu(false);
                                setShowMarketMenu(false);
                              }}
                              className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            >
                              {dropdownItem.label}
                            </button>
                          ))}
                        </div>
                      )}
                      {item.id === 'eodscans' && showEodScansMenu && (
                        <div className="ml-4 mt-2 space-y-1">
                          {item.dropdownItems?.map((dropdownItem) => (
                            <button
                              key={dropdownItem.id}
                              onClick={() => {
                                onSectionChange('eodscans', dropdownItem.id);
                                setShowMobileMenu(false);
                                setShowEodScansMenu(false);
                              }}
                              className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            >
                              {dropdownItem.label}
                            </button>
                          ))}
                        </div>
                      )}
                      {item.id === 'algo-trading' && showAlgoTradingMenu && (
                        <div className="ml-4 mt-2 space-y-1">
                          {item.dropdownItems?.map((dropdownItem) => (
                            <button
                              key={dropdownItem.id}
                              onClick={() => {
                                onSectionChange('algo-trading', dropdownItem.id);
                                setShowMobileMenu(false);
                                setShowAlgoTradingMenu(false);
                              }}
                              className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            >
                              {dropdownItem.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 