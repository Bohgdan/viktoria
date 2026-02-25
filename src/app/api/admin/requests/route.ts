import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

const headers = {
  'Cache-Control': 'no-store, no-cache, must-revalidate',
};

export async function GET() {
  try {
    const requests = await db.getAllRequests();
    return NextResponse.json(requests, { headers });
  } catch (error) {
    console.error('Requests API error:', error);
    return NextResponse.json(
      { error: 'Помилка завантаження заявок' },
      { status: 500, headers }
    );
  }
}
