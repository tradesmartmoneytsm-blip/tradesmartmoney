import { Metadata } from 'next';
import { FiiDiiActivityPageClient } from './FiiDiiActivityPageClient';

export const metadata: Metadata = {
  title: 'FII DII Activity | Foreign Domestic Institutional Investment Flow - TradeSmart Money',
  description: 'Track real-time FII DII activity with foreign and domestic institutional investment flows. Monitor daily FII DII data, net investment, and market impact analysis.',
  keywords: 'FII DII activity, foreign institutional investors, domestic institutional investors, FII data, DII data, institutional investment, FII DII flow, market impact, investment trends, NSE FII DII',
  openGraph: {
    title: 'FII DII Activity - Foreign Domestic Institutional Investment Flow',
    description: 'Track real-time FII DII activity with foreign and domestic institutional investment flows and market impact analysis.',
    url: 'https://www.tradesmartmoney.com/market/fii-dii-activity',
    siteName: 'TradeSmart Money',
    type: 'website',
    images: [
      {
        url: '/og-fii-dii-activity.jpg',
        width: 1200,
        height: 630,
        alt: 'TradeSmart Money FII DII Activity Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FII DII Activity - TradeSmart Money',
    description: 'Track real-time FII DII activity and institutional investment flows.',
  },
  alternates: {
    canonical: 'https://www.tradesmartmoney.com/market/fii-dii-activity',
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

export default function FiiDiiActivityPage() {
  return <FiiDiiActivityPageClient />;
}
