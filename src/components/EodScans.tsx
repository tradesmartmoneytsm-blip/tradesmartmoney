'use client';

import { Clock, TrendingUp } from 'lucide-react';

interface EodScansProps {
  initialSubSection?: string;
}

export function EodScans({ }: EodScansProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8 lg:py-12">
      {/* Coming Soon Section */}
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 lg:p-12 max-w-2xl mx-auto">
          {/* Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-10 h-10 text-blue-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            EOD Scans
          </h1>
          
          {/* Subtitle */}
          <h2 className="text-xl lg:text-2xl font-semibold text-blue-600 mb-6">
            Coming Soon
          </h2>

          {/* Description */}
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            We&apos;re working on advanced end-of-day scanning tools that will help you identify 
            trading opportunities through technical analysis, pattern recognition, and market screening.
          </p>

          {/* Features List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700">Technical Pattern Recognition</span>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700">Breakout Detection</span>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700">Volume Analysis</span>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700">Sector Performance</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="flex items-center justify-center space-x-2 text-gray-500">
            <Clock className="w-5 h-5" />
            <span className="text-sm">Expected launch: Q1 2025</span>
          </div>
        </div>
      </div>

      {/* Educational Disclaimer */}
      <div className="mt-8 max-w-4xl mx-auto">
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-lg">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-amber-800">
                <strong className="font-semibold">Educational Purpose:</strong> All scanning tools and analysis will be provided for educational purposes only. 
                We are not SEBI registered investment advisors. Please consult with qualified professionals for investment decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 