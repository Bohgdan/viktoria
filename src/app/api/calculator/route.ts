import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { businessType, businessName, city, name, phone, email, comment } = data;

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Ім\'я та телефон обов\'язкові' },
        { status: 400 }
      );
    }

    const supabase = await createServerClient();

    // Compose detailed message with business info
    const message = [
      `Тип бізнесу: ${businessType || 'Не вказано'}`,
      `Назва закладу: ${businessName || 'Не вказано'}`,
      `Місто: ${city || 'Не вказано'}`,
      comment ? `Коментар: ${comment}` : '',
    ].filter(Boolean).join('\n');

    const { error } = await supabase.from('requests').insert({
      name,
      phone,
      email: email || null,
      message,
      type: 'calculator',
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
    console.error('Calculator form error:', error);
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 }
    );
  }
}
