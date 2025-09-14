import { Metadata } from 'next';
import { SwingTradesPageClient } from './SwingTradesPageClient';
import { StructuredData } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'Swing Trading Strategies | Value Buying & Multi-Day Trades - TradeSmart Money',
  description: 'Professional swing trading strategies with value buying opportunities, multi-day momentum trades, risk management, and institutional-grade analysis. Perfect for position traders and long-term investors.',
  keywords: 'swing trading, swing trading strategies, value buying, position trading, multi-day trading, swing trade setups, momentum trading, breakout trading, swing trading signals, swing trade analysis',
  openGraph: {
    title: 'Swing Trading Strategies - Value Buying & Multi-Day Trades',
    description: 'Master swing trading with professional strategies, value buying opportunities, and institutional-grade analysis. Perfect for multi-day momentum trades.',
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
    title: 'Swing Trading Strategies - TradeSmart Money',
    description: 'Master swing trading with professional strategies and value buying opportunities.',
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