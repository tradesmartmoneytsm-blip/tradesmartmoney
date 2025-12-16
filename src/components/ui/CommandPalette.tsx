'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { 
  Search, 
  TrendingUp, 
  BarChart3, 
  Newspaper, 
  Bot, 
  Home,
  X,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CommandItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  keywords: string[];
  action: () => void;
  category: string;
}

interface CommandPaletteProps {
  isScrolled?: boolean;
}

export function CommandPalette({ isScrolled = false }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const commandRef = useRef<HTMLDivElement>(null);

  const commands: CommandItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home className="w-4 h-4" />,
      keywords: ['home', 'dashboard', 'main'],
      action: () => router.push('/'),
      category: 'Navigation'
    },
    {
      id: 'market',
      label: 'Market Analysis',
      icon: <BarChart3 className="w-4 h-4" />,
      keywords: ['market', 'analysis', 'sector'],
      action: () => router.push('/market'),
      category: 'Market'
    },
    {
      id: 'swing',
      label: 'Swing Trades',
      icon: <TrendingUp className="w-4 h-4" />,
      keywords: ['swing', 'trades', 'positions'],
      action: () => router.push('/swing-trades'),
      category: 'Trading'
    },
    {
      id: 'news',
      label: 'Market News',
      icon: <Newspaper className="w-4 h-4" />,
      keywords: ['news', 'updates', 'articles'],
      action: () => router.push('/news'),
      category: 'News'
    },
    {
      id: 'algo',
      label: 'AI Trading',
      icon: <Bot className="w-4 h-4" />,
      keywords: ['ai', 'algo', 'algorithm', 'bot'],
      action: () => router.push('/algo-trading'),
      category: 'AI'
    },
  ];

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Close when clicking outside
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (commandRef.current && !commandRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    // Add a small delay to avoid immediate closure
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <>
      {/* Search Button Trigger */}
      <button
        onClick={() => setOpen(true)}
        className={`p-2 rounded-full transition-all ${
          isScrolled
            ? 'text-white dark:text-white bg-gradient-to-r from-blue-500/90 via-purple-500/90 to-indigo-500/90 dark:from-blue-600/90 dark:via-purple-600/90 dark:to-indigo-600/90 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-600 dark:hover:from-blue-500 dark:hover:via-purple-500 dark:hover:to-indigo-500 backdrop-blur-sm border border-blue-400/50 dark:border-blue-500/50 shadow-md hover:shadow-lg hover:scale-110'
            : 'text-white bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl hover:scale-110'
        }`}
        aria-label="Search"
        title="Search (Cmd+K)"
      >
        <Search className="w-5 h-5" />
      </button>

      <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.div
            ref={commandRef}
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed left-1/2 top-1/4 z-50 w-full max-w-2xl -translate-x-1/2"
            onClick={(e) => e.stopPropagation()}
          >
            <Command className="rounded-2xl border border-white/20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center border-b border-gray-200 dark:border-gray-700 px-4">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <Command.Input
                  placeholder="Type a command or search..."
                  className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <button
                  onClick={() => setOpen(false)}
                  className="ml-2 rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <Command.List className="max-h-[400px] overflow-y-auto p-2">
                <Command.Empty>No results found.</Command.Empty>
                {commands.map((item) => (
                  <Command.Item
                    key={item.id}
                    onSelect={() => {
                      item.action();
                      setOpen(false);
                    }}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 aria-selected:bg-blue-50 dark:aria-selected:bg-blue-900/20"
                  >
                    <div className="text-gray-500 dark:text-gray-400">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {item.category}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 opacity-50" />
                  </Command.Item>
                ))}
              </Command.List>
              <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-2 text-xs text-gray-500 flex items-center gap-2">
                <kbd className="rounded bg-gray-100 dark:bg-gray-800 px-2 py-1">⌘K</kbd>
                <span>to open</span>
                <span>•</span>
                <kbd className="rounded bg-gray-100 dark:bg-gray-800 px-2 py-1">Esc</kbd>
                <span>to close</span>
              </div>
            </Command>
          </motion.div>
        </>
      )}
      </AnimatePresence>
    </>
  );
}

