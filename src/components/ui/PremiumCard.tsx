import React from 'react';
import { brandTokens } from '@/lib/design-tokens';
import { LucideIcon } from 'lucide-react';

interface PremiumCardProps {
  children: React.ReactNode;
  variant?: 'base' | 'elevated' | 'premium' | 'glass';
  interactive?: boolean;
  className?: string;
  icon?: LucideIcon;
  title?: string;
  subtitle?: string;
  padding?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export function PremiumCard({ 
  children, 
  variant = 'premium',
  interactive = true,
  className = '',
  icon: Icon,
  title,
  subtitle,
  padding = 'md',
  onClick
}: PremiumCardProps) {
  const baseClasses = brandTokens.components.card[variant];
  const interactiveClasses = interactive ? brandTokens.components.card.interactive : '';
  const paddingClasses = brandTokens.spacing.component.padding[padding];
  
  const CardComponent = onClick ? 'button' : 'div';
  
  return (
    <CardComponent
      className={`${baseClasses} ${interactiveClasses} ${paddingClasses} ${className} ${onClick ? 'cursor-pointer focus-ring' : ''}`}
      onClick={onClick}
    >
      {(Icon || title || subtitle) && (
        <div className="flex items-start space-x-4 mb-4">
          {Icon && (
            <div className="p-2 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg">
              <Icon className={`${brandTokens.icons.md} text-blue-600`} />
            </div>
          )}
          {(title || subtitle) && (
            <div className="flex-1 min-w-0">
              {title && (
                <h3 className={`${brandTokens.typography.heading.sm} text-gray-900 mb-1`}>
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className={`${brandTokens.typography.body.sm} text-gray-600`}>
                  {subtitle}
                </p>
              )}
            </div>
          )}
        </div>
      )}
      {children}
    </CardComponent>
  );
}

// Specialized card variants
export function StatsCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  trend = 'neutral',
  className = '' 
}: {
  title: string;
  value: string | number;
  change?: string;
  icon?: LucideIcon;
  trend?: 'positive' | 'negative' | 'neutral';
  className?: string;
}) {
  const trendColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  };

  return (
    <PremiumCard variant="premium" padding="md" className={className}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className={`${brandTokens.typography.label.md} text-gray-600 mb-2`}>
            {title}
          </p>
          <p className={`${brandTokens.typography.heading.lg} text-gray-900 font-bold mb-1`}>
            {value}
          </p>
          {change && (
            <p className={`${brandTokens.typography.body.sm} ${trendColors[trend]} font-medium`}>
              {change}
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl">
            <Icon className={`${brandTokens.icons.lg} text-blue-600`} />
          </div>
        )}
      </div>
    </PremiumCard>
  );
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  href,
  badge,
  className = ''
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  href?: string;
  badge?: string;
  className?: string;
}) {
  const content = (
    <PremiumCard 
      variant="premium" 
      interactive={!!href} 
      padding="lg" 
      className={`text-center group ${className}`}
    >
      {/* Icon */}
      <div className="relative mb-6">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
          <Icon className={`${brandTokens.icons.xl} text-white`} />
        </div>
        {badge && (
          <div className="absolute -top-2 -right-2 px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full shadow-sm">
            {badge}
          </div>
        )}
      </div>

      {/* Content */}
      <div>
        <h3 className={`${brandTokens.typography.heading.sm} text-gray-900 mb-3 group-hover:text-blue-600 transition-colors`}>
          {title}
        </h3>
        <p className={`${brandTokens.typography.body.md} text-gray-600 group-hover:text-gray-700 transition-colors`}>
          {description}
        </p>
      </div>
    </PremiumCard>
  );

  if (href) {
    return (
      <a href={href} className="block">
        {content}
      </a>
    );
  }

  return content;
}

export function DataCard({
  data,
  loading = false,
  error,
  emptyMessage = "No data available",
  className = ''
}: {
  data: React.ReactNode[];
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  className?: string;
}) {
  if (loading) {
    return (
      <PremiumCard variant="base" className={className}>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </PremiumCard>
    );
  }

  if (error) {
    return (
      <PremiumCard variant="base" className={`border-red-200 ${className}`}>
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-red-600 text-xl">⚠️</span>
          </div>
          <h3 className={`${brandTokens.typography.heading.xs} text-red-900 mb-2`}>
            Error Loading Data
          </h3>
          <p className={`${brandTokens.typography.body.sm} text-red-600`}>
            {error}
          </p>
        </div>
      </PremiumCard>
    );
  }

  if (!data || data.length === 0) {
    return (
      <PremiumCard variant="base" className={className}>
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-gray-400 text-2xl">📊</span>
          </div>
          <h3 className={`${brandTokens.typography.heading.xs} text-gray-900 mb-2`}>
            No Data Available
          </h3>
          <p className={`${brandTokens.typography.body.sm} text-gray-600`}>
            {emptyMessage}
          </p>
        </div>
      </PremiumCard>
    );
  }

  return (
    <PremiumCard variant="premium" className={className}>
      {/* Data will be rendered by parent component */}
      {data}
    </PremiumCard>
  );
} 