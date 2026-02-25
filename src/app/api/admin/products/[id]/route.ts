import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

const headers = {
  'Cache-Control': 'no-store, no-cache, must-revalidate',
};

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
        { status: 404, headers }
      );
    }
    
    return NextResponse.json(product, { headers });
  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json(
      { error: 'Помилка завантаження товару' },
      { status: 500, headers }
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
    
    revalidatePath('/catalog');
    revalidatePath('/');
    
    return NextResponse.json(product, { headers });
  } catch (error) {
    console.error('Update product error:', error);
    const message = error instanceof Error ? error.message : 'Невідома помилка';
    return NextResponse.json(
      { error: `Помилка оновлення товару: ${message}` },
      { status: 500, headers }
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
    
    revalidatePath('/catalog');
    revalidatePath('/');
    
    return NextResponse.json({ success: true }, { headers });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { error: 'Помилка видалення товару' },
      { status: 500, headers }
    );
  }
}
