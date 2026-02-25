import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PLACEHOLDER } from '@/lib/constants';
import db from '@/lib/db';
import { Breadcrumbs, ProductGrid } from '@/components/catalog';
import { GridSkeleton } from '@/components/ui';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface CategoryPageProps {
  params: Promise<{
    categorySlug: string;
  }>;
}

async function getCategoryData(slug: string) {
  const category = await db.getCategoryBySlug(slug);
  
  if (!category) {
    return null;
  }

  const products = await db.getProducts({ categoryId: category.id });

  return {
    category,
    products,
  };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { categorySlug } = await params;
  const data = await getCategoryData(categorySlug);
  
  if (!data) {
    return {
      title: 'Категорію не знайдено',
    };
  }

  return {
    title: `${data.category.name} | ${PLACEHOLDER.companyName}`,
    description: `${data.category.name} оптом від ${PLACEHOLDER.companyName}. Доставка по Україні.`,
  };
}

async function CategoryContent({ slug }: { slug: string }) {
  const data = await getCategoryData(slug);
  
  if (!data) {
    notFound();
  }

  const { category, products } = data;

  return (
    <>
      {/* Products Grid */}
      <ProductGrid
        products={products}
        categorySlug={category.slug}
        emptyMessage={`У категорії "${category.name}" поки немає товарів`}
      />
    </>
  );
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categorySlug } = await params;
  const data = await getCategoryData(categorySlug);
  
  if (!data) {
    notFound();
  }

  const breadcrumbs = [
    { label: PLACEHOLDER.catalogTitle, href: '/catalog' },
    { label: data.category.name },
  ];

  return (
    <main className="min-h-screen relative z-10">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbs} />

        <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-8">
          {data.category.name}
        </h1>

        <Suspense fallback={<GridSkeleton count={8} />}>
          <CategoryContent slug={categorySlug} />
        </Suspense>
      </div>
    </main>
  );
}
