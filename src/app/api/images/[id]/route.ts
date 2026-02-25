import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

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

    if (!product.image_data) {
      return NextResponse.json(
        { error: 'Зображення відсутнє' },
        { status: 404 }
      );
    }

    // Parse data URI
    const matches = product.image_data.match(/^data:([^;]+);base64,(.+)$/);
    if (!matches) {
      return NextResponse.json(
        { error: 'Некоректний формат зображення' },
        { status: 500 }
      );
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Image fetch error:', error);
    return NextResponse.json(
      { error: 'Помилка завантаження зображення' },
      { status: 500 }
    );
  }
}
