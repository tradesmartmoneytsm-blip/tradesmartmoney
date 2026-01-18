'use client';

import { motion } from 'framer-motion';
import { BookOpen, Star, ExternalLink, Award, Users, Target } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { useRouter } from 'next/navigation';

interface Book {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  features: string[];
  status: 'published' | 'coming-soon';
  purchaseLink?: string;
  coverColor: string;
  pages?: number;
  rating?: number;
  readers?: number;
}

const myBooks: Book[] = [
  {
    id: '1',
    title: 'Mastering Fundamental Analysis',
    subtitle: 'A Complete Guide to In-Depth Stock Evaluation',
    description: 'Comprehensive 31-chapter guide covering everything from financial statements to advanced valuation, risk management, behavioral finance, and portfolio construction. A complete masterclass in fundamental analysis.',
    features: [
      'All 31 Chapters - Complete Course',
      'Financial Statement Deep Dives',
      'Multiple Valuation Techniques',
      'Business Moats & Competitive Advantage',
      'Risk Analysis & Management',
      'Behavioral Finance & Psychology',
      'Real-World Case Studies',
      'Portfolio Construction Strategies',
      'Financial Modeling & Forecasting'
    ],
    status: 'published',
    purchaseLink: '/books/my-books/fundamental-analysis',
    coverColor: 'from-blue-600 to-indigo-800',
    pages: 500,
  },
  {
    id: '2',
    title: 'Master Smart Money Trading',
    subtitle: 'A Complete Guide to Institutional Trading Strategies',
    description: 'Learn how to identify and trade alongside institutional investors. This comprehensive 15-chapter guide covers smart money concepts, order flow analysis, liquidity hunts, supply/demand zones, and advanced market structure techniques.',
    features: [
      'Smart Money Concepts & Psychology',
      'Market Structure & Price Action',
      'Order Flow & Institutional Footprints',
      'Accumulation & Distribution Patterns',
      'Supply and Demand Zones',
      'Liquidity Hunts & Stop Runs',
      'Order Blocks & Fair Value Gaps',
      'Multi-Timeframe Analysis',
      'Complete Trading Strategies'
    ],
    status: 'published',
    purchaseLink: '/books/my-books/smart-money-trading',
    coverColor: 'from-green-600 to-emerald-800',
    pages: 350,
  },
  {
    id: '3',
    title: 'Indian Stock Market Mastery',
    subtitle: 'NSE & BSE Trading Strategies for Consistent Profits',
    description: 'A practical 15-chapter guide specifically for Indian stock market traders. Master NSE/BSE mechanics, FII/DII analysis, sector rotation, F&O strategies, intraday and swing trading with real Indian market examples.',
    features: [
      'NSE & BSE Market Ecosystem',
      'NIFTY & Bank NIFTY Analysis',
      'FII/DII Flow Tracking',
      'Sector Rotation Strategies',
      'Stock Selection Framework',
      'Futures & Options Trading',
      'Intraday & Swing Strategies',
      'Risk Management & Tax Planning',
      'Real Case Studies'
    ],
    status: 'published',
    purchaseLink: '/books/my-books/indian-market',
    coverColor: 'from-purple-600 to-violet-800',
    pages: 400,
  },
  {
    id: '4',
    title: 'Algorithmic Trading for Beginners',
    subtitle: 'Build Your First Trading Bot',
    description: 'Step-by-step 12-chapter guide to creating automated trading strategies. Learn Python programming, data analysis, strategy development, backtesting, broker API integration, and deploy your first trading algorithm.',
    features: [
      'Python Programming for Traders',
      'Market Data Acquisition',
      'Technical Indicators in Code',
      'Strategy Development',
      'Backtesting Framework',
      'Risk Management Algorithms',
      'Broker API Integration',
      'Paper Trading & Testing',
      'Live Deployment Guide'
    ],
    status: 'published',
    purchaseLink: '/books/my-books/algo-trading',
    coverColor: 'from-orange-600 to-red-800',
    pages: 300,
  }
];

export function MyBooksPageClient() {
  const router = useRouter();

  const handleSectionChange = (section: string, subSection?: string) => {
    if (section === 'books' && subSection) {
      router.push(`/books/${subSection}`);
      return;
    }
    
    const routes: { [key: string]: string } = {
      'home': '/',
      'market': '/market',
      'swing': '/swing-trades',
      'news': '/news',
      'algo-trading': '/algo-trading',
      'books': '/books',
    };
    
    const route = routes[section];
    if (route) {
      router.push(route);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation 
        activeSection="books" 
        onSectionChange={handleSectionChange}
      />
      
      {/* Header */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-16 px-4 overflow-hidden mt-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Award className="w-12 h-12" />
              <h1 className="text-4xl md:text-5xl font-bold">Books Written by Me</h1>
            </div>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Sharing my trading experience and knowledge to help you become a better trader
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Book Type Tabs */}
        <div className="mb-8 flex justify-center gap-4">
          <a
            href="/books/recommended-books"
            className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
          >
            <BookOpen className="w-6 h-6" />
            <span>Recommended Books</span>
          </a>
          <a
            href="/books/my-books"
            className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg hover:shadow-xl hover:scale-105 ring-4 ring-orange-300"
          >
            <Award className="w-6 h-6" />
            <span>📚 Books Written by Me</span>
          </a>
        </div>

        {/* Author Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-12"
        >
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <Users className="w-12 h-12 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                About the Author
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                With years of experience in the Indian stock market and a passion for algorithmic trading, 
                I've developed proven strategies that have helped thousands of traders improve their results. 
                My books combine practical knowledge with real-world trading experience, focusing on actionable 
                strategies you can implement immediately.
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <Target className="w-4 h-4" />
                  <span className="font-semibold">10+ Years Trading Experience</span>
                </div>
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                  <Users className="w-4 h-4" />
                  <span className="font-semibold">Helped 50,000+ Traders</span>
                </div>
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <Award className="w-4 h-4" />
                  <span className="font-semibold">Professional Trader & Educator</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {myBooks.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden"
            >
              {/* Book Cover */}
              {book.status === 'published' && book.purchaseLink ? (
                <a 
                  href={book.purchaseLink}
                  className="block h-64 bg-gradient-to-br cursor-pointer relative overflow-hidden"
                  style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
                >
                  <div className={`h-full bg-gradient-to-br ${book.coverColor} p-8 flex flex-col items-center justify-center`}>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                    <BookOpen className="w-24 h-24 text-white/90 relative z-10 mb-4" />
                    <h3 className="text-2xl font-bold text-white text-center relative z-10 mb-2 hover:scale-105 transition-transform">
                      {book.title}
                    </h3>
                    {book.subtitle && (
                      <p className="text-sm text-white/80 text-center relative z-10">
                        {book.subtitle}
                      </p>
                    )}
                  </div>
                </a>
              ) : (
                <div className={`h-64 bg-gradient-to-br ${book.coverColor} p-8 flex flex-col items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                  <BookOpen className="w-24 h-24 text-white/90 relative z-10 mb-4" />
                  <h3 className="text-2xl font-bold text-white text-center relative z-10 mb-2">
                    {book.title}
                  </h3>
                  {book.subtitle && (
                    <p className="text-sm text-white/80 text-center relative z-10">
                      {book.subtitle}
                    </p>
                  )}
                  {book.status === 'coming-soon' && (
                    <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      Coming Soon
                    </div>
                  )}
                </div>
              )}

              {/* Book Details */}
              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {book.description}
                </p>

                {/* Book Stats */}
                <div className="flex gap-6 mb-6 text-sm">
                  {book.pages && (
                    <div className="text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">{book.pages}</span> pages
                    </div>
                  )}
                  {book.rating && (
                    <div className="flex items-center gap-1">
                      {[...Array(book.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  )}
                  {book.readers && (
                    <div className="text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">{book.readers.toLocaleString()}</span> readers
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-3">What You'll Learn:</h4>
                  <ul className="space-y-2">
                    {book.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Star className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                {book.status === 'published' && book.purchaseLink ? (
                  <a
                    href={book.purchaseLink}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg w-full justify-center"
                  >
                    <span>Read Free Online</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg px-6 py-3 text-center">
                    <p className="text-yellow-800 dark:text-yellow-300 font-semibold">
                      Coming Soon - Stay Tuned!
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-600/20 dark:to-purple-600/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-8 text-center"
        >
          <BookOpen className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Want to Be Notified When Books Launch?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Join our mailing list to get early access, special discounts, and exclusive content from upcoming books.
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg">
            Notify Me on Launch
          </button>
        </motion.div>
      </div>
    </div>
  );
}

