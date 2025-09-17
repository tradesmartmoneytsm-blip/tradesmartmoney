import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Educational Smart Money Study: Learn Institutional Patterns | TradeSmartMoney",
  description: "Educational platform for studying smart money concepts (SMC) and institutional patterns. Learn about order flow analysis and market structure through comprehensive video tutorials for educational purposes only.",
  keywords: [
    "smart money concepts",
    "smart money trading", 
    "institutional trading",
    "order flow analysis",
    "liquidity analysis",
    "smart money footprint",
    "market structure",
    "supply and demand trading",
    "smart money algo",
    "smart money indicators",
    "institutional order flow",
    "smc trading",
    "trading video tutorials",
    "smart money education videos"
  ],
  alternates: {
    canonical: '/smart-money-concepts',
  },
  openGraph: {
    title: "Educational Smart Money Study: Learn Institutional Patterns",
    description: "Educational platform for studying smart money concepts (SMC) and institutional patterns. Learn about order flow analysis for educational purposes only.",
    url: '/smart-money-concepts',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Educational Smart Money Study: Learn Institutional Patterns',
    description: 'Educational platform for studying smart money concepts and institutional patterns for educational purposes only.',
    images: ['/twitter-image.jpg'],
  },
};

export default function SmartMoneyConceptsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 