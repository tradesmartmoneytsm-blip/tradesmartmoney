'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  delay?: number;
  onClick?: () => void;
}

export function GlassCard({ 
  children, 
  className, 
  hover = true, 
  glow = false,
  delay = 0,
  onClick 
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { 
        y: -8, 
        scale: 1.02,
        transition: { duration: 0.2 }
      } : {}}
      onClick={onClick}
      className={cn(
        'relative rounded-2xl backdrop-blur-xl bg-white/10 dark:bg-gray-900/10',
        'border border-white/20 dark:border-gray-700/20',
        'shadow-xl shadow-black/5',
        glow && 'before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-blue-500/20 before:to-purple-500/20 before:blur-xl before:-z-10',
        'transition-all duration-300',
        onClick && 'cursor-pointer',
        className
      )}
    >
      <div className="relative z-10 p-6">
        {children}
      </div>
    </motion.div>
  );
}

