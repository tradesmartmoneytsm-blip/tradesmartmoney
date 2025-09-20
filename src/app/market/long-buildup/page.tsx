import { Metadata } from 'next';
import { LongBuildupPageClient } from './LongBuildupPageClient';

export const metadata: Metadata = {
  title: 'Long Buildup Stocks | Options Long Position Analysis - TradeSmart Money',
  description: 'Track stocks with long buildup in options market. Real-time analysis of increasing long positions, bullish sentiment, and institutional accumulation patterns.',
  keywords: 'long buildup, options long positions, bullish stocks, institutional accumulation, options analysis, long unwinding, futures long buildup, position analysis, bullish sentiment',
  openGraph: {
    title: 'Long Buildup Stocks - Options Long Position Analysis',
    description: 'Track stocks with long buildup in options market and analyze bullish institutional sentiment.',
    url: 'https://www.tradesmartmoney.com/market/long-buildup',
    siteName: 'TradeSmart Money',
    type: 'website',
    images: [
      {
        url: '/og-long-buildup.jpg',
        width: 1200,
        height: 630,
        alt: 'TradeSmart Money Long Buildup Analysis Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Long Buildup Stocks - TradeSmart Money',
    description: 'Track stocks with long buildup in options market.',
  },
  alternates: {
    canonical: 'https://www.tradesmartmoney.com/market/long-buildup',
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

export default function LongBuildupPage() {
  return <LongBuildupPageClient />;
}
