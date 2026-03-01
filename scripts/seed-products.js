const { Pool } = require('pg');

const DATABASE_URL = 'postgresql://postgres:vLAuxVbaXtHoTwTIzeEQGzkWVhcWusge@turntable.proxy.rlwy.net:30356/railway';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function addProducts() {
  const client = await pool.connect();
  try {
    console.log('Adding test products...\n');
    
    // Get category and subcategory ids
    const cats = await client.query('SELECT id, slug FROM categories');
    const subs = await client.query('SELECT id, slug, category_id FROM subcategories');
    
    const catMap = {};
    cats.rows.forEach(c => catMap[c.slug] = c.id);
    const subMap = {};
    subs.rows.forEach(s => subMap[s.slug] = { id: s.id, cat: s.category_id });
    
    const products = [
      { name: 'Паприка закарпатська мелена', slug: 'papryka-zakarpat', price: 85, category_slug: 'spetsii', sub_slug: 'papryka', unit: 'кг', featured: true },
      { name: 'Паприка солодка', slug: 'papryka-solodka', price: 75, category_slug: 'spetsii', sub_slug: 'papryka', unit: 'кг' },
      { name: 'Перець чорний мелений', slug: 'perets-chornyi', price: 180, category_slug: 'spetsii', sub_slug: 'perets', unit: 'кг', featured: true },
      { name: 'Перець білий мелений', slug: 'perets-bilyi', price: 220, category_slug: 'spetsii', sub_slug: 'perets', unit: 'кг' },
      { name: 'Суміш спецій для м\'яса', slug: 'sumish-myaso', price: 95, category_slug: 'spetsii', sub_slug: 'sumishi-spetsij', unit: 'кг' },
      { name: 'Рожки звичайні 400г', slug: 'rozhky-400', price: 22, category_slug: 'makaronni-vyroby', sub_slug: 'rozhky', unit: 'пачка' },
      { name: 'Спіраль 400г', slug: 'spiral-400', price: 22, category_slug: 'makaronni-vyroby', sub_slug: 'spiral', unit: 'пачка' },
      { name: 'Вермішель 400г', slug: 'vermishel-400', price: 20, category_slug: 'makaronni-vyroby', sub_slug: 'vermishel', unit: 'пачка', featured: true },
      { name: 'Галушка 400г', slug: 'galushka-400', price: 24, category_slug: 'makaronni-vyroby', sub_slug: 'galushka', unit: 'пачка' },
      { name: 'Лапша яєчна 400г', slug: 'lapsha-400', price: 28, category_slug: 'makaronni-vyroby', sub_slug: 'lapsha', unit: 'пачка' },
      { name: 'Кукурудза консервована 400г', slug: 'kukurudza-400', price: 35, category_slug: 'konservatsiia', sub_slug: 'kukurudza', unit: 'банка' },
      { name: 'Горошок зелений 400г', slug: 'goroshok-400', price: 32, category_slug: 'konservatsiia', sub_slug: 'goroshok', unit: 'банка' },
      { name: 'Огірки мариновані 720г', slug: 'ogirky-720', price: 45, category_slug: 'konservatsiia', sub_slug: 'ogirky', unit: 'банка' },
      { name: 'Томати консервовані 720г', slug: 'tomaty-720', price: 42, category_slug: 'konservatsiia', sub_slug: 'tomaty', unit: 'банка' },
      { name: 'Олія соняшникова 1л', slug: 'oliia-1l', price: 58, category_slug: 'oliia-ta-zhyry', sub_slug: 'oliia-soniashnikova', unit: 'л', featured: true },
      { name: 'Олія соняшникова 5л', slug: 'oliia-5l', price: 270, category_slug: 'oliia-ta-zhyry', sub_slug: 'oliia-soniashnikova', unit: 'л' },
      { name: 'Універсальна приправа 1кг', slug: 'pryprava-universal', price: 95, category_slug: 'prypravy', sub_slug: 'universalna', unit: 'кг' },
      { name: 'Вігета приправа 500г', slug: 'vigeta-500', price: 65, category_slug: 'prypravy', sub_slug: 'vigeta-gurmanik', unit: 'пачка' },
      { name: 'Сода харчова 500г', slug: 'soda-500', price: 18, category_slug: 'bakaliia', sub_slug: 'soda', unit: 'пачка' },
      { name: 'Лимонна кислота 100г', slug: 'lymonna-100', price: 25, category_slug: 'bakaliia', sub_slug: 'lymonna-kyslota', unit: 'пачка' },
    ];
    
    for (const p of products) {
      const catId = catMap[p.category_slug];
      const subId = subMap[p.sub_slug]?.id;
      
      if (!catId) {
        console.log('  ! Category not found: ' + p.category_slug);
        continue;
      }
      
      await client.query(
        `INSERT INTO products (name, slug, price, category_id, subcategory_id, unit, featured, is_visible, in_stock) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, true, true)
         ON CONFLICT (slug) DO NOTHING`,
        [p.name, p.slug, p.price, catId, subId || null, p.unit, p.featured || false]
      );
      console.log('  + ' + p.name);
    }
    
    const count = await client.query('SELECT COUNT(*) as cnt FROM products');
    console.log('\n' + count.rows[0].cnt + ' products in database!');
    
  } finally {
    client.release();
    await pool.end();
  }
}

addProducts().catch(console.error);
