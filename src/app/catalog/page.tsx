import { Suspense } from 'react';
import type { Metadata } from 'next';
import { PLACEHOLDER } from '@/lib/constants';
import { CATEGORIES, PRODUCTS } from '@/lib/data';
import { Breadcrumbs, ProductCard } from '@/components/catalog';
import { GridSkeleton } from '@/components/ui';

export const metadata: Metadata = {
  title: `${PLACEHOLDER.catalogTitle} | ${PLACEHOLDER.companyName}`,
  description: PLACEHOLDER.catalogDescription,
};

function getData(categorySlug?: string) {
  const categories = CATEGORIES;
  let products = PRODUCTS.filter(p => p.in_stock);

  if (categorySlug && categorySlug !== 'all') {
    const category = categories.find(c => c.slug === categorySlug);
    if (category) {
      products = products.filter(p => p.category_id === category.id);
    }
  }

  // Sort: featured first, then by sort_order
  products = products.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.sort_order - b.sort_order;
  });

  return { categories, products };
}

interface CatalogContentProps {
  categorySlug?: string;
}

function CatalogContent({ categorySlug }: CatalogContentProps) {
  const { categories, products } = getData(categorySlug);

  return (
    <>
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        <a
          href="/catalog"
          className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
            !categorySlug || categorySlug === 'all'
              ? 'bg-[var(--color-primary)] text-white'
              : 'bg-white/10 text-white/70 hover:bg-white/15 hover:text-white'
          }`}
        >
          Всі товари
        </a>
        {categories.map((category) => (
          <a
            key={category.id}
            href={`/catalog?category=${category.slug}`}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
              categorySlug === category.slug
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/15 hover:text-white'
            }`}
          >
            {category.name}
          </a>
        ))}
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-white/50">Товарів у цій категорії поки немає</p>
        </div>
      )}
    </>
  );
}

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function CatalogPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const categorySlug = params.category;

  const breadcrumbs = [
    { label: PLACEHOLDER.catalogTitle },
  ];

  return (
    <main className="min-h-screen relative z-10">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbs} />

        <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
          {PLACEHOLDER.catalogTitle}
        </h1>

        <p className="text-[var(--color-text-secondary)] mb-8 max-w-3xl">
          {PLACEHOLDER.catalogDescription}
        </p>

        <Suspense fallback={<GridSkeleton count={8} />}>
          <CatalogContent categorySlug={categorySlug} />
        </Suspense>
      </div>
    </main>
  );
}
