'use client';

import { useEffect } from 'react';
import { trackPageView } from '@/lib/analytics';
import { Bot, Cpu, Zap, TrendingUp, Shield, BarChart3, Brain, Rocket, CheckCircle, ArrowRight, Star } from 'lucide-react';

export default function AIPoweredTradingPage() {
  useEffect(() => {
    trackPageView('/ai-powered-trading', 'AI Powered Trading');
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* SEO Meta Tags */}
      <head>
        <title>AI Powered Trading Platform | Advanced AI Trading Algorithms | TradeSmartMoney</title>
        <meta 
          name="description" 
          content="Harness the power of AI for trading with our advanced AI trading algorithms. Machine learning models, automated trading systems, and AI-powered market analysis for professional traders." 
        />
        <meta name="keywords" content="ai powered trading, ai trading algorithm, machine learning trading, automated trading systems, algorithmic trading, quantitative trading, artificial intelligence trading" />
        <link rel="canonical" href="https://tradesmartmoney.com/ai-powered-trading" />
      </head>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-purple-500/20 p-4 rounded-full">
              <Bot className="h-16 w-16 text-purple-300" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">AI-Powered Trading</span> Platform
          </h1>
          <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-4xl mx-auto leading-relaxed">
            Revolutionize your trading with cutting-edge AI trading algorithms. Our machine learning models analyze millions of data points to identify profitable trading opportunities in real-time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors inline-flex items-center">
              Try AI Trading <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button className="border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* What is AI-Powered Trading */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">What is AI-Powered Trading?</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              AI-powered trading uses artificial intelligence and machine learning algorithms to analyze market data, identify patterns, and execute trades with superhuman speed and accuracy.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Advanced Machine Learning Models</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Pattern Recognition</h4>
                    <p className="text-gray-600">AI identifies complex market patterns invisible to human traders</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Real-Time Analysis</h4>
                    <p className="text-gray-600">Process millions of data points in milliseconds for instant decisions</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Emotion-Free Trading</h4>
                    <p className="text-gray-600">Remove human emotions and biases from trading decisions</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">AI Trading Components</h3>
              <ul className="space-y-3 text-gray-700">
                <li>• <strong>Neural Networks</strong> - Deep learning for pattern recognition</li>
                <li>• <strong>Natural Language Processing</strong> - News sentiment analysis</li>
                <li>• <strong>Reinforcement Learning</strong> - Self-improving algorithms</li>
                <li>• <strong>Computer Vision</strong> - Chart pattern recognition</li>
                <li>• <strong>Time Series Analysis</strong> - Price prediction models</li>
                <li>• <strong>Risk Management AI</strong> - Automated position sizing</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* AI Trading Features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Advanced AI Trading Algorithms</h2>
            <p className="text-xl text-gray-600">
              Our proprietary AI systems leverage the latest in machine learning technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Predictive Analytics</h3>
              <p className="text-gray-600 mb-4">
                Advanced machine learning models predict market movements with high accuracy using historical and real-time data.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• LSTM Neural Networks</li>
                <li>• Random Forest Models</li>
                <li>• Gradient Boosting</li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Cpu className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">High-Frequency Trading</h3>
              <p className="text-gray-600 mb-4">
                Lightning-fast execution algorithms that can process and execute thousands of trades per second.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Microsecond Latency</li>
                <li>• Smart Order Routing</li>
                <li>• Market Making Algorithms</li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Sentiment Analysis</h3>
              <p className="text-gray-600 mb-4">
                Natural language processing analyzes news, social media, and market sentiment to gauge market mood.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Real-Time News Analysis</li>
                <li>• Social Media Monitoring</li>
                <li>• Market Sentiment Scoring</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* AI vs Traditional Trading */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">AI Trading vs Traditional Methods</h2>
            <p className="text-xl text-gray-600">
              See why AI-powered trading is revolutionizing the financial markets
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-red-50 p-8 rounded-xl border-2 border-red-200">
              <h3 className="text-2xl font-bold text-red-800 mb-6 flex items-center">
                <BarChart3 className="mr-3 h-6 w-6" />
                Traditional Trading
              </h3>
              <ul className="space-y-3 text-red-700">
                <li>• Manual analysis takes hours or days</li>
                <li>• Limited to processing few data sources</li>
                <li>• Emotional decisions affect performance</li>
                <li>• Cannot trade 24/7 consistently</li>
                <li>• Prone to human errors and biases</li>
                <li>• Slow execution speeds</li>
                <li>• Limited backtesting capabilities</li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-8 rounded-xl border-2 border-green-200">
              <h3 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                <Bot className="mr-3 h-6 w-6" />
                AI-Powered Trading
              </h3>
              <ul className="space-y-3 text-green-700">
                <li>• Instant analysis of millions of data points</li>
                <li>• Processes unlimited data sources simultaneously</li>
                <li>• Emotion-free, data-driven decisions</li>
                <li>• 24/7 automated trading capabilities</li>
                <li>• Eliminates human errors and biases</li>
                <li>• Microsecond execution speeds</li>
                <li>• Comprehensive backtesting and optimization</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Trading Strategies */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">AI Trading Strategies</h2>
            <p className="text-xl text-gray-600">
              Multiple AI-powered strategies working together for optimal performance
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Mean Reversion AI</h3>
              <p className="text-gray-600 mb-4">Identifies oversold/overbought conditions using statistical models</p>
              <div className="flex items-center text-green-600">
                <TrendingUp className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">85% Accuracy</span>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Momentum AI</h3>
              <p className="text-gray-600 mb-4">Captures trending moves using deep learning pattern recognition</p>
              <div className="flex items-center text-green-600">
                <TrendingUp className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">78% Accuracy</span>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Arbitrage AI</h3>
              <p className="text-gray-600 mb-4">Exploits price differences across markets in microseconds</p>
              <div className="flex items-center text-green-600">
                <TrendingUp className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">92% Accuracy</span>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-3">News Trading AI</h3>
              <p className="text-gray-600 mb-4">Reacts to breaking news faster than human traders</p>
              <div className="flex items-center text-green-600">
                <Zap className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Sub-second</span>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Pairs Trading AI</h3>
              <p className="text-gray-600 mb-4">Identifies correlation breakdowns between related assets</p>
              <div className="flex items-center text-green-600">
                <Shield className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Market Neutral</span>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Options AI</h3>
              <p className="text-gray-600 mb-4">Advanced volatility modeling for options strategies</p>
              <div className="flex items-center text-green-600">
                <Star className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Greek Neutral</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Choose AI-Powered Trading?</h2>
            <p className="text-xl text-gray-600">
              Experience the future of trading with artificial intelligence
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Superior Performance</h3>
              <p className="text-gray-600">AI algorithms consistently outperform traditional methods</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Lightning Speed</h3>
              <p className="text-gray-600">Execute trades in microseconds, never miss opportunities</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Risk Control</h3>
              <p className="text-gray-600">Advanced risk management built into every algorithm</p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Continuous Learning</h3>
              <p className="text-gray-600">AI models adapt and improve with new market data</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready for AI-Powered Trading?</h2>
          <p className="text-xl text-purple-100 mb-8">
            Join the AI trading revolution and experience the future of financial markets
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-purple-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg text-lg transition-colors">
              Start AI Trading
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-purple-600 font-semibold py-4 px-8 rounded-lg text-lg transition-all">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
} 