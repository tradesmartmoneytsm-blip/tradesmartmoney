import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Algo Trading Platform | Smart Money Algorithmic Trading Systems | TradeSmartMoney',
  description: 'Master algorithmic trading with our comprehensive algo trading platform. Advanced smart money algorithms, swing trading systems, and automated trading strategies for professional results.',
  keywords: 'algo trading, algorithmic trading, smart money algo, automated trading, trading algorithms, quantitative trading, systematic trading, backtesting',
  alternates: {
    canonical: 'https://tradesmartmoney.com/algo-trading',
  },
  openGraph: {
    title: 'Algo Trading Platform | Smart Money Algorithmic Trading Systems',
    description: 'Master algorithmic trading with our comprehensive algo trading platform. Advanced smart money algorithms, swing trading systems, and automated trading strategies for professional results.',
    url: 'https://tradesmartmoney.com/algo-trading',
    siteName: 'TradeSmartMoney',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Algo Trading Platform | Smart Money Algorithmic Trading Systems',
    description: 'Master algorithmic trading with our comprehensive algo trading platform. Advanced smart money algorithms, swing trading systems, and automated trading strategies for professional results.',
  },
};

export default function AlgoTradingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 