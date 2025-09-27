'use client';

import Link from 'next/link';
import { BookOpen, ArrowLeft } from 'lucide-react';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Blog Content Under Enhancement
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're improving our content quality to provide more valuable trading education and market analysis.
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">What's Happening?</h2>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></div>
              <div>
                <h3 className="font-medium text-gray-900">Content Quality Review</h3>
                <p className="text-gray-600">Enhancing all articles with detailed analysis, real market data, and actionable insights.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></div>
              <div>
                <h3 className="font-medium text-gray-900">New Educational Content</h3>
                <p className="text-gray-600">Adding comprehensive guides and market analysis using live data from our platform.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></div>
              <div>
                <h3 className="font-medium text-gray-900">Better User Experience</h3>
                <p className="text-gray-600">Improving readability and ensuring mobile-friendly content.</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">Coming Soon:</h3>
            <ul className="text-blue-800 space-y-1">
              <li>• Complete Smart Money Trading Guide with live FII/DII data</li>
              <li>• Technical Analysis Masterclass with interactive charts</li>
              <li>• Risk Management Strategies with real examples</li>
              <li>• Market Basics for Beginners (comprehensive course)</li>
            </ul>
          </div>
        </div>

        {/* Alternative Resources */}
        <div className="bg-gray-50 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Explore Our Platform</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link 
              href="/market" 
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
            >
              <h3 className="font-semibold text-gray-900 mb-2">Live Market Data</h3>
              <p className="text-gray-600 text-sm">Real-time indices, sector performance, and FII/DII activity.</p>
            </Link>
            
            <Link 
              href="/swing-trades" 
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
            >
              <h3 className="font-semibold text-gray-900 mb-2">Swing Trades</h3>
              <p className="text-gray-600 text-sm">Educational trading setups and analysis for learning.</p>
            </Link>
            
            <Link 
              href="/smart-money-concepts" 
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
            >
              <h3 className="font-semibold text-gray-900 mb-2">Smart Money Concepts</h3>
              <p className="text-gray-600 text-sm">Learn institutional trading concepts and market structure.</p>
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center">
          <Link 
            href="/" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Timeline */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Expected completion: <strong>February 2025</strong>
          </p>
          <p className="text-gray-400 text-xs mt-2">
            We appreciate your patience as we work to provide better content quality.
          </p>
        </div>
      </div>
    </div>
  );
}