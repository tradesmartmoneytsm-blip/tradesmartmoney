import { Metadata } from 'next';
import { ShortBuildupPageClient } from './ShortBuildupPageClient';

export const metadata: Metadata = {
  title: 'Short Buildup Stocks | Options Short Position Analysis - TradeSmart Money',
  description: 'Track stocks with short buildup in options market. Real-time analysis of increasing short positions, bearish sentiment, and potential shorting opportunities.',
  keywords: 'short buildup, options short positions, bearish stocks, short selling, options analysis, short unwinding, futures short buildup, position analysis, bearish sentiment',
  openGraph: {
    title: 'Short Buildup Stocks - Options Short Position Analysis',
    description: 'Track stocks with short buildup in options market and analyze bearish institutional sentiment.',
    url: 'https://www.tradesmartmoney.com/market/short-buildup',
    siteName: 'TradeSmart Money',
    type: 'website',
    images: [
      {
        url: '/og-short-buildup.jpg',
        width: 1200,
        height: 630,
        alt: 'TradeSmart Money Short Buildup Analysis Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Short Buildup Stocks - TradeSmart Money',
    description: 'Track stocks with short buildup in options market.',
  },
  alternates: {
    canonical: 'https://www.tradesmartmoney.com/market/short-buildup',
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

export default function ShortBuildupPage() {
  return <ShortBuildupPageClient />;
}
