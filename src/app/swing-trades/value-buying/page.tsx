import { Metadata } from 'next';
import { ValueBuyingPageClient } from './ValueBuyingPageClient';

export const metadata: Metadata = {
  title: 'Value Buying Strategy - Oversold Quality Stocks | TradeSmart Money',
  description: 'Advanced Value Buying strategy focusing on oversold quality stocks with strong fundamentals and swing trading potential.',
  keywords: 'value buying strategy, oversold stocks, quality stocks, value investing, swing trading, fundamental analysis',
  openGraph: {
    title: 'Value Buying Strategy - Oversold Quality Stocks',
    description: 'Advanced Value Buying strategy focusing on oversold quality stocks',
    type: 'website',
  },
};

export default function ValueBuyingPage() {
  return <ValueBuyingPageClient />;
}
