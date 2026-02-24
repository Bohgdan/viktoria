import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const requests = await db.getAllRequests();
    return NextResponse.json(requests);
  } catch (error) {
    console.error('Requests API error:', error);
    return NextResponse.json(
      { error: 'Помилка завантаження заявок' },
      { status: 500 }
    );
  }
}
