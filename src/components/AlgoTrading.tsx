'use client';

import { useState, useEffect } from 'react';
import { Bot, Brain, BarChart3, Shield, Code, TrendingUp, Activity, Clock } from 'lucide-react';

interface AlgoTradingProps {
  initialSubSection?: string;
}

interface AlgoSubSection {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

export function AlgoTrading({ initialSubSection }: AlgoTradingProps) {
  const [activeSubSection, setActiveSubSection] = useState(initialSubSection || 'strategy-basics');

  useEffect(() => {
    if (initialSubSection) {
      setActiveSubSection(initialSubSection);
    }
  }, [initialSubSection]);

  const subSections: AlgoSubSection[] = [
    { id: 'strategy-basics', label: 'Strategy Basics', icon: <Brain className="w-4 h-4" />, description: 'Fundamental concepts' },
    { id: 'backtesting', label: 'Backtesting', icon: <BarChart3 className="w-4 h-4" />, description: 'Historical testing' },
    { id: 'live-strategies', label: 'Live Strategies', icon: <Activity className="w-4 h-4" />, description: 'Running algorithms' },
    { id: 'performance-analytics', label: 'Performance Analytics', icon: <TrendingUp className="w-4 h-4" />, description: 'Results analysis' },
    { id: 'risk-management', label: 'Risk Management', icon: <Shield className="w-4 h-4" />, description: 'Automated controls' },
    { id: 'code-examples', label: 'Code Examples', icon: <Code className="w-4 h-4" />, description: 'Sample algorithms' },
  ];

  const strategyBasics = [
    {
      title: 'Moving Average Crossover',
      description: 'Simple strategy using two moving averages to generate buy/sell signals',
      difficulty: 'Beginner',
      concepts: ['Technical Indicators', 'Signal Generation', 'Trend Following'],
      timeToLearn: '2-3 hours'
    },
    {
      title: 'Mean Reversion',
      description: 'Identifies overbought/oversold conditions for contrarian trades',
      difficulty: 'Intermediate',
      concepts: ['Statistical Analysis', 'RSI', 'Bollinger Bands'],
      timeToLearn: '4-6 hours'
    },
    {
      title: 'Momentum Strategy',
      description: 'Captures price momentum using multiple technical indicators',
      difficulty: 'Advanced',
      concepts: ['Multi-indicator Analysis', 'Volume Confirmation', 'Risk Management'],
      timeToLearn: '8-10 hours'
    }
  ];

  const backtestResults = [
    {
      strategy: 'Moving Average Crossover',
      period: '2023-2024',
      totalTrades: 245,
      winRate: 68.5,
      totalReturn: 24.3,
      maxDrawdown: 8.7,
      sharpeRatio: 1.42
    },
    {
      strategy: 'Mean Reversion',
      period: '2023-2024',
      totalTrades: 189,
      winRate: 72.4,
      totalReturn: 31.8,
      maxDrawdown: 6.2,
      sharpeRatio: 1.89
    },
    {
      strategy: 'Momentum Strategy',
      period: '2023-2024',
      totalTrades: 156,
      winRate: 74.2,
      totalReturn: 38.6,
      maxDrawdown: 12.1,
      sharpeRatio: 2.15
    }
  ];

  const liveStrategies = [
    {
      name: 'Scalping Bot v2.1',
      status: 'Active',
      todayTrades: 23,
      todayPnl: '+₹4,250',
      winRate: 78.3,
      lastSignal: '2 minutes ago'
    },
    {
      name: 'Swing Momentum',
      status: 'Active',
      todayTrades: 3,
      todayPnl: '+₹8,900',
      winRate: 85.7,
      lastSignal: '1 hour ago'
    },
    {
      name: 'Options Straddle',
      status: 'Paused',
      todayTrades: 0,
      todayPnl: '₹0',
      winRate: 62.1,
      lastSignal: 'N/A'
    }
  ];

  const performanceMetrics = [
    { metric: 'Total Algorithms', value: '8', status: 'Active', color: 'text-green-600' },
    { metric: 'Monthly Return', value: '12.4%', status: 'Above Target', color: 'text-green-600' },
    { metric: 'Max Drawdown', value: '4.2%', status: 'Within Limits', color: 'text-yellow-600' },
    { metric: 'Sharpe Ratio', value: '2.18', status: 'Excellent', color: 'text-green-600' }
  ];

  const riskControls = [
    {
      control: 'Position Size Limit',
      current: '₹50,000',
      maximum: '₹1,00,000',
      status: 'Safe',
      description: 'Maximum capital per trade'
    },
    {
      control: 'Daily Loss Limit',
      current: '₹2,100',
      maximum: '₹10,000',
      status: 'Safe',
      description: 'Stop trading if daily loss exceeds limit'
    },
    {
      control: 'Correlation Check',
      current: '0.35',
      maximum: '0.70',
      status: 'Safe',
      description: 'Prevent over-concentration in correlated assets'
    }
  ];

  const codeExamples = [
    {
      title: 'Simple Moving Average Strategy',
      language: 'Python',
      description: 'Basic crossover strategy implementation',
      complexity: 'Beginner',
      lines: 45
    },
    {
      title: 'RSI Mean Reversion',
      language: 'Python',
      description: 'Contrarian strategy using RSI indicator',
      complexity: 'Intermediate',
      lines: 78
    },
    {
      title: 'Multi-factor Momentum',
      language: 'Python',
      description: 'Advanced momentum strategy with multiple indicators',
      complexity: 'Advanced',
      lines: 156
    }
  ];

  const renderSubSection = () => {
    switch (activeSubSection) {
      case 'strategy-basics':
        return (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 lg:p-6">
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 font-serif">Strategy Fundamentals</h3>
            <div className="space-y-4">
              {strategyBasics.map((strategy, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-sm lg:text-base font-bold text-gray-900 font-serif">{strategy.title}</h4>
                      <p className="text-xs lg:text-sm text-gray-600 mt-1">{strategy.description}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      strategy.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                      strategy.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {strategy.difficulty}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {strategy.concepts.map((concept, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {concept}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>Estimated learning time: {strategy.timeToLearn}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'backtesting':
        return (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 lg:p-6">
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 font-serif">Backtest Results</h3>
            <div className="space-y-3">
              {backtestResults.map((result, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm lg:text-base font-bold text-gray-900 font-serif">{result.strategy}</h4>
                    <span className="text-xs text-gray-500">{result.period}</span>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 text-xs lg:text-sm">
                    <div>
                      <span className="text-gray-600">Total Trades:</span>
                      <p className="font-semibold">{result.totalTrades}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Win Rate:</span>
                      <p className="font-semibold text-green-600">{result.winRate}%</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Return:</span>
                      <p className="font-semibold text-blue-600">{result.totalReturn}%</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Max Drawdown:</span>
                      <p className="font-semibold text-red-600">{result.maxDrawdown}%</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Sharpe Ratio:</span>
                      <p className="font-semibold text-purple-600">{result.sharpeRatio}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'live-strategies':
        return (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 lg:p-6">
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 font-serif">Live Trading Algorithms</h3>
            <div className="space-y-3">
              {liveStrategies.map((strategy, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-sm lg:text-base font-bold text-gray-900 font-serif">{strategy.name}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className={`w-2 h-2 rounded-full ${
                          strategy.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                        }`}></div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          strategy.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {strategy.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm lg:text-base font-bold ${
                        strategy.todayPnl.startsWith('+') ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {strategy.todayPnl}
                      </p>
                      <p className="text-xs text-gray-500">Today&apos;s P&L</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-xs lg:text-sm">
                    <div>
                      <span className="text-gray-600">Trades:</span>
                      <p className="font-semibold">{strategy.todayTrades}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Win Rate:</span>
                      <p className="font-semibold text-blue-600">{strategy.winRate}%</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Last Signal:</span>
                      <p className="font-semibold">{strategy.lastSignal}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'performance-analytics':
        return (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 lg:p-6">
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 font-serif">Algorithm Performance</h3>
            <div className="grid grid-cols-2 gap-3">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-all duration-300">
                  <h4 className="text-xs lg:text-sm font-semibold text-gray-600 mb-2">{metric.metric}</h4>
                  <p className={`text-lg lg:text-xl font-bold ${metric.color} mb-1`}>{metric.value}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    metric.status.includes('Excellent') || metric.status.includes('Above') ? 'bg-green-100 text-green-700' :
                    metric.status.includes('Within') ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {metric.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'risk-management':
        return (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 lg:p-6">
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 font-serif">Risk Controls</h3>
            <div className="space-y-3">
              {riskControls.map((control, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm lg:text-base font-bold text-gray-900 font-serif">{control.control}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      control.status === 'Safe' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {control.status}
                    </span>
                  </div>
                  <p className="text-xs lg:text-sm text-gray-600 mb-2">{control.description}</p>
                  <div className="flex items-center justify-between text-xs lg:text-sm">
                    <div>
                      <span className="text-gray-600">Current: </span>
                      <span className="font-semibold">{control.current}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Limit: </span>
                      <span className="font-semibold text-red-600">{control.maximum}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'code-examples':
        return (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 lg:p-6">
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 font-serif">Trading Algorithm Examples</h3>
            <div className="space-y-3">
              {codeExamples.map((example, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-sm lg:text-base font-bold text-gray-900 font-serif">{example.title}</h4>
                      <p className="text-xs lg:text-sm text-gray-600 mt-1">{example.description}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        example.complexity === 'Beginner' ? 'bg-green-100 text-green-700' :
                        example.complexity === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {example.complexity}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs lg:text-sm">
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-600">Language: <span className="font-semibold text-blue-600">{example.language}</span></span>
                      <span className="text-gray-600">Lines: <span className="font-semibold">{example.lines}</span></span>
                    </div>
                    <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors">
                      View Code
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return <div>Select a section to view content</div>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 lg:py-6">
      {/* Compact Page Header */}
      <div className="mb-6 lg:mb-8">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2 font-serif">Algorithmic Trading</h2>
        <p className="text-sm lg:text-base text-gray-600">
          Learn and implement automated trading strategies with comprehensive tutorials and tools.
        </p>
      </div>

      {/* Compact Professional Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
        {/* Compact Left Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
            <h3 className="text-sm lg:text-base font-bold text-gray-900 mb-4 font-serif">Algo Sections</h3>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mt-6 lg:mt-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 lg:p-6 text-center">
          <Bot className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600 mx-auto mb-2 lg:mb-3" />
          <h3 className="text-sm lg:text-lg font-bold text-blue-800 mb-1">Active Algorithms</h3>
          <p className="text-xs lg:text-sm text-blue-700 font-semibold">6</p>
          <p className="text-xs text-blue-600 mt-1">Currently running</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4 lg:p-6 text-center">
          <TrendingUp className="w-6 h-6 lg:w-8 lg:h-8 text-green-600 mx-auto mb-2 lg:mb-3" />
          <h3 className="text-sm lg:text-lg font-bold text-green-800 mb-1">Monthly Return</h3>
          <p className="text-xs lg:text-sm text-green-700 font-semibold">+12.4%</p>
          <p className="text-xs text-green-600 mt-1">Automated trading</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4 lg:p-6 text-center">
          <Code className="w-6 h-6 lg:w-8 lg:h-8 text-purple-600 mx-auto mb-2 lg:mb-3" />
          <h3 className="text-sm lg:text-lg font-bold text-purple-800 mb-1">Code Examples</h3>
          <p className="text-xs lg:text-sm text-purple-700 font-semibold">12</p>
          <p className="text-xs text-purple-600 mt-1">Ready-to-use strategies</p>
        </div>
      </div>
    </div>
  );
} 