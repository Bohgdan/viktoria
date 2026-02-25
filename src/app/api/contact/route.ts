import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

async function sendToTelegram(name: string, phone: string, message?: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn('Telegram credentials not configured');
    return false;
  }

  const text = `📬 *Нова заявка з сайту*\n\n👤 *Ім'я:* ${name}\n📞 *Телефон:* ${phone}${message ? `\n💬 *Повідомлення:* ${message}` : ''}`;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'Markdown',
        }),
      }
    );

    if (!response.ok) {
      console.error('Telegram API error:', await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
    return false;
  }
}

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

    // Send to Telegram
    await sendToTelegram(name, phone, message);

    // Save to database
    await db.createContactRequest({
      name,
      phone,
      email: email || undefined,
      message: message || undefined,
      type: type || 'contact',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 }
    );
  }
}
