import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

const headers = {
  'Cache-Control': 'no-store, no-cache, must-revalidate',
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');
    const subcategorySlug = searchParams.get('subcategory');
    const featured = searchParams.get('featured') === 'true';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    
    // Build filter options
    const options: {
      categoryId?: string;
      subcategoryId?: string;
      featured?: boolean;
      limit?: number;
    } = {};
    
    // Get category ID from slug
    if (categorySlug) {
      const category = await db.getCategoryBySlug(categorySlug);
      if (category) {
        options.categoryId = category.id;
      }
    }
    
    // Get subcategory ID from slug
    if (subcategorySlug && categorySlug) {
      const subcategory = await db.getSubcategoryBySlug(categorySlug, subcategorySlug);
      if (subcategory) {
        options.subcategoryId = subcategory.id;
      }
    }
    
    if (featured) {
      options.featured = true;
    }
    
    if (limit) {
      options.limit = limit;
    }
    
    const products = await db.getProducts(options);
    
    return NextResponse.json(products, { headers });
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { error: 'Помилка завантаження товарів' },
      { status: 500, headers }
    );
  }
}
