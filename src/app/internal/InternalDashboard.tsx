'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  BarChart3, 
  Target, 
  TrendingUp, 
  Activity, 
  Shield, 
  Zap,
  Settings
} from 'lucide-react'

interface InternalTool {
  title: string
  description: string
  href: string
  icon: React.ReactNode
  status: 'ACTIVE' | 'BETA' | 'DEVELOPMENT'
  category: 'ANALYSIS' | 'SIGNALS' | 'TOOLS' | 'DATA'
}

export default function InternalDashboard() {
  const [currentDate, setCurrentDate] = useState<string>('')

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString())
  }, [])

  const tools: InternalTool[] = [
    {
      title: 'Stock Progression Analysis',
      description: 'Track how any stock\'s sentiment progressed throughout the trading day with interactive charts and detailed timeline.',
      href: '/internal/stock-progression',
      icon: <BarChart3 className="w-6 h-6" />,
      status: 'ACTIVE',
      category: 'ANALYSIS'
    },
    {
      title: 'AI Trading Signals',
      description: 'Advanced multi-factor algorithm that pinpoints exact stocks for profitable trades with entry/exit points.',
      href: '/internal/trading-signals',
      icon: <Target className="w-6 h-6" />,
      status: 'ACTIVE',
      category: 'SIGNALS'
    },
    {
      title: 'Advanced Scanner',
      description: 'Real-time option chain scanner with live NSE data analysis and comprehensive scoring algorithm.',
      href: '/internal/advanced-scanner',
      icon: <Activity className="w-6 h-6" />,
      status: 'ACTIVE',
      category: 'ANALYSIS'
    },
    {
      title: 'Option Analysis',
      description: 'Comprehensive option chain analysis with institutional flow, PCR analysis, and sentiment scoring.',
      href: '/option-analysis',
      icon: <TrendingUp className="w-6 h-6" />,
      status: 'ACTIVE',
      category: 'ANALYSIS'
    },
    {
      title: 'Futures Analysis',
      description: 'Futures market analysis with OI buildup, basis analysis, and rollover pressure insights.',
      href: '/futures-analysis',
      icon: <Zap className="w-6 h-6" />,
      status: 'ACTIVE',
      category: 'ANALYSIS'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800 border-green-200'
      case 'BETA': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'DEVELOPMENT': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ANALYSIS': return 'text-blue-600 bg-blue-50'
      case 'SIGNALS': return 'text-green-600 bg-green-50'
      case 'TOOLS': return 'text-purple-600 bg-purple-50'
      case 'DATA': return 'text-orange-600 bg-orange-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const categories = ['ANALYSIS', 'SIGNALS', 'TOOLS', 'DATA']

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                <Shield className="w-10 h-10 text-blue-600" />
                Internal Dashboard
              </h1>
              <p className="text-gray-600 mt-3 text-lg">
                Professional trading tools and analysis systems for internal use
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-gray-500">Last Updated</div>
              <div className="text-lg font-semibold text-gray-900">
                {currentDate || 'Loading...'}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{tools.length}</div>
              <div className="text-sm text-blue-800">Total Tools</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {tools.filter(t => t.status === 'ACTIVE').length}
              </div>
              <div className="text-sm text-green-800">Active Tools</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {tools.filter(t => t.category === 'ANALYSIS').length}
              </div>
              <div className="text-sm text-purple-800">Analysis Tools</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {tools.filter(t => t.category === 'SIGNALS').length}
              </div>
              <div className="text-sm text-orange-800">Signal Tools</div>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        {categories.map(category => {
          const categoryTools = tools.filter(tool => tool.category === category)
          if (categoryTools.length === 0) return null

          return (
            <div key={category} className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(category)}`}>
                  {category}
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {category.toLowerCase().charAt(0).toUpperCase() + category.toLowerCase().slice(1)} Tools
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryTools.map((tool, index) => (
                  <Link
                    key={index}
                    href={tool.href}
                    className="group bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-100 transition-colors">
                          {tool.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {tool.title}
                          </h3>
                        </div>
                      </div>
                      
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(tool.status)}`}>
                        {tool.status}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {tool.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(tool.category)}`}>
                        {tool.category}
                      </div>
                      <div className="text-blue-600 text-sm font-medium group-hover:text-blue-700">
                        Open Tool →
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}

        {/* System Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-600" />
            System Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Data Sources</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• NSE Real-time Option Chain Data</li>
                <li>• Supabase Database (Historical Analysis)</li>
                <li>• Live Market Indices</li>
                <li>• FII/DII Flow Data</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Analysis Methods</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Institutional Flow Analysis</li>
                <li>• PCR-based Sentiment Scoring</li>
                <li>• Multi-factor Signal Generation</li>
                <li>• Risk-Reward Optimization</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Update Frequency</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Option Analysis: Every 5 minutes</li>
                <li>• Futures Analysis: Every 15 minutes</li>
                <li>• Trading Signals: Real-time</li>
                <li>• Advanced Scanner: Live data</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p className="flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" />
            Internal Tools Dashboard • Professional Trading Analysis • Restricted Access
          </p>
          <p className="mt-2">
            ⚠️ These tools are for internal research and analysis purposes only. 
            Not for public distribution or commercial use.
          </p>
        </div>
      </div>
    </div>
  )
}
