import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import type { Category } from '@/lib/types';

interface CategoryCardProps {
  category: Category;
  showSubcategories?: boolean;
}

export function CategoryCard({ category, showSubcategories = true }: CategoryCardProps) {
  return (
    <div className="group bg-[var(--color-bg-card)]/60 backdrop-blur-sm border border-[var(--color-border)] rounded-xl overflow-hidden hover:border-[var(--color-accent)] transition-all duration-300">
      {/* Image */}
      <Link href={`/catalog/${category.slug}`} className="block relative h-40 overflow-hidden">
        {category.image_url ? (
          <Image
            src={category.image_url}
            alt={category.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-[var(--color-bg-secondary)] flex items-center justify-center">
            <Image
              src="/images/placeholder-category.svg"
              alt={category.name}
              width={100}
              height={80}
              className="opacity-50"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-card)]/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link href={`/catalog/${category.slug}`}>
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3 group-hover:text-[var(--color-accent)] transition-colors">
            {category.name}
          </h3>
        </Link>

        {/* Subcategories */}
        {showSubcategories && category.subcategories && category.subcategories.length > 0 && (
          <ul className="space-y-1.5 mb-4">
            {category.subcategories.slice(0, 5).map((sub) => (
              <li key={sub.id}>
                <Link
                  href={`/catalog/${category.slug}/${sub.slug}`}
                  className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                  {sub.name}
                </Link>
              </li>
            ))}
            {category.subcategories.length > 5 && (
              <li className="text-sm text-[var(--color-text-muted)] pl-3.5">
                + ще {category.subcategories.length - 5}
              </li>
            )}
          </ul>
        )}

        {/* Products count */}
        {category.products_count !== undefined && (
          <p className="text-sm text-[var(--color-text-muted)] mb-3">
            {category.products_count} товарів
          </p>
        )}

        {/* View all link */}
        <Link
          href={`/catalog/${category.slug}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-accent)] hover:gap-2 transition-all"
        >
          Переглянути
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
