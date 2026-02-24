'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, ChevronLeft, ChevronRight, Package, Check, X } from 'lucide-react';
import type { Product, Category } from '@/lib/types';
import { formatPrice, formatPhone, getPhoneLink, getViberLink, getTelegramLink, getWhatsAppLink, cn } from '@/lib/utils';
import { PLACEHOLDER } from '@/lib/constants';
import { Button } from '@/components/ui';

interface ProductDetailProps {
  product: Product;
  category?: Category | null;
}

export function ProductDetail({ product, category }: ProductDetailProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Combine main image with additional images
  const allImages = [
    product.image_url,
    ...(product.images || [])
  ].filter(Boolean) as string[];

  const hasMultipleImages = allImages.length > 1;

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Image Gallery */}
      <div>
        {/* Main Image */}
        <div className="relative aspect-square rounded-xl overflow-hidden bg-[var(--color-bg-card)]/60 backdrop-blur-sm border border-[var(--color-border)] mb-4">
          {allImages.length > 0 ? (
            <Image
              src={allImages[selectedImageIndex]}
              alt={product.name}
              fill
              className="object-contain p-4"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Image
                src="/images/placeholder-product.svg"
                alt={product.name}
                width={300}
                height={300}
                className="opacity-50"
              />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.old_price && product.price && (
              <span className="px-3 py-1.5 text-sm font-semibold bg-[var(--color-error)] text-white rounded-lg">
                -{Math.round((1 - product.price / product.old_price) * 100)}%
              </span>
            )}
            {product.featured && (
              <span className="px-3 py-1.5 text-sm font-semibold bg-[var(--color-accent)] text-[var(--color-accent-dark)] rounded-lg">
                Рекомендовано
              </span>
            )}
          </div>

          {/* Navigation arrows */}
          {hasMultipleImages && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[var(--color-bg-primary)]/80 backdrop-blur-sm flex items-center justify-center text-[var(--color-text-primary)] hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-dark)] transition-colors"
                aria-label="Попереднє фото"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[var(--color-bg-primary)]/80 backdrop-blur-sm flex items-center justify-center text-[var(--color-text-primary)] hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-dark)] transition-colors"
                aria-label="Наступне фото"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {hasMultipleImages && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {allImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={cn(
                  'flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors',
                  index === selectedImageIndex
                    ? 'border-[var(--color-accent)]'
                    : 'border-[var(--color-border)] hover:border-[var(--color-accent)]'
                )}
              >
                <Image
                  src={image}
                  alt={`${product.name} - фото ${index + 1}`}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div>
        {/* Category link */}
        {category && (
          <Link
            href={`/catalog/${category.slug}`}
            className="text-sm text-[var(--color-accent)] hover:underline mb-2 inline-block"
          >
            {category.name}
          </Link>
        )}

        {/* Product name */}
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-4">
          {product.name}
        </h1>

        {/* Stock status */}
        <div className="flex items-center gap-2 mb-6">
          {product.in_stock ? (
            <>
              <Check className="w-5 h-5 text-[var(--color-success)]" />
              <span className="text-[var(--color-success)]">{PLACEHOLDER.inStock}</span>
            </>
          ) : (
            <>
              <X className="w-5 h-5 text-[var(--color-error)]" />
              <span className="text-[var(--color-error)]">{PLACEHOLDER.outOfStock}</span>
            </>
          )}
        </div>

        {/* Price */}
        <div className="bg-[var(--color-bg-card)]/60 backdrop-blur-sm border border-[var(--color-border)] rounded-xl p-6 mb-6">
          <div className="flex items-baseline gap-3 flex-wrap mb-2">
            <span className="text-3xl font-bold text-[var(--color-accent)]">
              {formatPrice(product.price)}
            </span>
            {product.old_price && (
              <span className="text-xl text-[var(--color-text-muted)] line-through">
                {formatPrice(product.old_price)}
              </span>
            )}
            <span className="text-[var(--color-text-secondary)]">
              / {product.unit}
            </span>
          </div>

          {/* Min order */}
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <Package className="w-4 h-4" />
            <span>Мінімальне замовлення: {product.min_order_qty} {product.unit}</span>
          </div>
        </div>

        {/* Order CTA */}
        <div className="space-y-4 mb-8">
          <p className="text-[var(--color-text-secondary)]">
            Для замовлення зв&apos;яжіться з нами:
          </p>
          
          {/* Phone */}
          <a
            href={getPhoneLink(PLACEHOLDER.phone)}
            className="flex items-center gap-3 p-4 bg-[var(--color-accent)] text-[var(--color-accent-dark)] rounded-xl font-medium hover:bg-[var(--color-accent-hover)] transition-colors"
          >
            <Phone className="w-5 h-5" />
            <span>{formatPhone(PLACEHOLDER.phone)}</span>
          </a>

          {/* Messengers */}
          <div className="flex gap-2">
            <a
              href={getViberLink(PLACEHOLDER.viber)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#7360f2] text-white hover:opacity-90 transition-opacity"
            >
              <Image src="/icons/viber.svg" alt="" width={20} height={20} />
              <span className="font-medium">Viber</span>
            </a>
            <a
              href={getTelegramLink(PLACEHOLDER.telegram)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#0088cc] text-white hover:opacity-90 transition-opacity"
            >
              <Image src="/icons/telegram.svg" alt="" width={20} height={20} />
              <span className="font-medium">Telegram</span>
            </a>
            <a
              href={getWhatsAppLink(PLACEHOLDER.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#25d366] text-white hover:opacity-90 transition-opacity"
            >
              <Image src="/icons/whatsapp.svg" alt="" width={20} height={20} />
              <span className="font-medium">WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="border-t border-[var(--color-border)] pt-6">
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
              Опис товару
            </h2>
            <div className="prose prose-sm max-w-none text-[var(--color-text-secondary)]">
              {product.description.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
