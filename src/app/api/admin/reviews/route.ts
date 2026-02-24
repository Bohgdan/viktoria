import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const reviews = await db.getAllReviews();
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Reviews API error:', error);
    return NextResponse.json(
      { error: 'Помилка завантаження відгуків' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const review = await db.createReview(data);
    return NextResponse.json(review);
  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json(
      { error: 'Помилка створення відгуку' },
      { status: 500 }
    );
  }
}
