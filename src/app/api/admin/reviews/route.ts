import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

const headers = {
  'Cache-Control': 'no-store, no-cache, must-revalidate',
};

export async function GET() {
  try {
    const reviews = await db.getAllReviews();
    return NextResponse.json(reviews, { headers });
  } catch (error) {
    console.error('Reviews API error:', error);
    return NextResponse.json(
      { error: 'Помилка завантаження відгуків' },
      { status: 500, headers }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const review = await db.createReview(data);
    
    revalidatePath('/');
    
    return NextResponse.json(review, { headers });
  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json(
      { error: 'Помилка створення відгуку' },
      { status: 500, headers }
    );
  }
}
