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
    <section className="section">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] font-[family-name:var(--font-heading)] mb-4">
            Рекомендовані <span className="text-[var(--color-accent)]">товари</span>
          </h2>
        </div>

        {/* 2 large product cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.slice(0, 2).map((product) => {
            const imageUrl = getProductImageUrl(product);
            return (
            <Link
              key={product.id}
              href={`/catalog/product/${product.slug}`}
              className="group bg-[var(--color-bg-card)]/60 backdrop-blur-sm border border-[var(--color-border)] rounded-xl overflow-hidden hover:border-[var(--color-accent)] transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-64 md:h-72 overflow-hidden bg-[var(--color-bg-hover)]">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized={!!product.image_data}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-20 h-20 text-[var(--color-text-light)]" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2 group-hover:text-[var(--color-accent)] transition-colors">
                  {product.name}
                </h3>
                {product.description && (
                  <p className="text-[var(--color-text-muted)] text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  {product.price ? (
                    <span className="text-xl font-bold text-[var(--color-accent)]">
                      {formatPrice(product.price)}
                    </span>
                  ) : (
                    <span className="text-sm text-[var(--color-text-muted)]">
                      {PLACEHOLDER.priceOnRequest}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-[var(--color-accent-dark)] rounded-lg text-sm font-semibold group-hover:bg-[var(--color-accent-hover)] transition-colors">
                    Детальніше
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          );
          })}
        </div>

        {/* View all products */}
        <div className="text-center mt-10">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 text-[var(--color-accent)] font-semibold hover:gap-3 transition-all"
          >
            Дивитись всі товари
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
