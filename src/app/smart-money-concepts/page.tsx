'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { trackPageView } from '@/lib/analytics';
import { TrendingUp, Brain, Target, BarChart3, Zap, Shield, Users, ArrowRight, CheckCircle, Star, Home, BarChart2 } from 'lucide-react';

export default function SmartMoneyConceptsPage() {
  useEffect(() => {
    trackPageView('/smart-money-concepts', 'Smart Money Concepts');
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* SEO Meta Tags */}
      <head>
        <title>Smart Money Concepts: Master Institutional Trading Patterns | TradeSmartMoney</title>
        <meta 
          name="description" 
          content="Learn smart money concepts (SMC) and institutional trading patterns. Master order flow analysis, liquidity hunting, and smart money footprint for professional trading success." 
        />
        <meta name="keywords" content="smart money concepts, smart money trading, institutional trading, order flow analysis, liquidity analysis, smart money footprint, market structure, supply and demand trading" />
        <link rel="canonical" href="https://tradesmartmoney.com/smart-money-concepts" />
      </head>

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
              <Link 
                href="/ai-powered-trading" 
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors group"
              >
                <span className="text-sm">AI Trading</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <Link 
                href="/algo-trading" 
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors group"
              >
                <span className="text-sm">Algo Trading</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-500/20 p-4 rounded-full">
              <Brain className="h-16 w-16 text-blue-300" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Master <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Smart Money Concepts</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
            Unlock the secrets of institutional trading with advanced smart money concepts. Learn how professional traders analyze market structure, order flow, and liquidity to make profitable decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors inline-flex items-center">
              Start Learning SMC <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button className="border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all">
              Watch Free Training
            </button>
          </div>
        </div>
      </section>

      {/* What are Smart Money Concepts */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">What are Smart Money Concepts?</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Smart Money Concepts (SMC) is a trading methodology that focuses on understanding how institutional investors and market makers operate in financial markets.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Understanding Institutional Behavior</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Market Structure Analysis</h4>
                    <p className="text-gray-600">Learn to identify key support and resistance levels that institutions respect</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Order Flow Analysis</h4>
                    <p className="text-gray-600">Understand how smart money enters and exits positions in the market</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Liquidity Concepts</h4>
                    <p className="text-gray-600">Master the art of identifying where institutions hunt for liquidity</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Key SMC Components</h3>
              <ul className="space-y-3 text-gray-700">
                <li>• <strong>Break of Structure (BOS)</strong> - Trend continuation signals</li>
                <li>• <strong>Change of Character (CHOCH)</strong> - Trend reversal identification</li>
                <li>• <strong>Order Blocks</strong> - Institutional supply and demand zones</li>
                <li>• <strong>Fair Value Gaps</strong> - Market imbalance areas</li>
                <li>• <strong>Liquidity Pools</strong> - Areas where stop losses cluster</li>
                <li>• <strong>Inducement</strong> - False breakouts to trap retail traders</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Master Professional Trading Concepts</h2>
            <p className="text-xl text-gray-600">
              Learn the exact strategies used by institutional traders and market makers
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Smart Money Footprint</h3>
              <p className="text-gray-600 mb-4">
                Learn to identify the footprint of institutional money through volume profile analysis and order flow patterns.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Volume at Price Analysis</li>
                <li>• Delta and Cumulative Delta</li>
                <li>• Market Profile Concepts</li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Liquidity Analysis</h3>
              <p className="text-gray-600 mb-4">
                Master the art of identifying where institutions hunt for liquidity and how to position accordingly.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Equal Highs and Lows</li>
                <li>• Stop Loss Clusters</li>
                <li>• Liquidity Sweeps</li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Market Structure</h3>
              <p className="text-gray-600 mb-4">
                Understand how to read market structure like a professional trader and identify high-probability setups.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Higher Highs & Higher Lows</li>
                <li>• Supply and Demand Zones</li>
                <li>• Trend Analysis</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Money vs Retail Money */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Smart Money vs Retail Trading</h2>
            <p className="text-xl text-gray-600">
              Understand the fundamental differences between institutional and retail trading approaches
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-red-50 p-8 rounded-xl border-2 border-red-200">
              <h3 className="text-2xl font-bold text-red-800 mb-6 flex items-center">
                <Users className="mr-3 h-6 w-6" />
                Retail Traders
              </h3>
              <ul className="space-y-3 text-red-700">
                <li>• Chase breakouts and follow trends late</li>
                <li>• Use basic support and resistance</li>
                <li>• Focus on technical indicators only</li>
                <li>• Trade with emotions and FOMO</li>
                <li>• Small position sizes, frequent trading</li>
                <li>• React to news and market sentiment</li>
                <li>• Use tight stops that get hunted</li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-8 rounded-xl border-2 border-green-200">
              <h3 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                <Shield className="mr-3 h-6 w-6" />
                Smart Money (Institutions)
              </h3>
              <ul className="space-y-3 text-green-700">
                <li>• Create false breakouts to trap retail</li>
                <li>• Use advanced market structure analysis</li>
                <li>• Focus on order flow and volume</li>
                <li>• Trade with discipline and patience</li>
                <li>• Large position sizes, strategic entries</li>
                <li>• Create the news and sentiment</li>
                <li>• Target retail stop loss clusters</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Trading Benefits */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Learn Smart Money Concepts?</h2>
            <p className="text-xl text-gray-600">
              Transform your trading by understanding how the market really works
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Higher Win Rate</h3>
              <p className="text-gray-600">Increase your trading accuracy by following institutional flow</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Better Entries</h3>
              <p className="text-gray-600">Enter trades at optimal levels where institutions are active</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Risk Management</h3>
              <p className="text-gray-600">Avoid retail traps and position your stops strategically</p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Consistent Profits</h3>
              <p className="text-gray-600">Build a sustainable trading approach based on market reality</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Trade Like the Pros?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of traders who have transformed their results with smart money concepts
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg text-lg transition-colors inline-flex items-center justify-center">
              <BarChart2 className="w-5 h-5 mr-2" />
              Access Trading Platform
            </Link>
            <Link href="/contact" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold py-4 px-8 rounded-lg text-lg transition-all">
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 