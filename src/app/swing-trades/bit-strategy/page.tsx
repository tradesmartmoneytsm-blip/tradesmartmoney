import { Metadata } from 'next';
import { BitStrategyPageClient } from './BitStrategyPageClient';

export const metadata: Metadata = {
  title: 'BIT Strategy - Buyer Initiated Trades Analysis | TradeSmart Money',
  description: 'Advanced BIT (Buyer Initiated Trades) strategy with momentum breakout analysis, volume confirmation, and swing trading opportunities.',
  keywords: 'BIT strategy, buyer initiated trades, momentum breakout, swing trading, volume analysis, technical analysis',
  openGraph: {
    title: 'BIT Strategy - Buyer Initiated Trades Analysis',
    description: 'Advanced BIT strategy with momentum breakout analysis',
    type: 'website',
  },
};

export default function BitStrategyPage() {
  return <BitStrategyPageClient />;
}
