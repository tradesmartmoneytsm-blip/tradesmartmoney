import { Metadata } from 'next';
import { SwingAnglePageClient } from './SwingAnglePageClient';

export const metadata: Metadata = {
  title: 'Swing Angle Strategy - Angular Momentum Analysis | TradeSmart Money',
  description: 'Advanced Swing Angle strategy with angular momentum analysis, technical indicators, and swing trading opportunities.',
  keywords: 'swing angle strategy, angular momentum, swing trading, technical analysis, momentum indicators',
  openGraph: {
    title: 'Swing Angle Strategy - Angular Momentum Analysis',
    description: 'Advanced Swing Angle strategy with angular momentum analysis',
    type: 'website',
  },
};

export default function SwingAnglePage() {
  return <SwingAnglePageClient />;
}
