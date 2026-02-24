import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import type { BreadcrumbItem } from '@/lib/types';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Навігація" className="mb-6">
      <ol className="flex items-center flex-wrap gap-1 text-sm">
        {/* Home link */}
        <li className="flex items-center">
          <Link
            href="/"
            className="flex items-center gap-1 text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
          >
            <Home className="w-4 h-4" />
            <span className="sr-only">Головна</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center">
              <ChevronRight className="w-4 h-4 mx-1 text-[var(--color-text-muted)]" />
              {isLast || !item.href ? (
                <span className="text-[var(--color-text-primary)] font-medium">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
