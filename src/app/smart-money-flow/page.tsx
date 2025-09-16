import { Metadata } from 'next';
import { SmartMoneyFlowPageClient } from './SmartMoneyFlowPageClient';
import { StructuredData } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'Smart Money Flow | Track Institutional Options Activity - TradeSmart Money',
  description: 'Track smart money flow with real-time institutional options activity, most active stock calls, puts, and professional money movement analysis.',
  keywords: 'smart money flow, institutional trading, options flow, most active stock calls, professional money tracking, institutional activity',
      openGraph: {
      title: 'Smart Money Flow - Track Institutional Trading',
      description: 'Track smart money flow with real-time institutional options activity and professional money movement analysis.',
      url: 'https://www.tradesmartmoney.com/smart-money-flow',
      siteName: 'TradeSmart Money',
      type: 'website',
      images: [
        {
          url: '/og-smart-money-flow.jpg',
          width: 1200,
          height: 630,
          alt: 'TradeSmart Money Smart Money Flow Dashboard',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Smart Money Flow - TradeSmart Money',
      description: 'Track smart money flow and institutional options activity.',
    },
    alternates: {
      canonical: 'https://www.tradesmartmoney.com/smart-money-flow',
    },
};

export default function SmartMoneyFlowPage() {
  return (
    <>
      <StructuredData />
      <SmartMoneyFlowPageClient />
    </>
  );
} 