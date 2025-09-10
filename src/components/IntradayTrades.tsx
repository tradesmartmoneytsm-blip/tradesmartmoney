'use client';

import { useState } from 'react';
import { Activity, Shield, BarChart3, Clock, Target, Zap, TrendingUp, Settings } from 'lucide-react';
import { StormStrategy } from './StormStrategy';
// Auto ads will handle all ad placement automatically

export function IntradayTrades() {
  const [activeStrategy, setActiveStrategy] = useState('signals');
  
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

  const strategies = [
    {
      id: 'signals',
      name: 'Trading Signals',
      description: 'Real-time intraday trading opportunities',
      icon: TrendingUp
    },
    {
      id: 'storm',
      name: 'Storm',
      description: 'High money flow activity detection',
      icon: Zap
    },
    {
      id: 'more-coming',
      name: 'More Strategies',
      description: 'Additional strategies coming soon',
      icon: Settings,
      disabled: true
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 lg:py-6">
      {/* Google Auto Ads will handle ad placement automatically */}
      
      {/* Page Header with Strategy Selection */}
      <div className="mb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 font-serif">Intraday Trading Strategies</h2>
          <p className="text-gray-600">
            Choose your preferred strategy for today&apos;s trading opportunities.
          </p>
        </div>

        {/* Strategy Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {strategies.map((strategy) => {
            const IconComponent = strategy.icon;
            return (
              <button
                key={strategy.id}
                onClick={() => !strategy.disabled && setActiveStrategy(strategy.id)}
                disabled={strategy.disabled}
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  activeStrategy === strategy.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : strategy.disabled
                    ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    activeStrategy === strategy.id
                      ? 'bg-blue-500 text-white'
                      : strategy.disabled
                      ? 'bg-gray-300 text-gray-500'
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${
                      strategy.disabled ? 'text-gray-500' : 'text-gray-800'
                    }`}>
                      {strategy.name}
                    </h3>
                    <p className={`text-sm ${
                      strategy.disabled ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {strategy.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Trading Signals Strategy */}
      {activeStrategy === 'signals' && (
        <div className="space-y-6">
          {/* Status Badge */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 p-4 rounded-lg">
            <div className="flex items-center">
              <Activity className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <p className="font-semibold text-green-800">Market is OPEN</p>
                <p className="text-sm text-green-700">Intraday signals are actively generated</p>
              </div>
            </div>
          </div>

          {/* Trading Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {intradaySignals.map((signal) => (
              <div key={signal.symbol} className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
                {/* Card Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 font-serif">{signal.symbol}</h3>
                    <p className="text-sm text-gray-600 truncate" title={signal.company}>{signal.company}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
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
                    <span className="text-xl font-bold text-gray-900">₹{signal.ltp.toLocaleString()}</span>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-gray-500 mr-1" />
                      <span className="text-sm text-gray-600">{signal.signalTime}</span>
                    </div>
                  </div>
                  <div className={`text-base font-semibold ${
                    signal.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {signal.change >= 0 ? '+' : ''}{signal.change}%
                  </div>
                </div>

                {/* Trading Levels */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="flex items-center space-x-2 min-w-0">
                      <Target className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-600">Target</p>
                        <p className="text-base font-semibold text-blue-600 truncate">₹{signal.target.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 min-w-0">
                      <Shield className="w-4 h-4 text-red-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-600">Stop Loss</p>
                        <p className="text-base font-semibold text-red-600 truncate">₹{signal.stopLoss.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 min-w-0">
                      <BarChart3 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-600">Potential</p>
                        <p className="text-base font-semibold text-green-600">{signal.potentialReturn}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reason */}
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600 italic">{signal.reason}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Trading Guidelines */}
          <div className="bg-blue-50 rounded-xl p-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Risk Management</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Always use stop loss</li>
                  <li>• Risk only 1-2% per trade</li>
                  <li>• Exit on target achievement</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Entry Rules</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Wait for signal confirmation</li>
                  <li>• Check market trend</li>
                  <li>• Verify volume support</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Best Practices</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Trade with the trend</li>
                  <li>• Exit all positions by market close</li>
                  <li>• Monitor volume confirmation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Storm Strategy */}
      {activeStrategy === 'storm' && (
        <StormStrategy />
      )}
    </div>
  );
} 