const { Pool } = require('pg');

const DATABASE_URL = 'postgresql://postgres:vLAuxVbaXtHoTwTIzeEQGzkWVhcWusge@turntable.proxy.rlwy.net:30356/railway';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Starting database migration...\n');

    // Create categories table
    console.log('Creating categories table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        image_url TEXT,
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    console.log('✅ categories table created\n');

    // Create subcategories table
    console.log('Creating subcategories table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS subcategories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL,
        description TEXT,
        image_url TEXT,
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(category_id, slug)
      )
    `);
    console.log('✅ subcategories table created\n');

    // Create products table
    console.log('Creating products table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        price DECIMAL(10, 2),
        old_price DECIMAL(10, 2),
        unit VARCHAR(50) DEFAULT 'шт',
        min_order_qty INTEGER DEFAULT 1,
        category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
        subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL,
        image_url TEXT,
        images JSONB DEFAULT '[]',
        in_stock BOOLEAN DEFAULT true,
        is_visible BOOLEAN DEFAULT true,
        featured BOOLEAN DEFAULT false,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    console.log('✅ products table created\n');

    // Create contact_requests table
    console.log('Creating contact_requests table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS contact_requests (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        email VARCHAR(255),
        message TEXT,
        status VARCHAR(50) DEFAULT 'new',
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    console.log('✅ contact_requests table created\n');

    // Create callback_requests table
    console.log('Creating callback_requests table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS callback_requests (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        status VARCHAR(50) DEFAULT 'new',
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    console.log('✅ callback_requests table created\n');

    // Create calculator_requests table
    console.log('Creating calculator_requests table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS calculator_requests (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(255),
        company VARCHAR(255),
        items JSONB NOT NULL,
        total_items INTEGER,
        status VARCHAR(50) DEFAULT 'new',
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    console.log('✅ calculator_requests table created\n');

    // Create reviews table
    console.log('Creating reviews table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        author_name VARCHAR(255) NOT NULL,
        company VARCHAR(255),
        text TEXT NOT NULL,
        rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
        is_visible BOOLEAN DEFAULT true,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    console.log('✅ reviews table created\n');

    // Create indexes
    console.log('Creating indexes...');
    await client.query(`CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_subcategories_category ON subcategories(category_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_subcategories_slug ON subcategories(slug)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_products_subcategory ON products(subcategory_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = true`);
    console.log('✅ indexes created\n');

    console.log('🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
