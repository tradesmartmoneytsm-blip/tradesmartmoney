import { brandTokens } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';

interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabNavigationProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'blue' | 'purple' | 'green';
  className?: string;
}

export function TabNavigation({ 
  tabs, 
  activeTab, 
  onTabChange, 
  variant = 'blue',
  className 
}: TabNavigationProps) {
  const variantStyles = {
    blue: {
      active: 'border-blue-500 text-blue-600',
      inactive: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    },
    purple: {
      active: 'border-purple-500 text-purple-600',
      inactive: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    },
    green: {
      active: 'border-green-500 text-green-600',
      inactive: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }
  };

  return (
    <div className={cn(brandTokens.spacing.section.y, className)}>
      <div className="border-b border-gray-200">
        <nav className="flex space-x-2 sm:space-x-4 lg:space-x-8 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex items-center space-x-2 py-3 sm:py-4 px-2 sm:px-3 lg:px-4',
                'border-b-2 font-medium text-sm sm:text-base lg:text-lg',
                'whitespace-nowrap transition-colors',
                brandTokens.effects.transition.normal,
                activeTab === tab.id 
                  ? variantStyles[variant].active
                  : variantStyles[variant].inactive
              )}
            >
              {tab.icon}
              <span className="hidden xs:inline sm:inline">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
} 