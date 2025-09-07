'use client';

import { Activity, Shield, BarChart3, Clock, Target } from 'lucide-react';
import { HeaderAd, InContentAd } from '@/components/AdSense';

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
      {/* Header Advertisement */}
      <HeaderAd />
      
      {/* Compact Page Header */}
      <div className="mb-6 lg:mb-8">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2 font-serif">Intraday Trading Signals</h2>
        <p className="text-sm lg:text-base text-gray-600">
          Real-time intraday opportunities for same-day trading.
        </p>
      </div>

      {/* Market Status Alert */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 p-3 lg:p-4 rounded-lg mb-6">
        <div className="flex items-center">
          <Activity className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 mr-2 lg:mr-3" />
          <div>
            <p className="text-sm lg:text-base font-semibold text-green-800">Market is OPEN</p>
            <p className="text-xs lg:text-sm text-green-700">Live signals are being generated every 5 minutes</p>
          </div>
        </div>
      </div>

      {/* Compact Trading Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6 lg:mb-8">
        {intradaySignals.map((signal) => (
          <div key={signal.symbol} className="bg-white rounded-lg shadow-md border border-gray-200 p-4 lg:p-6 hover:shadow-lg transition-all duration-300">
            {/* Compact Card Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1 min-w-0 mr-3">
                <h3 className="text-base lg:text-lg font-bold text-gray-900 truncate font-serif">{signal.symbol}</h3>
                <p className="text-xs lg:text-sm text-gray-600 truncate">{signal.company}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm lg:text-base font-bold text-gray-900">₹{signal.ltp}</p>
                <p className={`text-xs lg:text-sm font-semibold ${signal.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {signal.change >= 0 ? '+' : ''}{signal.change}%
                </p>
              </div>
            </div>

            {/* Compact Trading Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 lg:gap-3 mb-3">
              <div className="flex items-center space-x-2 min-w-0">
                <Target className="w-3 h-3 lg:w-4 lg:h-4 text-blue-600 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-600">Target</p>
                  <p className="text-xs lg:text-sm font-semibold text-gray-900 truncate">₹{signal.target}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 min-w-0">
                <Shield className="w-3 h-3 lg:w-4 lg:h-4 text-red-600 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-600">Stop Loss</p>
                  <p className="text-xs lg:text-sm font-semibold text-gray-900 truncate">₹{signal.stopLoss}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 min-w-0">
                <BarChart3 className="w-3 h-3 lg:w-4 lg:h-4 text-green-600 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-600">Potential</p>
                  <p className="text-xs lg:text-sm font-semibold text-green-600 truncate">+{signal.potentialReturn}%</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 min-w-0">
                <Clock className="w-3 h-3 lg:w-4 lg:h-4 text-purple-600 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-600">Signal Time</p>
                  <p className="text-xs lg:text-sm font-semibold text-gray-900 truncate">{signal.signalTime}</p>
                </div>
              </div>
            </div>

            {/* Compact Signal Details */}
            <div className="pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs lg:text-sm font-medium text-gray-600">Signal Type</span>
                <span className={`text-xs lg:text-sm font-bold ${
                  signal.signalType === 'BUY' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {signal.signalType}
                </span>
              </div>
              <p className="text-xs lg:text-sm text-gray-600 text-center italic">&ldquo;{signal.reason}&rdquo;</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* In-Content Advertisement */}
      <InContentAd />

      {/* Compact Trading Guidelines */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 lg:p-6">
        <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 font-serif">Intraday Trading Guidelines</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <div className="space-y-3">
            <h4 className="text-sm lg:text-base font-semibold text-blue-600 font-serif">Time Management</h4>
            <ul className="space-y-1 text-xs lg:text-sm text-gray-700">
              <li>• Best trading hours: 9:30-11:30 AM & 2:30-3:15 PM</li>
              <li>• Avoid trading during lunch hour volatility</li>
              <li>• Exit all positions 15 minutes before close</li>
              <li>• Monitor pre-market and after-market trends</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm lg:text-base font-semibold text-green-600 font-serif">Risk Management</h4>
            <ul className="space-y-1 text-xs lg:text-sm text-gray-700">
              <li>• Maximum 3-5 trades per day</li>
              <li>• Risk only 1% of capital per trade</li>
              <li>• Use trailing stops for profitable trades</li>
              <li>• Cut losses quickly, let profits run</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 