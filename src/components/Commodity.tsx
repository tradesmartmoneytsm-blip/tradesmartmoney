'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Activity, TrendingUp, Clock } from 'lucide-react';

interface CommoditySubSection {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

interface CommodityProps {
  initialSubSection?: string;
}

export function Commodity({ initialSubSection }: CommodityProps) {
  const [activeSubSection, setActiveSubSection] = useState(initialSubSection || 'coming-soon');

  // Update active subsection when initialSubSection prop changes
  useEffect(() => {
    if (initialSubSection) {
      setActiveSubSection(initialSubSection);
    }
  }, [initialSubSection]);

  const subSections: CommoditySubSection[] = [
    { 
      id: 'coming-soon', 
      label: 'Coming Soon', 
      icon: <Clock className="w-4 h-4" />, 
      description: 'Commodity analysis features coming soon' 
    },
  ];

  const renderContent = () => {
    switch (activeSubSection) {
      case 'coming-soon':
      default:
        return (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
            <div className="max-w-md mx-auto">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                🚀 Commodity Trading Analysis
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Advanced commodity trading features are coming soon! We're building comprehensive analysis tools for:
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="font-semibold text-yellow-800 mb-1">🛢️ Crude Oil</div>
                  <div className="text-yellow-600">Price analysis & signals</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="font-semibold text-yellow-800 mb-1">🥇 Gold</div>
                  <div className="text-yellow-600">Precious metals tracking</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="font-semibold text-blue-800 mb-1">🔥 Natural Gas</div>
                  <div className="text-blue-600">Energy sector analysis</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="font-semibold text-gray-800 mb-1">🏭 Base Metals</div>
                  <div className="text-gray-600">Industrial metals</div>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">📈 Coming Features:</h4>
                <ul className="text-left text-blue-700 text-sm space-y-1">
                  <li>• Real-time commodity price tracking</li>
                  <li>• Futures & Options analysis</li>
                  <li>• Technical indicators & signals</li>
                  <li>• Market sentiment analysis</li>
                  <li>• Risk management tools</li>
                </ul>
              </div>
              <p className="text-gray-500 text-sm mt-4">
                Stay tuned for powerful commodity trading insights!
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <article className="w-full px-2 sm:px-3 md:px-4 lg:px-5 xl:px-6 2xl:px-8 py-2 sm:py-3 md:py-4 lg:py-5">
      {/* Header */}
      <header className="text-center mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 lg:mb-4 font-serif">
          Commodity Trading Analysis
        </h1>
        <p className="text-sm lg:text-base text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Advanced commodity market analysis, futures & options signals, and institutional trading insights.
        </p>
      </header>

      {/* Compact Professional Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-5">
        {/* Compact Left Sidebar Navigation */}
        <aside className="lg:col-span-1" role="navigation" aria-label="Commodity sections">
          <nav className="compact-card compact-padding">
            <h2 className="text-h4 mb-4">Commodity Sections</h2>
            <ul className="space-y-1" role="menu">
              {subSections.map((section) => (
                <li key={section.id} role="none">
                  <button
                    onClick={() => setActiveSubSection(section.id)}
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
                      <div className={`text-xs ${
                        activeSubSection === section.id ? 'text-blue-200' : 'text-gray-500'
                      }`}>
                        {section.description}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Compact Right Content Area */}
        <section className="lg:col-span-4" role="main" aria-live="polite">
          {renderContent()}
        </section>
      </div>
    </article>
  );
}
