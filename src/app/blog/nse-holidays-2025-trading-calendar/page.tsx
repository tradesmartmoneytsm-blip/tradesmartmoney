import { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import { CalendarActions } from '@/components/CalendarActions';

export const metadata: Metadata = {
  title: 'NSE Holidays 2025: Complete Trading Calendar & Market Timings | TradeSmart Money',
  description: 'Complete NSE BSE holidays 2025 list with trading calendar, market timings, and important dates. Plan your trading with official stock exchange holiday schedule.',
  keywords: 'NSE holidays 2025, BSE holidays 2025, stock market holidays, trading calendar 2025, market closed dates, NSE BSE schedule, Indian stock market calendar',
  authors: [{ name: 'TradeSmart Team' }],
  openGraph: {
    title: 'NSE Holidays 2025: Complete Trading Calendar & Market Timings',
    description: 'Complete NSE BSE holidays 2025 list with trading calendar and market timings. Official stock exchange holiday schedule.',
    url: 'https://www.tradesmartmoney.com/blog/nse-holidays-2025-trading-calendar',
    siteName: 'TradeSmart Money',
    type: 'article',
    images: [
      {
        url: '/blog/nse-holidays-2025.jpg',
        width: 1200,
        height: 630,
        alt: 'NSE BSE Holidays 2025 Trading Calendar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NSE Holidays 2025: Complete Trading Calendar',
    description: 'Complete NSE BSE holidays 2025 list with trading calendar and market timings.',
  },
  alternates: {
    canonical: 'https://www.tradesmartmoney.com/blog/nse-holidays-2025-trading-calendar',
  },
};

export default function NSEHolidays2025() {
  // SEO IMPROVEMENT #1: Structured Data
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'NSE Holidays 2025: Complete Trading Calendar & Market Timings',
    description: 'Complete NSE BSE holidays 2025 list with trading calendar, market timings, and important dates. Plan your trading with official stock exchange holiday schedule.',
    image: 'https://www.tradesmartmoney.com/blog/nse-holidays-2025.jpg',
    author: {
      '@type': 'Organization',
      name: 'TradeSmart Money',
      url: 'https://www.tradesmartmoney.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'TradeSmart Money',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.tradesmartmoney.com/favicon.svg',
      },
    },
    datePublished: '2025-01-10T05:30:00.000Z',
    dateModified: '2025-02-07T05:30:00.000Z',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://www.tradesmartmoney.com/blog/nse-holidays-2025-trading-calendar',
    },
    articleSection: 'Trading Calendar',
    keywords: 'NSE holidays 2025, BSE holidays, trading calendar',
    wordCount: 1000,
    timeRequired: 'PT5M',
  };

  const holidays2025 = [
    { date: 'January 26, 2025', day: 'Sunday', occasion: 'Republic Day', markets: 'NSE, BSE Closed' },
    { date: 'March 14, 2025', day: 'Friday', occasion: 'Holi', markets: 'NSE, BSE Closed' },
    { date: 'March 31, 2025', day: 'Monday', occasion: 'Id-Ul-Fitr (Ramzan Id)', markets: 'NSE, BSE Closed' },
    { date: 'April 14, 2025', day: 'Monday', occasion: 'Dr. Baba Saheb Ambedkar Jayanti', markets: 'NSE, BSE Closed' },
    { date: 'April 18, 2025', day: 'Friday', occasion: 'Good Friday', markets: 'NSE, BSE Closed' },
    { date: 'May 1, 2025', day: 'Thursday', occasion: 'Maharashtra Day', markets: 'NSE, BSE Closed' },
    { date: 'June 6, 2025', day: 'Friday', occasion: 'Id-Ul-Zuha (Bakri Id)', markets: 'NSE, BSE Closed' },
    { date: 'August 15, 2025', day: 'Friday', occasion: 'Independence Day', markets: 'NSE, BSE Closed' },
    { date: 'September 2, 2025', day: 'Tuesday', occasion: 'Ganesh Chaturthi', markets: 'NSE, BSE Closed' },
    { date: 'October 2, 2025', day: 'Thursday', occasion: 'Gandhi Jayanti', markets: 'NSE, BSE Closed' },
    { date: 'November 1, 2025', day: 'Saturday', occasion: 'Diwali (Laxmi Pujan)', markets: 'NSE, BSE Closed' },
    { date: 'November 15, 2025', day: 'Saturday', occasion: 'Guru Nanak Jayanti', markets: 'NSE, BSE Closed' },
    { date: 'December 25, 2025', day: 'Thursday', occasion: 'Christmas', markets: 'NSE, BSE Closed' },
  ];

  const specialSessions = [
    { date: 'October 31, 2025', session: 'Diwali Muhurat Trading', timings: '6:00 PM to 7:00 PM' },
  ];

  return (
    <>
      <Script id="article-schema" type="application/ld+json">
        {JSON.stringify(articleSchema)}
      </Script>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-8">
            <div className="flex items-center mb-4">
              <span className="bg-green-500 text-xs font-semibold px-3 py-1 rounded-full">TRADING CALENDAR</span>
              <span className="ml-3 text-green-200 text-sm">Updated for 2025</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">NSE Holidays 2025: Complete Trading Calendar</h1>
            <p className="text-xl text-green-100">
              Official NSE & BSE holiday schedule with market timings and special trading sessions
            </p>
          </div>

          <div className="p-8">
            {/* Quick Summary */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
              <h2 className="text-xl font-semibold text-blue-900 mb-3">📅 Quick Summary 2025</h2>
              <div className="grid md:grid-cols-3 gap-4 text-blue-800">
                <div className="text-center">
                  <div className="text-2xl font-bold">13</div>
                  <div className="text-sm">Total Holidays</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">1</div>
                  <div className="text-sm">Special Session</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">250+</div>
                  <div className="text-sm">Trading Days</div>
                </div>
              </div>
            </div>

            {/* Market Timings */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🕒 Regular Market Timings</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">NSE (National Stock Exchange)</h3>
                  <ul className="text-green-800 space-y-2">
                    <li>• <strong>Pre-Market:</strong> 9:00 AM to 9:15 AM</li>
                    <li>• <strong>Regular Trading:</strong> 9:15 AM to 3:30 PM</li>
                    <li>• <strong>Closing Session:</strong> 3:30 PM to 4:00 PM</li>
                    <li>• <strong>Trading Days:</strong> Monday to Friday</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">BSE (Bombay Stock Exchange)</h3>
                  <ul className="text-blue-800 space-y-2">
                    <li>• <strong>Pre-Market:</strong> 9:00 AM to 9:15 AM</li>
                    <li>• <strong>Regular Trading:</strong> 9:15 AM to 3:30 PM</li>
                    <li>• <strong>Closing Session:</strong> 3:30 PM to 4:00 PM</li>
                    <li>• <strong>Trading Days:</strong> Monday to Friday</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Complete Holiday List */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 Complete NSE BSE Holidays 2025</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Day</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Occasion</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Markets</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {holidays2025.map((holiday, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{holiday.date}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{holiday.day}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{holiday.occasion}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">{holiday.markets}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Special Trading Sessions */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">✨ Special Trading Sessions 2025</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-4">Diwali Muhurat Trading</h3>
                {specialSessions.map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{session.date}</div>
                      <div className="text-sm text-gray-600">{session.session}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-yellow-700">{session.timings}</div>
                      <div className="text-xs text-gray-500">Special Session</div>
                    </div>
                  </div>
                ))}
                <p className="text-yellow-700 text-sm mt-4">
                  <strong>Note:</strong> Muhurat Trading is a special 1-hour ceremonial trading session on Diwali, 
                  considered auspicious for new investments.
                </p>
              </div>
            </section>

            {/* Monthly Breakdown */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">📅 Month-wise Holiday Breakdown</h2>
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { month: 'January', count: 1, holidays: ['Republic Day'] },
                  { month: 'February', count: 0, holidays: [] },
                  { month: 'March', count: 2, holidays: ['Holi', 'Ramzan Id'] },
                  { month: 'April', count: 2, holidays: ['Ambedkar Jayanti', 'Good Friday'] },
                  { month: 'May', count: 1, holidays: ['Maharashtra Day'] },
                  { month: 'June', count: 1, holidays: ['Bakri Id'] },
                  { month: 'July', count: 0, holidays: [] },
                  { month: 'August', count: 1, holidays: ['Independence Day'] },
                  { month: 'September', count: 1, holidays: ['Ganesh Chaturthi'] },
                  { month: 'October', count: 1, holidays: ['Gandhi Jayanti'] },
                  { month: 'November', count: 2, holidays: ['Diwali', 'Guru Nanak Jayanti'] },
                  { month: 'December', count: 1, holidays: ['Christmas'] },
                ].map((month, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-semibold text-gray-900">{month.month}</div>
                    <div className="text-2xl font-bold text-blue-600">{month.count}</div>
                    <div className="text-xs text-gray-600">
                      {month.count === 0 ? 'No holidays' : `${month.count} holiday${month.count > 1 ? 's' : ''}`}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Important Notes */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">⚠️ Important Notes for Traders</h2>
              <div className="space-y-4">
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                  <h3 className="font-semibold text-blue-900">Settlement Schedules</h3>
                  <p className="text-blue-800 text-sm">
                    T+1 settlement cycle means trades executed today will be settled tomorrow (if not a holiday). 
                    {/* SEO IMPROVEMENT #4: Internal Link */}
                    Monitor your portfolio on our{' '}
                    <Link href="/market" className="text-blue-900 hover:underline font-medium">
                      live market dashboard
                    </Link>.
                  </p>
                </div>
                <div className="bg-green-50 border-l-4 border-green-400 p-4">
                  <h3 className="font-semibold text-green-900">Derivative Expiry</h3>
                  <p className="text-green-800 text-sm">
                    Options and Futures contracts expire on the last Thursday of each month (if not a holiday). 
                    Track expiry patterns on our{' '}
                    <Link href="/fno/futures-analysis" className="text-green-900 hover:underline font-medium">
                      futures analysis page
                    </Link>.
                  </p>
                </div>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <h3 className="font-semibold text-yellow-900">SIP & Mutual Funds</h3>
                  <p className="text-yellow-800 text-sm">
                    SIP dates may shift if they fall on market holidays. Check with your fund house for exact dates.
                  </p>
                </div>
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <h3 className="font-semibold text-red-900">Global Market Impact</h3>
                  <p className="text-red-800 text-sm">
                    Indian markets may be affected by global events even when domestic markets are open.
                  </p>
                </div>
              </div>
            </section>

            {/* Trading Tips */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">💡 Holiday Trading Tips (Educational)</h2>
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    <span><strong>Pre-Holiday Volatility:</strong> Markets often show increased volatility before long holidays</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    <span><strong>Position Management:</strong> Consider reducing position sizes before holidays</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    <span><strong>Global Events:</strong> Monitor international markets during Indian holidays</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    <span><strong>Settlement Planning:</strong> Plan trades considering T+1 settlement and holidays</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    <span><strong>Muhurat Trading:</strong> Participate in Diwali session for ceremonial purposes</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Downloadable Calendar */}
            <section className="mb-8">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">📱 Save This Calendar</h3>
                <p className="text-gray-700 mb-4">
                  Bookmark this page or save it to your home screen for quick access to the 2025 trading calendar.
                </p>
                <CalendarActions />
              </div>
            </section>

            {/* Disclaimer */}
            <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3">📋 Important Disclaimer</h3>
              <p className="text-yellow-700 text-sm">
                <strong>Educational Information:</strong> This calendar is compiled from official NSE and BSE sources for educational purposes. 
                Holiday dates may be subject to change based on official notifications from the exchanges. 
                Always verify with official NSE/BSE announcements before making trading decisions. 
                We are not responsible for any trading losses due to incorrect holiday information.
              </p>
            </div>
          </div>
        </article>

        {/* SEO IMPROVEMENT #4: Related Platform Features */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Plan Your Trading Strategy</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/swing-trades" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Swing Trading Strategies</h4>
              <p className="text-gray-600 text-sm">Educational swing trading setups and analysis</p>
            </Link>
            <Link href="/market/fii-dii-activity" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">FII/DII Activity</h4>
              <p className="text-gray-600 text-sm">Track institutional money flow patterns</p>
            </Link>
            <Link href="/blog/understanding-market-basics-beginners" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Market Basics Guide</h4>
              <p className="text-gray-600 text-sm">Learn stock market fundamentals</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
