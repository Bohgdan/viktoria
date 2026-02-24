import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { name, phone } = data;

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Ім\'я та телефон обов\'язкові' },
        { status: 400 }
      );
    }

    await db.createCallbackRequest({ name, phone });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Callback form error:', error);
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 }
    );
  }
}
