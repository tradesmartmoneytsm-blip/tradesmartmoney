import { Metadata } from 'next';
import { SwingTradesPageClient } from './SwingTradesPageClient';
import { StructuredData } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'Educational Swing Trading Study | Learn Multi-Day Analysis - TradeSmart Money',
  description: 'Educational platform for studying swing trading concepts, value analysis examples, and multi-day market patterns. Learn about position trading concepts for educational purposes only.',
  keywords: 'swing trading, swing trading strategies, value buying, position trading, multi-day trading, swing trade setups, momentum trading, breakout trading, swing trading signals, swing trade analysis',
  openGraph: {
    title: 'Educational Swing Trading Study - Learn Multi-Day Analysis',
    description: 'Educational platform for studying swing trading concepts, value analysis examples, and multi-day market patterns for educational purposes only.',
    url: 'https://www.tradesmartmoney.com/swing-trades',
    siteName: 'TradeSmart Money',
    type: 'website',
    images: [
      {
        url: '/og-swing-trading.jpg',
        width: 1200,
        height: 630,
        alt: 'TradeSmart Money Swing Trading Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Educational Swing Trading Study - TradeSmart Money',
    description: 'Educational platform for studying swing trading concepts and value analysis examples for educational purposes only.',
  },
  alternates: {
    canonical: 'https://www.tradesmartmoney.com/swing-trades',
  },
};

export default function SwingTradesPage() {
  return (
    <>
      <StructuredData />
      <SwingTradesPageClient />
    </>
  );
} 