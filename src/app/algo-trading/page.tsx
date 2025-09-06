'use client';

import { useEffect } from 'react';
import { trackPageView } from '@/lib/analytics';
import { Settings, Activity, BarChart3, Target, Zap, Shield, TrendingUp, Brain, CheckCircle, ArrowRight, Cpu, Code } from 'lucide-react';

export default function AlgoTradingPage() {
  useEffect(() => {
    trackPageView('/algo-trading', 'Algo Trading');
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* SEO Meta Tags */}
      <head>
        <title>Algo Trading Platform | Smart Money Algorithmic Trading Systems | TradeSmartMoney</title>
        <meta 
          name="description" 
          content="Master algorithmic trading with our comprehensive algo trading platform. Advanced smart money algorithms, swing trading systems, and automated trading strategies for professional results." 
        />
        <meta name="keywords" content="algo trading, algorithmic trading, smart money algo, automated trading, trading algorithms, quantitative trading, systematic trading, backtesting" />
        <link rel="canonical" href="https://tradesmartmoney.com/algo-trading" />
      </head>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-900 via-blue-900 to-teal-900 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-green-500/20 p-4 rounded-full">
              <Settings className="h-16 w-16 text-green-300" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">Algorithmic Trading</span> Platform
          </h1>
          <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-4xl mx-auto leading-relaxed">
            Build, backtest, and deploy sophisticated algo trading systems with our smart money algorithmic trading platform. Create automated strategies that trade like institutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors inline-flex items-center">
              Start Algo Trading <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button className="border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all">
              View Strategies
            </button>
          </div>
        </div>
      </section>

      {/* What is Algo Trading */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">What is Algorithmic Trading?</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Algorithmic trading uses computer programs to automatically execute trading strategies based on pre-defined rules, market conditions, and smart money principles.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Systematic Trading Approach</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Rule-Based Execution</h4>
                    <p className="text-gray-600">Execute trades based on predefined criteria without emotional interference</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Backtesting & Optimization</h4>
                    <p className="text-gray-600">Test strategies on historical data before risking real capital</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">24/7 Market Monitoring</h4>
                    <p className="text-gray-600">Never miss opportunities with automated market surveillance</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Algo Trading Components</h3>
              <ul className="space-y-3 text-gray-700">
                <li>• <strong>Strategy Development</strong> - Build custom trading logic</li>
                <li>• <strong>Risk Management</strong> - Automated position sizing and stops</li>
                <li>• <strong>Market Data Processing</strong> - Real-time data analysis</li>
                <li>• <strong>Order Management</strong> - Smart order routing and execution</li>
                <li>• <strong>Performance Analytics</strong> - Detailed strategy metrics</li>
                <li>• <strong>Portfolio Management</strong> - Multi-strategy coordination</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Money Algo Features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Smart Money Algorithmic Strategies</h2>
            <p className="text-xl text-gray-600">
              Our algo trading platform incorporates institutional-grade smart money concepts
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Brain className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Smart Money Flow Detection</h3>
              <p className="text-gray-600 mb-4">
                Algorithms that identify institutional money movement and follow smart money footprints in real-time.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Order Block Recognition</li>
                <li>• Liquidity Pool Identification</li>
                <li>• Break of Structure Analysis</li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Swing Trading Algorithms</h3>
              <p className="text-gray-600 mb-4">
                Automated swing trading systems that capture multi-day moves using technical and smart money analysis.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Trend Following Systems</li>
                <li>• Mean Reversion Strategies</li>
                <li>• Breakout Detection</li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Target className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Risk Management Algos</h3>
              <p className="text-gray-600 mb-4">
                Advanced risk management algorithms that protect capital and optimize position sizing automatically.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Dynamic Position Sizing</li>
                <li>• Stop Loss Optimization</li>
                <li>• Portfolio Risk Control</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Manual vs Algo Trading */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Manual Trading vs Algorithmic Trading</h2>
            <p className="text-xl text-gray-600">
              See why systematic algo trading outperforms manual trading approaches
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-red-50 p-8 rounded-xl border-2 border-red-200">
              <h3 className="text-2xl font-bold text-red-800 mb-6 flex items-center">
                <Activity className="mr-3 h-6 w-6" />
                Manual Trading
              </h3>
              <ul className="space-y-3 text-red-700">
                <li>• Emotional decision making</li>
                <li>• Inconsistent strategy execution</li>
                <li>• Limited monitoring capacity</li>
                <li>• Fatigue affects performance</li>
                <li>• Cannot process multiple markets</li>
                <li>• Prone to psychological biases</li>
                <li>• Reaction-based trading</li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-8 rounded-xl border-2 border-green-200">
              <h3 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                <Settings className="mr-3 h-6 w-6" />
                Algorithmic Trading
              </h3>
              <ul className="space-y-3 text-green-700">
                <li>• Emotion-free systematic execution</li>
                <li>• Consistent rule-based trading</li>
                <li>• Monitor hundreds of instruments</li>
                <li>• 24/7 market surveillance</li>
                <li>• Multi-market capability</li>
                <li>• Eliminates psychological biases</li>
                <li>• Proactive strategy deployment</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Trading Strategies */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Popular Algo Trading Strategies</h2>
            <p className="text-xl text-gray-600">
              Pre-built and customizable algorithmic trading strategies for every market condition
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Momentum Breakout</h3>
              <p className="text-gray-600 mb-4">Captures strong trending moves with volume confirmation</p>
              <div className="flex items-center text-green-600 mb-2">
                <TrendingUp className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Win Rate: 68%</span>
              </div>
              <div className="text-xs text-gray-500">Best for: Trending Markets</div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Mean Reversion</h3>
              <p className="text-gray-600 mb-4">Identifies oversold/overbought conditions for reversal trades</p>
              <div className="flex items-center text-green-600 mb-2">
                <TrendingUp className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Win Rate: 72%</span>
              </div>
              <div className="text-xs text-gray-500">Best for: Range-bound Markets</div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Pairs Trading</h3>
              <p className="text-gray-600 mb-4">Market-neutral strategy trading correlated instruments</p>
              <div className="flex items-center text-green-600 mb-2">
                <Shield className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Market Neutral</span>
              </div>
              <div className="text-xs text-gray-500">Best for: Risk Management</div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Grid Trading</h3>
              <p className="text-gray-600 mb-4">Systematic buy/sell orders at predefined price levels</p>
              <div className="flex items-center text-green-600 mb-2">
                <BarChart3 className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Consistent Returns</span>
              </div>
              <div className="text-xs text-gray-500">Best for: Sideways Markets</div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-3">News Trading</h3>
              <p className="text-gray-600 mb-4">Reacts to economic events and earnings announcements</p>
              <div className="flex items-center text-green-600 mb-2">
                <Zap className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Fast Execution</span>
              </div>
              <div className="text-xs text-gray-500">Best for: Event-driven Trading</div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Arbitrage</h3>
              <p className="text-gray-600 mb-4">Exploits price differences across markets or instruments</p>
              <div className="flex items-center text-green-600 mb-2">
                <Target className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Low Risk</span>
              </div>
              <div className="text-xs text-gray-500">Best for: Risk-free Profits</div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Algo Trading Platform Features</h2>
            <p className="text-xl text-gray-600">
              Everything you need to build, test, and deploy successful trading algorithms
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Strategy Builder</h3>
              <p className="text-gray-600">Visual drag-and-drop strategy creation tool</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Backtesting Engine</h3>
              <p className="text-gray-600">Test strategies on years of historical data</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Cpu className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Live Trading</h3>
              <p className="text-gray-600">Deploy algorithms for automated execution</p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Risk Controls</h3>
              <p className="text-gray-600">Advanced risk management and monitoring</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Algorithmic Trading?</h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of traders using our algo trading platform to automate their success
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg text-lg transition-colors">
              Start Free Trial
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-green-600 font-semibold py-4 px-8 rounded-lg text-lg transition-all">
              View Pricing
            </button>
          </div>
        </div>
      </section>
    </div>
  );
} 