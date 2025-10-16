import { Metadata } from 'next';
import { BottomFormationPageClient } from './BottomFormationPageClient';

export const metadata: Metadata = {
  title: 'Bottom Formation Strategy - Reversal Pattern Analysis | TradeSmart Money',
  description: 'Advanced Bottom Formation strategy with reversal pattern analysis, support level identification, and swing trading opportunities.',
  keywords: 'bottom formation strategy, reversal patterns, support levels, swing trading, technical analysis',
  openGraph: {
    title: 'Bottom Formation Strategy - Reversal Pattern Analysis',
    description: 'Advanced Bottom Formation strategy with reversal pattern analysis',
    type: 'website',
  },
};

export default function BottomFormationPage() {
  return <BottomFormationPageClient />;
}
