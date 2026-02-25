'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Camera, ShoppingCart } from 'lucide-react';
import type { Product } from '@/lib/types';
import { formatPrice, cn } from '@/lib/utils';
import { PLACEHOLDER } from '@/lib/constants';
import { OrderModal } from './OrderModal';

interface ProductCardProps {
  product: Product;
  categorySlug?: string;
}

export function ProductCard({ product, categorySlug }: ProductCardProps) {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  
  const productUrl = categorySlug 
    ? `/catalog/${categorySlug}/product/${product.slug}`
    : `/catalog/product/${product.slug}`;

  // Get image URL - prioritize image_data, then image_url
  const imageUrl = product.image_data 
    ? `/api/images/${product.id}` 
    : product.image_url;

  return (
    <>
      <div className="group bg-[var(--color-bg-card)]/60 backdrop-blur-sm border border-[var(--color-border)] rounded-xl overflow-hidden hover:border-[var(--color-accent)] transition-all duration-300 h-full flex flex-col">
        {/* Image */}
        <Link href={productUrl} className="block relative aspect-square overflow-hidden bg-[var(--color-bg-secondary)]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              unoptimized={!!product.image_data}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Camera className="w-16 h-16 text-[var(--color-text-muted)]" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.featured && (
              <span className="px-2.5 py-1 text-xs font-semibold bg-[var(--color-accent)] text-[var(--color-accent-dark)] rounded-md">
                Хіт
              </span>
            )}
            {product.old_price && product.price && (
              <span className="px-2.5 py-1 text-xs font-semibold bg-[var(--color-error)] text-white rounded-md">
                -{Math.round((1 - product.price / product.old_price) * 100)}%
              </span>
            )}
            {!product.in_stock && (
              <span className="px-2.5 py-1 text-xs font-semibold bg-[var(--color-text-muted)] text-white rounded-md">
                {PLACEHOLDER.outOfStock}
              </span>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          {/* Name */}
          <Link href={productUrl}>
            <h3 className={cn(
              "font-semibold text-[var(--color-text-primary)] mb-2 line-clamp-2 group-hover:text-[var(--color-accent)] transition-colors text-sm leading-tight",
              !product.in_stock && "opacity-60"
            )}>
              {product.name}
            </h3>
          </Link>

          {/* Price section */}
          <div className="mt-auto">
            <div className="flex items-baseline gap-2 flex-wrap mb-1">
              <span className={cn(
                "text-lg font-bold",
                product.in_stock ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)]"
              )}>
                {formatPrice(product.price)}
              </span>
              {product.old_price && (
                <span className="text-sm text-[var(--color-text-muted)] line-through">
                  {formatPrice(product.old_price)}
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--color-text-muted)] mb-3">
              /{product.unit}
            </p>

            {/* Order button */}
            <button
              onClick={() => setIsOrderModalOpen(true)}
              disabled={!product.in_stock}
              className={cn(
                "w-full py-2.5 rounded-full font-medium text-sm transition-colors flex items-center justify-center gap-2",
                product.in_stock 
                  ? "bg-[var(--color-accent)] text-[var(--color-accent-dark)] hover:bg-[var(--color-accent-hover)]"
                  : "bg-[var(--color-bg-hover)] text-[var(--color-text-muted)] cursor-not-allowed"
              )}
            >
              <ShoppingCart className="w-4 h-4" />
              Замовити
            </button>
          </div>
        </div>
      </div>

      {/* Order Modal */}
      <OrderModal 
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        product={product}
      />
    </>
  );
}
