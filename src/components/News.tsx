'use client';

import { TrendingUp, Globe, Clock, BarChart3, Building, FileText } from 'lucide-react';

export function News() {
  const newsArticles = [
    {
      id: 1,
      title: 'Market Hits New All-Time High',
      summary: 'Nifty crosses 22,200 mark driven by IT and banking sector gains.',
      category: 'Market',
      timestamp: '2 hours ago',
      impact: 'Positive',
      source: 'Economic Times'
    },
    {
      id: 2,
      title: 'RBI Monetary Policy Decision Expected',
      summary: 'Central bank likely to maintain repo rate at current levels amid inflation concerns.',
      category: 'Policy',
      timestamp: '4 hours ago',
      impact: 'Neutral',
      source: 'Business Standard'
    },
    {
      id: 3,
      title: 'FII Outflows Continue for Third Day',
      summary: 'Foreign institutional investors pull out ₹1,250 crores from Indian markets.',
      category: 'FII/DII',
      timestamp: '6 hours ago',
      impact: 'Negative',
      source: 'Mint'
    },
    {
      id: 4,
      title: 'Q3 Earnings Season Begins',
      summary: 'Major IT companies expected to report strong numbers driven by digital transformation.',
      category: 'Earnings',
      timestamp: '8 hours ago',
      impact: 'Positive',
      source: 'CNBC TV18'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 lg:py-6">
      {/* Compact Page Header */}
      <div className="mb-6 lg:mb-8">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2 font-serif">Market News & Updates</h2>
        <p className="text-sm lg:text-base text-gray-600">
          Latest market developments and breaking news affecting your trading decisions.
        </p>
      </div>

      {/* Compact News Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 lg:mb-8">
        {newsArticles.map((article) => (
          <div key={article.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-4 lg:p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${
                article.category === 'Market' ? 'bg-blue-100 text-blue-600' :
                article.category === 'Earnings' ? 'bg-green-100 text-green-600' :
                article.category === 'Economic' ? 'bg-purple-100 text-purple-600' :
                'bg-orange-100 text-orange-600'
              }`}>
                {article.category === 'Market' && <TrendingUp className="w-4 h-4" />}
                {article.category === 'Earnings' && <BarChart3 className="w-4 h-4" />}
                {article.category === 'Economic' && <Building className="w-4 h-4" />}
                {article.category === 'Policy' && <FileText className="w-4 h-4" />}
                {article.category === 'FII/DII' && <Globe className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm lg:text-base font-bold text-gray-900 mb-2 font-serif line-clamp-2">{article.title}</h3>
                <p className="text-xs lg:text-sm text-gray-600 mb-3 line-clamp-3">{article.summary}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="font-medium">{article.source}</span>
                  <span>{article.timestamp}</span>
                </div>
                {article.impact && (
                  <div className="mt-2">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      article.impact === 'Positive' ? 'bg-green-100 text-green-700' :
                      article.impact === 'Negative' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {article.impact} Impact
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Compact Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 lg:p-6 text-center">
          <Clock className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600 mx-auto mb-2 lg:mb-3" />
          <h3 className="text-sm lg:text-lg font-bold text-blue-800 mb-1">Market Hours</h3>
          <p className="text-xs lg:text-sm text-blue-700 font-semibold">9:15 AM - 3:30 PM</p>
          <p className="text-xs text-blue-600 mt-1">IST Trading Hours</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4 lg:p-6 text-center">
          <TrendingUp className="w-6 h-6 lg:w-8 lg:h-8 text-green-600 mx-auto mb-2 lg:mb-3" />
          <h3 className="text-sm lg:text-lg font-bold text-green-800 mb-1">Active Signals</h3>
          <p className="text-xs lg:text-sm text-green-700 font-semibold">42</p>
          <p className="text-xs text-green-600 mt-1">Live opportunities</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4 lg:p-6 text-center">
          <FileText className="w-6 h-6 lg:w-8 lg:h-8 text-purple-600 mx-auto mb-2 lg:mb-3" />
          <h3 className="text-sm lg:text-lg font-bold text-purple-800 mb-1">News Updates</h3>
          <p className="text-xs lg:text-sm text-purple-700 font-semibold">16</p>
          <p className="text-xs text-purple-600 mt-1">Today&apos;s updates</p>
        </div>
      </div>
    </div>
  );
} 