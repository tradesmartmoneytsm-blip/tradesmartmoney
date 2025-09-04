'use client';

import { TrendingUp, Clock, Target, AlertCircle } from 'lucide-react';

export function SwingTrades() {
  const trades = [
    {
      id: 1,
      name: 'Reliance Industries',
      symbol: 'RELIANCE',
      currentPrice: 2450.80,
      targetPrice: 2650.00,
      stopLoss: 2320.00,
      potentialReturn: 8.12,
      setup: 'Breakout from resistance with volume confirmation',
      timeframe: '5-10 days',
      riskReward: '1:2.5',
      entry: 2460.00,
      status: 'Active'
    },
    {
      id: 2,
      name: 'Tata Consultancy Services',
      symbol: 'TCS',
      currentPrice: 3680.45,
      targetPrice: 3950.00,
      stopLoss: 3520.00,
      potentialReturn: 7.32,
      setup: 'Pullback to support in uptrend',
      timeframe: '7-12 days',
      riskReward: '1:1.8',
      entry: 3695.00,
      status: 'Entry Pending'
    },
    {
      id: 3,
      name: 'HDFC Bank',
      symbol: 'HDFCBANK',
      currentPrice: 1680.90,
      targetPrice: 1820.00,
      stopLoss: 1620.00,
      potentialReturn: 8.27,
      setup: 'Flag pattern breakout expected',
      timeframe: '3-8 days',
      riskReward: '1:2.1',
      entry: 1685.00,
      status: 'Watchlist'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 border-green-200';
      case 'Entry Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Watchlist': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-10">
      {/* Page Header */}
      <div className="mb-8 lg:mb-12">
        <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-4">Swing Trading Opportunities</h2>
        <p className="text-lg lg:text-xl text-gray-600">
          Multi-day position trades with technical analysis and risk management.
        </p>
      </div>

      {/* Trading Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 mb-8 lg:mb-12">
        {trades.map((trade) => (
          <div key={trade.id} className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 lg:p-8 hover:shadow-xl transition-all duration-300 touch-manipulation">
            {/* Card Header */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1 min-w-0 mr-4">
                <h3 className="text-lg lg:text-2xl font-bold text-gray-900 truncate">{trade.name}</h3>
                <p className="text-base lg:text-lg text-gray-600 font-medium">{trade.symbol}</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900 mt-2">₹{trade.currentPrice}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm lg:text-base font-medium border ${getStatusColor(trade.status)}`}>
                {trade.status}
              </span>
            </div>

            {/* Trading Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-6 mb-6">
              <div className="flex items-center space-x-2 lg:space-x-3">
                <Target className="w-4 h-4 lg:w-5 lg:h-5 text-green-600" />
                <div className="min-w-0">
                  <p className="text-xs lg:text-sm text-gray-500 truncate">Target</p>
                  <p className="font-bold text-sm lg:text-base text-green-600 truncate">₹{trade.targetPrice}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 lg:space-x-3">
                <AlertCircle className="w-4 h-4 lg:w-5 lg:h-5 text-red-600" />
                <div className="min-w-0">
                  <p className="text-xs lg:text-sm text-gray-500 truncate">Stop Loss</p>
                  <p className="font-bold text-sm lg:text-base text-red-600 truncate">₹{trade.stopLoss}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 lg:space-x-3">
                <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                <div className="min-w-0">
                  <p className="text-xs lg:text-sm text-gray-500 truncate">Return</p>
                  <p className="font-bold text-sm lg:text-base text-blue-600 truncate">{trade.potentialReturn}%</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 lg:space-x-3">
                <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600" />
                <div className="min-w-0">
                  <p className="text-xs lg:text-sm text-gray-500 truncate">Timeframe</p>
                  <p className="font-bold text-sm lg:text-base text-purple-600 truncate">{trade.timeframe}</p>
                </div>
              </div>
            </div>

            {/* Setup Description */}
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm lg:text-base text-gray-700 mb-3">{trade.setup}</p>
              <div className="flex justify-between text-sm lg:text-base">
                <span className="text-gray-600">Risk:Reward</span>
                <span className="font-bold text-gray-900">{trade.riskReward}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trading Guidelines */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 lg:p-10">
        <h3 className="text-xl lg:text-2xl font-bold text-blue-900 mb-4 lg:mb-6">Swing Trading Guidelines</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div>
            <h4 className="text-lg lg:text-xl font-semibold text-blue-800 mb-3">Risk Management</h4>
            <ul className="space-y-2 text-base lg:text-lg text-blue-700">
              <li>• Never risk more than 2% of portfolio per trade</li>
              <li>• Always set stop-loss before entering</li>
              <li>• Follow the risk-reward ratio strictly</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg lg:text-xl font-semibold text-blue-800 mb-3">Entry Rules</h4>
            <ul className="space-y-2 text-base lg:text-lg text-blue-700">
              <li>• Wait for volume confirmation</li>
              <li>• Enter only after breakout/breakdown</li>
              <li>• Monitor market conditions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 