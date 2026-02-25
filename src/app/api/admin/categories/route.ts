import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

const headers = {
  'Cache-Control': 'no-store, no-cache, must-revalidate',
};

export async function GET() {
  try {
    const [categories, subcategories] = await Promise.all([
      db.getAllCategories(),
      db.getAllSubcategories(),
    ]);
    return NextResponse.json({ categories, subcategories }, { headers });
  } catch (error) {
    console.error('Categories API error:', error);
    return NextResponse.json(
      { error: 'Помилка завантаження категорій' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { type, ...itemData } = data;
    
    let result;
    if (type === 'subcategory') {
      result = await db.createSubcategory(itemData);
    } else {
      result = await db.createCategory(itemData);
    }
    
    revalidatePath('/catalog');
    revalidatePath('/');
    
    return NextResponse.json(result, { headers });
  } catch (error) {
    console.error('Create category error:', error);
    const message = error instanceof Error ? error.message : 'Невідома помилка';
    return NextResponse.json(
      { error: `Помилка створення: ${message}` },
      { status: 500, headers }
    );
  }
}
