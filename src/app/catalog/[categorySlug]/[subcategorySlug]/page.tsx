import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PLACEHOLDER } from '@/lib/constants';
import db from '@/lib/db';
import { Breadcrumbs, ProductGrid } from '@/components/catalog';
import { GridSkeleton } from '@/components/ui';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface SubcategoryPageProps {
  params: Promise<{
    categorySlug: string;
    subcategorySlug: string;
  }>;
}

async function getSubcategoryData(categorySlug: string, subcategorySlug: string) {
  const category = await db.getCategoryBySlug(categorySlug);
  if (!category) return null;
  
  const subcategory = await db.getSubcategoryBySlug(categorySlug, subcategorySlug);
  if (!subcategory) return null;
  
  const products = await db.getProducts({ subcategoryId: subcategory.id });
  
  return { category, subcategory, products };
}

export async function generateMetadata({ params }: SubcategoryPageProps): Promise<Metadata> {
  const { categorySlug, subcategorySlug } = await params;
  const data = await getSubcategoryData(categorySlug, subcategorySlug);
  
  if (!data) {
    return { title: 'Підкатегорію не знайдено' };
  }
  
  return {
    title: `${data.subcategory.name} | ${data.category.name} | ${PLACEHOLDER.companyName}`,
    description: `${data.subcategory.name} - ${data.category.name} оптом від ${PLACEHOLDER.companyName}`,
  };
}

async function SubcategoryContent({ categorySlug, subcategorySlug }: { categorySlug: string; subcategorySlug: string }) {
  const data = await getSubcategoryData(categorySlug, subcategorySlug);
  
  if (!data) {
    notFound();
  }
  
  const { subcategory, products } = data;
  
  return (
    <ProductGrid
      products={products}
      categorySlug={categorySlug}
      emptyMessage={`У підкатегорії "${subcategory.name}" поки немає товарів`}
    />
  );
}

export default async function SubcategoryPage({ params }: SubcategoryPageProps) {
  const { categorySlug, subcategorySlug } = await params;
  const data = await getSubcategoryData(categorySlug, subcategorySlug);
  
  if (!data) {
    notFound();
  }
  
  const { category, subcategory } = data;
  
  const breadcrumbs = [
    { label: PLACEHOLDER.catalogTitle, href: '/catalog' },
    { label: category.name, href: `/catalog/${category.slug}` },
    { label: subcategory.name },
  ];
  
  return (
    <main className="min-h-screen relative z-10">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbs} />
        
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-8">
          {subcategory.name}
        </h1>
        
        <Suspense fallback={<GridSkeleton count={8} />}>
          <SubcategoryContent categorySlug={categorySlug} subcategorySlug={subcategorySlug} />
        </Suspense>
      </div>
    </main>
  );
}
