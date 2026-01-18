'use client';

import { BookReader } from '@/components/BookReader';

const chapters = [
  { id: 1, title: 'Introduction to Algorithmic Trading' },
  { id: 2, title: 'Python Basics for Traders' },
  { id: 3, title: 'Getting Market Data' },
  { id: 4, title: 'Building Your First Strategy' },
  { id: 5, title: 'Backtesting Your Strategy' },
  { id: 6, title: 'Technical Indicators in Code' },
  { id: 7, title: 'Building a Complete Trading Bot' },
  { id: 8, title: 'Risk Management in Algo Trading' },
  { id: 9, title: 'Connecting to Broker APIs' },
  { id: 10, title: 'Paper Trading and Testing' },
  { id: 11, title: 'Advanced Strategies' },
  { id: 12, title: 'Deployment and Monitoring' },
];

export function AlgoTradingBookClient() {
  return (
    <BookReader
      bookTitle="Algorithmic Trading for Beginners"
      bookSubtitle="Build Your First Trading Bot"
      chapters={chapters}
      bookFile="algo-trading-beginners.md"
      coverGradient="from-orange-600 via-red-600 to-pink-600"
    />
  );
}

