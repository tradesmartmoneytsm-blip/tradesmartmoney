import { Metadata } from 'next';
import { FiftyTwoWeekHighPageClient } from './FiftyTwoWeekHighPageClient';

export const metadata: Metadata = {
  title: '52 Week High Stocks | NSE BSE Stocks Near All-Time High - TradeSmart Money',
  description: 'Track stocks trading near their 52-week high levels on NSE and BSE. Real-time data of momentum stocks, breakout candidates, and strength indicators.',
  keywords: '52 week high, all time high stocks, NSE 52 week high, BSE 52 week high, momentum stocks, breakout stocks, strength indicators, new highs, stock screener',
  openGraph: {
    title: '52 Week High Stocks - NSE BSE Stocks Near All-Time High',
    description: 'Track stocks trading near their 52-week high levels with real-time NSE and BSE data.',
    url: 'https://www.tradesmartmoney.com/market/52w-high',
    siteName: 'TradeSmart Money',
    type: 'website',
    images: [
      {
        url: '/og-52w-high.jpg',
        width: 1200,
        height: 630,
        alt: 'TradeSmart Money 52 Week High Stocks Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '52 Week High Stocks - TradeSmart Money',
    description: 'Track stocks trading near their 52-week high levels.',
  },
  alternates: {
    canonical: 'https://www.tradesmartmoney.com/market/52w-high',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function FiftyTwoWeekHighPage() {
  return <FiftyTwoWeekHighPageClient />;
}
