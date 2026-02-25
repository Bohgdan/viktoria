import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

const headers = {
  'Cache-Control': 'no-store, no-cache, must-revalidate',
};

// Max file size: 5MB
const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const productId = formData.get('productId') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'Файл не завантажено' },
        { status: 400, headers }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Дозволено лише зображення' },
        { status: 400, headers }
      );
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'Файл занадто великий (макс. 5MB)' },
        { status: 400, headers }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const mimeType = file.type;
    const dataUri = `data:${mimeType};base64,${base64}`;

    if (productId) {
      // Update existing product with image data
      await db.updateProduct(productId, { image_data: dataUri });
      
      return NextResponse.json({
        success: true,
        productId,
        imageUrl: `/api/images/${productId}`,
      }, { headers });
    } else {
      // Return base64 for new product (will be saved with product)
      return NextResponse.json({
        success: true,
        imageData: dataUri,
      }, { headers });
    }
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Помилка завантаження файлу' },
      { status: 500, headers }
    );
  }
}
