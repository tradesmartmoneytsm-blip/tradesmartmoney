'use client';

import { Activity, Shield, BarChart3, Clock, Target } from 'lucide-react';
// Auto ads will handle all ad placement automatically

export function IntradayTrades() {
  const intradaySignals = [
    {
      symbol: 'INFY',
      company: 'Infosys Limited',
      ltp: 1590.25,
      change: 1.87,
      target: 1620.00,
      stopLoss: 1575.00,
      potentialReturn: 1.87,
      signalTime: '09:45 AM',
      signalType: 'BUY',
      reason: 'Morning breakout above resistance'
    },
    {
      symbol: 'ICICIBANK',
      company: 'ICICI Bank',
      ltp: 990.55,
      change: 1.46,
      target: 1005.00,
      stopLoss: 985.00,
      potentialReturn: 1.46,
      signalTime: '10:15 AM',
      signalType: 'BUY',
      reason: 'Reversal from support level'
    },
    {
      symbol: 'BAJFINANCE',
      company: 'Bajaj Finance',
      ltp: 6420.30,
      change: 0.93,
      target: 6480.00,
      stopLoss: 6390.00,
      potentialReturn: 0.93,
      signalTime: '11:30 AM',
      signalType: 'BUY',
      reason: 'Flag pattern completion'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 lg:py-6">
      {/* Google Auto Ads will handle ad placement automatically */}
      
      {/* Compact Page Header */}
      <div className="mb-6 lg:mb-8">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2 font-serif">Intraday Trading Signals</h2>
        <p className="text-sm lg:text-base text-gray-600">
          Real-time intraday opportunities for same-day trading.
        </p>
      </div>

      {/* Compact Status Badge */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 p-3 lg:p-4 rounded-lg mb-6">
        <div className="flex items-center">
          <Activity className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 mr-2 lg:mr-3" />
          <div>
            <p className="text-sm lg:text-base font-semibold text-green-800">Market is OPEN</p>
            <p className="text-xs lg:text-sm text-green-700">Intraday signals are actively generated</p>
          </div>
        </div>
      </div>

      {/* Compact Trading Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6 lg:mb-8">
        {intradaySignals.map((signal) => (
          <div key={signal.symbol} className="bg-white rounded-lg shadow-md border border-gray-200 p-4 lg:p-6 hover:shadow-lg transition-all duration-300">
            {/* Compact Card Header */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base lg:text-lg font-bold text-gray-900 font-serif">{signal.symbol}</h3>
                <p className="text-xs lg:text-sm text-gray-600 truncate" title={signal.company}>{signal.company}</p>
              </div>
              <div className={`px-2 py-1 lg:px-3 lg:py-2 rounded-full text-xs lg:text-sm font-semibold ${
                signal.signalType === 'BUY' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {signal.signalType}
              </div>
            </div>

            {/* Price Information */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg lg:text-xl font-bold text-gray-900">₹{signal.ltp.toLocaleString()}</span>
                <div className="flex items-center">
                  <Clock className="w-3 h-3 lg:w-4 lg:h-4 text-gray-500 mr-1" />
                  <span className="text-xs lg:text-sm text-gray-600">{signal.signalTime}</span>
                </div>
              </div>
              <div className={`text-sm lg:text-base font-semibold ${
                signal.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                  {signal.change >= 0 ? '+' : ''}{signal.change}%
              </div>
            </div>

            {/* Trading Levels - Compact Grid */}
            <div className="space-y-3">
            <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 lg:gap-3 mb-3">
              <div className="flex items-center space-x-2 min-w-0">
                <Target className="w-3 h-3 lg:w-4 lg:h-4 text-blue-600 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-600">Target</p>
                    <p className="text-sm lg:text-base font-semibold text-blue-600 truncate">₹{signal.target.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 min-w-0">
                <Shield className="w-3 h-3 lg:w-4 lg:h-4 text-red-600 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-600">Stop Loss</p>
                    <p className="text-sm lg:text-base font-semibold text-red-600 truncate">₹{signal.stopLoss.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 min-w-0">
                <BarChart3 className="w-3 h-3 lg:w-4 lg:h-4 text-green-600 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-600">Potential</p>
                    <p className="text-sm lg:text-base font-semibold text-green-600">{signal.potentialReturn}%</p>
              </div>
                </div>
              </div>
            </div>

            {/* Signal Reason */}
            <div className="mt-4 pt-3 border-t border-gray-100">
              <p className="text-xs lg:text-sm text-gray-700 font-medium">{signal.reason}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Auto Ads will handle in-content placement */}

      {/* Compact Trading Guidelines */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 lg:p-6">
        <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 font-serif">Intraday Trading Guidelines</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <div>
            <h4 className="text-base font-semibold text-gray-800 mb-2">Risk Management</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Never risk more than 2% per trade</li>
              <li>• Always use stop loss orders</li>
              <li>• Book partial profits at targets</li>
            </ul>
          </div>
          <div>
            <h4 className="text-base font-semibold text-gray-800 mb-2">Best Practices</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Trade with the trend</li>
              <li>• Exit all positions by market close</li>
              <li>• Monitor volume confirmation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 