import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const category = await db.updateCategory(id, data);
    return NextResponse.json(category);
  } catch (error) {
    console.error('Update category error:', error);
    return NextResponse.json(
      { error: 'Помилка оновлення категорії' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    if (type === 'subcategory') {
      await db.deleteSubcategory(id);
    } else {
      await db.deleteCategory(id);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete category error:', error);
    return NextResponse.json(
      { error: 'Помилка видалення категорії' },
      { status: 500 }
    );
  }
}
