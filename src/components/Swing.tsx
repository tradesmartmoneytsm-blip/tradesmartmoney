'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Zap, TrendingUp, DollarSign } from 'lucide-react';
import { BitStrategyContent } from './BitStrategyContent';
import { SwingAngleContent } from './SwingAngleContent';
import { BottomFormationContent } from './BottomFormationContent';
import { ValueBuyingContent } from './ValueBuyingContent';
import { ModernSidebar, SidebarItem } from './ui/ModernSidebar';
import { SectorPerformanceHistogram } from './SectorPerformanceHistogram';

interface SwingSubSection {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

interface SwingProps {
  initialSubSection?: string;
}

export function Swing({ initialSubSection }: SwingProps) {
  const [activeSubSection, setActiveSubSection] = useState(initialSubSection || 'momentum-strategy');

  // Update active subsection when initialSubSection prop changes
  useEffect(() => {
    if (initialSubSection) {
      setActiveSubSection(initialSubSection);
    }
  }, [initialSubSection]);

  const subSections: SwingSubSection[] = [
    { 
      id: 'momentum-strategy', 
      label: 'Momentum Strategy', 
      icon: <BarChart3 className="w-4 h-4" />, 
      description: 'Momentum-Based Trading Analysis'
    },
    { 
      id: 'swing-angle', 
      label: 'Swing Angle', 
      icon: <Zap className="w-4 h-4" />, 
      description: 'Angular Momentum Strategy' 
    },
    { 
      id: 'bottom-formation', 
      label: 'Bottom Formation', 
      icon: <TrendingUp className="w-4 h-4" />, 
      description: 'Reversal Pattern Strategy' 
    },
    { 
      id: 'value-buying', 
      label: 'Value Buying', 
      icon: <DollarSign className="w-4 h-4" />, 
      description: 'Oversold Quality Stocks' 
    },
  ];

  const renderContent = () => {
    switch (activeSubSection) {
      case 'momentum-strategy':
        return <BitStrategyContent />;  // Reusing BitStrategyContent for now

      case 'swing-angle':
        return <SwingAngleContent />;

      case 'bottom-formation':
        return <BottomFormationContent />;

      case 'value-buying':
        return <ValueBuyingContent />;

      default:
        return <BitStrategyContent />;
    }
  };

  return (
    <article className="w-full px-2 sm:px-3 md:px-4 lg:px-5 xl:px-6 2xl:px-8 py-2 sm:py-3 md:py-4 lg:py-5">

      {/* Modern Professional Layout with Glassmorphism Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
        {/* Modern Glassmorphism Sidebar */}
        <div className="lg:col-span-1" role="navigation" aria-label="Swing trading strategies">
          <ModernSidebar
            title="Trading Strategies"
            items={subSections.map((section): SidebarItem => ({
              id: section.id,
              label: section.label,
              icon: section.icon,
              description: section.description,
              onClick: () => {
                setActiveSubSection(section.id);
                // Navigate to separate swing strategy subpage
                window.location.href = `/swing-trades/${section.id}`;
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
        <main className="lg:col-span-4" role="main" aria-label="Swing trading strategy content">
          {renderContent()}
        </main>
      </div>
    </article>
  );
}
