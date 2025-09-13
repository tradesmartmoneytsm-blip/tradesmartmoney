'use client';

import { useState } from 'react';
import { Zap, Search, Brain, Activity } from 'lucide-react';
import { StormStrategy } from './StormStrategy';
import { IntradayScanner } from './IntradayScanner';
import { AdvancedScanner } from './AdvancedScanner';
import IntradaySignals from './IntradaySignals';
// Auto ads will handle all ad placement automatically

export function IntradayTrades() {
  const [activeStrategy, setActiveStrategy] = useState('signals');

  const strategies = [
    {
      id: 'signals',
      name: 'Intraday Signals',
      description: 'Live institutional activity signals updated every 5 minutes',
      icon: Activity
    },
    {
      id: 'advanced',
      name: 'Advanced Options Scanner',
      description: 'Real institutional data analysis with risk-reward optimization',
      icon: Brain
    },
    {
      id: 'scanner',
      name: 'AI Scanner',
      description: 'Multi-factor algorithm to find high-probability moves',
      icon: Search
    },
    {
      id: 'storm',
      name: 'Storm',
      description: 'High money flow activity detection',
      icon: Zap
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
                onClick={() => setActiveStrategy(strategy.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  activeStrategy === strategy.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    activeStrategy === strategy.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {strategy.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {strategy.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Intraday Signals */}
      {activeStrategy === 'signals' && (
        <IntradaySignals />
      )}

      {/* Advanced Options Scanner */}
      {activeStrategy === 'advanced' && (
        <AdvancedScanner />
      )}

      {/* AI Scanner Strategy */}
      {activeStrategy === 'scanner' && (
        <IntradayScanner />
      )}

      {/* Storm Strategy */}
      {activeStrategy === 'storm' && (
        <StormStrategy />
      )}
    </div>
  );
} 