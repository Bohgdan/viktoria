import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { businessType, businessScale, name, phone, email, recommendedProducts } = data;

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Ім\'я та телефон обов\'язкові' },
        { status: 400 }
      );
    }

    await db.createCalculatorRequest({
      name,
      phone,
      email: email || undefined,
      business_type: businessType || 'Не вказано',
      business_scale: businessScale || 'Не вказано',
      recommended_products: recommendedProducts,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Calculator form error:', error);
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 }
    );
  }
}
