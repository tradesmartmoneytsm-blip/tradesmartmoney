import { Metadata } from 'next';
import { IntradayTradesPageClient } from './IntradayTradesPageClient';
import { StructuredData } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'Intraday Trading Signals | Day Trading & Momentum Scanner - TradeSmart Money',
  description: 'Advanced intraday trading signals with AI-powered momentum scanner, day trading opportunities, real-time alerts, options analysis, and professional-grade scalping strategies for active traders.',
  keywords: 'intraday trading, day trading, intraday signals, momentum scanner, scalping strategies, day trading signals, intraday momentum, options trading, intraday analysis, day trading strategies',
  openGraph: {
    title: 'Intraday Trading Signals - AI-Powered Day Trading Scanner',
    description: 'Advanced intraday trading with AI-powered momentum scanner and professional day trading signals. Perfect for active traders and scalpers.',
    url: 'https://www.tradesmartmoney.com/intraday-trades',
    siteName: 'TradeSmart Money',
    type: 'website',
    images: [
      {
        url: '/og-intraday-trading.jpg',
        width: 1200,
        height: 630,
        alt: 'TradeSmart Money Intraday Trading Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Intraday Trading Signals - TradeSmart Money',
    description: 'Advanced intraday trading with AI-powered momentum scanner and day trading signals.',
  },
  alternates: {
    canonical: 'https://www.tradesmartmoney.com/intraday-trades',
  },
};

export default function IntradayTradesPage() {
  return (
    <>
      <StructuredData />
      <IntradayTradesPageClient />
    </>
  );
} 