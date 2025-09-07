import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Powered Trading Platform | Advanced AI Trading Algorithms | TradeSmartMoney",
  description: "Harness the power of AI for trading with our advanced AI trading algorithms. Machine learning models, automated trading systems, and AI-powered market analysis for professional traders.",
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
    title: "AI Powered Trading Platform | Advanced AI Trading Algorithms",
    description: "Harness the power of AI for trading with our advanced AI trading algorithms. Machine learning models, automated trading systems, and AI-powered market analysis for professional traders.",
    url: '/ai-powered-trading',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Powered Trading Platform | Advanced AI Trading Algorithms',
    description: 'Harness the power of AI for trading with our advanced AI trading algorithms. Machine learning models, automated trading systems, and AI-powered market analysis.',
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