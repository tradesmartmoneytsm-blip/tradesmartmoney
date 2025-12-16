'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  href?: string;
  onClick?: () => void;
  children?: SidebarItem[];
}

interface ModernSidebarProps {
  items: SidebarItem[];
  activeItemId?: string;
  title?: string;
  className?: string;
  onItemClick?: (item: SidebarItem) => void;
}

export function ModernSidebar({
  items,
  activeItemId,
  title,
  className,
  onItemClick,
}: ModernSidebarProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [collapsed, setCollapsed] = useState(false);

  const toggleExpand = (itemId: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const handleItemClick = (item: SidebarItem) => {
    if (item.children && item.children.length > 0) {
      toggleExpand(item.id);
    }
    if (item.onClick) {
      item.onClick();
    }
    if (onItemClick) {
      onItemClick(item);
    }
  };

  return (
    <motion.aside
      initial={{ width: collapsed ? 80 : 320 }}
      animate={{ width: collapsed ? 80 : 320 }}
      className={cn(
        'relative transition-all duration-300',
        className
      )}
    >
      <div
        className={cn(
          'rounded-2xl backdrop-blur-xl bg-white/80 dark:bg-gray-900/80',
          'border border-white/20 dark:border-gray-700/20',
          'shadow-xl shadow-black/5',
          'p-4 transition-all duration-300',
          'h-fit'
        )}
      >
        {/* Header */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            {title && !collapsed && (
              <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {title}
              </h2>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg hover:bg-white/20 dark:hover:bg-gray-800/20 transition-colors ml-auto"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400 rotate-[-90deg]" />
              )}
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="space-y-1">
          {items.map((item) => {
            const isActive = activeItemId === item.id;
            const isExpanded = expandedItems.has(item.id);
            const hasChildren = item.children && item.children.length > 0;

            return (
              <div key={item.id}>
                {/* Parent Item */}
                <motion.button
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg',
                    'text-sm font-medium transition-all duration-200',
                    'group relative overflow-hidden',
                    isActive
                      ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-700 dark:text-blue-300 border border-blue-500/30'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-800/10',
                    collapsed && 'justify-center'
                  )}
                >
                  {/* Icon */}
                  {item.icon && (
                    <div
                      className={cn(
                        'flex-shrink-0 transition-colors',
                        isActive
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                      )}
                    >
                      {item.icon}
                    </div>
                  )}

                  {/* Label & Description */}
                  {!collapsed && (
                    <div className="flex-1 text-left min-w-0">
                      <div className="font-semibold truncate">{item.label}</div>
                      {item.description && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {item.description}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Expand/Collapse Icon */}
                  {!collapsed && hasChildren && (
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </motion.div>
                  )}

                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 to-purple-600 rounded-r-full"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>

                {/* Children Items */}
                {!collapsed && hasChildren && (
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-4 mt-1 space-y-1 border-l-2 border-white/10 dark:border-gray-700/10 pl-3"
                      >
                        {item.children!.map((child) => {
                          const isChildActive = activeItemId === child.id;

                          return (
                            <motion.button
                              key={child.id}
                              whileHover={{ x: 4 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                if (child.onClick) child.onClick();
                                if (onItemClick) onItemClick(child);
                              }}
                              className={cn(
                                'w-full flex items-center gap-2 px-3 py-2 rounded-lg',
                                'text-sm transition-all duration-200',
                                'group relative',
                                isChildActive
                                  ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-700 dark:text-blue-300'
                                  : 'text-gray-600 dark:text-gray-400 hover:bg-white/10 dark:hover:bg-gray-800/10 hover:text-blue-600 dark:hover:text-blue-400'
                              )}
                            >
                              {child.icon && (
                                <div className="flex-shrink-0 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                  {child.icon}
                                </div>
                              )}
                              <div className="flex-1 text-left">
                                <div className="font-medium truncate">{child.label}</div>
                                {child.description && (
                                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {child.description}
                                  </div>
                                )}
                              </div>
                              {isChildActive && (
                                <motion.div
                                  layoutId="childActiveIndicator"
                                  className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 to-purple-600 rounded-r-full"
                                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                />
                              )}
                            </motion.button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </motion.aside>
  );
}

