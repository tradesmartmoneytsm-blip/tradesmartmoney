'use client';

import { AdvancedScanner } from '@/components/AdvancedScanner';
import { 
  Brain, 
  Activity, 
  AlertTriangle,
  Info
} from 'lucide-react';

export function AdvancedScannerPageClient() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🔍 Advanced Scanner
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Real-Time Option Chain Analysis & Institutional Flow Tracking
          </p>
          <p className="text-sm text-gray-500">
            Professional-Grade Analysis Tool • For Reference & Development
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Advanced Scanner - Reference Tool</h3>
              <p className="text-blue-800 text-sm mb-2">
                This is the live Advanced Scanner component that provides real-time option chain analysis. 
                It fetches fresh data from live market sources and applies the enhanced Indian market algorithm.
              </p>
              <div className="text-blue-700 text-xs">
                <strong>Key Features:</strong> Live data fetching • Real-time analysis • Interactive filtering • 
                Comprehensive scoring • Indian market intelligence
              </div>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-yellow-900 mb-1">Development & Reference Only</h3>
              <p className="text-yellow-800 text-sm">
                This page is for development reference and testing. For production use, access Option Analysis 
                through the main navigation or FNO section.
              </p>
            </div>
          </div>
        </div>

        {/* Advanced Scanner Component */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Brain className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">Live Advanced Scanner</h2>
          </div>
          
          <AdvancedScanner />
        </div>

        {/* Technical Details */}
        <div className="mt-8 bg-gray-50 rounded-xl p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Technical Details
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-700">
            <div>
              <h4 className="font-semibold mb-2">Data Source:</h4>
              <ul className="space-y-1 text-xs">
                <li>• Live Market Data (Real-time option chain)</li>
                <li>• Real-time PCR calculations</li>
                <li>• Live institutional flow analysis</li>
                <li>• Dynamic support/resistance levels</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Algorithm Features:</h4>
              <ul className="space-y-1 text-xs">
                <li>• Enhanced Indian market intelligence</li>
                <li>• Sector-specific adjustments</li>
                <li>• Expiry week effects</li>
                <li>• Volatility tier classification</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>
            🔧 Development Tool • 📊 Real-Time Data • ⚠️ Reference Only
          </p>
        </div>
      </div>
    </div>
  );
}
