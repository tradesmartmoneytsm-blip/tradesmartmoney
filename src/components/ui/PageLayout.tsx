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
    <div className={cn(`${brandTokens.spacing.page.container} ${brandTokens.spacing.page.x} ${brandTokens.spacing.page.y}`, className)}>
      <div className={brandTokens.spacing.section.gap}>
        <h2 className={brandTokens.typography.heading.xl}>{title}</h2>
        {description && (
          <p className={cn(brandTokens.typography.body.lg, 'mt-3 sm:mt-4')}>
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
} 