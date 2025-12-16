'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, Activity } from 'lucide-react';
import { OptionAnalysisContent } from './OptionAnalysisContent';
import { FuturesAnalysisContent } from './FuturesAnalysisContent';
import { MostActiveCallsContent } from './MostActiveCallsContent';
import { PcrStormContent } from './PcrStormContent';
import { HeatmapContent } from './HeatmapContent';
import { ModernSidebar, SidebarItem } from './ui/ModernSidebar';
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
    <article className="w-full px-2 sm:px-3 md:px-4 lg:px-5 xl:px-6 2xl:px-8 py-2 sm:py-3 md:py-4 lg:py-5">

      {/* Modern Professional Layout with Glassmorphism Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
        {/* Modern Glassmorphism Sidebar */}
        <div className="lg:col-span-1" role="navigation" aria-label="FNO sections">
          <ModernSidebar
            title="FNO Sections"
            items={subSections.map((section): SidebarItem => ({
              id: section.id,
              label: section.label,
              icon: section.icon,
              description: section.description,
              onClick: () => {
                setActiveSubSection(section.id);
                // Navigate to separate FNO subpage
                window.location.href = `/fno/${section.id}`;
              },
            }))}
            activeItemId={activeSubSection}
          />
          
          {/* Sector Performance Histogram - Below Submenu */}
          <div className="mt-3">
            <SectorPerformanceHistogram />
          </div>
        </div>

        {/* Main Content Area */}
        <main className="lg:col-span-4" role="main" aria-label="FNO analysis content">
          {renderContent()}
        </main>
      </div>
    </article>
  );
}
