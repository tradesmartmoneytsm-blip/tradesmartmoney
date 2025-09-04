import { dt } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
}

export function PageLayout({ children, title, description, className }: PageLayoutProps) {
  return (
    <div className={cn(`max-w-7xl mx-auto ${dt.spacing.page} ${dt.spacing.pagePadding}`, className)}>
      <div className={dt.spacing.section}>
        <h2 className={dt.typography.pageTitle}>{title}</h2>
        {description && (
          <p className={cn(dt.typography.body, 'mt-3 sm:mt-4')}>
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
} 