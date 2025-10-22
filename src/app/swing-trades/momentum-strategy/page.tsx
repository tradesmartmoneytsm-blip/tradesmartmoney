import { Metadata } from 'next';
import MomentumStrategyPageClient from './MomentumStrategyPageClient';

export const metadata: Metadata = {
  title: 'Momentum Strategy - Swing Trading | TradeSmartMoney',
  description: 'Advanced momentum-based swing trading strategy with institutional flow analysis and technical indicators.',
  keywords: 'momentum trading, swing trading, momentum strategy, technical analysis, stock momentum',
};

export default function MomentumStrategyPage() {
  return <MomentumStrategyPageClient />;
}
