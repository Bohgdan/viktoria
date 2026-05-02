'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Package, ArrowRight } from 'lucide-react';
import type { Product } from '@/lib/types';
import { PLACEHOLDER } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';

interface FeaturedProductsProps {
  products?: Product[];
}

// Helper function to get image URL
function getProductImageUrl(product: Product): string | null {
  if (product.image_data) {
    return `/api/images/${product.id}`;
  }
  return product.image_url;
}

// Demo products for empty state - Perfect 4 you
const demoProducts: Product[] = [
  { id: '1', name: 'Паприка солодка 1кг', slug: 'papryka-solodka-1kg', description: 'Високоякісна солодка паприка для приготування страв та консервації. Натуральний склад без домішок.', price: null, old_price: null, unit: 'шт', min_order_qty: 10, category_id: null, image_url: null, images: [], in_stock: true, is_visible: true, featured: true, sort_order: 1, created_at: '', updated_at: '' },
  { id: '2', name: 'Кукурудза консервована 340г', slug: 'kukurudza-340g', description: 'Солодка кукурудза вищого ґатунку. Ідеально для салатів та інших страв.', price: null, old_price: null, unit: 'шт', min_order_qty: 24, category_id: null, image_url: null, images: [], in_stock: true, is_visible: true, featured: true, sort_order: 2, created_at: '', updated_at: '' },
];

export function FeaturedProducts({ products = demoProducts }: FeaturedProductsProps) {
  if (products.length === 0) {
    return (
      <section className="section">
        <div className="container">
          <h2 className="section-title">{PLACEHOLDER.featuredProducts}</h2>
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto text-[var(--color-text-muted)] mb-4" />
            <p className="text-[var(--color-text-secondary)]">{PLACEHOLDER.noProducts}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section relative">
      {/* Ambient glow */}
      <div className="absolute -top-10 right-[10%] w-80 h-80 bg-[var(--color-accent-warm)]/10 blur-[120px] pointer-events-none" />
      <div className="container relative z-10">
        <div className="text-center mb-14 reveal-up" data-reveal>
          <span className="kicker mb-5">
            <span>Бестселери</span>
          </span>
          <h2 className="section-heading mt-4">
            Рекомендовані <span className="text-[var(--color-accent)] italic font-[family-name:var(--font-heading)]">товари</span>
          </h2>
          <div className="section-divider mt-5">
            <span className="dot" />
          </div>
        </div>

        {/* 2 large product cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.slice(0, 2).map((product, idx) => {
            const imageUrl = getProductImageUrl(product);
            return (
            <Link
              key={product.id}
              href={`/catalog/product/${product.slug}`}
              className="group card-premium lift reveal-up block"
              data-reveal
              style={{ transitionDelay: `${idx * 150}ms` }}
            >
              {/* Image */}
              <div className="relative h-72 md:h-80 overflow-hidden bg-[var(--color-bg-hover)]">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover zoom-img"
                    unoptimized={!!product.image_data}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center zoom-img">
                    <Package className="w-20 h-20 text-[var(--color-text-light)]" />
                  </div>
                )}
                <div className="img-overlay-warm" />
                <div className="img-overlay-accent" />
                {product.featured && (
                  <span className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.3em] text-[var(--color-accent)] bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[var(--color-accent)]/30">
                    Рекомендоване
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-7">
                <h3 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-3 group-hover:text-[var(--color-accent)] transition-colors font-[family-name:var(--font-heading)]">
                  {product.name}
                </h3>
                {product.description && (
                  <p className="text-[var(--color-text-muted)] text-sm mb-5 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                )}
                <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
                  {product.price ? (
                    <span className="text-2xl font-bold text-[var(--color-accent)] font-[family-name:var(--font-heading)]">
                      {formatPrice(product.price)}
                    </span>
                  ) : (
                    <span className="text-sm text-[var(--color-text-muted)] uppercase tracking-[0.18em]">
                      {PLACEHOLDER.priceOnRequest}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)] group-hover:gap-3 transition-all">
                    Детальніше
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          );
          })}
        </div>

        {/* View all products */}
        <div className="text-center mt-14 reveal-up" data-reveal>
          <Link href="/catalog" className="btn-outline-premium">
            Дивитись всі товари
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
