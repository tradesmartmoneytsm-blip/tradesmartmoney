import { Metadata } from 'next';
import { SmartMoneyBookClient } from './SmartMoneyBookClient';
import { StructuredData } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'Master Smart Money Trading - Complete Guide | TradeSmart Money',
  description: 'A comprehensive 15-chapter guide to smart money trading covering institutional strategies, order flow analysis, market structure, liquidity hunts, and professional trading techniques.',
  keywords: 'smart money trading, institutional trading, order flow, market structure, liquidity, supply demand zones, wyckoff, smart money concepts, professional trading',
  openGraph: {
    title: 'Master Smart Money Trading - Complete Guide',
    description: 'Learn to trade like institutions with this comprehensive guide to smart money concepts and strategies.',
    url: 'https://www.tradesmartmoney.com/books/my-books/smart-money-trading',
    siteName: 'TradeSmart Money',
    type: 'book',
    images: [
      {
        url: '/og-smart-money-book.jpg',
        width: 1200,
        height: 630,
        alt: 'Master Smart Money Trading Book',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Master Smart Money Trading - TradeSmart Money',
    description: 'Complete guide to institutional trading strategies.',
  },
  alternates: {
    canonical: 'https://www.tradesmartmoney.com/books/my-books/smart-money-trading',
  },
};

export default function SmartMoneyBookPage() {
  return (
    <>
      <StructuredData />
      <SmartMoneyBookClient />
    </>
  );
}

