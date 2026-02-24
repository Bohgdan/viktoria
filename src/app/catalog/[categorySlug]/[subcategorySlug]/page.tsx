import { redirect } from 'next/navigation';
import { getCategoryBySlug } from '@/lib/data';

interface SubcategoryPageProps {
  params: Promise<{
    categorySlug: string;
    subcategorySlug: string;
  }>;
}

// В нашій структурі немає підкатегорій - перенаправляємо на головну категорію
export default async function SubcategoryPage({ params }: SubcategoryPageProps) {
  const { categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  
  if (category) {
    redirect(`/catalog?category=${category.slug}`);
  }
  
  redirect('/catalog');
}
