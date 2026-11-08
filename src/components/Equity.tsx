'use client';

import { useState, useEffect } from 'react';
import { SmartMoneyFlowContent } from './SmartMoneyFlowContent';
import { MarketOutlookRail } from './layout/MarketOutlookRail';

interface EquityProps {
  initialSubSection?: string;
}

export function Equity({ initialSubSection }: EquityProps) {
  const [activeSubSection, setActiveSubSection] = useState(initialSubSection || 'smart-money-flow');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (initialSubSection) {
      setActiveSubSection(initialSubSection);
    }
  }, [initialSubSection]);

  const renderContent = () => {
    switch (activeSubSection) {
      case 'smart-money-flow':
        return <SmartMoneyFlowContent />;
      case 'futures-analysis':
        if (typeof window !== 'undefined') {
          window.location.href = '/fno/futures-analysis';
        }
        return <div className="p-8 text-center">Redirecting...</div>;
      case 'option-analysis':
        if (typeof window !== 'undefined') {
          window.location.href = '/fno/option-analysis';
        }
        return <div className="p-8 text-center">Redirecting...</div>;
      case 'most-active-calls-puts':
        if (typeof window !== 'undefined') {
          window.location.href = '/fno/most-active-calls-puts';
        }
        return <div className="p-8 text-center">Redirecting...</div>;
      case 'pcr-storm':
        if (typeof window !== 'undefined') {
          window.location.href = '/fno/pcr-storm';
        }
        return <div className="p-8 text-center">Redirecting...</div>;
      case 'heatmap':
        if (typeof window !== 'undefined') {
          window.location.href = '/fno/heatmap';
        }
        return <div className="p-8 text-center">Redirecting...</div>;
      default:
        return <SmartMoneyFlowContent />;
    }
  };

  return (
    <article className="w-full pt-3 sm:pt-4 pb-2 sm:pb-3">
      <div className="flex w-full items-start">
        <MarketOutlookRail
          collapsed={isSidebarCollapsed}
          onCollapse={() => setIsSidebarCollapsed(true)}
          onExpand={() => setIsSidebarCollapsed(false)}
        />

        <div className="flex-1 min-w-0 px-2 sm:px-3">
          <main role="main" aria-label="Equity analysis content" style={{ zoom: 0.9 }}>
            {renderContent()}
          </main>
        </div>
      </div>
    </article>
  );
}
