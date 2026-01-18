'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  TrendingUp, 
  BarChart3, 
  Newspaper,
  Bot,
  Home,
  BookOpen
} from 'lucide-react';
import { CommandPalette } from './CommandPalette';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" />, href: '/' },
  { id: 'market', label: 'Market', icon: <BarChart3 className="w-5 h-5" />, href: '/market' },
  { id: 'swing', label: 'Swing', icon: <TrendingUp className="w-5 h-5" />, href: '/swing-trades' },
  { id: 'news', label: 'News', icon: <Newspaper className="w-5 h-5" />, href: '/news' },
  { id: 'algo', label: 'AI Trading', icon: <Bot className="w-5 h-5" />, href: '/algo-trading' },
  { id: 'books', label: 'Books', icon: <BookOpen className="w-5 h-5" />, href: '/books' },
];

export function ModernNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Force reload for Books menu

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-gradient-to-r from-blue-50/95 via-purple-50/95 to-indigo-50/95 dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 backdrop-blur-xl shadow-lg border-b border-blue-200/50 dark:border-gray-700/50'
            : 'bg-gradient-to-r from-black/50 via-black/45 to-black/50 backdrop-blur-2xl shadow-2xl border-b border-white/30'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.a
              href="/"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 group"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center transition-shadow ${
                isScrolled
                  ? 'shadow-lg group-hover:shadow-xl'
                  : 'shadow-2xl group-hover:shadow-2xl ring-2 ring-white/40'
              }`}>
                <TrendingUp className="w-6 h-6 text-white drop-shadow-lg" />
              </div>
              <div className="hidden sm:block">
                <div className={`font-bold text-lg ${
                  isScrolled
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
                    : 'text-white font-extrabold drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]'
                }`}>
                  TradeSmartMoney
                </div>
                <div className={`text-xs ${
                  isScrolled
                    ? 'text-gray-500 dark:text-gray-400'
                    : 'text-white/90 font-semibold drop-shadow-[0_1px_5px_rgba(0,0,0,0.5)]'
                }`}>
                  Professional Trading
                </div>
              </div>
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => (
                <motion.a
                  key={item.id}
                  href={item.href}
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ y: 0, scale: 0.98 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    isScrolled
                      ? 'text-white dark:text-white bg-gradient-to-r from-blue-500/90 via-purple-500/90 to-indigo-500/90 dark:from-blue-600/90 dark:via-purple-600/90 dark:to-indigo-600/90 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-600 dark:hover:from-blue-500 dark:hover:via-purple-500 dark:hover:to-indigo-500 backdrop-blur-sm border border-blue-400/50 dark:border-blue-500/50 shadow-md hover:shadow-lg'
                      : 'text-white bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl hover:border-white/30'
                  }`}
                >
                  <div className={`rounded-full p-1 ${
                    isScrolled
                      ? 'bg-white/20 dark:bg-white/10'
                      : 'bg-white/20'
                  }`}>
                    {item.icon}
                  </div>
                  <span>{item.label}</span>
                </motion.a>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              <CommandPalette isScrolled={isScrolled} />
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`md:hidden p-2 rounded-lg transition-colors ${
                  isScrolled
                    ? 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    : 'hover:bg-white/30 text-white drop-shadow-lg'
                }`}
                aria-label="Menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl"
            >
              <div className="px-4 py-4 space-y-2">
                {navItems.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
      
      <CommandPalette />
    </>
  );
}

