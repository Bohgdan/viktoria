import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

const headers = {
  'Cache-Control': 'no-store, no-cache, must-revalidate',
};

// GET /api/admin/settings - Load all settings
export async function GET() {
  try {
    const settings = await db.getSettings();
    return NextResponse.json(settings, { headers });
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json(
      { error: 'Помилка завантаження налаштувань' },
      { status: 500, headers }
    );
  }
}

// PUT /api/admin/settings - Save all settings
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    await db.saveSettings(data);
    
    // Revalidate pages that use settings
    revalidatePath('/');
    revalidatePath('/contacts');
    
    return NextResponse.json({ success: true }, { headers });
  } catch (error) {
    console.error('Settings PUT error:', error);
    return NextResponse.json(
      { error: 'Помилка збереження налаштувань' },
      { status: 500, headers }
    );
  }
}
