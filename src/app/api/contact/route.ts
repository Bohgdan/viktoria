import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { name, phone, email, message, type } = data;

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Ім\'я та телефон обов\'язкові' },
        { status: 400 }
      );
    }

    await db.createContactRequest({
      name,
      phone,
      email: email || undefined,
      message: message || undefined,
      type: type || 'contact',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 }
    );
  }
}
