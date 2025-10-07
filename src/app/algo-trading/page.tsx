'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { trackPageView } from '@/lib/analytics';
import { Settings, TrendingUp, Home, Clock } from 'lucide-react';

export default function AlgoTradingPage() {
  useEffect(() => {
    trackPageView('/algo-trading', 'Algo Trading');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  TradeSmartMoney
                </h1>
                <p className="text-xs text-gray-500">Professional Trading Platform</p>
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors group"
              >
                <Home className="w-4 h-4" />
                <span className="font-medium">Trading Platform</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Coming Soon Section */}
      <section className="py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <div className="bg-blue-100 p-6 rounded-full">
              <Settings className="h-20 w-20 text-blue-600" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Algorithmic Trading
            </span>
          </h1>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Clock className="w-8 h-8 text-yellow-600" />
              <h2 className="text-3xl font-bold text-yellow-800">Coming Soon</h2>
            </div>
            <p className="text-xl text-yellow-700 mb-4">
              We're building an advanced algorithmic trading platform with institutional-grade features.
            </p>
            <p className="text-lg text-yellow-600">
              Stay tuned for automated trading strategies, backtesting tools, and smart money algorithms.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors inline-flex items-center justify-center"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Explore Current Platform
            </Link>
            <Link 
              href="/contact" 
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all"
            >
              Get Notified When Ready
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 