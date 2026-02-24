import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const stats = await db.getDashboardStats();
    const recentRequests = await db.getRecentRequests(5);
    
    return NextResponse.json({
      stats,
      recentRequests,
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Помилка завантаження даних' },
      { status: 500 }
    );
  }
}
