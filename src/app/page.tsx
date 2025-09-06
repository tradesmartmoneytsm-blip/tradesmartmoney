'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { SwingTrades } from '@/components/SwingTrades';
import { IntradayTrades } from '@/components/IntradayTrades';
import { News } from '@/components/News';
import { Market } from '@/components/Market';
import { EodScans } from '@/components/EodScans';
import { AlgoTrading } from '@/components/AlgoTrading';
import Head from 'next/head';
import { Brain, Bot, Settings, ArrowRight, BookOpen, TrendingUp } from 'lucide-react';

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
        
        {/* Educational Resources Section */}
        {activeSection === 'market' && (
          <section className="bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white py-16 px-4 mb-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="flex justify-center mb-4">
                  <BookOpen className="h-12 w-12 text-blue-300" />
                </div>
                <h2 className="text-4xl font-bold mb-4">Master Professional Trading</h2>
                <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                  Learn advanced trading concepts used by institutions and professional traders to consistently profit from the markets.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <Link href="/smart-money-concepts" className="group">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 hover:transform hover:scale-105">
                    <div className="bg-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-500/30 transition-colors">
                      <Brain className="h-8 w-8 text-blue-300" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-blue-300 transition-colors">Smart Money Concepts</h3>
                    <p className="text-blue-100 mb-4 group-hover:text-white transition-colors">
                      Master institutional trading patterns, order flow analysis, and smart money footprint to trade like the pros.
                    </p>
                    <div className="flex items-center text-blue-300 group-hover:text-white transition-colors">
                      <span className="text-sm font-medium">Learn SMC</span>
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
                
                <Link href="/ai-powered-trading" className="group">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 hover:transform hover:scale-105">
                    <div className="bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-purple-500/30 transition-colors">
                      <Bot className="h-8 w-8 text-purple-300" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-purple-300 transition-colors">AI-Powered Trading</h3>
                    <p className="text-blue-100 mb-4 group-hover:text-white transition-colors">
                      Harness artificial intelligence and machine learning algorithms for superior trading performance and automation.
                    </p>
                    <div className="flex items-center text-purple-300 group-hover:text-white transition-colors">
                      <span className="text-sm font-medium">Explore AI Trading</span>
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
                
                <Link href="/algo-trading" className="group">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 hover:transform hover:scale-105">
                    <div className="bg-green-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-500/30 transition-colors">
                      <Settings className="h-8 w-8 text-green-300" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-green-300 transition-colors">Algorithmic Trading</h3>
                    <p className="text-blue-100 mb-4 group-hover:text-white transition-colors">
                      Build, backtest, and deploy automated trading systems with advanced algorithms and risk management.
                    </p>
                    <div className="flex items-center text-green-300 group-hover:text-white transition-colors">
                      <span className="text-sm font-medium">Start Algo Trading</span>
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </div>
              
              <div className="text-center mt-12">
                <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                  <TrendingUp className="h-5 w-5 text-green-400 mr-2" />
                  <span className="text-blue-100">Join 10,000+ traders mastering professional strategies</span>
                </div>
              </div>
            </div>
          </section>
        )}
        
        <main className="relative" role="main" aria-label={`${activeSection} content`}>
          <div className="w-full">
            {renderContent()}
          </div>
        </main>
      </div>
    </>
  );
}
