import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const products = await db.getAllProducts();
    return NextResponse.json(products);
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
    const product = await db.createProduct(data);
    return NextResponse.json(product);
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Помилка створення товару' },
      { status: 500 }
    );
  }
}
