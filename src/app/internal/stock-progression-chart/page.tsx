import { Metadata } from 'next';
import StockProgressionChart from './StockProgressionChart';

export const metadata: Metadata = {
  title: 'Stock Progression Chart | TradeSmartMoney Internal',
  description: 'Interactive chart showing how strong bullish stocks (score > 100) progress throughout the trading day.',
};

export default function StockProgressionChartPage() {
  return <StockProgressionChart />;
}
