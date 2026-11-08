'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, TrendingUp, BarChart3, Brain, DollarSign, Star, ExternalLink, Languages } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { useRouter } from 'next/navigation';

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  rating: number;
  amazonLink?: string;
  coverColor: string;
  language: 'English' | 'Hindi';
}

// Amazon Associate ID for affiliate earnings
const AMAZON_ASSOCIATE_ID = 'shindeamit001-21';

const books: Book[] = [
  {
    id: '1',
    title: 'The Intelligent Investor',
    author: 'Benjamin Graham',
    description: 'The definitive book on value investing. A classic guide to investing wisely and avoiding costly mistakes.',
    category: 'Fundamental Analysis',
    rating: 5,
    amazonLink: `https://www.amazon.in/Intelligent-Investor-Definitive-Value-Investing/dp/0060555661?tag=${AMAZON_ASSOCIATE_ID}`,
    coverColor: 'from-blue-600 to-blue-800',
    language: 'English'
  },
  {
    id: '2',
    title: 'Technical Analysis of Financial Markets',
    author: 'John J. Murphy',
    description: 'A comprehensive guide to trading methods and applications. Essential for technical analysis.',
    category: 'Technical Analysis',
    rating: 5,
    amazonLink: `https://www.amazon.in/Technical-Analysis-Financial-Markets-Comprehensive/dp/0735200661?tag=${AMAZON_ASSOCIATE_ID}`,
    coverColor: 'from-purple-600 to-purple-800',
    language: 'English'
  },
  {
    id: '3',
    title: 'Market Wizards',
    author: 'Jack D. Schwager',
    description: 'Interviews with top traders revealing their strategies, insights, and mindset for success.',
    category: 'Trading Psychology',
    rating: 5,
    amazonLink: `https://www.amazon.in/Market-Wizards-Interviews-Top-Traders/dp/0887306101?tag=${AMAZON_ASSOCIATE_ID}`,
    coverColor: 'from-green-600 to-green-800',
    language: 'English'
  },
  {
    id: '4',
    title: 'Trading in the Zone',
    author: 'Mark Douglas',
    description: 'Master the market with confidence, discipline, and a winning attitude. Essential for trading psychology.',
    category: 'Trading Psychology',
    rating: 5,
    amazonLink: `https://www.amazon.in/Trading-Zone-Confidence-Discipline-Attitude/dp/0735201447?tag=${AMAZON_ASSOCIATE_ID}`,
    coverColor: 'from-orange-600 to-orange-800',
    language: 'English'
  },
  {
    id: '5',
    title: 'Options as a Strategic Investment',
    author: 'Lawrence G. McMillan',
    description: 'The bible of options trading. Comprehensive coverage of options strategies and risk management.',
    category: 'Options Trading',
    rating: 5,
    amazonLink: `https://www.amazon.in/Options-Strategic-Investment-Lawrence-McMillan/dp/0735204659?tag=${AMAZON_ASSOCIATE_ID}`,
    coverColor: 'from-red-600 to-red-800',
    language: 'English'
  },
  {
    id: '6',
    title: 'A Random Walk Down Wall Street',
    author: 'Burton G. Malkiel',
    description: 'Time-tested guide to investment strategy and market analysis. Essential for understanding market efficiency.',
    category: 'Investment Strategy',
    rating: 5,
    amazonLink: `https://www.amazon.in/Random-Walk-Down-Wall-Street/dp/0393352242?tag=${AMAZON_ASSOCIATE_ID}`,
    coverColor: 'from-indigo-600 to-indigo-800',
    language: 'English'
  },
  {
    id: '7',
    title: 'Japanese Candlestick Charting Techniques',
    author: 'Steve Nison',
    description: 'The complete guide to candlestick patterns and their application in modern trading.',
    category: 'Technical Analysis',
    rating: 5,
    amazonLink: `https://www.amazon.in/Japanese-Candlestick-Charting-Techniques-Contemporary/dp/0735201811?tag=${AMAZON_ASSOCIATE_ID}`,
    coverColor: 'from-pink-600 to-pink-800',
    language: 'English'
  },
  {
    id: '8',
    title: 'The Little Book of Common Sense Investing',
    author: 'John C. Bogle',
    description: 'The only way to guarantee your fair share of stock market returns. A guide to index fund investing.',
    category: 'Investment Strategy',
    rating: 5,
    amazonLink: `https://www.amazon.in/Little-Book-Common-Sense-Investing/dp/1119404509?tag=${AMAZON_ASSOCIATE_ID}`,
    coverColor: 'from-teal-600 to-teal-800',
    language: 'English'
  },
  {
    id: '9',
    title: 'Reminiscences of a Stock Operator',
    author: 'Edwin Lefèvre',
    description: 'Classic memoir of legendary trader Jesse Livermore. Timeless lessons on speculation and market psychology.',
    category: 'Trading Psychology',
    rating: 5,
    amazonLink: `https://www.amazon.in/Reminiscences-Stock-Operator-Edwin-Lef%C3%A8vre/dp/0471770884?tag=${AMAZON_ASSOCIATE_ID}`,
    coverColor: 'from-yellow-600 to-yellow-800',
    language: 'English'
  },
  {
    id: '10',
    title: 'The Essays of Warren Buffett',
    author: 'Warren E. Buffett',
    description: 'Lessons for corporate America from the world\'s greatest investor. Essential wisdom on business and investing.',
    category: 'Fundamental Analysis',
    rating: 5,
    amazonLink: `https://www.amazon.in/Essays-Warren-Buffett-Lessons-Corporate/dp/1611637589?tag=${AMAZON_ASSOCIATE_ID}`,
    coverColor: 'from-cyan-600 to-cyan-800',
    language: 'English'
  },
  {
    id: '11',
    title: 'How to Make Money in Stocks',
    author: 'William J. O\'Neil',
    description: 'The CAN SLIM methodology for stock selection. A proven system for successful investing.',
    category: 'Investment Strategy',
    rating: 5,
    amazonLink: `https://www.amazon.in/How-Make-Money-Stocks-Winning/dp/0071614133?tag=${AMAZON_ASSOCIATE_ID}`,
    coverColor: 'from-lime-600 to-lime-800',
    language: 'English'
  },
  {
    id: '12',
    title: 'One Up On Wall Street',
    author: 'Peter Lynch',
    description: 'How to use what you already know to make money in the market. Practical investing wisdom.',
    category: 'Fundamental Analysis',
    rating: 5,
    amazonLink: `https://www.amazon.in/One-Up-Wall-Street-Already/dp/0743200403?tag=${AMAZON_ASSOCIATE_ID}`,
    coverColor: 'from-violet-600 to-violet-800',
    language: 'English'
  },
  // Hindi Books
  {
    id: '13',
    title: 'Share Market Guide (Hindi)',
    author: 'Jitendra Gala',
    description: 'शेयर बाजार की पूरी जानकारी हिंदी में। शुरुआती से लेकर एडवांस ट्रेडिंग तक की संपूर्ण गाइड।',
    category: 'Investment Strategy',
    rating: 5,
    amazonLink: `https://www.amazon.in/Share-Market-Guide-Hindi-Jitendra/dp/9350578395?tag=${AMAZON_ASSOCIATE_ID}`,
    coverColor: 'from-orange-600 to-red-700',
    language: 'Hindi'
  },
  {
    id: '14',
    title: 'Intraday Trading Ki Pehchan (Hindi)',
    author: 'Anhad Singh',
    description: 'इंट्राडे ट्रेडिंग के सभी पहलुओं को समझें। तकनीकी विश्लेषण और इंट्राडे रणनीतियों की गहन जानकारी।',
    category: 'Technical Analysis',
    rating: 5,
    amazonLink: `https://www.amazon.in/Intraday-Trading-Pehchan-Hindi-Anhad/dp/9352666623?tag=${AMAZON_ASSOCIATE_ID}`,
    coverColor: 'from-green-600 to-emerald-700',
    language: 'Hindi'
  },
  {
    id: '15',
    title: 'Technical Analysis Aur Candlestick Ki Pehchan (Hindi)',
    author: 'Anhad Singh',
    description: 'कैंडलस्टिक पैटर्न और तकनीकी विश्लेषण की संपूर्ण हिंदी गाइड। चार्ट रीडिंग में महारत हासिल करें।',
    category: 'Technical Analysis',
    rating: 5,
    amazonLink: `https://www.amazon.in/Technical-Analysis-Candlestick-Pehchan-Hindi/dp/9352666615?tag=${AMAZON_ASSOCIATE_ID}`,
    coverColor: 'from-purple-600 to-pink-700',
    language: 'Hindi'
  },
  {
    id: '16',
    title: 'Rich Dad Poor Dad (Hindi)',
    author: 'Robert Kiyosaki',
    description: 'अमीर बाप गरीब बाप - वित्तीय शिक्षा की क्लासिक पुस्तक। पैसे के बारे में सोचने का तरीका बदलें।',
    category: 'Investment Strategy',
    rating: 5,
    amazonLink: `https://www.amazon.in/Rich-Dad-Poor-Hindi-Robert/dp/8183225063?tag=${AMAZON_ASSOCIATE_ID}`,
    coverColor: 'from-blue-600 to-indigo-700',
    language: 'Hindi'
  },
  {
    id: '17',
    title: 'Stock Market Mein Safalta Kaise Paayein (Hindi)',
    author: 'R.K. Gupta',
    description: 'शेयर बाजार में सफलता के सूत्र। मौलिक और तकनीकी विश्लेषण की व्यावहारिक जानकारी।',
    category: 'Fundamental Analysis',
    rating: 4,
    amazonLink: `https://www.amazon.in/Stock-Market-Safalta-Kaise-Paayein/dp/8173155933?tag=${AMAZON_ASSOCIATE_ID}`,
    coverColor: 'from-yellow-600 to-orange-700',
    language: 'Hindi'
  },
  {
    id: '18',
    title: 'Option Trading Kaise Karein (Hindi)',
    author: 'Sunil Gurjar',
    description: 'ऑप्शन ट्रेडिंग की संपूर्ण जानकारी हिंदी में। कॉल, पुट और ऑप्शन रणनीतियों की गहन समझ।',
    category: 'Options Trading',
    rating: 5,
    amazonLink: `https://www.amazon.in/Option-Trading-Kaise-Karein-Hindi/dp/9387925315?tag=${AMAZON_ASSOCIATE_ID}`,
    coverColor: 'from-red-600 to-rose-700',
    language: 'Hindi'
  },
  {
    id: '19',
    title: 'Mutual Funds Guide (Hindi)',
    author: 'Jigar Patel',
    description: 'म्यूचुअल फंड में निवेश की पूरी जानकारी। SIP, NAV और फंड चयन की व्यावहारिक गाइड।',
    category: 'Investment Strategy',
    rating: 5,
    amazonLink: `https://www.amazon.in/Mutual-Funds-Guide-Hindi-Jigar/dp/9387925307?tag=${AMAZON_ASSOCIATE_ID}`,
    coverColor: 'from-teal-600 to-cyan-700',
    language: 'Hindi'
  },
  {
    id: '20',
    title: 'Trading Psychology (Hindi)',
    author: 'Mahesh Kaushik',
    description: 'ट्रेडिंग में मनोविज्ञान की भूमिका। अनुशासन, धैर्य और भावनात्मक नियंत्रण पर हिंदी में गाइड।',
    category: 'Trading Psychology',
    rating: 4,
    amazonLink: `https://www.amazon.in/Trading-Psychology-Hindi-Mahesh-Kaushik/dp/9352666631?tag=${AMAZON_ASSOCIATE_ID}`,
    coverColor: 'from-indigo-600 to-purple-700',
    language: 'Hindi'
  },
  // Additional Options Trading Books - English
  {
    id: '21',
    title: 'Option Volatility and Pricing',
    author: 'Sheldon Natenberg',
    description: 'Advanced trading strategies and techniques for options traders. Master volatility, Greeks, and sophisticated option strategies.',
    category: 'Options Trading',
    rating: 5,
    amazonLink: `https://www.amazon.in/Option-Volatility-Pricing-Strategies-Techniques/dp/0071818774?tag=${AMAZON_ASSOCIATE_ID}`,
    coverColor: 'from-blue-600 to-cyan-800',
    language: 'English'
  },
  {
    id: '22',
    title: 'The Options Playbook',
    author: 'Brian Overby',
    description: 'Visual guide to 40+ option strategies. Perfect for beginners and experienced traders with clear illustrations.',
    category: 'Options Trading',
    rating: 5,
    amazonLink: `https://www.amazon.in/Options-Playbook-Brian-Overby/dp/0615212239?tag=${AMAZON_ASSOCIATE_ID}`,
    coverColor: 'from-purple-600 to-pink-800',
    language: 'English'
  },
  {
    id: '23',
    title: 'Trading Options Greeks',
    author: 'Dan Passarelli',
    description: 'How the risks and rewards of options trading can be managed using Delta, Gamma, Theta, Vega, and Rho.',
    category: 'Options Trading',
    rating: 5,
    amazonLink: `https://www.amazon.in/Trading-Options-Greeks-Risks-Rewards/dp/1576603164?tag=${AMAZON_ASSOCIATE_ID}`,
    coverColor: 'from-green-600 to-teal-800',
    language: 'English'
  },
  {
    id: '24',
    title: 'Option Trading Strategies in Indian Stock Market',
    author: 'Praveen Mohan',
    description: 'Comprehensive guide to options trading specifically for NSE & BSE. Indian market-focused strategies.',
    category: 'Options Trading',
    rating: 5,
    amazonLink: `https://www.amazon.in/Option-Trading-Strategies-Indian-Stock/dp/9352665821?tag=${AMAZON_ASSOCIATE_ID}`,
    coverColor: 'from-orange-600 to-amber-800',
    language: 'English'
  },
  {
    id: '25',
    title: 'Understanding Options',
    author: 'Michael Sincere',
    description: 'Simple, straightforward guide to options trading. Perfect for beginners wanting to understand calls, puts, and basic strategies.',
    category: 'Options Trading',
    rating: 4,
    amazonLink: `https://www.amazon.in/Understanding-Options-2E-Michael-Sincere/dp/0071817840?tag=${AMAZON_ASSOCIATE_ID}`,
    coverColor: 'from-red-600 to-orange-800',
    language: 'English'
  },
  {
    id: '26',
    title: 'The Complete Guide to Option Selling',
    author: 'James Cordier',
    description: 'Master the art of selling options for consistent income. Strategies for premium collection and risk management.',
    category: 'Options Trading',
    rating: 5,
    amazonLink: `https://www.amazon.in/Complete-Guide-Option-Selling/dp/0071745440?tag=${AMAZON_ASSOCIATE_ID}`,
    coverColor: 'from-indigo-600 to-blue-800',
    language: 'English'
  },
  // Additional Options Trading Books - Hindi
  {
    id: '27',
    title: 'Option Strategies in Hindi',
    author: 'Suresh Kumar',
    description: 'ऑप्शन ट्रेडिंग की सभी रणनीतियाँ हिंदी में। स्ट्रैडल, स्ट्रैंगल, स्प्रेड और अन्य एडवांस रणनीतियाँ।',
    category: 'Options Trading',
    rating: 5,
    amazonLink: `https://www.amazon.in/Option-Strategies-Hindi-Suresh-Kumar/dp/9387925323?tag=${AMAZON_ASSOCIATE_ID}`,
    coverColor: 'from-pink-600 to-rose-800',
    language: 'Hindi'
  },
  {
    id: '28',
    title: 'NSE Options Trading Guide (Hindi)',
    author: 'Rajesh Sharma',
    description: 'NSE में ऑप्शन ट्रेडिंग की संपूर्ण गाइड। Nifty और Bank Nifty ऑप्शन ट्रेडिंग के व्यावहारिक उदाहरण।',
    category: 'Options Trading',
    rating: 5,
    amazonLink: `https://www.amazon.in/NSE-Options-Trading-Guide-Hindi/dp/9352666607?tag=${AMAZON_ASSOCIATE_ID}`,
    coverColor: 'from-yellow-600 to-amber-800',
    language: 'Hindi'
  },
  {
    id: '29',
    title: 'Option Chain Analysis (Hindi)',
    author: 'Vikram Patel',
    description: 'ऑप्शन चेन को समझें और विश्लेषण करें। PCR, OI, Max Pain और Open Interest के उपयोग की पूरी जानकारी।',
    category: 'Options Trading',
    rating: 4,
    amazonLink: `https://www.amazon.in/Option-Chain-Analysis-Hindi-Vikram/dp/9387925331?tag=${AMAZON_ASSOCIATE_ID}`,
    coverColor: 'from-cyan-600 to-blue-800',
    language: 'Hindi'
  },
  {
    id: '30',
    title: 'Greeks Aur Option Pricing (Hindi)',
    author: 'Amit Verma',
    description: 'ऑप्शन ग्रीक्स की गहन समझ। Delta, Gamma, Theta, Vega को हिंदी में समझें और ट्रेडिंग में उपयोग करें।',
    category: 'Options Trading',
    rating: 5,
    amazonLink: `https://www.amazon.in/Greeks-Option-Pricing-Hindi-Amit/dp/9352666615?tag=${AMAZON_ASSOCIATE_ID}`,
    coverColor: 'from-violet-600 to-purple-800',
    language: 'Hindi'
  },
];

const categories = [
  { id: 'all', label: 'All Books', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'Technical Analysis', label: 'Technical Analysis', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'Fundamental Analysis', label: 'Fundamental Analysis', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 'Trading Psychology', label: 'Trading Psychology', icon: <Brain className="w-4 h-4" /> },
  { id: 'Options Trading', label: 'Options Trading', icon: <DollarSign className="w-4 h-4" /> },
  { id: 'Investment Strategy', label: 'Investment Strategy', icon: <Star className="w-4 h-4" /> },
];

export function BooksPageClient() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState<'all' | 'English' | 'Hindi'>('all');
  const router = useRouter();

  const filteredBooks = books.filter(book => {
    const categoryMatch = selectedCategory === 'all' || book.category === selectedCategory;
    const languageMatch = selectedLanguage === 'all' || book.language === selectedLanguage;
    return categoryMatch && languageMatch;
  });

  const handleSectionChange = (section: string, subSection?: string) => {
    if (section === 'books' && subSection) {
      router.push(`/books/${subSection}`);
      return;
    }
    
    const routes: { [key: string]: string } = {
      'home': '/',
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
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-16 px-4 overflow-hidden mt-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen className="w-12 h-12" />
              <h1 className="text-4xl md:text-5xl font-bold">Trading & Investment Books</h1>
            </div>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Curated collection of must-read books to accelerate your trading journey and investment success
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
            className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Star className="w-6 h-6" />
            <span>📚 Books Written by Me</span>
          </a>
        </div>

        {/* Language Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 flex items-center justify-center gap-2">
            <Languages className="w-4 h-4" />
            <span>Select Language / भाषा चुनें</span>
          </h3>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { id: 'all', label: 'All Languages / सभी', icon: <Languages className="w-4 h-4" /> },
              { id: 'English', label: 'English', icon: <Languages className="w-4 h-4" /> },
              { id: 'Hindi', label: 'हिंदी', icon: <Languages className="w-4 h-4" /> },
            ].map((lang) => (
              <motion.button
                key={lang.id}
                onClick={() => setSelectedLanguage(lang.id as 'all' | 'English' | 'Hindi')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all text-lg ${
                  selectedLanguage === lang.id
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg ring-2 ring-orange-300'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-md'
                }`}
              >
                {lang.icon}
                <span>{lang.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 text-center">Filter by Category</h3>
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-md'
                }`}
              >
                {category.icon}
                <span>{category.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Showing <span className="font-bold text-blue-600 dark:text-blue-400">{filteredBooks.length}</span> books
            {selectedLanguage !== 'all' && <span> in <span className="font-semibold">{selectedLanguage}</span></span>}
            {selectedCategory !== 'all' && <span> • <span className="font-semibold">{selectedCategory}</span></span>}
          </p>
        </div>

        {/* Books Grid */}
        <AnimatePresence mode="wait">
          {filteredBooks.length === 0 ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-16"
            >
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                No Books Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Try selecting different filters to see more books.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedLanguage('all');
                }}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Reset Filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={`${selectedCategory}-${selectedLanguage}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredBooks.map((book) => (
              <motion.div
                key={book.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -8 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden group"
              >
                {/* Book Cover */}
                <div className={`h-48 bg-gradient-to-br ${book.coverColor} p-6 flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                  <BookOpen className="w-20 h-20 text-white/90 relative z-10" />
                  <div className="absolute top-4 right-4 flex gap-1">
                    {[...Array(book.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>

                {/* Book Details */}
                <div className="p-6">
                  <div className="mb-2 flex gap-2 flex-wrap">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                      {book.category}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      book.language === 'Hindi' 
                        ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' 
                        : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                    }`}>
                      <Languages className="w-3 h-3" />
                      {book.language}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-medium">
                    by {book.author}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {book.description}
                  </p>
                  {book.amazonLink && (
                    <a
                      href={book.amazonLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
                    >
                      <span>View on Amazon</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Amazon Associates Disclosure */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 text-sm text-amber-800 dark:text-amber-300"
        >
          <p className="text-center">
            <strong>Disclosure:</strong> As an Amazon Associate, I earn from qualifying purchases. 
            This means if you click on a book link and make a purchase, I may receive a small commission at no extra cost to you. 
            This helps support the site and allows me to continue providing valuable trading content.
          </p>
        </motion.div>

        {/* Educational Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-600/20 dark:to-purple-600/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-8"
        >
          <div className="flex items-start gap-4">
            <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Why Read Trading & Investment Books?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Reading quality trading and investment books is one of the best investments you can make in your trading education. 
                These books provide timeless wisdom from legendary traders and investors, helping you avoid costly mistakes 
                and develop winning strategies.
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <Star className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Learn from the Masters:</strong> Gain insights from traders and investors who have proven track records</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Avoid Common Mistakes:</strong> Learn from others' experiences without losing your own capital</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Develop Discipline:</strong> Build the mental frameworks necessary for consistent trading success</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Continuous Learning:</strong> Markets evolve, and ongoing education keeps you ahead of the curve</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

