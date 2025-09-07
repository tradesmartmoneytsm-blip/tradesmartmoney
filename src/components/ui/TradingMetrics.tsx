import { brandTokens } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';

interface MetricItem {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'green' | 'red' | 'blue' | 'purple' | 'orange' | 'gray';
}

interface TradingMetricsProps {
  metrics: MetricItem[];
  variant?: 'swing' | 'intraday';
  className?: string;
}

export function TradingMetrics({ metrics, variant = 'swing', className }: TradingMetricsProps) {
  const colorClasses = {
    green: 'text-green-600',
    red: 'text-red-600', 
    blue: 'text-blue-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
    gray: 'text-gray-600',
  };

  const gridClass = variant === 'intraday' 
    ? brandTokens.grids.responsive 
    : 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4';

  return (
    <div className={cn(gridClass, brandTokens.spacing.grid.gap.xs, 'mb-4 lg:mb-6', className)}>
      {metrics.map((metric, index) => (
        <div 
          key={index} 
          className={cn(
            'flex items-center space-x-2 lg:space-x-3',
            variant === 'intraday' && index === metrics.length - 1 ? 'col-span-2 sm:col-span-1' : ''
          )}
        >
          <div className={cn(brandTokens.icons.sm, 'lg:w-6 lg:h-6', colorClasses[metric.color])}>
            {metric.icon}
          </div>
          <div className="min-w-0">
            <div className={cn(brandTokens.typography.label.sm, 'truncate')}>{metric.label}</div>
            <div className={cn(
              'font-semibold text-sm sm:text-base lg:text-lg truncate',
              colorClasses[metric.color]
            )}>
              {metric.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

interface TradingCardHeaderProps {
  name: string;
  symbol: string;
  currentPrice: number;
  badge?: {
    text: string;
    variant: 'positive' | 'negative' | 'neutral';
  };
  setup?: string;
}

export function TradingCardHeader({ name, symbol, currentPrice, badge, setup }: TradingCardHeaderProps) {
  const badgeColors = {
    positive: 'text-green-600 bg-green-50',
    negative: 'text-red-600 bg-red-50', 
    neutral: 'text-gray-600 bg-gray-50',
  };

  return (
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1 min-w-0 mr-4">
                  <h3 className={cn(brandTokens.typography.heading.sm, 'truncate')}>{name}</h3>
          <p className={cn(brandTokens.typography.body.sm, 'text-blue-600 font-medium')}>{symbol}</p>
          {setup && (
            <p className={cn(brandTokens.typography.label.sm, 'mt-1')}>{setup}</p>
          )}
      </div>
      <div className="text-right flex-shrink-0">
                  <div className={cn(brandTokens.typography.heading.md, 'text-gray-900')}>₹{currentPrice}</div>
        {badge && (
          <div className={cn(
            'inline-flex px-3 py-1 text-xs sm:text-sm font-medium rounded-full mt-1',
            badgeColors[badge.variant]
          )}>
            {badge.text}
          </div>
        )}
      </div>
    </div>
  );
} 