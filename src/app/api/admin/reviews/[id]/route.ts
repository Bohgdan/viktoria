import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

const headers = {
  'Cache-Control': 'no-store, no-cache, must-revalidate',
};

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const review = await db.updateReview(id, data);
    
    revalidatePath('/');
    
    return NextResponse.json(review, { headers });
  } catch (error) {
    console.error('Update review error:', error);
    return NextResponse.json(
      { error: 'Помилка оновлення відгуку' },
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
    await db.deleteReview(id);
    
    revalidatePath('/');
    
    return NextResponse.json({ success: true }, { headers });
  } catch (error) {
    console.error('Delete review error:', error);
    return NextResponse.json(
      { error: 'Помилка видалення відгуку' },
      { status: 500, headers }
    );
  }
}
