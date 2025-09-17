import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Educational AI Trading Study | Learn AI Market Analysis Concepts | TradeSmartMoney",
  description: "Educational platform for studying AI trading concepts, machine learning in finance, and algorithmic analysis. Learn about AI market analysis for educational purposes only.",
  keywords: [
    "ai powered trading",
    "ai trading algorithm", 
    "machine learning trading",
    "automated trading systems",
    "algorithmic trading",
    "quantitative trading",
    "artificial intelligence trading",
    "ai powered algo",
    "smart money ai",
    "ai trading bot",
    "neural network trading",
    "deep learning trading"
  ],
  alternates: {
    canonical: '/ai-powered-trading',
  },
  openGraph: {
    title: "Educational AI Trading Study | Learn AI Market Analysis Concepts",
    description: "Educational platform for studying AI trading concepts, machine learning in finance, and algorithmic analysis for educational purposes only.",
    url: '/ai-powered-trading',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Educational AI Trading Study | Learn AI Market Analysis Concepts',
    description: 'Educational platform for studying AI trading concepts and machine learning in finance for educational purposes only.',
    images: ['/twitter-image.jpg'],
  },
};

export default function AIPoweredTradingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 