import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await db.getProductById(id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Товар не знайдено' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json(
      { error: 'Помилка завантаження товару' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const product = await db.updateProduct(id, data);
    return NextResponse.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { error: 'Помилка оновлення товару' },
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
    await db.deleteProduct(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { error: 'Помилка видалення товару' },
      { status: 500 }
    );
  }
}
