'use client';

import { BookReader } from '@/components/BookReader';

const chapters = [
  { id: 1, title: 'Introduction to Smart Money Concepts' },
  { id: 2, title: 'Market Structure and Price Action' },
  { id: 3, title: 'Order Flow and Institutional Footprints' },
  { id: 4, title: 'Smart Money Accumulation and Distribution' },
  { id: 5, title: 'Supply and Demand Zones' },
  { id: 6, title: 'Liquidity Hunts and Stop Runs' },
  { id: 7, title: 'Order Blocks and Breaker Blocks' },
  { id: 8, title: 'Fair Value Gaps (FVG) and Imbalances' },
  { id: 9, title: 'Smart Money Trading Strategies' },
  { id: 10, title: 'Multi-Timeframe Analysis' },
  { id: 11, title: 'Risk Management for Smart Money Trading' },
  { id: 12, title: 'Volume Profile and Market Profile' },
  { id: 13, title: 'Smart Money Indicators' },
  { id: 14, title: 'Psychology and Discipline' },
  { id: 15, title: 'Complete Trading Plan' },
];

export function SmartMoneyBookClient() {
  return (
    <BookReader
      bookTitle="Master Smart Money Trading"
      bookSubtitle="A Complete Guide to Institutional Trading Strategies"
      chapters={chapters}
      bookFile="smart-money-trading.md"
      coverGradient="from-green-600 via-emerald-600 to-teal-600"
    />
  );
}

