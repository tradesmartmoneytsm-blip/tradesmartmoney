import { brandTokens } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gradient';
  size?: 'small' | 'medium' | 'large';
}

export function Card({ children, className, variant = 'default', size = 'medium' }: CardProps) {
  const sizeClasses = {
    small: brandTokens.spacing.component.padding.xs,
    medium: brandTokens.spacing.component.padding.sm,
    large: brandTokens.spacing.component.padding.md,
  };

  const variantClasses = {
    default: 'bg-white border border-gray-200 rounded-lg shadow-sm',
    gradient: 'rounded-lg border shadow-sm',
  };

  return (
    <div className={cn(
      variantClasses[variant],
      sizeClasses[size],
      brandTokens.components.card.base,
      className
    )}>
      {children}
    </div>
  );
}

interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: 'positive' | 'negative' | 'neutral' | 'info';
  className?: string;
}

export function SummaryCard({ title, value, subtitle, icon, variant = 'neutral', className }: SummaryCardProps) {
  const variantStyles = {
    positive: 'bg-gradient-to-r from-green-50 to-emerald-100 border-green-200',
    negative: 'bg-gradient-to-r from-red-50 to-rose-100 border-red-200',
    neutral: 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200',
    info: 'bg-gradient-to-r from-blue-50 to-cyan-100 border-blue-200',
  };

  const textColors = {
    positive: 'text-green-900',
    negative: 'text-red-900',
    neutral: 'text-gray-900',
    info: 'text-blue-900',
  };

  const iconColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600',
    info: 'text-blue-600',
  };

  return (
    <Card 
      variant="gradient" 
      className={cn(variantStyles[variant], 'text-center', className)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className={cn('font-medium', brandTokens.typography.label.sm, iconColors[variant])}>{title}</p>
          <p className={cn(brandTokens.typography.heading.md, textColors[variant])}>{value}</p>
          {subtitle && (
            <p className={cn(brandTokens.typography.label.sm, iconColors[variant], 'mt-1')}>{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className={cn(brandTokens.icons.xl, iconColors[variant])}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}

interface GridProps {
  children: React.ReactNode;
  variant?: 'auto' | 'oneToThree' | 'twoToFour' | 'responsive';
  gap?: 'small' | 'medium' | 'large';
  className?: string;
}

export function Grid({ children, variant = 'auto', gap = 'medium', className }: GridProps) {
  const gapClasses = {
    small: brandTokens.spacing.grid.gap.xs,
    medium: brandTokens.spacing.grid.gap.sm,
    large: brandTokens.spacing.grid.gap.md,
  };

  return (
    <div className={cn(brandTokens.grids[variant], gapClasses[gap], className)}>
      {children}
    </div>
  );
} 