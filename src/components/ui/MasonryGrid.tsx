'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MasonryGridProps {
  children: ReactNode[];
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  className?: string;
}

export function MasonryGrid({ 
  children, 
  columns = { sm: 1, md: 2, lg: 3, xl: 4 },
  className 
}: MasonryGridProps) {
  return (
    <div
      className={cn(
        'grid gap-6',
        `grid-cols-${columns.sm || 1}`,
        `md:grid-cols-${columns.md || 2}`,
        `lg:grid-cols-${columns.lg || 3}`,
        `xl:grid-cols-${columns.xl || 4}`,
        className
      )}
      style={{
        gridTemplateRows: 'masonry',
      }}
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}

