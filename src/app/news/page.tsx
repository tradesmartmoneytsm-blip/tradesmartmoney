import { Metadata } from 'next';
import { NewsPageClient } from './NewsPageClient';
import { StructuredData } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'Market News & Analysis | Latest Stock Market Updates - TradeSmart Money',
  description: 'Stay updated with latest stock market news, market analysis, earnings reports, sector updates, IPO news, and financial market developments from India and global markets.',
  keywords: 'stock market news, market analysis, earnings reports, IPO news, sector updates, financial news, NSE BSE news, market updates, trading news, investment news',
  openGraph: {
    title: 'Market News & Analysis - Latest Stock Market Updates',
    description: 'Stay updated with latest stock market news, earnings reports, and financial market developments. Real-time market analysis and insights.',
    url: 'https://www.tradesmartmoney.com/news',
    siteName: 'TradeSmart Money',
    type: 'website',
    images: [
      {
        url: '/og-market-news.jpg',
        width: 1200,
        height: 630,
        alt: 'TradeSmart Money Market News Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Market News & Analysis - TradeSmart Money',
    description: 'Stay updated with latest stock market news and financial market developments.',
  },
  alternates: {
    canonical: 'https://www.tradesmartmoney.com/news',
  },
};

export default function NewsPage() {
  return (
    <>
      <StructuredData />
      <NewsPageClient />
    </>
  );
} 