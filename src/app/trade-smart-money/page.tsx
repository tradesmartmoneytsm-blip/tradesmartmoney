import { Metadata } from 'next';
import Link from 'next/link';
import { TrendingUp, BarChart3, Brain, Target, Users, Shield, Zap, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Trade Smart Money | Master Smart Money Trading Concepts & Institutional Strategies',
  description: 'Learn to trade smart money like professional institutions. Master smart money concepts, institutional trading patterns, and smart money flow analysis. Trade smart money strategies with our advanced platform.',
  keywords: [
    'trade smart money',
    'smart money trading',
    'smart money concepts',
    'smart money flow',
    'institutional trading',
    'professional trading',
    'smart money strategies',
    'smart money analysis',
    'trade like institutions',
    'smart money indicators',
    'institutional investors',
    'smart money footprint',
    'order flow trading',
    'liquidity analysis',
    'market makers trading'
  ],
  openGraph: {
    title: 'Trade Smart Money | Master Smart Money Trading Concepts & Institutional Strategies',
    description: 'Learn to trade smart money like professional institutions. Master smart money concepts, institutional trading patterns, and smart money flow analysis.',
    url: 'https://www.tradesmartmoney.com/trade-smart-money',
    type: 'website',
    images: [
      {
        url: 'https://www.tradesmartmoney.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Trade Smart Money - Professional Trading Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trade Smart Money | Master Smart Money Trading Concepts & Institutional Strategies',
    description: 'Learn to trade smart money like professional institutions. Master smart money concepts, institutional trading patterns, and smart money flow analysis.',
    images: ['https://www.tradesmartmoney.com/twitter-image.jpg'],
  },
  alternates: {
    canonical: 'https://www.tradesmartmoney.com/trade-smart-money',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TradeSmartMoneyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-white text-sm font-medium">Professional Smart Money Trading</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Trade Smart Money Like
            <span className="block mt-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Professional Institutions
            </span>
          </h1>
          
          <p className="text-xl text-blue-100 mb-10 max-w-4xl mx-auto">
            Master smart money trading concepts and learn how to trade like institutional investors. 
            Discover smart money flow patterns, institutional trading strategies, and professional 
            market analysis techniques used by smart money traders worldwide.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/market"
              className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-3"
            >
              <BarChart3 className="w-5 h-5" />
              Start Smart Money Trading
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              href="/smart-money-concepts"
              className="group px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 rounded-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300 flex items-center gap-3"
            >
              <Brain className="w-5 h-5" />
              Learn Smart Money Concepts
            </Link>
          </div>
        </div>
      </section>

      {/* What is Smart Money Trading */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              What is Smart Money Trading?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Smart money refers to institutional investors, hedge funds, and professional traders who have 
              access to superior information, resources, and trading strategies that retail traders typically don't have.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Smart Money Characteristics</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Target className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Institutional Capital</h4>
                    <p className="text-gray-600">Large capital pools that can move markets significantly</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Brain className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Advanced Analysis</h4>
                    <p className="text-gray-600">Sophisticated algorithms and professional research teams</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Early Information</h4>
                    <p className="text-gray-600">Access to market-moving information before retail traders</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Risk Management</h4>
                    <p className="text-gray-600">Professional risk management and position sizing strategies</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Smart Money vs Retail Money</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-green-700">Smart Money Approach</h4>
                  <p className="text-gray-600">Strategic, patient, data-driven, contrarian when needed</p>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="font-semibold text-red-700">Retail Money Approach</h4>
                  <p className="text-gray-600">Emotional, reactive, follows trends, lacks proper analysis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Money Concepts */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Key Smart Money Trading Concepts
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Master these fundamental smart money concepts to trade like institutional investors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Order Flow Analysis</h3>
              <p className="text-gray-600">
                Analyze smart money order flow to understand institutional buying and selling patterns. 
                Track large block trades and unusual options activity.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Liquidity Analysis</h3>
              <p className="text-gray-600">
                Understand where smart money creates liquidity pools and how they use retail trader 
                stops and limits to their advantage.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Market Structure</h3>
              <p className="text-gray-600">
                Learn to read market structure like smart money traders. Identify key support, 
                resistance, and institutional levels.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Money Indicators</h3>
              <p className="text-gray-600">
                Use professional indicators that track institutional activity: FII/DII flows, 
                block deals, and insider trading patterns.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Risk Management</h3>
              <p className="text-gray-600">
                Implement institutional-grade risk management strategies. Learn position sizing, 
                portfolio diversification, and hedging techniques.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sentiment Analysis</h3>
              <p className="text-gray-600">
                Understand market sentiment from an institutional perspective. Learn to read 
                VIX, put/call ratios, and advance/decline indicators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Trade Smart Money */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              How to Trade Like Smart Money
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Follow these proven strategies to align your trading with institutional smart money
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Smart Money Trading Steps</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Identify Smart Money Flow</h4>
                    <p className="text-gray-600">Track FII/DII activity, block deals, and unusual volume patterns to spot institutional activity.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Analyze Market Structure</h4>
                    <p className="text-gray-600">Study support/resistance levels, trend lines, and key institutional price levels.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Follow Smart Money Timing</h4>
                    <p className="text-gray-600">Enter positions when smart money is accumulating, exit when they're distributing.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">4</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Implement Professional Risk Management</h4>
                    <p className="text-gray-600">Use position sizing, stop losses, and portfolio diversification like institutions.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Smart Money Tools on Our Platform</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">Real-time FII/DII flow tracking</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">Block deal and bulk deal analysis</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">Smart money sentiment indicators</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">Institutional order flow analysis</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">Professional risk management tools</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">Smart money educational content</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Trade Like Smart Money?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Join thousands of traders who have learned to follow smart money and improve their trading results. 
            Start your smart money trading journey today with our professional platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/market"
              className="group bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-lg font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 flex items-center gap-3"
            >
              <TrendingUp className="w-5 h-5" />
              Start Smart Money Trading
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              href="/smart-money-concepts"
              className="group px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 rounded-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300 flex items-center gap-3"
            >
              <Brain className="w-5 h-5" />
              Learn More Concepts
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section for SEO */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Smart Money Trading FAQ
          </h2>
          
          <div className="space-y-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">What is smart money in trading?</h3>
              <p className="text-gray-600">
                Smart money refers to institutional investors, hedge funds, banks, and professional traders who have 
                access to superior information, advanced analysis tools, and significant capital. They are called "smart money" 
                because their trading decisions are typically well-informed and strategic, often moving markets significantly.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">How can I trade like smart money?</h3>
              <p className="text-gray-600">
                To trade like smart money, focus on: 1) Following institutional flow through FII/DII data, 2) Analyzing order flow 
                and volume patterns, 3) Understanding market structure and key levels, 4) Implementing professional risk management, 
                5) Being patient and strategic rather than emotional, and 6) Using advanced analysis tools and indicators.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">What are smart money concepts?</h3>
              <p className="text-gray-600">
                Smart money concepts include order flow analysis, liquidity analysis, market structure understanding, 
                institutional accumulation/distribution patterns, professional risk management techniques, and sentiment analysis 
                from an institutional perspective. These concepts help retail traders align with institutional activity.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">How do I identify smart money flow?</h3>
              <p className="text-gray-600">
                Identify smart money flow by tracking: FII/DII buying/selling data, block deals and bulk deals, unusual volume 
                patterns, options chain analysis, advance/decline ratios, and sector rotation patterns. Our platform provides 
                real-time tracking of these smart money indicators to help you follow institutional activity.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
