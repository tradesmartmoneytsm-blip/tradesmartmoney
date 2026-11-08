'use client';

import { useState, useEffect } from 'react';
import { OptionAnalysisContent } from './OptionAnalysisContent';
import { FuturesAnalysisContent } from './FuturesAnalysisContent';
import { MostActiveCallsContent } from './MostActiveCallsContent';
import { PcrStormContent } from './PcrStormContent';
import { HeatmapContent } from './HeatmapContent';
import { SmartMoneyFlowContent } from './SmartMoneyFlowContent';
import { MarketOutlookRail } from './layout/MarketOutlookRail';

interface FnoProps {
  initialSubSection?: string;
}

export function Fno({ initialSubSection }: FnoProps) {
  const [activeSubSection, setActiveSubSection] = useState(initialSubSection || 'option-analysis');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (initialSubSection) {
      setActiveSubSection(initialSubSection);
    }
  }, [initialSubSection]);

  const renderContent = () => {
    switch (activeSubSection) {
      case 'futures-analysis':
        return <FuturesAnalysisContent />;
      case 'option-analysis':
        return <OptionAnalysisContent />;
      case 'smart-money-flow':
        return <SmartMoneyFlowContent />;
      case 'most-active-calls-puts':
        return <MostActiveCallsContent />;
      case 'pcr-storm':
        return <PcrStormContent />;
      case 'heatmap':
        return <HeatmapContent />;
      default:
        return <FuturesAnalysisContent />;
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
          <main role="main" aria-label="FNO analysis content" style={{ zoom: 0.9 }}>
            {renderContent()}
          </main>
        </div>
      </div>
    </article>
  );
}
