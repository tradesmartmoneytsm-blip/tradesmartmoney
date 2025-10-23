import { CommodityPageClient } from './CommodityPageClient';

export const metadata = {
  title: 'Commodity Trading Analysis | TradeSmartMoney',
  description: 'Advanced commodity trading analysis, signals, and market insights for crude oil, gold, silver, and other commodities.',
  keywords: ['commodity trading', 'crude oil', 'gold', 'silver', 'commodity analysis', 'futures', 'options'],
};

export default function CommodityPage() {
  return <CommodityPageClient />;
}
