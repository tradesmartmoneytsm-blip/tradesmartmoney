import { TrendingUp, TrendingDown, BarChart3, Building2, Microscope, Bot, Activity } from 'lucide-react';
import { brandTokens } from '@/lib/design-tokens';

interface SubmenuCardsProps {
  section: string;
  onSubItemClick: (sectionId: string, subItemId: string) => void;
}

const submenuData = {
  market: {
    title: 'Market Analysis',
    description: 'Choose your market analysis focus',
    gradient: 'from-blue-600 via-blue-700 to-purple-600',
    icon: <Building2 className="w-8 h-8" />,
    subItems: [
      { 
        id: 'sector-performance', 
        label: 'Sector Performance', 
        icon: <BarChart3 className={brandTokens.icons.sm} />,
        description: 'Real-time sector analysis and performance metrics'
      },
      { 
        id: 'fii-dii-activity', 
        label: 'FII DII Activity', 
        icon: <Building2 className={brandTokens.icons.sm} />,
        description: 'Foreign and domestic institutional investment flows'
      },
      { 
        id: 'top-gainers', 
        label: 'Top Gainers', 
        icon: <TrendingUp className={brandTokens.icons.sm} />,
        description: 'Stocks with highest price appreciation'
      },
      { 
        id: 'top-losers', 
        label: 'Top Losers', 
        icon: <TrendingUp className={brandTokens.icons.sm} />,
        description: 'Stocks with significant price decline'
      },
      { 
        id: 'long-buildup', 
        label: 'Long Built Up', 
        icon: <TrendingUp className={brandTokens.icons.sm} />,
        description: 'Stocks showing long position accumulation'
      },
      { 
        id: 'short-buildup', 
        label: 'Short Built Up', 
        icon: <TrendingUp className={brandTokens.icons.sm} />,
        description: 'Stocks with increasing short positions'
      },
      { 
        id: '52w-high', 
        label: '52W High', 
        icon: <TrendingUp className={brandTokens.icons.sm} />,
        description: 'Stocks near their 52-week high prices'
      },
      { 
        id: '52w-low', 
        label: '52W Low', 
        icon: <TrendingDown className={brandTokens.icons.sm} />,
        description: 'Stocks near their 52-week low prices'
      },
    ]
  },
  eodscans: {
    title: 'EOD Scans',
    description: 'End-of-day technical analysis tools',
    gradient: 'from-green-600 via-emerald-700 to-teal-600',
    icon: <Microscope className="w-8 h-8" />,
    subItems: [
      { 
        id: 'relative-outperformance', 
        label: 'Relative Outperformance', 
        icon: <BarChart3 className={brandTokens.icons.sm} />,
        description: 'Stocks outperforming their sector/market'
      },
      { 
        id: 'technical-patterns', 
        label: 'Technical Patterns', 
        icon: <TrendingUp className={brandTokens.icons.sm} />,
        description: 'Chart pattern recognition and analysis'
      },
    ]
  },
  'algo-trading': {
    title: 'Algo Trading',
    description: 'Automated trading strategies and tools',
    gradient: 'from-purple-600 via-indigo-700 to-blue-600',
    icon: <Bot className="w-8 h-8" />,
    subItems: [
      { 
        id: 'strategy-basics', 
        label: 'Strategy Basics', 
        icon: <Bot className={brandTokens.icons.sm} />,
        description: 'Learn fundamental algorithmic trading concepts'
      },
      { 
        id: 'backtesting', 
        label: 'Backtesting', 
        icon: <BarChart3 className={brandTokens.icons.sm} />,
        description: 'Test strategies against historical data'
      },
      { 
        id: 'live-performance', 
        label: 'Live Performance', 
        icon: <TrendingUp className={brandTokens.icons.sm} />,
        description: 'Real-time strategy performance tracking'
      },
    ]
  }
};

export function SubmenuCards({ section, onSubItemClick }: SubmenuCardsProps) {
  const menuData = submenuData[section as keyof typeof submenuData];
  
  if (!menuData) {
    return null;
  }

  return (
    <div className="min-h-[600px] bg-gradient-to-br from-slate-50 to-blue-50">
      <div className={`${brandTokens.spacing.page.container} ${brandTokens.spacing.page.x} py-8`}>
        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {menuData.subItems.map((item) => (
            <div key={item.id} className="group">
              <button
                onClick={() => onSubItemClick(section, item.id)}
                className="w-full h-full bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 p-6 text-left group-hover:scale-[1.02] active:scale-[0.98]"
              >
                {/* Card Header */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`flex-shrink-0 p-3 bg-gradient-to-br ${menuData.gradient} rounded-xl shadow-sm group-hover:shadow-md transition-shadow`}>
                    <div className="text-white">
                      {item.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className={`${brandTokens.typography.heading.sm} text-gray-900 group-hover:text-blue-900 mb-1`}>
                      {item.label}
                    </h3>
                  </div>
                </div>
                
                {/* Card Description */}
                <p className={`${brandTokens.typography.body.sm} text-gray-600 group-hover:text-gray-700 leading-relaxed`}>
                  {item.description}
                </p>
                
                {/* Card Footer - Hover Effect */}
                <div className="mt-4 pt-4 border-t border-gray-100 group-hover:border-blue-100 transition-colors">
                  <div className="flex items-center text-blue-600 group-hover:text-blue-700 font-medium text-sm">
                    Explore
                    <TrendingUp className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => onSubItemClick('home', '')}
            className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
} 