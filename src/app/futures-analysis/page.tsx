import { Metadata } from 'next';
import { FuturesAnalysisPageClient } from './FuturesAnalysisPageClient';

export const metadata: Metadata = {
  title: 'Futures Analysis - Live OI Buildup & Basis Analysis | TradeSmart Money',
  description: 'Advanced futures analysis with Open Interest buildup patterns, basis analysis, and rollover intelligence. Real-time bullish and bearish futures setups.',
  keywords: 'futures analysis, open interest, OI buildup, basis analysis, rollover, contango, backwardation, futures trading',
  openGraph: {
    title: 'Futures Analysis - Live OI Buildup & Basis Analysis',
    description: 'Advanced futures analysis with Open Interest patterns and basis intelligence',
    url: 'https://www.tradesmartmoney.com/futures-analysis',
    siteName: 'TradeSmart Money',
    images: [
      {
        url: 'https://www.tradesmartmoney.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TradeSmart Money Futures Analysis',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Futures Analysis - Live OI Buildup & Basis Analysis',
    description: 'Advanced futures analysis with Open Interest patterns and basis intelligence',
    images: ['https://www.tradesmartmoney.com/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://www.tradesmartmoney.com/futures-analysis',
  },
};

export default function FuturesAnalysisPage() {
  return <FuturesAnalysisPageClient />;
}
