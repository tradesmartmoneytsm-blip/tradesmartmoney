import { Metadata } from 'next';
import { MarketSentimentPageClient } from './MarketSentimentPageClient';

export const metadata: Metadata = {
  title: 'Indian Market Sentiment Analysis | TradeSmartMoney',
  description: 'Real-time AI-powered sentiment analysis of Indian stock market. Track Nifty trends, VIX levels, FII/DII activity, and sector performance with confidence scores.',
  keywords: [
    'indian market sentiment',
    'nse sentiment analysis', 
    'stock market sentiment',
    'nifty sentiment',
    'vix analysis',
    'fii dii sentiment',
    'market mood',
    'bullish bearish analysis',
    'indian stock market analysis',
    'market confidence score',
    'sector sentiment',
    'market indicators india'
  ],
  openGraph: {
    title: 'Indian Market Sentiment Analysis | TradeSmartMoney',
    description: 'Real-time AI-powered sentiment analysis of Indian stock market with confidence scores and detailed indicators.',
    type: 'website',
    url: 'https://www.tradesmartmoney.com/market/market-sentiment',
    siteName: 'TradeSmartMoney',
    images: [
      {
        url: 'https://www.tradesmartmoney.com/og-market-sentiment.jpg',
        width: 1200,
        height: 630,
        alt: 'Indian Market Sentiment Analysis'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Indian Market Sentiment Analysis | TradeSmartMoney',
    description: 'Real-time AI-powered sentiment analysis of Indian stock market with confidence scores.',
    images: ['https://www.tradesmartmoney.com/og-market-sentiment.jpg']
  },
  alternates: {
    canonical: 'https://www.tradesmartmoney.com/market/market-sentiment'
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
  }
};

export default function MarketSentimentPage() {
  return <MarketSentimentPageClient />;
}
