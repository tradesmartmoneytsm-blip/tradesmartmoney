import { Metadata } from 'next';
import { TradingGuideClient } from './TradingGuideClient';

export const metadata: Metadata = {
  title: 'Complete Trading Guide | Learn Stock Market Trading & Technical Analysis | TradeSmartMoney',
  description: 'Comprehensive trading guide covering stock market basics, technical analysis, trading strategies, risk management, and psychology. Learn trading fundamentals for educational purposes.',
  keywords: [
    'trading guide',
    'stock market trading',
    'technical analysis',
    'trading strategies',
    'risk management',
    'trading psychology',
    'day trading',
    'swing trading',
    'stock trading basics',
    'trading education',
    'market analysis',
    'trading tools',
    'position sizing',
    'stop loss',
    'trading indicators'
  ],
  openGraph: {
    title: 'Complete Trading Guide | Learn Stock Market Trading & Technical Analysis',
    description: 'Comprehensive trading guide covering stock market basics, technical analysis, trading strategies, risk management, and psychology.',
    url: 'https://www.tradesmartmoney.com/trading-guide',
    type: 'website',
    images: [
      {
        url: 'https://www.tradesmartmoney.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Complete Trading Guide - TradeSmartMoney',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Complete Trading Guide | Learn Stock Market Trading & Technical Analysis',
    description: 'Comprehensive trading guide covering stock market basics, technical analysis, trading strategies, risk management, and psychology.',
    images: ['https://www.tradesmartmoney.com/twitter-image.jpg'],
  },
  alternates: {
    canonical: 'https://www.tradesmartmoney.com/trading-guide',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TradingGuide() {
  return <TradingGuideClient />;
} 