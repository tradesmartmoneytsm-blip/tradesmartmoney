import { Metadata } from 'next';
import { BooksPageClient } from './BooksPageClient';
import { StructuredData } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'Trading & Investment Books | Learn from Market Experts - TradeSmart Money',
  description: 'Discover the best trading and investment books. Curated collection of must-read books on stock market, technical analysis, fundamental analysis, options trading, and wealth building.',
  keywords: 'trading books, investment books, stock market books, technical analysis books, fundamental analysis books, options trading books, financial education, best trading books, market psychology books',
  openGraph: {
    title: 'Trading & Investment Books - Expert Recommendations',
    description: 'Discover curated collection of best trading and investment books to accelerate your financial education and trading success.',
    url: 'https://www.tradesmartmoney.com/books',
    siteName: 'TradeSmart Money',
    type: 'website',
    images: [
      {
        url: '/og-books.jpg',
        width: 1200,
        height: 630,
        alt: 'TradeSmart Money - Trading & Investment Books',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trading & Investment Books - TradeSmart Money',
    description: 'Curated collection of must-read books for traders and investors.',
  },
  alternates: {
    canonical: 'https://www.tradesmartmoney.com/books',
  },
};

export default function BooksPage() {
  // Main books page shows recommended books by default
  return (
    <>
      <StructuredData />
      <BooksPageClient />
    </>
  );
}

