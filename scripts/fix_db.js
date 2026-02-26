const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:vLAuxVbaXtHoTwTIzeEQGzkWVhcWusge@turntable.proxy.rlwy.net:30356/railway',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  const client = await pool.connect();
  try {
    // Create site_settings table
    console.log('Creating site_settings table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        key TEXT UNIQUE NOT NULL,
        value TEXT NOT NULL DEFAULT '',
        updated_at TIMESTAMPTZ DEFAULT now()
      )
    `);
    console.log('✅ site_settings table ready');

    // Check count
    const res = await client.query('SELECT COUNT(*) FROM site_settings');
    console.log('Settings rows:', res.rows[0].count);

    // If empty, seed with defaults
    if (parseInt(res.rows[0].count) === 0) {
      console.log('Seeding default settings...');
      const defaults = [
        ['company_name', 'Perfect 4 You'],
        ['phone', '+380 (50) 517-25-93'],
        ['email', 'info@perfect4you.com.ua'],
        ['address', 'м. Ужгород, вул. Минайська 12'],
        ['viber', '+380505172593'],
        ['telegram', '+380505172593'],
        ['whatsapp', '+380505172593'],
        ['instagram', ''],
        ['facebook', ''],
        ['work_hours', 'Пн-Пт: 9:00-18:00, Сб: 9:00-14:00'],
      ];
      for (const [key, value] of defaults) {
        await client.query(
          `INSERT INTO site_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING`,
          [key, value]
        );
      }
      console.log('✅ Default settings seeded');
    }

    // Verify products table has image_data column
    const cols = await client.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'products' AND column_name = 'image_data'
    `);
    if (cols.rows.length === 0) {
      console.log('Adding image_data column...');
      await client.query('ALTER TABLE products ADD COLUMN IF NOT EXISTS image_data TEXT');
      console.log('✅ image_data column added');
    } else {
      console.log('✅ image_data column exists');
    }

    // List all tables
    const tables = await client.query(`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename
    `);
    console.log('\nAll tables:', tables.rows.map(r => r.tablename).join(', '));

    console.log('\n🎉 Database fix complete!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
