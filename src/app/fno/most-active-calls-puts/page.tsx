import { Metadata } from 'next';
import { MostActiveCallsPageClient } from './MostActiveCallsPageClient';

export const metadata: Metadata = {
  title: 'Most Active Calls/Puts - Options Activity Scanner | TradeSmart Money',
  description: 'Track most active stock calls and puts with highest trading activity, real-time options flow, and institutional activity monitoring.',
  keywords: 'most active options, stock calls, stock puts, options activity, options flow, institutional activity, derivatives trading',
  openGraph: {
    title: 'Most Active Calls/Puts - Options Activity Scanner',
    description: 'Track most active stock calls and puts with highest trading activity',
    type: 'website',
  },
};

export default function MostActiveCallsPage() {
  return <MostActiveCallsPageClient />;
}
