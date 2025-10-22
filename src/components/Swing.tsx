'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Zap, TrendingUp, DollarSign } from 'lucide-react';
import { BitStrategyContent } from './BitStrategyContent';
import { SwingAngleContent } from './SwingAngleContent';
import { BottomFormationContent } from './BottomFormationContent';
import { ValueBuyingContent } from './ValueBuyingContent';

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
      {/* Compact Page Header */}
      <header className="mb-3 sm:mb-4 lg:mb-6">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 font-serif">Swing Trading Strategies</h1>
        <p className="text-sm lg:text-base text-gray-600">
          Multi-day trading strategies with technical analysis and momentum indicators for consistent profits.
        </p>
      </header>

      {/* Compact Professional Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
        {/* Compact Left Sidebar Navigation */}
        <aside className="lg:col-span-1" role="navigation" aria-label="Swing trading strategies">
          <nav className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
            <h2 className="text-sm lg:text-base font-bold text-gray-900 mb-4 font-serif">Trading Strategies</h2>
            <ul className="space-y-1" role="menu">
              {subSections.map((section) => (
                <li key={section.id} role="none">
                  <button
                    onClick={() => {
                      // Navigate to separate swing strategy subpage
                      window.location.href = `/swing-trades/${section.id}`;
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
        <main className="lg:col-span-4" role="main" aria-label="Swing trading strategy content">
          {renderContent()}
        </main>
      </div>
    </article>
  );
}
