'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, Activity } from 'lucide-react';
import { OptionAnalysisContent } from './OptionAnalysisContent';
import { FuturesAnalysisContent } from './FuturesAnalysisContent';
import { MostActiveCallsContent } from './MostActiveCallsContent';
import { PcrStormContent } from './PcrStormContent';

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

      default:
        return <OptionAnalysisContent />;
    }
  };

  return (
    <article className="w-full px-2 sm:px-3 md:px-4 lg:px-5 xl:px-6 2xl:px-8 py-2 sm:py-3 md:py-4 lg:py-5">
      {/* Compact Page Header */}
      <header className="mb-3 sm:mb-4 lg:mb-6">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 font-serif">FNO Analysis</h1>
        <p className="text-sm lg:text-base text-gray-600">
          Advanced futures and options analysis with institutional flow tracking and smart money insights.
        </p>
      </header>

      {/* Compact Professional Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
        {/* Compact Left Sidebar Navigation */}
        <aside className="lg:col-span-1" role="navigation" aria-label="FNO sections">
          <nav className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
            <h2 className="text-sm lg:text-base font-bold text-gray-900 mb-4 font-serif">FNO Sections</h2>
            <ul className="space-y-1" role="menu">
              {subSections.map((section) => (
                <li key={section.id} role="none">
                  <button
                    onClick={() => {
                      // Navigate to separate FNO subpage
                      window.location.href = `/fno/${section.id}`;
                    }}
                    className={`w-full flex items-center space-x-2 px-3 py-2 lg:py-3 rounded-lg font-medium transition-all duration-300 text-left ${
                      activeSubSection === section.id
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm'
                    }`}
                    role="menuitem"
                    aria-current={activeSubSection === section.id ? 'page' : undefined}
                    aria-label={`View ${section.label} - ${section.description}`}
                  >
                    <div className={`${activeSubSection === section.id ? 'text-blue-200' : 'text-gray-500'}`} aria-hidden="true">
                      {section.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-xs lg:text-sm">{section.label}</div>
                      <div className={`text-xs hidden lg:block ${activeSubSection === section.id ? 'text-blue-200' : 'text-gray-500'}`}>{section.description}</div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-4" role="main" aria-label="FNO analysis content">
          {renderContent()}
        </main>
      </div>
    </article>
  );
}
