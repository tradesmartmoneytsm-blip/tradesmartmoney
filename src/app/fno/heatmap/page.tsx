import { Metadata } from 'next';
import FNOHeatmapClient from './FNOHeatmapClient';

export const metadata: Metadata = {
  title: 'F&O Options Heatmap | TradeSmart Money',
  description: 'Live F&O options heatmap showing price changes, open interest, and volume across all NSE F&O stocks. Identify bullish and bearish setups instantly.',
  keywords: ['fno heatmap', 'options heatmap', 'open interest', 'option chain', 'long buildup', 'short buildup', 'futures and options'],
};

export default function FNOHeatmapPage() {
  return <FNOHeatmapClient />;
}

