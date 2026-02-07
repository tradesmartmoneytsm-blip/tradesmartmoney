'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, ArrowRight, Calendar, Clock, TrendingUp, Shield, BarChart3, Brain, Target } from 'lucide-react';
import { trackPageView } from '@/lib/analytics';

// Blog posts data
const blogPosts = [
  {
    slug: 'complete-guide-smart-money-trading-2025',
    title: 'Complete Guide to Smart Money Trading in 2025',
    excerpt: 'Master smart money trading with institutional money flow analysis, advanced order flow techniques, and proven strategies for Indian stock markets.',
    category: 'Smart Money',
    readTime: '12 min read',
    publishDate: '2025-01-15',
    icon: Brain,
    featured: true,
  },
  {
    slug: 'understanding-market-basics-beginners',
    title: 'Understanding Stock Market Basics: A Complete Beginner\'s Guide',
    excerpt: 'Learn the fundamentals of the stock market, key players, market terminology, and how to get started with trading in Indian markets.',
    category: 'Beginner Guide',
    readTime: '15 min read',
    publishDate: '2025-01-20',
    icon: BookOpen,
  },
  {
    slug: 'risk-management-trading-education',
    title: 'Risk Management in Trading: Educational Guide to Protecting Your Capital',
    excerpt: 'Comprehensive guide to risk management strategies, position sizing, stop losses, and capital preservation techniques for traders.',
    category: 'Risk Management',
    readTime: '18 min read',
    publishDate: '2025-01-25',
    icon: Shield,
  },
  {
    slug: 'how-to-read-financial-charts',
    title: 'How to Read Financial Charts: Educational Guide for Beginners',
    excerpt: 'Learn to read candlestick charts, identify patterns, understand technical indicators, and analyze price movements effectively.',
    category: 'Technical Analysis',
    readTime: '12 min read',
    publishDate: '2025-01-28',
    icon: BarChart3,
  },
  {
    slug: 'bank-nifty-levels-today-support-resistance',
    title: 'Bank Nifty Levels Today: Support and Resistance Analysis',
    excerpt: 'Daily Bank Nifty support and resistance levels, pivot points, and technical analysis for intraday and swing trading.',
    category: 'Market Analysis',
    readTime: '8 min read',
    publishDate: '2025-02-01',
    icon: TrendingUp,
  },
  {
    slug: 'nifty-50-prediction-2025',
    title: 'Nifty 50 Prediction 2025: Market Outlook and Analysis',
    excerpt: 'Comprehensive analysis and predictions for Nifty 50 index in 2025 based on technical, fundamental, and macroeconomic factors.',
    category: 'Market Outlook',
    readTime: '10 min read',
    publishDate: '2025-02-03',
    icon: Target,
  },
  {
    slug: 'nse-holidays-2025-trading-calendar',
    title: 'NSE Holidays 2025: Complete Trading Calendar',
    excerpt: 'Complete list of NSE and BSE trading holidays for 2025, including market closed dates and special trading sessions.',
    category: 'Trading Calendar',
    readTime: '5 min read',
    publishDate: '2025-01-10',
    icon: Calendar,
  },
];

export default function BlogPage() {
  useEffect(() => {
    trackPageView('/blog', 'Blog - Trading Education & Market Analysis');
  }, []);

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Trading Education & Market Analysis</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Learn professional trading strategies, market analysis techniques, and smart money concepts 
              from our comprehensive educational guides.
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/" 
                className="bg-white text-blue-600 font-semibold py-4 px-8 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center shadow-lg"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                Access Live Market Data
              </Link>
              <Link 
                href="/contact" 
                className="bg-blue-500 text-white font-semibold py-4 px-8 rounded-lg hover:bg-blue-400 transition-colors inline-flex items-center justify-center shadow-lg"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-16">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Featured Article
              </div>
            </div>
            
            <Link href={`/blog/${featuredPost.slug}`}>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 group">
                <div className="md:flex">
                  <div className="md:w-2/5 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-8 flex items-center justify-center">
                    <featuredPost.icon className="w-32 h-32 text-white/20" />
                  </div>
                  <div className="md:w-3/5 p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                        {featuredPost.category}
                      </span>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(featuredPost.publishDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                    </div>
                    
                    <h2 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                      {featuredPost.title}
                    </h2>
                    
                    <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-500 text-sm">
                        <Clock className="w-4 h-4 mr-1" />
                        {featuredPost.readTime}
                      </div>
                      
                      <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                        Read Article
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* All Articles Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">All Articles</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => {
              const Icon = post.icon;
              return (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <article className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 h-full group">
                    <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6 flex items-center justify-center">
                      <Icon className="w-16 h-16 text-white/80" />
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                          {post.category}
                        </span>
                        <span className="text-gray-400 text-xs">•</span>
                        <span className="text-gray-500 text-xs">{post.readTime}</span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-400">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(post.publishDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                        
                        <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                          Read More
                          <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        </div>

        {/* SEBI Disclaimer */}
        <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg mb-12">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Important Disclaimer</h3>
          <p className="text-red-700">
            <strong>SEBI COMPLIANCE:</strong> TradeSmartMoney is not registered with SEBI. 
            All content on this website is for educational purposes only and should not be construed as investment advice. 
            Please consult SEBI registered advisors before making any investment decisions.
          </p>
        </div>

        {/* Categories */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Explore by Category</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-2">Beginner Guides</h4>
              <p className="text-gray-600 text-sm">Learn the basics of trading and investing</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-2">Technical Analysis</h4>
              <p className="text-gray-600 text-sm">Charts, patterns, and indicators explained</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-2">Risk Management</h4>
              <p className="text-gray-600 text-sm">Protect your capital with proven strategies</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Start Your Trading Journey?</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Access real-time market data, advanced analytics, and professional trading tools on our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/" 
              className="bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors inline-block"
            >
              Access Trading Platform
            </Link>
            <Link 
              href="/contact" 
              className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-400 transition-colors inline-block"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
