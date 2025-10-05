import { Metadata } from 'next';
import { AdvancedScannerPageClient } from './AdvancedScannerPageClient';

export const metadata: Metadata = {
  title: 'Advanced Scanner - Live Option Chain Analysis | TradeSmart Money',
  description: 'Advanced real-time option chain scanner with institutional flow analysis and smart money tracking for professional traders.',
  keywords: 'advanced scanner, option chain, institutional flow, real-time analysis, smart money, professional trading',
  robots: 'noindex, nofollow', // Private page for reference only
};

export default function AdvancedScannerPage() {
  return <AdvancedScannerPageClient />;
}
