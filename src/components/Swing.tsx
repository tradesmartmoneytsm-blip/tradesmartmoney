'use client';

import { useState, useEffect } from 'react';
import { BitStrategyContent } from './BitStrategyContent';
import { SwingAngleContent } from './SwingAngleContent';
import { BottomFormationContent } from './BottomFormationContent';
import { ValueBuyingContent } from './ValueBuyingContent';
import { FutureSwingsEliteContent } from './FutureSwingsEliteContent';
import { MarketOutlookRail } from './layout/MarketOutlookRail';

interface SwingProps {
  initialSubSection?: string;
}

export function Swing({ initialSubSection }: SwingProps) {
  const [activeSubSection, setActiveSubSection] = useState(initialSubSection || 'futures');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (initialSubSection) {
      setActiveSubSection(initialSubSection);
    }
  }, [initialSubSection]);

  const renderContent = () => {
    switch (activeSubSection) {
      case 'futures':
        return <FutureSwingsEliteContent />;
      case 'momentum-strategy':
        return <BitStrategyContent />;
      case 'swing-angle':
        return <SwingAngleContent />;
      case 'bottom-formation':
        return <BottomFormationContent />;
      case 'value-buying':
        return <ValueBuyingContent />;
      default:
        return <FutureSwingsEliteContent />;
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
          <main
            role="main"
            aria-label="Swing trading strategy content"
            style={{ zoom: 0.9 }}
          >
            {renderContent()}
          </main>
        </div>
      </div>
    </article>
  );
}
