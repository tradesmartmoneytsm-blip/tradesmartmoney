'use client';

import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { SmartMoneyFlowContent } from './SmartMoneyFlowContent';
import { SectorPerformanceHistogram } from './SectorPerformanceHistogram';

interface EquitySubSection {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

interface EquityProps {
  initialSubSection?: string;
}

export function Equity({ initialSubSection }: EquityProps) {
  const [activeSubSection, setActiveSubSection] = useState(initialSubSection || 'smart-money-flow');

  // Update active subsection when initialSubSection prop changes
  useEffect(() => {
    if (initialSubSection) {
      setActiveSubSection(initialSubSection);
    }
  }, [initialSubSection]);

  const subSections: EquitySubSection[] = [
    { 
      id: 'smart-money-flow', 
      label: 'Intraday Smart Money Flow', 
      icon: <Activity className="w-4 h-4" />, 
      description: 'Institutional Money Flow' 
    },
  ];

  const renderContent = () => {
    switch (activeSubSection) {
      case 'smart-money-flow':
        return <SmartMoneyFlowContent />;

      default:
        return <SmartMoneyFlowContent />;
    }
  };

  return (
    <article className="w-full px-2 sm:px-3 md:px-4 lg:px-5 xl:px-6 2xl:px-8 py-2 sm:py-3 md:py-4 lg:py-5">

      {/* Compact Professional Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
        {/* Compact Left Sidebar Navigation */}
        <aside className="lg:col-span-1" role="navigation" aria-label="Equity sections">
          <nav className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
            <h2 className="text-sm lg:text-base font-bold text-gray-900 mb-2 font-serif">Equity Sections</h2>
            <ul className="space-y-1" role="menu">
              {subSections.map((section) => (
                <li key={section.id} role="none">
                  <button
                    onClick={() => {
                      // Navigate to separate equity subpage
                      window.location.href = `/equity/${section.id}`;
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
          
          {/* Sector Performance Histogram - Below Submenu */}
          <div className="mt-3">
            <SectorPerformanceHistogram />
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-4" role="main" aria-label="Equity analysis content">
          {renderContent()}
        </main>
      </div>
    </article>
  );
}
