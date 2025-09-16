import { Metadata } from 'next';

import { MarketPageClient } from './MarketPageClient';
import { StructuredData } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'Live Market Analysis | Real-time Indian Stock Market Data - TradeSmart Money',
  description: 'Professional market analysis with real-time NSE/BSE data, sector performance, FII/DII activity, market indices, top gainers/losers, 52-week high/low stocks, and institutional flow tracking.',
  keywords: 'market analysis, NSE BSE data, sector performance, FII DII data, market indices, stock market analysis, Indian stock market, real-time market data, institutional flow, market trends, top gainers losers, 52 week high low',
  openGraph: {
    title: 'Live Market Analysis - Real-time Indian Stock Market Data',
    description: 'Professional market analysis with real-time NSE/BSE data, sector performance, and institutional flow tracking. Get market insights used by professional traders.',
    url: 'https://www.tradesmartmoney.com/market',
    siteName: 'TradeSmart Money',
    type: 'website',
    images: [
      {
        url: '/og-market-analysis.jpg',
        width: 1200,
        height: 630,
        alt: 'TradeSmart Money Market Analysis Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Live Market Analysis - TradeSmart Money',
    description: 'Professional market analysis with real-time NSE/BSE data and institutional flow tracking.',
  },
  alternates: {
    canonical: 'https://www.tradesmartmoney.com/market',
  },
};

export default function MarketPage() {
  return (
    <>
      <StructuredData />
      <MarketPageClient />
    </>
  );
} 