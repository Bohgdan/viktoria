import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PLACEHOLDER } from '@/lib/constants';
import db from '@/lib/db';
import { Breadcrumbs, ProductDetail, ProductGrid } from '@/components/catalog';
import { PageLoader } from '@/components/ui';
import type { BreadcrumbItem, Product, Category } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ProductPageProps {
  params: Promise<{
    productSlug: string;
  }>;
}

async function getProductData(slug: string) {
  const product = await db.getProductBySlug(slug);
  
  if (!product) {
    return null;
  }

  const category = product.category_id ? await db.getCategoryById(product.category_id) : null;
  
  // Get related products from same category (excluding current product)
  const allCategoryProducts = product.category_id 
    ? await db.getProducts({ categoryId: product.category_id, limit: 5 })
    : [];
  
  const relatedProducts = allCategoryProducts.filter((p: Product) => p.id !== product.id).slice(0, 4);

  return {
    product,
    category,
    relatedProducts,
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { productSlug } = await params;
  const data = await getProductData(productSlug);
  
  if (!data) {
    return {
      title: 'Товар не знайдено',
    };
  }

  return {
    title: `${data.product.name} | ${PLACEHOLDER.companyName}`,
    description: data.product.description || `${data.product.name} оптом від ${PLACEHOLDER.companyName}`,
  };
}

async function ProductContent({ slug }: { slug: string }) {
  const data = await getProductData(slug);
  
  if (!data) {
    notFound();
  }

  const { product, category, relatedProducts } = data;

  return (
    <>
      <ProductDetail product={product} category={category} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-8">
            Схожі товари
          </h2>
          <ProductGrid 
            products={relatedProducts}
            categorySlug={category?.slug}
          />
        </section>
      )}
    </>
  );
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productSlug } = await params;
  const data = await getProductData(productSlug);
  
  if (!data) {
    notFound();
  }

  const { product, category } = data;

  // Build breadcrumbs
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: PLACEHOLDER.catalogTitle as string, href: '/catalog' },
  ];

  if (category) {
    breadcrumbItems.push({ 
      label: category.name as string, 
      href: `/catalog/${category.slug}` 
    });
  }

  breadcrumbItems.push({ label: product.name as string });

  return (
    <main className="min-h-screen relative z-10">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbItems} />

        <Suspense fallback={<PageLoader text="Завантаження товару..." />}>
          <ProductContent slug={productSlug} />
        </Suspense>
      </div>
    </main>
  );
}
