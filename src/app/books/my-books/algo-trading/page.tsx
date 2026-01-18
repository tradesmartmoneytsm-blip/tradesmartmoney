import { Metadata } from 'next';
import { AlgoTradingBookClient } from './AlgoTradingBookClient';
import { StructuredData } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'Algorithmic Trading for Beginners - Complete Guide | TradeSmart Money',
  description: 'A comprehensive 12-chapter guide to algorithmic trading covering Python programming, strategy development, backtesting, broker APIs, and building your first trading bot.',
  keywords: 'algorithmic trading, algo trading, trading bot, python trading, automated trading, backtesting, quantitative trading, trading algorithms, API trading',
  openGraph: {
    title: 'Algorithmic Trading for Beginners - Complete Guide',
    description: 'Build your first trading bot with this step-by-step guide to algorithmic trading.',
    url: 'https://www.tradesmartmoney.com/books/my-books/algo-trading',
    siteName: 'TradeSmart Money',
    type: 'book',
    images: [
      {
        url: '/og-algo-trading-book.jpg',
        width: 1200,
        height: 630,
        alt: 'Algorithmic Trading for Beginners Book',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Algorithmic Trading for Beginners - TradeSmart Money',
    description: 'Complete guide to building trading bots.',
  },
  alternates: {
    canonical: 'https://www.tradesmartmoney.com/books/my-books/algo-trading',
  },
};

export default function AlgoTradingBookPage() {
  return (
    <>
      <StructuredData />
      <AlgoTradingBookClient />
    </>
  );
}

