import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const [categories, subcategories] = await Promise.all([
      db.getAllCategories(),
      db.getAllSubcategories(),
    ]);
    return NextResponse.json({ categories, subcategories });
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
    
    if (type === 'subcategory') {
      const subcategory = await db.createSubcategory(itemData);
      return NextResponse.json(subcategory);
    } else {
      const category = await db.createCategory(itemData);
      return NextResponse.json(category);
    }
  } catch (error) {
    console.error('Create category error:', error);
    return NextResponse.json(
      { error: 'Помилка створення категорії' },
      { status: 500 }
    );
  }
}
