'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Zap, TrendingUp, DollarSign, ChevronLeft, ChevronRight, TrendingUpDown } from 'lucide-react';
import { BitStrategyContent } from './BitStrategyContent';
import { SwingAngleContent } from './SwingAngleContent';
import { BottomFormationContent } from './BottomFormationContent';
import { ValueBuyingContent } from './ValueBuyingContent';
import { FutureSwingsEliteContent } from './FutureSwingsEliteContent';
import { SectorPerformanceHistogram } from './SectorPerformanceHistogram';
import { ActivityManager } from './ActivityManager';

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
  const [activeSubSection, setActiveSubSection] = useState(initialSubSection || 'futures');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSubmenuCollapsed, setIsSubmenuCollapsed] = useState(false);

  // Update active subsection when initialSubSection prop changes
  useEffect(() => {
    if (initialSubSection) {
      setActiveSubSection(initialSubSection);
    }
  }, [initialSubSection]);

  const subSections: SwingSubSection[] = [
    { 
      id: 'futures', 
      label: 'Futures', 
      icon: <TrendingUpDown className="w-4 h-4" />, 
      description: 'Elite Futures Swing Strategy'
    },
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
      case 'futures':
        return <FutureSwingsEliteContent />;

      case 'momentum-strategy':
        return <BitStrategyContent />;  // Reusing BitStrategyContent for now

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
    <article className="w-full pl-0 pr-0 sm:pl-0 sm:pr-0 md:pl-0 md:pr-0 lg:pl-0 lg:pr-0 xl:pl-0 xl:pr-0 2xl:pl-0 2xl:pr-0 pt-1 pb-2 sm:pt-2 sm:pb-3 md:pt-2 md:pb-4">
      {/* Three Column Layout: Left Submenu | Middle Content | Right Sector Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-x-2">
        
        {/* Left Sidebar - Vertical Submenu (Collapsible) */}
        {!isSubmenuCollapsed && (
          <aside className="lg:col-span-2">
            <div className="sticky top-4">
              <div className="relative bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-2.5 py-2 flex items-center justify-between">
                  <h3 className="text-white font-semibold text-xs">Swing Strategies</h3>
                  <button
                    onClick={() => setIsSubmenuCollapsed(true)}
                    className="p-1 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                    aria-label="Collapse submenu"
                    title="Collapse submenu"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>

                {/* Vertical Submenu Items */}
                <nav className="p-2 space-y-0.5" aria-label="Swing subsections">
                  {subSections.map((section) => {
                    const isActive = activeSubSection === section.id;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSubSection(section.id)}
                        className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-xs font-medium transition-all duration-200 text-left group relative ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-sm'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <span className={`flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                          {section.icon}
                        </span>
                        <span className="flex-1 truncate text-[11px] leading-tight">{section.label}</span>
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-r-full" />
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
              
              {/* Activity Manager Below Submenu */}
              <div className="mt-3">
                <ActivityManager isEmbedded={true} />
              </div>
            </div>
          </aside>
        )}

        {/* Expand Button for Submenu - When Collapsed */}
        {isSubmenuCollapsed && (
          <button
            onClick={() => setIsSubmenuCollapsed(false)}
            className="fixed left-4 top-24 z-30 flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg shadow-lg transition-all hover:shadow-xl"
            aria-label="Expand submenu"
            title="Show submenu"
          >
            <ChevronRight className="w-4 h-4" />
            <span className="text-xs font-medium">Menu</span>
          </button>
        )}

        {/* Middle Content Area */}
        <main 
          className={`${
            isSubmenuCollapsed && isSidebarCollapsed
              ? 'lg:col-span-12'
              : isSubmenuCollapsed
              ? 'lg:col-span-10'
              : isSidebarCollapsed
              ? 'lg:col-span-10'
              : 'lg:col-span-8'
          }`} 
          role="main" 
          aria-label="Swing trading strategy content"
          style={{ zoom: 0.9 }}
        >
          {/* Content */}
          {renderContent()}
        </main>

        {/* Right Sidebar - Sector Performance (Collapsible) */}
        {!isSidebarCollapsed && (
          <aside className="lg:col-span-2">
            <div className="sticky top-4">
              <div className="relative rounded-lg shadow-md ring-1 ring-blue-200/40">
                {/* Sector Performance - Full width */}
                <SectorPerformanceHistogram onCollapse={() => setIsSidebarCollapsed(true)} />
              </div>
            </div>
          </aside>
        )}

        {/* Expand Button for Sector Performance - When Collapsed */}
        {isSidebarCollapsed && (
          <button
            onClick={() => setIsSidebarCollapsed(false)}
            className="fixed right-4 top-24 z-30 p-2 bg-white hover:bg-gray-100 border border-gray-200 rounded-full shadow-md transition-all hover:shadow-lg"
            aria-label="Expand sidebar"
            title="Show market data"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>
    </article>
  );
}
