import { Metadata } from 'next';
import { PcrStormPageClient } from './PcrStormPageClient';

export const metadata: Metadata = {
  title: 'PCR Storm - Put-Call Ratio Analysis | TradeSmart Money',
  description: 'Advanced PCR (Put-Call Ratio) storm detection and analysis for identifying extreme market sentiment shifts and trading opportunities.',
  keywords: 'PCR storm, put call ratio, market sentiment, option analysis, PCR analysis, sentiment indicators, derivatives trading',
  openGraph: {
    title: 'PCR Storm - Put-Call Ratio Analysis',
    description: 'Advanced PCR storm detection and analysis for market sentiment',
    type: 'website',
  },
};

export default function PcrStormPage() {
  return <PcrStormPageClient />;
}
