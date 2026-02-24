import { Package } from 'lucide-react';
import type { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';
import { PLACEHOLDER } from '@/lib/constants';

interface ProductGridProps {
  products: Product[];
  categorySlug?: string;
  emptyMessage?: string;
}

export function ProductGrid({ 
  products, 
  categorySlug,
  emptyMessage = PLACEHOLDER.noProducts 
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <Package className="w-16 h-16 mx-auto text-[var(--color-text-muted)] mb-4" />
        <p className="text-lg text-[var(--color-text-secondary)]">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          categorySlug={categorySlug}
        />
      ))}
    </div>
  );
}
