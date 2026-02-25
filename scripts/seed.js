const { Pool } = require('pg');

const DATABASE_URL = 'postgresql://postgres:vLAuxVbaXtHoTwTIzeEQGzkWVhcWusge@turntable.proxy.rlwy.net:30356/railway';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Categories data (7 categories as specified)
const categories = [
  { name: 'Спеції', slug: 'spetsii', description: 'Паприка, перець та суміші спецій', sort_order: 1 },
  { name: 'Приправи', slug: 'prypravy', description: 'Універсальні приправи, Вігета та Гурманік', sort_order: 2 },
  { name: 'Овочеве асорті', slug: 'ovocheve-asorti', description: 'Асорті без солі, часник, зелень', sort_order: 3 },
  { name: 'Макаронні вироби', slug: 'makaronni-vyroby', description: 'Рожки, спіраль, вермішель та інші', sort_order: 4 },
  { name: 'Консервація', slug: 'konservatsiia', description: 'Кукурудза, горошок, огірки, томати', sort_order: 5 },
  { name: 'Олія та жири', slug: 'oliia-ta-zhyry', description: 'Соняшникова олія', sort_order: 6 },
  { name: 'Бакалія', slug: 'bakaliia', description: 'Сода, лимонна кислота', sort_order: 7 },
];

// Subcategories data (linked by category_slug)
const subcategories = [
  // Спеції
  { name: 'Паприка', slug: 'papryka', category_slug: 'spetsii', sort_order: 1 },
  { name: 'Перець', slug: 'perets', category_slug: 'spetsii', sort_order: 2 },
  { name: 'Суміші спецій', slug: 'sumishi-spetsij', category_slug: 'spetsii', sort_order: 3 },
  
  // Приправи
  { name: 'Універсальна приправа', slug: 'universalna', category_slug: 'prypravy', sort_order: 1 },
  { name: 'Вігета та Гурманік', slug: 'vigeta-gurmanik', category_slug: 'prypravy', sort_order: 2 },
  
  // Овочеве асорті
  { name: 'Асорті без солі', slug: 'asorti-bez-soli', category_slug: 'ovocheve-asorti', sort_order: 1 },
  { name: 'Спеції для страв', slug: 'spetsii-dlya-strav', category_slug: 'ovocheve-asorti', sort_order: 2 },
  { name: 'Часник', slug: 'chasnyk', category_slug: 'ovocheve-asorti', sort_order: 3 },
  { name: 'Суміш зелені', slug: 'sumish-zeleni', category_slug: 'ovocheve-asorti', sort_order: 4 },
  
  // Макаронні вироби
  { name: 'Рожки', slug: 'rozhky', category_slug: 'makaronni-vyroby', sort_order: 1 },
  { name: 'Спіраль', slug: 'spiral', category_slug: 'makaronni-vyroby', sort_order: 2 },
  { name: 'Галушка', slug: 'galushka', category_slug: 'makaronni-vyroby', sort_order: 3 },
  { name: 'Лапша', slug: 'lapsha', category_slug: 'makaronni-vyroby', sort_order: 4 },
  { name: 'Вермішель', slug: 'vermishel', category_slug: 'makaronni-vyroby', sort_order: 5 },
  { name: 'Перо', slug: 'pero', category_slug: 'makaronni-vyroby', sort_order: 6 },
  { name: 'Трубочка', slug: 'trubochka', category_slug: 'makaronni-vyroby', sort_order: 7 },
  { name: 'Кільця', slug: 'kiltsia', category_slug: 'makaronni-vyroby', sort_order: 8 },
  { name: 'Зірочка', slug: 'zirochka', category_slug: 'makaronni-vyroby', sort_order: 9 },
  { name: 'Ракушка', slug: 'rakushka', category_slug: 'makaronni-vyroby', sort_order: 10 },
  { name: 'Паутинка', slug: 'pautynka', category_slug: 'makaronni-vyroby', sort_order: 11 },
  { name: 'Косичка', slug: 'kosychka', category_slug: 'makaronni-vyroby', sort_order: 12 },
  { name: 'Локшина', slug: 'lokshyna', category_slug: 'makaronni-vyroby', sort_order: 13 },
  { name: 'Чіга', slug: 'chiga', category_slug: 'makaronni-vyroby', sort_order: 14 },
  { name: 'Коцка', slug: 'kotsna', category_slug: 'makaronni-vyroby', sort_order: 15 },
  { name: 'Торгоня', slug: 'torgonya', category_slug: 'makaronni-vyroby', sort_order: 16 },
  
  // Консервація
  { name: 'Кукурудза', slug: 'kukurudza', category_slug: 'konservatsiia', sort_order: 1 },
  { name: 'Горошок', slug: 'goroshok', category_slug: 'konservatsiia', sort_order: 2 },
  { name: 'Огірки', slug: 'ogirky', category_slug: 'konservatsiia', sort_order: 3 },
  { name: 'Томати', slug: 'tomaty', category_slug: 'konservatsiia', sort_order: 4 },
  { name: 'Квасоля', slug: 'kvasolya', category_slug: 'konservatsiia', sort_order: 5 },
  
  // Олія та жири
  { name: 'Олія соняшникова', slug: 'oliia-soniashnikova', category_slug: 'oliia-ta-zhyry', sort_order: 1 },
  
  // Бакалія
  { name: 'Сода', slug: 'soda', category_slug: 'bakaliia', sort_order: 1 },
  { name: 'Лимонна кислота', slug: 'lymonna-kyslota', category_slug: 'bakaliia', sort_order: 2 },
];

// Reviews data
const reviews = [
  { author_name: 'Оксана М.', company: 'Продуктовий магазин', text: 'Замовляємо приправи та макарони регулярно. Ціни найкращі серед постачальників!', rating: 5 },
  { author_name: 'Андрій К.', company: 'Кафе "Смачна їжа"', text: 'Якісна продукція, швидка доставка. Особливо подобаються приправи.', rating: 5 },
  { author_name: 'Наталія П.', company: 'ФОП Наталія', text: 'Працюємо з Perfect 4 you вже півроку. Завжди все в наявності.', rating: 5 },
];

// Site settings
const siteSettings = [
  { key: 'company_name', value: 'Perfect 4 You' },
  { key: 'phone', value: '+380 97 123 45 67' },
  { key: 'email', value: 'info@perfect4you.com.ua' },
  { key: 'address', value: 'м. Київ, Україна' },
  { key: 'work_hours', value: 'Пн-Пт: 9:00-18:00, Сб: 10:00-15:00' },
  { key: 'viber', value: 'viber://chat?number=%2B380971234567' },
  { key: 'telegram', value: 'https://t.me/perfect4you' },
  { key: 'whatsapp', value: 'https://wa.me/380971234567' },
  { key: 'hero_title', value: 'Оптовий постачальник продуктів харчування' },
  { key: 'hero_subtitle', value: 'Спеції, приправи, макарони та консервація для вашого бізнесу' },
  { key: 'about_text', value: 'Perfect 4 You - надійний партнер для вашого бізнесу. Ми пропонуємо широкий асортимент якісних продуктів за оптовими цінами.' },
];

async function seed() {
  const client = await pool.connect();
  
  try {
    console.log('Starting database seed...\n');

    // Clear existing data (in correct order due to foreign keys)
    console.log('Clearing existing data...');
    await client.query('TRUNCATE products, subcategories, categories, reviews CASCADE');
    console.log('Existing data cleared\n');

    // Create site_settings table if not exists
    console.log('Creating site_settings table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        key VARCHAR(100) PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    await client.query('DELETE FROM site_settings');
    console.log('site_settings table ready\n');

    // Insert categories
    console.log('Inserting categories...');
    const categoryIds = {};
    for (const cat of categories) {
      const result = await client.query(
        `INSERT INTO categories (name, slug, description, sort_order, is_active) 
         VALUES ($1, $2, $3, $4, true) RETURNING id`,
        [cat.name, cat.slug, cat.description, cat.sort_order]
      );
      categoryIds[cat.slug] = result.rows[0].id;
      console.log(`  + ${cat.name}`);
    }
    console.log(`${categories.length} categories inserted\n`);

    // Insert subcategories
    console.log('Inserting subcategories...');
    for (const sub of subcategories) {
      const categoryId = categoryIds[sub.category_slug];
      if (!categoryId) {
        console.log(`  ! Skipping ${sub.name} - category ${sub.category_slug} not found`);
        continue;
      }
      await client.query(
        `INSERT INTO subcategories (category_id, name, slug, sort_order, is_active) 
         VALUES ($1, $2, $3, $4, true)`,
        [categoryId, sub.name, sub.slug, sub.sort_order]
      );
    }
    console.log(`${subcategories.length} subcategories inserted\n`);

    // Insert reviews
    console.log('Inserting reviews...');
    let reviewOrder = 1;
    for (const rev of reviews) {
      await client.query(
        `INSERT INTO reviews (author_name, company, text, rating, is_visible, sort_order) 
         VALUES ($1, $2, $3, $4, true, $5)`,
        [rev.author_name, rev.company, rev.text, rev.rating, reviewOrder++]
      );
      console.log(`  + ${rev.author_name}`);
    }
    console.log(`${reviews.length} reviews inserted\n`);

    // Insert site settings
    console.log('Inserting site settings...');
    for (const setting of siteSettings) {
      await client.query(
        `INSERT INTO site_settings (key, value) VALUES ($1, $2)
         ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()`,
        [setting.key, setting.value]
      );
    }
    console.log(`${siteSettings.length} settings inserted\n`);

    // Show summary
    const catCount = await client.query('SELECT COUNT(*) FROM categories');
    const subCount = await client.query('SELECT COUNT(*) FROM subcategories');
    const prodCount = await client.query('SELECT COUNT(*) FROM products');
    const revCount = await client.query('SELECT COUNT(*) FROM reviews');
    const settingsCount = await client.query('SELECT COUNT(*) FROM site_settings');
    
    console.log('Database Summary:');
    console.log(`   Categories: ${catCount.rows[0].count}`);
    console.log(`   Subcategories: ${subCount.rows[0].count}`);
    console.log(`   Products: ${prodCount.rows[0].count} (empty - add via admin)`);
    console.log(`   Reviews: ${revCount.rows[0].count}`);
    console.log(`   Settings: ${settingsCount.rows[0].count}`);
    console.log('\nSeed completed successfully!');
    
  } catch (error) {
    console.error('Seed failed:', error.message);
    console.error(error.stack);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
