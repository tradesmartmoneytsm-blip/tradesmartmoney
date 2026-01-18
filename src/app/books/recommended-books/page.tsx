import { Metadata } from 'next';
import { BooksPageClient } from '../BooksPageClient';
import { StructuredData } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'Recommended Trading & Investment Books - TradeSmart Money',
  description: 'Curated collection of must-read books on stock market, technical analysis, fundamental analysis, options trading, and wealth building. Learn from market experts.',
  keywords: 'trading books, investment books, stock market books, technical analysis books, fundamental analysis books, options trading books, best trading books',
  openGraph: {
    title: 'Recommended Trading & Investment Books',
    description: 'Curated collection of must-read books to accelerate your trading success.',
    url: 'https://www.tradesmartmoney.com/books/recommended-books',
    siteName: 'TradeSmart Money',
    type: 'website',
    images: [
      {
        url: '/og-books.jpg',
        width: 1200,
        height: 630,
        alt: 'TradeSmart Money - Recommended Trading Books',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Recommended Trading Books - TradeSmart Money',
    description: 'Curated collection of must-read books for traders and investors.',
  },
  alternates: {
    canonical: 'https://www.tradesmartmoney.com/books/recommended-books',
  },
};

export default function RecommendedBooksPage() {
  return (
    <>
      <StructuredData />
      <BooksPageClient />
    </>
  );
}

