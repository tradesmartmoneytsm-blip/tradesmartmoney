import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Smart Money Concepts: Master Institutional Trading Patterns | TradeSmartMoney",
  description: "Learn smart money concepts (SMC) and institutional trading patterns. Master order flow analysis, liquidity hunting, and smart money footprint for professional trading success.",
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
    "smc trading"
  ],
  alternates: {
    canonical: '/smart-money-concepts',
  },
  openGraph: {
    title: "Smart Money Concepts: Master Institutional Trading Patterns",
    description: "Learn smart money concepts (SMC) and institutional trading patterns. Master order flow analysis, liquidity hunting, and smart money footprint for professional trading success.",
    url: '/smart-money-concepts',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smart Money Concepts: Master Institutional Trading Patterns',
    description: 'Learn smart money concepts (SMC) and institutional trading patterns. Master order flow analysis, liquidity hunting, and smart money footprint for professional trading success.',
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