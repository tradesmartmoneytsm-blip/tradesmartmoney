import { Metadata } from 'next';
import { FiftyTwoWeekLowPageClient } from './FiftyTwoWeekLowPageClient';

export const metadata: Metadata = {
  title: '52 Week Low Stocks | NSE BSE Oversold Value Opportunities - TradeSmart Money',
  description: 'Track stocks trading near their 52-week low levels on NSE and BSE. Real-time data of oversold stocks, value opportunities, and potential turnaround candidates.',
  keywords: '52 week low, oversold stocks, NSE 52 week low, BSE 52 week low, value opportunities, turnaround stocks, contrarian picks, support levels, stock screener',
  openGraph: {
    title: '52 Week Low Stocks - NSE BSE Oversold Value Opportunities',
    description: 'Track stocks trading near their 52-week low levels and identify value opportunities.',
    url: 'https://www.tradesmartmoney.com/market/52w-low',
    siteName: 'TradeSmart Money',
    type: 'website',
    images: [
      {
        url: '/og-52w-low.jpg',
        width: 1200,
        height: 630,
        alt: 'TradeSmart Money 52 Week Low Stocks Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '52 Week Low Stocks - TradeSmart Money',
    description: 'Track stocks trading near their 52-week low levels.',
  },
  alternates: {
    canonical: 'https://www.tradesmartmoney.com/market/52w-low',
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

export default function FiftyTwoWeekLowPage() {
  return <FiftyTwoWeekLowPageClient />;
}
