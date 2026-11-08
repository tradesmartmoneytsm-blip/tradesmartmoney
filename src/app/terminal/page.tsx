import { Metadata } from 'next';
import { TerminalPageClient } from './TerminalPageClient';

export const metadata: Metadata = {
  title: 'Trading Terminal | Charts, Live Scanner & News - TradeSmart Money',
  description:
    'Trading workspace: NSE watchlist, TradingView charts, live market scanner, and market news. Analysis terminal for Indian equities and F&O.',
  keywords:
    'trading terminal, live scanner, TradingView NSE, stock watchlist, intraday terminal',
  openGraph: {
    title: 'TradeSmart Money Trading Terminal',
    description: 'Watchlist, charts, live scanner, and news in one dark trading workspace.',
    url: 'https://www.tradesmartmoney.com/terminal',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.tradesmartmoney.com/terminal',
  },
};

export default function TerminalPage() {
  return <TerminalPageClient />;
}
