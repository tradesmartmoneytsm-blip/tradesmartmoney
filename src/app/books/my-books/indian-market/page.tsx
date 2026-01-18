import { Metadata } from 'next';
import { IndianMarketBookClient } from './IndianMarketBookClient';
import { StructuredData } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'Indian Stock Market Mastery - Complete Guide | TradeSmart Money',
  description: 'A comprehensive 15-chapter guide to NSE & BSE trading covering market mechanics, FII/DII analysis, sector rotation, F&O strategies, and proven trading techniques for Indian markets.',
  keywords: 'indian stock market, NSE trading, BSE trading, nifty trading, bank nifty, FII DII data, sector rotation, F&O trading, intraday trading india, swing trading india',
  openGraph: {
    title: 'Indian Stock Market Mastery - Complete Guide',
    description: 'Master NSE & BSE trading with proven strategies for consistent profits in Indian markets.',
    url: 'https://www.tradesmartmoney.com/books/my-books/indian-market',
    siteName: 'TradeSmart Money',
    type: 'book',
    images: [
      {
        url: '/og-indian-market-book.jpg',
        width: 1200,
        height: 630,
        alt: 'Indian Stock Market Mastery Book',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Indian Stock Market Mastery - TradeSmart Money',
    description: 'Complete guide to NSE & BSE trading strategies.',
  },
  alternates: {
    canonical: 'https://www.tradesmartmoney.com/books/my-books/indian-market',
  },
};

export default function IndianMarketBookPage() {
  return (
    <>
      <StructuredData />
      <IndianMarketBookClient />
    </>
  );
}

