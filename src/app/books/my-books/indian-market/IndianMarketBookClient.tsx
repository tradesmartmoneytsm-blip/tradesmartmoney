'use client';

import { BookReader } from '@/components/BookReader';

const chapters = [
  { id: 1, title: 'Understanding the Indian Stock Market Ecosystem' },
  { id: 2, title: 'NIFTY and SENSEX Analysis' },
  { id: 3, title: 'FII and DII Data Analysis' },
  { id: 4, title: 'Sector Rotation and Analysis' },
  { id: 5, title: 'Stock Selection Framework' },
  { id: 6, title: 'NSE Futures and Options Trading' },
  { id: 7, title: 'Intraday Trading Strategies' },
  { id: 8, title: 'Swing Trading in Indian Markets' },
  { id: 9, title: 'Chart Patterns Specific to Indian Markets' },
  { id: 10, title: 'Risk Management for Indian Markets' },
  { id: 11, title: 'Developing Your Trading Edge' },
  { id: 12, title: 'Advanced NSE/BSE Techniques' },
  { id: 13, title: 'Building a Winning Mindset' },
  { id: 14, title: 'Tools and Platforms' },
  { id: 15, title: 'Case Studies and Practical Examples' },
];

export function IndianMarketBookClient() {
  return (
    <BookReader
      bookTitle="Indian Stock Market Mastery"
      bookSubtitle="NSE & BSE Trading Strategies for Consistent Profits"
      chapters={chapters}
      bookFile="indian-stock-market-mastery.md"
      coverGradient="from-purple-600 via-violet-600 to-indigo-600"
    />
  );
}

