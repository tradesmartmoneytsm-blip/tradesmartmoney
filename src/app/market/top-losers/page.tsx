import { Metadata } from 'next';
import { TopLosersPageClient } from './TopLosersPageClient';

export const metadata: Metadata = {
  title: 'Top Losers Today | NSE BSE Biggest Declining Stocks - TradeSmart Money',
  description: 'Track today\'s top losing stocks on NSE and BSE. Real-time data of biggest declining stocks, percentage losses, oversold opportunities, and value picks.',
  keywords: 'top losers, biggest declining stocks, NSE losers, BSE losers, stock price decline, percentage losses, oversold stocks, value opportunities, contrarian picks, support levels',
  openGraph: {
    title: 'Top Losers Today - NSE BSE Biggest Declining Stocks',
    description: 'Track today\'s top losing stocks with real-time NSE and BSE data. Identify oversold opportunities and value picks.',
    url: 'https://www.tradesmartmoney.com/market/top-losers',
    siteName: 'TradeSmart Money',
    type: 'website',
    images: [
      {
        url: '/og-top-losers.jpg',
        width: 1200,
        height: 630,
        alt: 'TradeSmart Money Top Losers Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Top Losers Today - TradeSmart Money',
    description: 'Track today\'s top losing stocks with real-time NSE and BSE data.',
  },
  alternates: {
    canonical: 'https://www.tradesmartmoney.com/market/top-losers',
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

export default function TopLosersPage() {
  return <TopLosersPageClient />;
}
