'use client';

import { useEffect } from 'react';
import { trackPageView } from '@/lib/analytics';
import { TrendingUp, Users, Shield, BarChart3, Globe, Award } from 'lucide-react';

export default function About() {
  useEffect(() => {
    trackPageView('/about', 'About Us');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6">About TradeSmartMoney</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Empowering traders with real-time market data, professional analysis, and cutting-edge tools 
              to make informed investment decisions in the Indian financial markets.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Mission Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Mission</h2>
          <p className="text-lg text-gray-700 text-center max-w-4xl mx-auto">
            To democratize access to professional-grade trading tools and market intelligence, 
            helping retail and institutional investors make data-driven decisions in the dynamic Indian stock market.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="bg-blue-100 rounded-full p-3 inline-block mb-4">
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-Time Market Data</h3>
            <p className="text-gray-700">
              Live NSE sector performance, FII/DII activity tracking, and comprehensive market analysis 
              updated throughout trading hours.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="bg-green-100 rounded-full p-3 inline-block mb-4">
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Advanced Analytics</h3>
            <p className="text-gray-700">
              Sophisticated technical analysis tools, algorithmic trading insights, and pattern recognition 
              to identify market opportunities.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="bg-purple-100 rounded-full p-3 inline-block mb-4">
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Trusted Platform</h3>
            <p className="text-gray-700">
              Secure, reliable, and transparent platform built with institutional-grade infrastructure 
              and rigorous data validation processes.
            </p>
          </div>
        </div>

        {/* What We Offer */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What We Offer</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Globe className="h-5 w-5 text-blue-600 mr-2" />
                Market Intelligence
              </h3>
              <ul className="text-gray-700 space-y-2">
                <li>• Real-time sector performance analysis</li>
                <li>• FII/DII institutional investor tracking</li>
                <li>• Market breadth and momentum indicators</li>
                <li>• Economic calendar and events</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Award className="h-5 w-5 text-green-600 mr-2" />
                Trading Tools
              </h3>
              <ul className="text-gray-700 space-y-2">
                <li>• Swing trading setups and signals</li>
                <li>• Intraday trading opportunities</li>
                <li>• End-of-day technical scans</li>
                <li>• Algorithmic trading education</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Our Approach */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Approach</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Data-Driven Decisions</h3>
                <p className="text-gray-700">
                  We believe in the power of data. Our platform aggregates information from multiple reliable sources, 
                  processes it through advanced algorithms, and presents actionable insights.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Educational Focus</h3>
                <p className="text-gray-700">
                  Beyond providing tools, we educate our users about market dynamics, risk management, 
                  and trading psychology to build long-term success.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-3 inline-block mb-3">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Transparency</h3>
              <p className="text-gray-700 text-sm">
                Clear, honest communication about our methods, limitations, and the risks involved in trading.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-3 inline-block mb-3">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">User-Centric</h3>
              <p className="text-gray-700 text-sm">
                Every feature is designed with our users' success in mind, prioritizing usability and effectiveness.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-3 inline-block mb-3">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-700 text-sm">
                Constantly evolving our platform with the latest technology and market insights.
              </p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Smart Trading?</h2>
          <p className="text-blue-100 mb-6">
            Join thousands of traders who trust TradeSmartMoney for their market analysis and trading decisions.
          </p>
          <a 
            href="/contact" 
            className="bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors inline-block"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </div>
  );
} 