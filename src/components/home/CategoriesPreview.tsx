import Link from 'next/link';
import { ArrowRight, FolderOpen, Camera } from 'lucide-react';
import type { Category } from '@/lib/types';
import { PLACEHOLDER } from '@/lib/constants';

interface CategoriesPreviewProps {
  categories?: Category[];
}

// Demo categories - Perfect 4 you
const demoCategories: Category[] = [
  { id: '1', name: 'Консервація', slug: 'konservatsiia', parent_id: null, image_url: null, sort_order: 1, is_visible: true, created_at: '', updated_at: '' },
  { id: '2', name: 'Крупи та макарони', slug: 'krupy-makarony', parent_id: null, image_url: null, sort_order: 2, is_visible: true, created_at: '', updated_at: '' },
  { id: '3', name: 'Олія та жири', slug: 'oliia-zhyry', parent_id: null, image_url: null, sort_order: 3, is_visible: true, created_at: '', updated_at: '' },
];

export function CategoriesPreview({ categories = demoCategories }: CategoriesPreviewProps) {
  if (categories.length === 0) {
    return (
      <section className="py-16 lg:py-20 relative">
        <div className="container relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-[family-name:var(--font-heading)] text-[var(--color-text-primary)]">
            Каталог продукції
          </h2>
          <div className="text-center py-12">
            <FolderOpen className="w-16 h-16 mx-auto text-[var(--color-text-light)] mb-4" />
            <p className="text-[var(--color-text-muted)]">{PLACEHOLDER.noCategories}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-20 relative">
      {/* Decorative waves */}
      <div className="decorative-waves" />

      <div className="container relative z-10">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-[family-name:var(--font-heading)] text-[var(--color-text-primary)]">
            Каталог
          </h2>
          <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto">
            Приправи, макарони, консерви та олія від прямого постачальника
          </p>
        </div>

        {/* Category Cards — 3 column */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {categories.slice(0, 3).map((category) => (
            <Link
              key={category.id}
              href={`/catalog/${category.slug}`}
              className="group bg-[var(--color-bg-card)]/60 backdrop-blur-sm border border-[var(--color-border)] rounded-xl overflow-hidden hover:border-[var(--color-accent)] transition-all duration-300"
            >
              {/* Image placeholder */}
              <div className="h-48 bg-[var(--color-bg-hover)] flex items-center justify-center relative overflow-hidden">
                <Camera className="w-12 h-12 text-[var(--color-text-light)]" />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[var(--color-accent)]/0 group-hover:bg-[var(--color-accent)]/10 transition-colors duration-300" />
              </div>

              {/* Category name + button */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors mb-3">
                  {category.name}
                </h3>
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-[var(--color-accent-dark)] rounded-lg text-sm font-semibold group-hover:bg-[var(--color-accent-hover)] transition-colors">
                  Замовити
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* View all button */}
        <div className="text-center mt-10">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[var(--color-accent)] text-[var(--color-accent-dark)] rounded-lg font-semibold hover:bg-[var(--color-accent-hover)] transition-colors uppercase tracking-wide"
          >
            Весь каталог
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
