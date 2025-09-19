import { brandTokens } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
}

export function PageLayout({ children, title, description, className }: PageLayoutProps) {
  return (
    <div className={cn(`${brandTokens.spacing.page.fullWidthPadded} ${brandTokens.spacing.page.y}`, className)}>
      <div className={brandTokens.spacing.section.gap}>
        <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold">{title}</h2>
        {description && (
          <p className={cn("text-sm sm:text-base lg:text-lg leading-relaxed", 'mt-3 sm:mt-4')}>
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
} 