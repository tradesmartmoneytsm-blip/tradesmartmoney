'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trackPageView } from '@/lib/analytics';
import { TrendingUp, Zap } from 'lucide-react';
import { Market } from '@/components/Market';
import { Navigation } from '@/components/Navigation';

export function SectorPerformancePageClient() {
  const router = useRouter();

  useEffect(() => {
    trackPageView('/market/sector-performance', 'Sector Performance Analysis');
  }, []);

  const handleSectionChange = (section: string, subSection?: string) => {
    // Handle market submenus - navigate to separate pages
    if (section === 'market' && subSection) {
      router.push(`/market/${subSection}`);
      return;
    }
    
    // Navigate to different sections
    const routes: { [key: string]: string } = {
      'home': '/',
      'swing': '/swing-trades',
      'intraday': '/intraday-trades',
      'news': '/news',
      'eodscans': '/eod-scans',
      'algo-trading': '/algo-trading',
    };
    
    const route = routes[section];
    if (route) {
      router.push(route);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navigation 
        activeSection="market" 
        onSectionChange={handleSectionChange}
      />
      {/* Main Content - Market Component with Sector Focus */}
      <div className="py-8">
        <Market initialSubSection="sector-performance" />
      </div>

      {/* SEO Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="prose max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Understanding Sector Performance Analysis
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Key Sectors to Watch</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <Zap className="h-4 w-4 text-blue-600 mr-2" />
                    <strong>Banking & Financial Services:</strong> HDFC Bank, ICICI Bank, SBI
                  </li>
                  <li className="flex items-center">
                    <Zap className="h-4 w-4 text-blue-600 mr-2" />
                    <strong>Information Technology:</strong> TCS, Infosys, Wipro, HCL Tech
                  </li>
                  <li className="flex items-center">
                    <Zap className="h-4 w-4 text-blue-600 mr-2" />
                    <strong>Pharmaceuticals:</strong> Sun Pharma, Dr. Reddy's, Cipla
                  </li>
                  <li className="flex items-center">
                    <Zap className="h-4 w-4 text-blue-600 mr-2" />
                    <strong>Automobile:</strong> Maruti Suzuki, Tata Motors, M&M
                  </li>
                  <li className="flex items-center">
                    <Zap className="h-4 w-4 text-blue-600 mr-2" />
                    <strong>FMCG:</strong> Hindustan Unilever, ITC, Nestle India
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Analysis Benefits</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                    Identify sector rotation opportunities
                  </li>
                  <li className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                    Track institutional money flow
                  </li>
                  <li className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                    Make informed portfolio allocation decisions
                  </li>
                  <li className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                    Understand market trends and cycles
                  </li>
                  <li className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                    Time entry and exit points better
                  </li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">How to Use Sector Performance Data</h3>
            <p className="text-gray-600 mb-4">
              Sector performance analysis is crucial for understanding market dynamics and making informed investment decisions. 
              By tracking how different sectors perform relative to each other, you can identify emerging trends, 
              sector rotation patterns, and potential investment opportunities.
            </p>
            
            <p className="text-gray-600 mb-6">
              Our real-time sector performance dashboard provides comprehensive data on all major NSE and BSE sectors, 
              helping you stay ahead of market movements and make data-driven investment choices.
            </p>

            {/* Educational Disclaimer */}
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
              <p className="text-red-800 text-sm font-medium">
                <strong>Educational Disclaimer:</strong> This sector performance data is for educational and informational purposes only. 
                We are not SEBI registered investment advisors. Please consult with qualified financial professionals before making investment decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
