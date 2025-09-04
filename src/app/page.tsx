'use client';

import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { SwingTrades } from '@/components/SwingTrades';
import { IntradayTrades } from '@/components/IntradayTrades';
import { News } from '@/components/News';
import { Market } from '@/components/Market';
import { EodScans } from '@/components/EodScans';
import { AlgoTrading } from '@/components/AlgoTrading';
import Head from 'next/head';

export default function Home() {
  const [activeSection, setActiveSection] = useState('market');
  const [activeMarketSubSection, setActiveMarketSubSection] = useState('sector-performance');
  const [activeEodScansSubSection, setActiveEodScansSubSection] = useState('relative-outperformance');
  const [activeAlgoTradingSubSection, setActiveAlgoTradingSubSection] = useState('strategy-basics');

  const handleSectionChange = (section: string, subSection?: string) => {
    setActiveSection(section as 'swing' | 'intraday' | 'news' | 'market' | 'eodscans' | 'algo-trading');

    // Handle subsections for Market, EodScans, and AlgoTrading
    if (section === 'market' && subSection) {
      setActiveMarketSubSection(subSection);
    } else if (section === 'eodscans' && subSection) {
      setActiveEodScansSubSection(subSection);
    } else if (section === 'algo-trading' && subSection) {
      setActiveAlgoTradingSubSection(subSection);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'swing':
        return <SwingTrades />;
      case 'intraday':
        return <IntradayTrades />;
      case 'news':
        return <News />;
      case 'market':
        return <Market initialSubSection={activeMarketSubSection} />;
      case 'eodscans':
        return <EodScans initialSubSection={activeEodScansSubSection} />;
      case 'algo-trading':
        return <AlgoTrading initialSubSection={activeAlgoTradingSubSection} />;
      default:
        return <Market initialSubSection={activeMarketSubSection} />;
    }
  };

  // Get section-specific meta information
  const getSectionMeta = () => {
    switch (activeSection) {
      case 'market':
        return {
          title: 'Live Market Data & Analysis - TradeSmartMoney',
          description: 'Real-time market data, sector performance, FII/DII activity, top gainers & losers. Professional market analysis tools.',
        };
      case 'swing':
        return {
          title: 'Swing Trading Opportunities - TradeSmartMoney', 
          description: 'Multi-day swing trading signals with detailed analysis, targets, and risk management for profitable trades.',
        };
      case 'intraday':
        return {
          title: 'Intraday Trading Signals - TradeSmartMoney',
          description: 'Real-time intraday trading opportunities with live signals, entry/exit points, and risk management.',
        };
      case 'news':
        return {
          title: 'Market News & Updates - TradeSmartMoney',
          description: 'Latest market news, earnings updates, policy changes, and economic developments affecting trading.',
        };
      case 'eodscans':
        return {
          title: 'End-of-Day Technical Scans - TradeSmartMoney',
          description: 'Technical analysis scans, chart patterns, candlestick analysis, and relative performance studies.',
        };
      case 'algo-trading':
        return {
          title: 'Algorithmic Trading Education - TradeSmartMoney',
          description: 'Learn algorithmic trading with strategies, backtesting, live performance analytics, and code examples.',
        };
      default:
        return {
          title: 'TradeSmartMoney - Professional Trading Platform',
          description: 'Advanced trading platform with market analysis, trading signals, and educational resources.',
        };
    }
  };

  const sectionMeta = getSectionMeta();

  return (
    <>
      <Head>
        <title>{sectionMeta.title}</title>
        <meta name="description" content={sectionMeta.description} />
        <meta property="og:title" content={sectionMeta.title} />
        <meta property="og:description" content={sectionMeta.description} />
        <link rel="canonical" href={`https://tradesmartmoney.com/${activeSection === 'market' ? '' : activeSection}`} />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <Navigation
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />
        <main className="relative" role="main" aria-label={`${activeSection} content`}>
          <div className="w-full">
            {renderContent()}
          </div>
        </main>
      </div>
    </>
  );
}
