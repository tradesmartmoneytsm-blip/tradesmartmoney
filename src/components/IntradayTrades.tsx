'use client';

import { useState } from 'react';
import { Zap, Search, Brain, Activity } from 'lucide-react';
import { StormStrategy } from './StormStrategy';
import { IntradayScanner } from './IntradayScanner';
import IntradaySignals from './IntradaySignals';
import { OptionAnalysisPageClient } from '../app/option-analysis/OptionAnalysisPageClient';
// Auto ads will handle all ad placement automatically

export function IntradayTrades() {
  const [activeStrategy, setActiveStrategy] = useState('signals');

  const strategies = [
    {
      id: 'signals',
      name: 'Educational Trading Examples',
      description: 'Live institutional activity data for educational analysis',
      icon: Activity
    },
    {
      id: 'advanced',
      name: 'Option Analysis',
      description: 'Institutional data analysis for educational learning purposes',
      icon: Brain
    },
    {
      id: 'scanner',
      name: 'AI Analysis',
      description: 'Multi-factor analysis examples for learning purposes • Coming Soon',
      icon: Search
    },
    {
      id: 'storm',
      name: 'PCRStorm',
      description: 'Money flow activity examples for educational study',
      icon: Zap
    }
  ];

  return (
    <div className="w-full px-2 sm:px-3 md:px-4 lg:px-5 xl:px-6 2xl:px-8 py-2 sm:py-3 md:py-4 lg:py-5">
      {/* Google Auto Ads will handle ad placement automatically */}
      
      {/* Page Header with Strategy Selection */}
      <div className="mb-4 sm:mb-6">
        <div className="mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 font-serif">Intraday Trading Strategies</h2>
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

      {/* Option Analysis - Integrated from dedicated page */}
      {activeStrategy === 'advanced' && (
        <div className="mt-4">
          <OptionAnalysisPageClient />
        </div>
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