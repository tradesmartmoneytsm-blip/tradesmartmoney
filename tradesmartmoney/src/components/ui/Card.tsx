import { dt } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gradient';
  size?: 'small' | 'medium' | 'large';
}

export function Card({ children, className, variant = 'default', size = 'medium' }: CardProps) {
  const sizeClasses = {
    small: dt.spacing.cardSmall,
    medium: dt.spacing.card,
    large: dt.spacing.card,
  };

  const variantClasses = {
    default: 'bg-white border border-gray-200 rounded-lg shadow-sm',
    gradient: 'rounded-lg border shadow-sm',
  };

  return (
    <div className={cn(
      variantClasses[variant],
      sizeClasses[size],
      dt.interactive.card,
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
          <p className={cn('font-medium', dt.typography.caption, iconColors[variant])}>{title}</p>
          <p className={cn(dt.typography.sectionTitle, textColors[variant])}>{value}</p>
          {subtitle && (
            <p className={cn(dt.typography.caption, iconColors[variant], 'mt-1')}>{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className={cn(dt.icons.large, iconColors[variant])}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}

interface GridProps {
  children: React.ReactNode;
  variant?: 'responsive1to3' | 'responsive2to4' | 'responsive2to5' | 'cardGrid';
  gap?: 'small' | 'medium' | 'large';
  className?: string;
}

export function Grid({ children, variant = 'cardGrid', gap = 'medium', className }: GridProps) {
  const gapClasses = {
    small: dt.spacing.gridGapSmall,
    medium: dt.spacing.gridGap,
    large: dt.spacing.gridGap,
  };

  return (
    <div className={cn(dt.grids[variant], gapClasses[gap], className)}>
      {children}
    </div>
  );
} 