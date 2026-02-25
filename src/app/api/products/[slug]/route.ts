import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

const headers = {
  'Cache-Control': 'no-store, no-cache, must-revalidate',
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const product = await db.getProductBySlug(slug);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Товар не знайдено' },
        { status: 404, headers }
      );
    }
    
    return NextResponse.json(product, { headers });
  } catch (error) {
    console.error('Product API error:', error);
    return NextResponse.json(
      { error: 'Помилка завантаження товару' },
      { status: 500, headers }
    );
  }
}
