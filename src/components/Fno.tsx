'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import { OptionAnalysisContent } from './OptionAnalysisContent';
import { FuturesAnalysisContent } from './FuturesAnalysisContent';
import { MostActiveCallsContent } from './MostActiveCallsContent';
import { PcrStormContent } from './PcrStormContent';
import { HeatmapContent } from './HeatmapContent';
import { HorizontalTabs, TabItem } from './ui/HorizontalTabs';
import { SectorPerformanceHistogram } from './SectorPerformanceHistogram';

interface FnoSubSection {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

interface FnoProps {
  initialSubSection?: string;
}

export function Fno({ initialSubSection }: FnoProps) {
  const [activeSubSection, setActiveSubSection] = useState(initialSubSection || 'option-analysis');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Update active subsection when initialSubSection prop changes
  useEffect(() => {
    if (initialSubSection) {
      setActiveSubSection(initialSubSection);
    }
  }, [initialSubSection]);

  const subSections: FnoSubSection[] = [
    { 
      id: 'option-analysis', 
      label: 'Option Analysis', 
      icon: <TrendingUp className="w-4 h-4" />, 
      description: 'Advanced option chain analysis and institutional flow' 
    },
    { 
      id: 'futures-analysis', 
      label: 'Futures Analysis', 
      icon: <BarChart3 className="w-4 h-4" />, 
      description: 'Futures market analysis and OI buildup patterns' 
    },
    { 
      id: 'most-active-calls-puts', 
      label: 'Most Active Calls/Puts', 
      icon: <Activity className="w-4 h-4" />, 
      description: 'Most active options with highest trading activity' 
    },
    { 
      id: 'pcr-storm', 
      label: 'PCR Storm', 
      icon: <Activity className="w-4 h-4" />, 
      description: 'Put-Call Ratio storm detection and analysis' 
    },
    { 
      id: 'heatmap', 
      label: 'Options Heatmap', 
      icon: <BarChart3 className="w-4 h-4" />, 
      description: 'Live heatmap of price, OI, and volume changes' 
    },
  ];

  const renderContent = () => {
    switch (activeSubSection) {
      case 'option-analysis':
        return <OptionAnalysisContent />;

      case 'futures-analysis':
        return <FuturesAnalysisContent />;

      case 'most-active-calls-puts':
        return <MostActiveCallsContent />;

      case 'pcr-storm':
        return <PcrStormContent />;

      case 'heatmap':
        return <HeatmapContent />;

      default:
        return <OptionAnalysisContent />;
    }
  };

  return (
    <article className="w-full px-2 sm:px-3 md:px-4 lg:px-5 xl:px-6 2xl:px-8 pt-1 pb-2 sm:pt-2 sm:pb-3 md:pt-2 md:pb-4">
      {/* Layout with Sticky Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Sticky Left Sidebar - Sector Performance */}
        {!isSidebarCollapsed && (
          <aside className="lg:col-span-1">
            <div className="sticky top-4">
              {/* Collapse Button - On Sidebar */}
              <div className="relative">
                  <button
                  onClick={() => setIsSidebarCollapsed(true)}
                  className="absolute left-2 top-2 z-10 p-1.5 bg-white hover:bg-gray-100 border border-gray-200 rounded-full shadow-sm transition-all hover:shadow-md"
                  aria-label="Collapse sidebar"
                  title="Collapse sidebar"
                  >
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                <SectorPerformanceHistogram />
                    </div>
                    </div>
          </aside>
        )}

        {/* Expand Button - When Collapsed */}
        {isSidebarCollapsed && (
          <button
            onClick={() => setIsSidebarCollapsed(false)}
            className="fixed left-4 top-24 z-30 p-2 bg-white hover:bg-gray-100 border border-gray-200 rounded-full shadow-md transition-all hover:shadow-lg"
            aria-label="Expand sidebar"
            title="Show market data"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
        )}

        {/* Main Content Area - Scrollable */}
        <main className={`${isSidebarCollapsed ? 'lg:col-span-5' : 'lg:col-span-4'}`} role="main" aria-label="FNO analysis content">
          {/* Horizontal Tabs Navigation - Inside Content Area */}
          <HorizontalTabs
            items={subSections.map((section): TabItem => ({
              id: section.id,
              label: section.label,
              icon: section.icon,
              description: section.description,
              onClick: () => {
                setActiveSubSection(section.id);
              },
            }))}
            activeItemId={activeSubSection}
            className="mb-4"
          />
          
          {/* Content Below Tabs */}
          {renderContent()}
        </main>
      </div>
    </article>
  );
}
