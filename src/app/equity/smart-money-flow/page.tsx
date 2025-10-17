import { Metadata } from 'next';
import { SmartMoneyFlowPageClient } from './SmartMoneyFlowPageClient';

export const metadata: Metadata = {
  title: 'SmartMoneyFlow - MIDCAP & SMALLCAP Stocks by Turnover | TradeSmart Money',
  description: 'Track smart money flow in NIFTY MIDCAP 50 and NIFTY SMALLCAP 50 stocks sorted by turnover value with advanced filtering options.',
  keywords: 'smart money flow, midcap stocks, smallcap stocks, turnover analysis, equity analysis, stock turnover, institutional flow',
  openGraph: {
    title: 'SmartMoneyFlow - MIDCAP & SMALLCAP Analysis',
    description: 'Track smart money flow in MIDCAP and SMALLCAP stocks by turnover',
    type: 'website',
  },
};

export default function SmartMoneyFlowPage() {
  return <SmartMoneyFlowPageClient />;
}
