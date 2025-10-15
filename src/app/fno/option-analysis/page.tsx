import { Metadata } from 'next';
import { OptionAnalysisPageClient } from './OptionAnalysisPageClient';

export const metadata: Metadata = {
  title: 'Option Analysis - Advanced Option Chain Analysis | TradeSmart Money',
  description: 'Advanced option chain analysis with institutional flow tracking, PCR analysis, and smart money detection for better trading decisions.',
  keywords: 'option analysis, option chain, institutional flow, PCR analysis, smart money, derivatives trading, option strategies',
  openGraph: {
    title: 'Option Analysis - Advanced Option Chain Analysis',
    description: 'Advanced option chain analysis with institutional flow tracking',
    type: 'website',
  },
};

export default function OptionAnalysisPage() {
  return <OptionAnalysisPageClient />;
}
