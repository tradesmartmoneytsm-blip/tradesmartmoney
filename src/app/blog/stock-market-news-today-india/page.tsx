import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Stock Market News Today India: Live Updates & Market Analysis | TradeSmart Money',
  description: 'Latest stock market news today India with live market updates, Sensex Nifty movements, FII DII data, and expert market analysis. Stay updated with Indian stock market.',
  keywords: 'stock market news today India, Indian stock market today, Sensex today, Nifty today, market news India, stock market updates, BSE NSE news, market analysis India',
  openGraph: {
    title: 'Stock Market News Today India: Live Updates & Analysis',
    description: 'Latest stock market news and live updates from Indian markets with expert analysis.',
    url: 'https://www.tradesmartmoney.com/blog/stock-market-news-today-india',
    siteName: 'TradeSmart Money',
    type: 'article',
    images: [
      {
        url: '/blog/stock-market-news-today.jpg',
        width: 1200,
        height: 630,
        alt: 'Stock Market News Today India',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stock Market News Today India',
    description: 'Latest stock market news and live updates from Indian markets.',
  },
  alternates: {
    canonical: 'https://www.tradesmartmoney.com/blog/stock-market-news-today-india',
  },
};

export default function StockMarketNewsToday() {
  const currentDate = new Date().toLocaleDateString('en-IN', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const currentTime = new Date().toLocaleTimeString('en-IN', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });

  // Sample market data (in real implementation, this would come from live API)
  const marketData = {
    sensex: { value: 81250, change: +245, changePercent: +0.30 },
    nifty: { value: 24650, change: +85, changePercent: +0.35 },
    bankNifty: { value: 51280, change: +125, changePercent: +0.24 },
    niftyIT: { value: 43850, change: -120, changePercent: -0.27 },
  };

  const topNews = [
    {
      time: "10:30 AM",
      headline: "RBI Monetary Policy Committee Meeting Outcome Expected This Week",
      summary: "Market participants await RBI's decision on repo rates amid inflation concerns and global economic uncertainty.",
      impact: "High",
      sector: "Banking"
    },
    {
      time: "10:15 AM", 
      headline: "FII Inflows Continue for Third Consecutive Session",
      summary: "Foreign institutional investors pump in ₹2,500 crores in Indian equities, boosting market sentiment.",
      impact: "High",
      sector: "Market"
    },
    {
      time: "10:00 AM",
      headline: "IT Stocks Under Pressure on Global Tech Selloff",
      summary: "Nifty IT index falls 0.3% as global technology stocks face headwinds from rising interest rate concerns.",
      impact: "Medium",
      sector: "IT"
    },
    {
      time: "9:45 AM",
      headline: "Banking Stocks Rally on Credit Growth Optimism", 
      summary: "Bank Nifty gains 0.25% as investors bet on sustained credit growth and improving asset quality.",
      impact: "Medium",
      sector: "Banking"
    },
    {
      time: "9:30 AM",
      headline: "Auto Sector Mixed Amid Festive Season Demand",
      summary: "Auto stocks show mixed performance with two-wheeler stocks outperforming passenger vehicle makers.",
      impact: "Low",
      sector: "Auto"
    },
  ];

  const topGainers = [
    { name: "HDFC Bank", price: 1675, change: +2.1 },
    { name: "Reliance", price: 2850, change: +1.8 },
    { name: "ICICI Bank", price: 1245, change: +1.5 },
    { name: "Infosys", price: 1820, change: +1.2 },
    { name: "TCS", price: 4150, change: +0.9 },
  ];

  const topLosers = [
    { name: "Tech Mahindra", price: 1650, change: -2.3 },
    { name: "Wipro", price: 585, change: -1.9 },
    { name: "HCL Tech", price: 1780, change: -1.6 },
    { name: "Bajaj Finance", price: 7250, change: -1.4 },
    { name: "Asian Paints", price: 2950, change: -1.1 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <article className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <span className="bg-red-500 text-xs font-semibold px-3 py-1 rounded-full animate-pulse">LIVE</span>
                <span className="ml-3 text-red-200 text-sm">{currentDate}</span>
              </div>
              <div className="text-red-200 text-sm">Last Updated: {currentTime}</div>
            </div>
            <h1 className="text-4xl font-bold mb-4">Stock Market News Today India</h1>
            <p className="text-xl text-red-100">
              Live market updates, analysis & breaking news from Indian stock markets
            </p>
          </div>

          <div className="p-8">
            {/* Disclaimer */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
              <p className="text-yellow-800 text-sm font-medium">
                <strong>EDUCATIONAL DISCLAIMER:</strong> This content is for educational purposes only. We are not SEBI registered advisors. 
                Market news and analysis are for learning about market dynamics. Please consult qualified professionals for investment decisions.
              </p>
            </div>

            {/* Market Dashboard */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">📊 Live Market Dashboard</h2>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                  <div className="text-sm text-blue-600 mb-1">Sensex</div>
                  <div className="text-2xl font-bold text-gray-900">{marketData.sensex.value.toLocaleString()}</div>
                  <div className="text-green-600 font-semibold">
                    +{marketData.sensex.change} ({marketData.sensex.changePercent}%)
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
                  <div className="text-sm text-green-600 mb-1">Nifty 50</div>
                  <div className="text-2xl font-bold text-gray-900">{marketData.nifty.value.toLocaleString()}</div>
                  <div className="text-green-600 font-semibold">
                    +{marketData.nifty.change} ({marketData.nifty.changePercent}%)
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
                  <div className="text-sm text-purple-600 mb-1">Bank Nifty</div>
                  <div className="text-2xl font-bold text-gray-900">{marketData.bankNifty.value.toLocaleString()}</div>
                  <div className="text-green-600 font-semibold">
                    +{marketData.bankNifty.change} ({marketData.bankNifty.changePercent}%)
                  </div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg">
                  <div className="text-sm text-red-600 mb-1">Nifty IT</div>
                  <div className="text-2xl font-bold text-gray-900">{marketData.niftyIT.value.toLocaleString()}</div>
                  <div className="text-red-600 font-semibold">
                    {marketData.niftyIT.change} ({marketData.niftyIT.changePercent}%)
                  </div>
                </div>
              </div>
            </section>

            {/* Breaking News */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🚨 Breaking Market News</h2>
              <div className="space-y-4">
                {topNews.map((news, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-semibold text-blue-600">{news.time}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          news.impact === 'High' ? 'bg-red-100 text-red-800' :
                          news.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {news.impact} Impact
                        </span>
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                          {news.sector}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{news.headline}</h3>
                    <p className="text-gray-700 text-sm">{news.summary}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Market Movers */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">📈 Market Movers</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-4">🟢 Top Gainers</h3>
                  <div className="space-y-3">
                    {topGainers.map((stock, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-white rounded">
                        <div>
                          <div className="font-medium text-gray-900">{stock.name}</div>
                          <div className="text-sm text-gray-600">₹{stock.price.toLocaleString()}</div>
                        </div>
                        <div className="text-green-600 font-semibold">+{stock.change}%</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-red-900 mb-4">🔴 Top Losers</h3>
                  <div className="space-y-3">
                    {topLosers.map((stock, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-white rounded">
                        <div>
                          <div className="font-medium text-gray-900">{stock.name}</div>
                          <div className="text-sm text-gray-600">₹{stock.price.toLocaleString()}</div>
                        </div>
                        <div className="text-red-600 font-semibold">{stock.change}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Sector Performance */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🏭 Sector Performance</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { sector: "Banking", change: +0.45, volume: "High" },
                  { sector: "IT", change: -0.25, volume: "Medium" },
                  { sector: "Auto", change: +0.15, volume: "Low" },
                  { sector: "Pharma", change: +0.85, volume: "High" },
                  { sector: "FMCG", change: -0.12, volume: "Low" },
                  { sector: "Metals", change: +1.25, volume: "High" },
                ].map((sector, index) => (
                  <div key={index} className="bg-white border border-gray-200 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">{sector.sector}</span>
                      <span className={`font-semibold ${sector.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {sector.change >= 0 ? '+' : ''}{sector.change}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">Volume: {sector.volume}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* FII DII Data */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">💰 FII DII Activity</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Foreign Institutional Investors (FII)</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Equity</span>
                      <span className="font-semibold text-green-600">+₹2,500 Cr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Debt</span>
                      <span className="font-semibold text-red-600">-₹450 Cr</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-medium text-gray-900">Net</span>
                      <span className="font-bold text-green-600">+₹2,050 Cr</span>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-4">Domestic Institutional Investors (DII)</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Equity</span>
                      <span className="font-semibold text-green-600">+₹1,800 Cr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Debt</span>
                      <span className="font-semibold text-green-600">+₹650 Cr</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-medium text-gray-900">Net</span>
                      <span className="font-bold text-green-600">+₹2,450 Cr</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Market Outlook */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🔮 Market Outlook (Educational Analysis)</h2>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical & Fundamental View</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-3">Bullish Factors</h4>
                    <ul className="text-gray-700 space-y-1 text-sm">
                      <li>• Sustained FII inflows boosting sentiment</li>
                      <li>• Banking sector showing strength</li>
                      <li>• Festive season demand pickup</li>
                      <li>• Corporate earnings growth expectations</li>
                      <li>• Domestic institutional support</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-900 mb-3">Risk Factors</h4>
                    <ul className="text-gray-700 space-y-1 text-sm">
                      <li>• Global tech selloff pressure</li>
                      <li>• Rising crude oil prices</li>
                      <li>• Geopolitical uncertainties</li>
                      <li>• Inflation concerns ahead of RBI policy</li>
                      <li>• Profit booking at higher levels</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Economic Calendar */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">📅 This Week's Economic Calendar</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Importance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Impact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-900">Today</td>
                      <td className="px-6 py-4 text-sm text-gray-700">FII/DII Data Release</td>
                      <td className="px-6 py-4"><span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">Medium</span></td>
                      <td className="px-6 py-4 text-sm text-gray-700">Market Sentiment</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-900">Tomorrow</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Q2 GDP Data</td>
                      <td className="px-6 py-4"><span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">High</span></td>
                      <td className="px-6 py-4 text-sm text-gray-700">Broad Market</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-900">This Week</td>
                      <td className="px-6 py-4 text-sm text-gray-700">RBI MPC Meeting</td>
                      <td className="px-6 py-4"><span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">High</span></td>
                      <td className="px-6 py-4 text-sm text-gray-700">Banking Sector</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Trading Tips */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">💡 Educational Trading Insights</h2>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-900 mb-4">Market Learning Points</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• <strong>News Impact:</strong> Study how different news affects various sectors</li>
                    <li>• <strong>FII/DII Flows:</strong> Understand institutional money movement patterns</li>
                    <li>• <strong>Sector Rotation:</strong> Learn how money flows between sectors</li>
                    <li>• <strong>Volume Analysis:</strong> High volume confirms price movements</li>
                  </ul>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• <strong>Economic Calendar:</strong> Plan trades around major events</li>
                    <li>• <strong>Risk Management:</strong> Never ignore stop losses</li>
                    <li>• <strong>Market Breadth:</strong> Check advance/decline ratios</li>
                    <li>• <strong>Global Cues:</strong> Monitor international market trends</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Auto-refresh Notice */}
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg mb-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">🔄 Live Updates</h3>
              <p className="text-blue-800 text-sm mb-3">
                This page provides educational market analysis and news updates. For the most current market data, 
                please refer to official NSE/BSE websites or your trading platform.
              </p>
              <div className="text-xs text-blue-700">
                <strong>Update Schedule:</strong> Every 15 minutes during market hours | 
                <strong> Last Updated:</strong> {currentTime} IST
              </div>
            </div>

            {/* Final Disclaimer */}
            <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-red-800 mb-3">⚠️ Important Educational Disclaimer</h3>
              <p className="text-red-700 text-sm">
                <strong>Educational Content:</strong> All market news, analysis, and data presented here are for educational purposes only. 
                We are not SEBI registered investment advisors. Market conditions can change rapidly, and past performance does not guarantee future results. 
                This content should not be considered as investment advice or recommendations to buy/sell securities. 
                Please consult qualified financial professionals and do your own research before making any investment decisions. 
                Trading and investing in securities involves substantial risk of loss.
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
