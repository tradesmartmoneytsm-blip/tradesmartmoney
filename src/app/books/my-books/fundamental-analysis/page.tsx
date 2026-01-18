import { Metadata } from 'next';
import { FundamentalAnalysisBookClient } from './FundamentalAnalysisBookClient';
import { StructuredData } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'Mastering Fundamental Analysis - Complete Guide | TradeSmart Money',
  description: 'A comprehensive 31-chapter guide to fundamental analysis covering financial statements, valuation frameworks, business quality assessment, risk analysis, and practical investment strategies.',
  keywords: 'fundamental analysis, stock valuation, financial statements, DCF, business quality, earnings quality, capital allocation, investment framework',
  openGraph: {
    title: 'Mastering Fundamental Analysis - Complete Guide',
    description: 'Learn in-depth stock evaluation with frameworks, checklists, and practical methods for assessing business quality and fair value.',
    url: 'https://www.tradesmartmoney.com/books/my-books/fundamental-analysis',
    siteName: 'TradeSmart Money',
    type: 'book',
    images: [
      {
        url: '/og-fundamental-analysis-book.jpg',
        width: 1200,
        height: 630,
        alt: 'Mastering Fundamental Analysis Book',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mastering Fundamental Analysis - TradeSmart Money',
    description: 'Complete guide to in-depth stock evaluation and valuation.',
  },
  alternates: {
    canonical: 'https://www.tradesmartmoney.com/books/my-books/fundamental-analysis',
  },
};

export default function FundamentalAnalysisBookPage() {
  return (
    <>
      <StructuredData />
      <FundamentalAnalysisBookClient />
    </>
  );
}

