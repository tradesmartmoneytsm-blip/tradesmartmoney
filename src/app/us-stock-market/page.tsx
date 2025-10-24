import { Metadata } from 'next';
import USStockMarketPageClient from './USStockMarketPageClient';

export const metadata: Metadata = {
  title: 'US Market Analysis | TradeSmartMoney',
  description: 'Comprehensive US equity market analysis, sector performance, and institutional money flow tracking.',
  keywords: 'US market, sector analysis, S&P 500, NASDAQ, institutional flow, equity analysis',
};

export default function USStockMarketPage() {
  return <USStockMarketPageClient />;
}
