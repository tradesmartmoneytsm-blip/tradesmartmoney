'use client';

import { Zap, Clock } from 'lucide-react';

export function StormStrategy() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
          <Zap className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">PCRStorm Analysis</h3>
          <p className="text-sm text-gray-600">High Money Flow Activity Detection</p>
        </div>
      </div>

      {/* Coming Soon Banner */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Clock className="w-6 h-6 text-yellow-600" />
          <h4 className="text-xl font-bold text-yellow-800">Coming Soon</h4>
        </div>
        <p className="text-yellow-700 mb-2">
          Advanced PCR Storm analysis is under development.
        </p>
        <p className="text-sm text-yellow-600">
          This tool will detect sudden PCR changes and money flow storms in real-time.
        </p>
      </div>

      {/* Feature Preview */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h5 className="font-semibold text-gray-800 mb-2">Upcoming Features</h5>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Real-time PCR storm detection</li>
            <li>• Money flow activity alerts</li>
            <li>• Institutional movement tracking</li>
            <li>• Storm intensity scoring</li>
          </ul>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h5 className="font-semibold text-gray-800 mb-2">Analysis Capabilities</h5>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Time-based PCR analysis</li>
            <li>• Volume surge detection</li>
            <li>• Unusual activity alerts</li>
            <li>• Storm pattern recognition</li>
          </ul>
        </div>
      </div>
    </div>
  );
}