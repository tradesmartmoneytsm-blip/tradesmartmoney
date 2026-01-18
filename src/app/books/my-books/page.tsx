import { Metadata } from 'next';
import { MyBooksPageClient } from './MyBooksPageClient';
import { StructuredData } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'Books Written by Me | Trading & Investment Books - TradeSmart Money',
  description: 'Explore books authored by TradeSmart Money team. Learn trading strategies, market analysis, and wealth-building techniques from our published works.',
  keywords: 'trading books, investment books, stock market books, technical analysis books, authored books, trading strategies book, market analysis book',
  openGraph: {
    title: 'Books Written by Me - TradeSmart Money',
    description: 'Explore books authored by TradeSmart Money team on trading strategies and market analysis.',
    url: 'https://www.tradesmartmoney.com/books/my-books',
    siteName: 'TradeSmart Money',
    type: 'website',
    images: [
      {
        url: '/og-my-books.jpg',
        width: 1200,
        height: 630,
        alt: 'TradeSmart Money - My Books',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Books Written by Me - TradeSmart Money',
    description: 'Explore books authored by TradeSmart Money team.',
  },
  alternates: {
    canonical: 'https://www.tradesmartmoney.com/books/my-books',
  },
};

export default function MyBooksPage() {
  return (
    <>
      <StructuredData />
      <MyBooksPageClient />
    </>
  );
}

