import { Metadata } from 'next';
import { EodScansPageClient } from './EodScansPageClient';
import { StructuredData } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'EOD Scans & Stock Screener | End of Day Analysis - TradeSmart Money',
  description: 'Professional EOD scans and stock screening with technical analysis, pattern recognition, breakout detection, and end-of-day market analysis for swing trading opportunities.',
  keywords: 'EOD scans, stock screener, end of day analysis, technical analysis, pattern recognition, breakout stocks, swing trading setups, stock scanner, market screening',
  openGraph: {
    title: 'EOD Scans & Stock Screener - End of Day Analysis',
    description: 'Professional EOD scans with technical analysis and pattern recognition. Perfect for identifying swing trading opportunities.',
    url: 'https://www.tradesmartmoney.com/eod-scans',
    siteName: 'TradeSmart Money',
    type: 'website',
    images: [
      {
        url: '/og-eod-scans.jpg',
        width: 1200,
        height: 630,
        alt: 'TradeSmart Money EOD Scans Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EOD Scans & Stock Screener - TradeSmart Money',
    description: 'Professional EOD scans with technical analysis and pattern recognition.',
  },
  alternates: {
    canonical: 'https://www.tradesmartmoney.com/eod-scans',
  },
};

export default function EodScansPage() {
  return (
    <>
      <StructuredData />
      <EodScansPageClient />
    </>
  );
} 