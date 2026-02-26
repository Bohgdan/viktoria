import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

const headers = {
  'Cache-Control': 'no-store, no-cache, must-revalidate',
};

export async function GET() {
  try {
    const products = await db.getAllProducts();
    return NextResponse.json(products, { headers });
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { error: 'Помилка завантаження товарів' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Generate slug from name if not provided
    if (!data.slug && data.name) {
      data.slug = data.name
        .toLowerCase()
        .replace(/[^a-zа-яіїєґ0-9\s-]/gi, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }
    
    const product = await db.createProduct(data);
    
    // Revalidate catalog pages
    revalidatePath('/catalog');
    revalidatePath('/');
    
    return NextResponse.json(product, { headers });
  } catch (error) {
    console.error('Create product error:', error);
    const message = error instanceof Error ? error.message : 'Невідома помилка';
    const stack = error instanceof Error ? error.stack : '';
    return NextResponse.json(
      { error: `Помилка створення товару: ${message}`, details: stack },
      { status: 500, headers }
    );
  }
}
