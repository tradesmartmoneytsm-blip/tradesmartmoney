import { Metadata } from 'next';
import { TopGainersPageClient } from './TopGainersPageClient';

export const metadata: Metadata = {
  title: 'Top Gainers Today | NSE BSE Highest Gaining Stocks - TradeSmart Money',
  description: 'Track today\'s top gaining stocks on NSE and BSE. Real-time data of highest price appreciation stocks, percentage gains, volume analysis, and trading opportunities.',
  keywords: 'top gainers, highest gaining stocks, NSE gainers, BSE gainers, stock price appreciation, percentage gains, volume gainers, momentum stocks, breakout stocks, trading opportunities',
  openGraph: {
    title: 'Top Gainers Today - NSE BSE Highest Gaining Stocks',
    description: 'Track today\'s top gaining stocks with real-time NSE and BSE data. Monitor highest price appreciation and trading opportunities.',
    url: 'https://www.tradesmartmoney.com/market/top-gainers',
    siteName: 'TradeSmart Money',
    type: 'website',
    images: [
      {
        url: '/og-top-gainers.jpg',
        width: 1200,
        height: 630,
        alt: 'TradeSmart Money Top Gainers Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Top Gainers Today - TradeSmart Money',
    description: 'Track today\'s top gaining stocks with real-time NSE and BSE data.',
  },
  alternates: {
    canonical: 'https://www.tradesmartmoney.com/market/top-gainers',
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

export default function TopGainersPage() {
  return <TopGainersPageClient />;
}
