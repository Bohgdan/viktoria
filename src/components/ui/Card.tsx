import { cn } from '@/lib/utils';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover = false, onClick }: CardProps) {
  return (
    <div
      className={cn(
        'bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg overflow-hidden',
        hover && 'transition-all duration-300 hover:border-[var(--color-accent)] hover:shadow-lg cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-4 border-b border-[var(--color-border)]', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn('text-lg font-semibold text-[var(--color-text-primary)]', className)}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('text-sm text-[var(--color-text-secondary)] mt-1', className)}>
      {children}
    </p>
  );
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-4', className)}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-4 border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)]', className)}>
      {children}
    </div>
  );
}

// Stats card for admin dashboard
export interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  href?: string;
  badge?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatsCard({ title, value, icon, description, href, badge, trend }: StatsCardProps) {
  const content = (
    <Card className={cn('p-6', href && 'hover:border-[var(--color-accent)] cursor-pointer transition-all')}>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm text-[var(--color-text-secondary)]">{title}</p>
            {badge && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--color-error)] text-white">
                {badge}
              </span>
            )}
          </div>
          <p className="text-3xl font-bold text-[var(--color-text-primary)] mt-2">{value}</p>
          {description && (
            <p className="text-sm text-[var(--color-text-muted)] mt-1">{description}</p>
          )}
          {trend && (
            <p
              className={cn(
                'text-sm mt-2',
                trend.isPositive ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'
              )}
            >
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        {icon && (
          <div className="p-3 rounded-lg bg-[var(--color-accent-light)] text-[var(--color-accent)]">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );

  if (href) {
    const Link = require('next/link').default;
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
