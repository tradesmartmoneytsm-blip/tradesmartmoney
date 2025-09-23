import { Metadata } from 'next';
import Link from 'next/link';
import { TrendingUp, BarChart3, Brain, Target, Zap, Shield, ArrowRight, Play } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Trade Online | Professional Trading Platform for Stock Market Trading | TradeSmartMoney',
  description: 'Trade online with our professional trading platform. Access real-time market data, advanced trading tools, and smart money insights. Start trading stocks, options, and derivatives with confidence.',
  keywords: [
    'trade',
    'trading',
    'trade online',
    'stock trading',
    'online trading',
    'trading platform',
    'trade stocks',
    'day trading',
    'swing trading',
    'options trading',
    'derivatives trading',
    'forex trading',
    'commodity trading',
    'futures trading',
    'professional trading',
    'trading tools',
    'trading software',
    'market trading',
    'electronic trading'
  ],
  openGraph: {
    title: 'Trade Online | Professional Trading Platform for Stock Market Trading | TradeSmartMoney',
    description: 'Trade online with our professional trading platform. Access real-time market data, advanced trading tools, and smart money insights.',
    url: 'https://www.tradesmartmoney.com/trade',
    type: 'website',
    images: [
      {
        url: 'https://www.tradesmartmoney.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Trade Online - Professional Trading Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trade Online | Professional Trading Platform for Stock Market Trading',
    description: 'Trade online with our professional trading platform. Access real-time market data, advanced trading tools, and smart money insights.',
    images: ['https://www.tradesmartmoney.com/twitter-image.jpg'],
  },
  alternates: {
    canonical: 'https://www.tradesmartmoney.com/trade',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TradePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-900 via-blue-800 to-purple-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-white text-sm font-medium">Professional Trading Platform</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Trade Online with
            <span className="block mt-2 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Professional Tools
            </span>
          </h1>
          
          <p className="text-xl text-blue-100 mb-10 max-w-4xl mx-auto">
            Trade stocks, options, and derivatives with our advanced trading platform. Get real-time market data, 
            professional trading tools, and smart money insights. Start trading online with confidence and precision.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/market"
              className="group bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-300 flex items-center gap-3"
            >
              <Play className="w-5 h-5" />
              Start Trading Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              href="/trading-guide"
              className="group px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 rounded-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300 flex items-center gap-3"
            >
              <Brain className="w-5 h-5" />
              Learn Trading
            </Link>
          </div>
        </div>
      </section>

      {/* Trading Types Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Trade Multiple Markets
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access diverse trading opportunities across different markets and instruments with our comprehensive trading platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Stock Trading</h3>
              <p className="text-gray-600 mb-4">
                Trade stocks from NSE and BSE with real-time data, advanced charting, and professional analysis tools.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Equity cash trading</li>
                <li>• Intraday trading</li>
                <li>• Delivery trading</li>
                <li>• Swing trading</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Options Trading</h3>
              <p className="text-gray-600 mb-4">
                Trade options with advanced strategies, real-time Greeks, and comprehensive options chain analysis.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Index options</li>
                <li>• Stock options</li>
                <li>• Options strategies</li>
                <li>• Greeks analysis</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Derivatives Trading</h3>
              <p className="text-gray-600 mb-4">
                Trade futures and derivatives with professional tools, margin calculators, and risk management features.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Index futures</li>
                <li>• Stock futures</li>
                <li>• Commodity futures</li>
                <li>• Currency futures</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Day Trading</h3>
              <p className="text-gray-600 mb-4">
                Execute fast day trades with low latency, advanced order types, and real-time market scanning tools.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Scalping strategies</li>
                <li>• Momentum trading</li>
                <li>• Gap trading</li>
                <li>• Breakout trading</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Swing Trading</h3>
              <p className="text-gray-600 mb-4">
                Identify swing trading opportunities with technical analysis, pattern recognition, and trend following tools.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Technical analysis</li>
                <li>• Pattern recognition</li>
                <li>• Trend following</li>
                <li>• Position trading</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Algorithmic Trading</h3>
              <p className="text-gray-600 mb-4">
                Deploy algorithmic trading strategies with backtesting, automated execution, and performance monitoring.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Automated strategies</li>
                <li>• Backtesting tools</li>
                <li>• API integration</li>
                <li>• Strategy monitoring</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Trading Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Professional Trading Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Trade with confidence using our advanced trading platform designed for both beginners and professional traders
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Advanced Trading Tools</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Real-time Market Data</h4>
                    <p className="text-gray-600">Live quotes, charts, and market depth for informed trading decisions</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Advanced Charting</h4>
                    <p className="text-gray-600">Professional charts with 100+ technical indicators and drawing tools</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Smart Order Management</h4>
                    <p className="text-gray-600">Advanced order types including stop-loss, bracket orders, and trailing stops</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Risk Management Tools</h4>
                    <p className="text-gray-600">Position sizing calculators, risk metrics, and portfolio analysis</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Our Trading Platform</h3>
              <div className="space-y-6">
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-green-700 mb-2">Low Latency Execution</h4>
                  <p className="text-gray-600">Lightning-fast order execution with minimal slippage for optimal trade entries and exits.</p>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-blue-700 mb-2">Comprehensive Analysis</h4>
                  <p className="text-gray-600">In-depth market analysis, sector performance, and smart money flow tracking.</p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold text-purple-700 mb-2">Educational Resources</h4>
                  <p className="text-gray-600">Learn trading through our comprehensive guides, tutorials, and market insights.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trading Strategies */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Popular Trading Strategies
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn and implement proven trading strategies used by successful traders worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Momentum Trading</h3>
              <p className="text-gray-600 mb-6">
                Trade stocks showing strong price momentum with high volume. Ideal for day traders and swing traders 
                looking to capitalize on trending moves.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  <span>Identify breakout patterns</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  <span>Volume confirmation</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  <span>Trend following techniques</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Value Trading</h3>
              <p className="text-gray-600 mb-6">
                Identify undervalued stocks with strong fundamentals. Perfect for long-term investors and position traders 
                seeking sustainable returns.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                  <span>Fundamental analysis</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                  <span>Financial ratio analysis</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                  <span>Long-term positioning</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Scalping</h3>
              <p className="text-gray-600 mb-6">
                Quick trades capturing small price movements with high frequency. Requires fast execution and 
                disciplined risk management.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                  <span>1-5 minute timeframes</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                  <span>High-volume stocks</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                  <span>Tight risk management</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Mean Reversion</h3>
              <p className="text-gray-600 mb-6">
                Trade stocks that have moved significantly away from their average price, expecting them to return 
                to their mean value.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-orange-600 rounded-full"></div>
                  <span>Oversold/overbought conditions</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-orange-600 rounded-full"></div>
                  <span>Statistical analysis</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-orange-600 rounded-full"></div>
                  <span>Counter-trend trading</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-900 via-blue-800 to-purple-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Start Trading Today
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Join thousands of traders who trust our platform for their trading needs. 
            Get access to professional tools, real-time data, and expert analysis.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/market"
              className="group bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-green-500 hover:to-blue-600 transition-all duration-300 flex items-center gap-3"
            >
              <Play className="w-5 h-5" />
              Start Trading Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              href="/trading-guide"
              className="group px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 rounded-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300 flex items-center gap-3"
            >
              <Brain className="w-5 h-5" />
              Learn Trading Basics
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
