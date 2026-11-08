import { Metadata } from 'next';
import { LiveScannerPageClient } from './LiveScannerPageClient';
import { StructuredData } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'Live Market Scanner | Day, Weekly, 52-Week Highs & Lows - TradeSmart Money',
  description: 'Live stock scanner tracking stocks at day high/low, weekly high/low, monthly high/low, 52-week high/low, and upper/lower circuit. F&O scope filter with auto-refreshing real-time data.',
  keywords: 'live market scanner, day high stocks, day low stocks, 52 week high, 52 week low, upper circuit stocks, lower circuit stocks, F&O scanner, live stock screener, intraday scanner',
  openGraph: {
    title: 'Live Market Scanner - TradeSmart Money',
    description: 'Real-time scanner for stocks at day/weekly/monthly/52-week highs and lows, plus circuit filters. Auto-refreshing with F&O scope.',
    url: 'https://www.tradesmartmoney.com/live-scanner',
    siteName: 'TradeSmart Money',
    type: 'website',
    images: [
      {
        url: '/og-live-scanner.jpg',
        width: 1200,
        height: 630,
        alt: 'TradeSmart Money Live Market Scanner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Live Market Scanner - TradeSmart Money',
    description: 'Real-time scanner for stocks at day/weekly/monthly/52-week highs and lows, plus circuit filters.',
  },
  alternates: {
    canonical: 'https://www.tradesmartmoney.com/live-scanner',
  },
};

export default function LiveScannerPage() {
  return (
    <>
      <StructuredData />
      <LiveScannerPageClient />
    </>
  );
}
