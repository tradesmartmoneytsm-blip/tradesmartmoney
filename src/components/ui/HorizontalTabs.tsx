'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  onClick?: () => void;
}

interface HorizontalTabsProps {
  items: TabItem[];
  activeItemId?: string;
  onItemClick?: (item: TabItem) => void;
  className?: string;
}

export function HorizontalTabs({
  items,
  activeItemId,
  onItemClick,
  className,
}: HorizontalTabsProps) {
  const handleItemClick = (item: TabItem) => {
    if (item.onClick) {
      item.onClick();
    }
    if (onItemClick) {
      onItemClick(item);
    }
  };

  return (
    <div className={cn('bg-white rounded-lg border border-gray-200', className)}>
      <nav className="flex items-center gap-2 overflow-x-auto px-3 py-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {items.map((item) => {
          const isActive = activeItemId === item.id;

          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleItemClick(item)}
              className={cn(
                'relative flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap',
                isActive
                  ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-700 border border-blue-500/30'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              )}
            >
              {/* Icon */}
              {item.icon && (
                <span className={cn(
                  'flex-shrink-0',
                  isActive ? 'text-blue-600' : 'text-gray-500'
                )}>
                  {item.icon}
                </span>
              )}

              {/* Label */}
              <span>{item.label}</span>

              {/* Active Indicator - Left border */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 to-purple-600 rounded-r-full"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
}

