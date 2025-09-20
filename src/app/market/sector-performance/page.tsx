import { Metadata } from 'next';
import { SectorPerformancePageClient } from './SectorPerformancePageClient';

export const metadata: Metadata = {
  title: 'Sector Performance Analysis | Real-time NSE BSE Sector Data - TradeSmart Money',
  description: 'Track real-time sector performance analysis with live NSE and BSE sector indices. Monitor banking, IT, pharma, auto, FMCG sector movements and make informed investment decisions.',
  keywords: 'sector performance, NSE sectors, BSE sectors, banking sector, IT sector, pharma sector, auto sector, FMCG sector, sector analysis, sector rotation, sector indices, real-time sector data',
  openGraph: {
    title: 'Sector Performance Analysis - Real-time NSE BSE Sector Data',
    description: 'Track real-time sector performance with live NSE and BSE sector indices. Monitor banking, IT, pharma, auto sectors for informed investment decisions.',
    url: 'https://www.tradesmartmoney.com/market/sector-performance',
    siteName: 'TradeSmart Money',
    type: 'website',
    images: [
      {
        url: '/og-sector-performance.jpg',
        width: 1200,
        height: 630,
        alt: 'TradeSmart Money Sector Performance Analysis Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sector Performance Analysis - TradeSmart Money',
    description: 'Track real-time sector performance with live NSE and BSE sector indices.',
  },
  alternates: {
    canonical: 'https://www.tradesmartmoney.com/market/sector-performance',
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

export default function SectorPerformancePage() {
  return <SectorPerformancePageClient />;
}
