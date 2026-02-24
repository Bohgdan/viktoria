import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';

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

    const supabase = await createServerClient();

    const { error } = await supabase.from('requests').insert({
      name,
      phone,
      email: email || null,
      message: message || null,
      type: type || 'contact',
      status: 'new',
    });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Помилка збереження заявки' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 }
    );
  }
}
