import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

const headers = {
  'Cache-Control': 'no-store, no-cache, must-revalidate',
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const withSubcategories = searchParams.get('include') === 'subcategories';
    
    const categories = await db.getCategories();
    
    if (withSubcategories) {
      const subcategories = await db.getAllSubcategories();
      
      // Group subcategories by category_id
      const categoriesWithSubs = categories.map((cat: { id: string }) => ({
        ...cat,
        subcategories: subcategories.filter((sub: { category_id: string }) => sub.category_id === cat.id),
      }));
      
      return NextResponse.json(categoriesWithSubs, { headers });
    }
    
    return NextResponse.json(categories, { headers });
  } catch (error) {
    console.error('Categories API error:', error);
    return NextResponse.json(
      { error: 'Помилка завантаження категорій' },
      { status: 500, headers }
    );
  }
}
