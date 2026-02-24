import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const review = await db.updateReview(id, data);
    return NextResponse.json(review);
  } catch (error) {
    console.error('Update review error:', error);
    return NextResponse.json(
      { error: 'Помилка оновлення відгуку' },
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
    await db.deleteReview(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete review error:', error);
    return NextResponse.json(
      { error: 'Помилка видалення відгуку' },
      { status: 500 }
    );
  }
}
