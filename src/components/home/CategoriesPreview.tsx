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
    <section className="py-20 lg:py-28 relative">
      {/* Decorative waves */}
      <div className="decorative-waves" />
      {/* Ambient glow */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[60%] h-40 bg-[var(--color-accent)]/10 blur-[100px] pointer-events-none" />

      <div className="container relative z-10">
        {/* Title */}
        <div className="text-center mb-14 reveal-up" data-reveal>
          <span className="kicker mb-5">
            <span>Каталог</span>
          </span>
          <h2 className="section-heading mt-4">
            Натуральні смаки <span className="text-[var(--color-accent)] italic font-[family-name:var(--font-heading)]">Закарпаття</span>
          </h2>
          <div className="section-divider mt-5">
            <span className="dot" />
          </div>
          <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto mt-5 leading-relaxed">
            Приправи, макарони, консерви та олія від прямого постачальника
          </p>
        </div>

        {/* Category Cards — 3 column */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {categories.slice(0, 3).map((category, idx) => (
            <Link
              key={category.id}
              href={`/catalog/${category.slug}`}
              className="group card-premium lift reveal-up block"
              data-reveal
              style={{ transitionDelay: `${idx * 120}ms` }}
            >
              {/* Image placeholder */}
              <div className="relative h-56 lg:h-64 overflow-hidden bg-gradient-to-br from-[var(--color-bg-hover)] to-[var(--color-bg-card)]">
                <div className="absolute inset-0 flex items-center justify-center zoom-img">
                  <Camera className="w-14 h-14 text-[var(--color-text-light)]" />
                </div>
                <div className="img-overlay-warm" />
                <div className="img-overlay-accent" />
                {/* Number tag */}
                <span className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.3em] text-[var(--color-accent)] bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[var(--color-accent)]/30">
                  0{idx + 1}
                </span>
              </div>

              {/* Category name + button */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors mb-4 font-[family-name:var(--font-heading)]">
                  {category.name}
                </h3>
                <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)] group-hover:gap-3 transition-all">
                  Замовити
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* View all button */}
        <div className="text-center mt-14 reveal-up" data-reveal>
          <Link href="/catalog" className="btn-premium">
            Весь каталог
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
