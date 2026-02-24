import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { type, status } = await request.json();
    await db.updateRequestStatus(id, type, status);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update request error:', error);
    return NextResponse.json(
      { error: 'Помилка оновлення заявки' },
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
    const type = searchParams.get('type') || 'contact';
    await db.deleteRequest(id, type);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete request error:', error);
    return NextResponse.json(
      { error: 'Помилка видалення заявки' },
      { status: 500 }
    );
  }
}
