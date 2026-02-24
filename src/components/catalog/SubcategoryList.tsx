import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { Category } from '@/lib/types';

interface SubcategoryListProps {
  subcategories: Category[];
  parentSlug: string;
  activeSlug?: string;
}

export function SubcategoryList({ subcategories, parentSlug, activeSlug }: SubcategoryListProps) {
  if (subcategories.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
        Підкатегорії
      </h2>
      <div className="flex flex-wrap gap-2">
        {/* All products link */}
        <Link
          href={`/catalog/${parentSlug}`}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            !activeSlug
              ? 'bg-[var(--color-accent)] text-[var(--color-accent-dark)]'
              : 'bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]'
          )}
        >
          Всі товари
        </Link>

        {/* Subcategory links */}
        {subcategories.map((sub) => (
          <Link
            key={sub.id}
            href={`/catalog/${parentSlug}/${sub.slug}`}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activeSlug === sub.slug
                ? 'bg-[var(--color-accent)] text-[var(--color-accent-dark)]'
                : 'bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]'
            )}
          >
            {sub.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

// Vertical list variant for sidebar
interface SubcategorySidebarProps {
  subcategories: Category[];
  parentSlug: string;
  activeSlug?: string;
  title?: string;
}

export function SubcategorySidebar({ 
  subcategories, 
  parentSlug, 
  activeSlug,
  title = 'Підкатегорії'
}: SubcategorySidebarProps) {
  if (subcategories.length === 0) {
    return null;
  }

  return (
    <div className="bg-[var(--color-bg-card)]/60 backdrop-blur-sm border border-[var(--color-border)] rounded-xl p-4">
      <h3 className="font-semibold text-[var(--color-text-primary)] mb-4">{title}</h3>
      <nav className="space-y-1">
        {/* All products link */}
        <Link
          href={`/catalog/${parentSlug}`}
          className={cn(
            'block px-3 py-2 rounded-lg text-sm transition-colors',
            !activeSlug
              ? 'bg-[var(--color-accent-light)] text-[var(--color-accent)] font-medium'
              : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]'
          )}
        >
          Всі товари
        </Link>

        {/* Subcategory links */}
        {subcategories.map((sub) => (
          <Link
            key={sub.id}
            href={`/catalog/${parentSlug}/${sub.slug}`}
            className={cn(
              'block px-3 py-2 rounded-lg text-sm transition-colors',
              activeSlug === sub.slug
                ? 'bg-[var(--color-accent-light)] text-[var(--color-accent)] font-medium'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]'
            )}
          >
            {sub.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
