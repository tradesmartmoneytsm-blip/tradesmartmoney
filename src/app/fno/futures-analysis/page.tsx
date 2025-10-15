import { Metadata } from 'next';
import { FuturesAnalysisPageClient } from './FuturesAnalysisPageClient';

export const metadata: Metadata = {
  title: 'Futures Analysis - OI Buildup & Market Analysis | TradeSmart Money',
  description: 'Comprehensive futures market analysis with OI buildup patterns, rollover insights, and basis analysis for informed trading decisions.',
  keywords: 'futures analysis, OI buildup, open interest, rollover analysis, basis analysis, futures trading, derivatives market',
  openGraph: {
    title: 'Futures Analysis - OI Buildup & Market Analysis',
    description: 'Comprehensive futures market analysis with OI buildup patterns',
    type: 'website',
  },
};

export default function FuturesAnalysisPage() {
  return <FuturesAnalysisPageClient />;
}
