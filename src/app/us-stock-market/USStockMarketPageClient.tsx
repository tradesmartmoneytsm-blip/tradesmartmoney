'use client';

import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { brandTokens } from '@/lib/design-tokens';

export default function USStockMarketPageClient() {
  const [activeSection, setActiveSection] = useState('us-stock-market');

  const handleSectionChange = (section: string, subSection?: string) => {
    setActiveSection(subSection || section);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange} 
      />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className={`${brandTokens.icons.lg} text-blue-600`} />
            <h1 className="text-4xl font-bold text-gray-900">
              US Market
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive US equity market analysis, sector performance, and institutional money flow tracking
          </p>
        </div>

        {/* Coming Soon Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-full">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Coming Soon</h2>
                  <p className="text-blue-100">Advanced US market analysis features in development</p>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Planned Features */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Planned Features
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <div className="font-medium text-gray-900">Real-time Sector Performance</div>
                        <div className="text-sm text-gray-600">Live S&P 500 sector analysis with heat maps</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <div className="font-medium text-gray-900">Institutional Flow Tracking</div>
                        <div className="text-sm text-gray-600">Monitor smart money movements in US equities</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <div className="font-medium text-gray-900">Market Sentiment Analysis</div>
                        <div className="text-sm text-gray-600">VIX analysis and fear/greed indicators</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <div className="font-medium text-gray-900">ETF Flow Analysis</div>
                        <div className="text-sm text-gray-600">Track institutional ETF inflows and outflows</div>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Development Status */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    Development Status
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                        <span className="font-medium text-amber-900">In Progress</span>
                      </div>
                      <p className="text-sm text-amber-800">
                        Our team is actively developing comprehensive US market analysis tools. 
                        We're integrating multiple data sources to provide institutional-grade insights.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="font-medium text-blue-900">Expected Launch</span>
                      </div>
                      <p className="text-sm text-blue-800">
                        Q1 2025 - Stay tuned for updates on our progress and beta testing opportunities.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    Want to be notified when US Stock Market features are available?
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                      Join Waitlist
                    </button>
                    <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Meanwhile, explore our comprehensive Indian market analysis tools including 
            <span className="text-blue-600 font-medium"> Option Analysis</span>, 
            <span className="text-blue-600 font-medium"> Futures Analysis</span>, and 
            <span className="text-blue-600 font-medium"> Smart Money Flow</span> features.
          </p>
        </div>
      </main>
    </div>
  );
}
