import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

const headers = {
  'Cache-Control': 'no-store, no-cache, must-revalidate',
};

export async function GET() {
  try {
    let stats = { products: 0, categories: 0, newRequests: 0, reviews: 0 };
    let recentRequests: unknown[] = [];
    
    try {
      stats = await db.getDashboardStats();
    } catch (e) {
      console.error('Stats error:', e);
    }
    
    try {
      recentRequests = await db.getRecentRequests(5);
    } catch (e) {
      console.error('Recent requests error:', e);
    }
    
    return NextResponse.json({ stats, recentRequests }, { headers });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { 
        stats: { products: 0, categories: 0, newRequests: 0, reviews: 0 },
        recentRequests: [] 
      },
      { headers }
    );
  }
}
