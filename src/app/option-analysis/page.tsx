import { Metadata } from 'next';
import { OptionAnalysisPageClient } from './OptionAnalysisPageClient';

export const metadata: Metadata = {
  title: 'Option Chain Analysis - Live Institutional Flow Data | TradeSmart Money',
  description: 'Advanced option chain analysis with institutional flow data, PCR analysis, and smart money tracking. Real-time bullish and bearish setups for swing trading.',
  keywords: 'option chain analysis, institutional flow, PCR analysis, smart money, swing trading, bullish setups, bearish setups',
  openGraph: {
    title: 'Option Chain Analysis - Live Institutional Flow Data',
    description: 'Advanced option chain analysis with institutional flow data and smart money tracking',
    url: 'https://www.tradesmartmoney.com/option-analysis',
    siteName: 'TradeSmart Money',
    images: [
      {
        url: 'https://www.tradesmartmoney.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TradeSmart Money Option Analysis',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Option Chain Analysis - Live Institutional Flow Data',
    description: 'Advanced option chain analysis with institutional flow data and smart money tracking',
    images: ['https://www.tradesmartmoney.com/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://www.tradesmartmoney.com/option-analysis',
  },
};

export default function OptionAnalysisPage() {
  return <OptionAnalysisPageClient />;
}
