const { Pool } = require('pg');

const DATABASE_URL = 'postgresql://postgres:vLAuxVbaXtHoTwTIzeEQGzkWVhcWusge@turntable.proxy.rlwy.net:30356/railway';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Categories data
const categories = [
  { name: 'Спеції', slug: 'spetsiyi', description: 'Перець, паприка та інші спеції', sort_order: 1 },
  { name: 'Приправи', slug: 'pripravy', description: 'Універсальні приправи та бакалія', sort_order: 2 },
  { name: 'Овочеве асорті', slug: 'ovocheve-asorti', description: 'Овочеве асорті без солі та ароматизаторів', sort_order: 3 },
  { name: 'Макарони', slug: 'makarony', description: 'Макаронні вироби різних форм', sort_order: 4 },
  { name: 'Консервація', slug: 'konservatsiya', description: 'Консервовані овочі та томатна продукція', sort_order: 5 },
  { name: 'Олія', slug: 'oliya', description: 'Соняшникова олія високої якості', sort_order: 6 },
];

// Products data (no prices as requested)
const products = [
  // СПЕЦІЇ
  { name: 'Перець чорний ГОРОШОК Преміум 200г', slug: 'perets-chornyi-goroshok-premium-200g', description: 'Перець чорний горошок преміум якість. Фасування 200г, 15шт в ящику.', category_slug: 'spetsiyi', unit: 'шт', featured: true },
  { name: 'Перець чорний МЕЛЕНИЙ Преміум 200г', slug: 'perets-chornyi-melenyi-premium-200g', description: 'Перець чорний мелений преміум якість. Фасування 200г, 15шт в ящику.', category_slug: 'spetsiyi', unit: 'шт', featured: false },
  { name: 'Перець чорний МЕЛЕНИЙ 1 ґатунок 200г', slug: 'perets-chornyi-melenyi-1gat-200g', description: 'Перець чорний мелений 1 ґатунок. Фасування 200г, 15шт в ящику.', category_slug: 'spetsiyi', unit: 'шт', featured: false },
  { name: 'Паприка червона 200г', slug: 'papryka-chervona-200g', description: 'Паприка червона солодка мелена. Фасування 200г, 15шт в ящику.', category_slug: 'spetsiyi', unit: 'шт', featured: true },
  { name: 'Паприка червона 100г', slug: 'papryka-chervona-100g', description: 'Паприка червона солодка мелена. Фасування 100г, 40шт в ящику.', category_slug: 'spetsiyi', unit: 'шт', featured: false },
  { name: 'Паприка КОПЧЕНА 200г', slug: 'papryka-kopchena-200g', description: 'Паприка червона копчена мелена. Фасування 200г, 20шт в ящику.', category_slug: 'spetsiyi', unit: 'шт', featured: true },
  { name: 'Паприка КОПЧЕНА 50г', slug: 'papryka-kopchena-50g', description: 'Паприка червона копчена мелена. Фасування 50г, 70шт в ящику.', category_slug: 'spetsiyi', unit: 'шт', featured: false },
  { name: 'Паприка ЧІЛІ гостра 50г', slug: 'papryka-chili-50g', description: 'Паприка чілі гостра мелена. Фасування 50г, 70шт в ящику.', category_slug: 'spetsiyi', unit: 'шт', featured: false },
  { name: 'Приправа Домашня з копченою паприкою 300г', slug: 'pryprava-domashnya-kopchena-300g', description: 'Набір приправ Домашня з копченою паприкою. Фасування 300г, 15шт в ящику.', category_slug: 'spetsiyi', unit: 'шт', featured: false },

  // ПРИПРАВИ
  { name: 'Приправа Універсальна 5кг (відро)', slug: 'pryprava-universalna-5kg-vidro', description: 'Універсальний набір приправ у пластиковому відрі. Фасування 5кг.', category_slug: 'pripravy', unit: 'шт', featured: true },
  { name: 'Приправа Універсальна 1кг (відро)', slug: 'pryprava-universalna-1kg-vidro', description: 'Універсальний набір приправ у відрі. Фасування 1кг, 6шт в ящику.', category_slug: 'pripravy', unit: 'шт', featured: false },
  { name: 'Приправа Універсальна 1кг (банка)', slug: 'pryprava-universalna-1kg-banka', description: 'Універсальний набір приправ у банці. Фасування 1кг, 12шт в ящику.', category_slug: 'pripravy', unit: 'шт', featured: false },
  { name: 'Приправа Універсальна 600г (банка)', slug: 'pryprava-universalna-600g', description: 'Універсальний набір приправ у банці. Фасування 600г, 12шт в ящику.', category_slug: 'pripravy', unit: 'шт', featured: false },
  { name: 'Приправа Універсальна 450г (банка)', slug: 'pryprava-universalna-450g', description: 'Універсальний набір приправ у банці. Фасування 450г, 15шт в ящику.', category_slug: 'pripravy', unit: 'шт', featured: true },
  { name: 'Приправа Універсальна ПАЧКА 1кг', slug: 'pryprava-universalna-1kg-pachka', description: 'Універсальний набір приправ у пачці. Фасування 1кг, 12шт в ящику.', category_slug: 'pripravy', unit: 'шт', featured: false },
  { name: 'Приправа Універсальна ПАЧКА 250г', slug: 'pryprava-universalna-250g-pachka', description: 'Універсальний набір приправ у пачці. Фасування 250г, 40шт в ящику.', category_slug: 'pripravy', unit: 'шт', featured: false },
  { name: 'Гурманік для бульйонів та соусів 500г', slug: 'gurmanik-500g', description: 'Приправа для бульйонів та соусів. Фасування 500г, 12шт в ящику.', category_slug: 'pripravy', unit: 'шт', featured: true },
  { name: 'Вігета 200г', slug: 'vigeta-200g', description: 'Приправа Вігета універсальна. Фасування 200г, 25шт в ящику.', category_slug: 'pripravy', unit: 'шт', featured: false },
  { name: 'Лимонна кислота 350г', slug: 'lymonna-kyslota-350g', description: 'Лимонна кислота харчова. Фасування 350г, 15шт в ящику.', category_slug: 'pripravy', unit: 'шт', featured: false },
  { name: 'Сода харчова 300г', slug: 'soda-300g', description: 'Сода харчова. Фасування 300г, 40шт в ящику.', category_slug: 'pripravy', unit: 'шт', featured: false },

  // ОВОЧЕВЕ АСОРТІ
  { name: 'Асорті овочеве 300г (банка)', slug: 'asorti-300g-banka', description: 'Овочеве асорті без солі та ароматизаторів у банці. Фасування 300г.', category_slug: 'ovocheve-asorti', unit: 'шт', featured: true },
  { name: 'Асорті овочеве 500г', slug: 'asorti-500g', description: 'Овочеве асорті без солі та ароматизаторів. Фасування 500г.', category_slug: 'ovocheve-asorti', unit: 'шт', featured: false },
  { name: 'Асорті овочеве 500г Бомба', slug: 'asorti-500g-bomba', description: 'Овочеве асорті Бомба преміум класу. Фасування 500г.', category_slug: 'ovocheve-asorti', unit: 'шт', featured: true },
  { name: 'Асорті овочеве 1кг (відро)', slug: 'asorti-1kg-vidro', description: 'Овочеве асорті у відрі без солі. Фасування 1кг.', category_slug: 'ovocheve-asorti', unit: 'шт', featured: false },

  // МАКАРОНИ
  { name: 'Макарони "Черепашка" 5кг (мішок)', slug: 'makarony-cherepashka-5kg', description: 'Макарони черепашка вищого сорту. Фасування 5кг.', category_slug: 'makarony', unit: 'шт', featured: true },
  { name: 'Макарони "Ріжки" 5кг (мішок)', slug: 'makarony-rizhky-5kg', description: 'Макарони ріжки вищого сорту. Фасування 5кг.', category_slug: 'makarony', unit: 'шт', featured: false },
  { name: 'Макарони "Спіраль" 5кг (мішок)', slug: 'makarony-spiral-5kg', description: 'Макарони спіраль вищого сорту. Фасування 5кг.', category_slug: 'makarony', unit: 'шт', featured: false },
  { name: 'Макарони "Пір\'ячко" 5кг (мішок)', slug: 'makarony-piryachko-5kg', description: 'Макарони пір\'ячко вищого сорту. Фасування 5кг.', category_slug: 'makarony', unit: 'шт', featured: true },
  { name: 'Макарони "Ріжки" 800г (пачка)', slug: 'makarony-rizhky-800g', description: 'Макарони ріжки у пачці. Фасування 800г, 20шт в ящику.', category_slug: 'makarony', unit: 'шт', featured: false },
  { name: 'Макарони "Спіраль" 800г (пачка)', slug: 'makarony-spiral-800g', description: 'Макарони спіраль у пачці. Фасування 800г, 20шт в ящику.', category_slug: 'makarony', unit: 'шт', featured: false },
  { name: 'Макарони "Ріжки" 400г (пачка)', slug: 'makarony-rizhky-400g', description: 'Макарони ріжки у пачці. Фасування 400г, 30шт в ящику.', category_slug: 'makarony', unit: 'шт', featured: false },
  { name: 'Вермішель 800г', slug: 'vermishel-800g', description: 'Вермішель тонка. Фасування 800г, 15шт в ящику.', category_slug: 'makarony', unit: 'шт', featured: false },

  // КОНСЕРВАЦІЯ
  { name: 'Томатна паста 25% 500г (банка)', slug: 'tomatna-pasta-25-500g', description: 'Томатна паста 25% у скляній банці. Фасування 500г.', category_slug: 'konservatsiya', unit: 'шт', featured: true },
  { name: 'Томатна паста 25% 400г (банка)', slug: 'tomatna-pasta-25-400g', description: 'Томатна паста 25% у скляній банці. Фасування 400г.', category_slug: 'konservatsiya', unit: 'шт', featured: false },
  { name: 'Томатна паста 25% 700г (банка)', slug: 'tomatna-pasta-25-700g', description: 'Томатна паста 25% у скляній банці. Фасування 700г.', category_slug: 'konservatsiya', unit: 'шт', featured: true },
  { name: 'Горошок консервований 425г', slug: 'goroshok-425g', description: 'Горошок зелений консервований. Фасування 425г.', category_slug: 'konservatsiya', unit: 'шт', featured: false },
  { name: 'Кукурудза консервована 425г', slug: 'kukurudza-425g', description: 'Кукурудза цукрова консервована. Фасування 425г.', category_slug: 'konservatsiya', unit: 'шт', featured: false },
  { name: 'Фасоля консервована 425г', slug: 'fasolya-425g', description: 'Фасоля червона консервована. Фасування 425г.', category_slug: 'konservatsiya', unit: 'шт', featured: false },

  // ОЛІЯ
  { name: 'Олія соняшникова рафінована 5л', slug: 'oliya-rafinovana-5l', description: 'Олія соняшникова рафінована дезодорована. Фасування 5л.', category_slug: 'oliya', unit: 'шт', featured: true },
  { name: 'Олія соняшникова рафінована 3л', slug: 'oliya-rafinovana-3l', description: 'Олія соняшникова рафінована дезодорована. Фасування 3л.', category_slug: 'oliya', unit: 'шт', featured: false },
  { name: 'Олія соняшникова рафінована 1л', slug: 'oliya-rafinovana-1l', description: 'Олія соняшникова рафінована дезодорована. Фасування 1л.', category_slug: 'oliya', unit: 'шт', featured: false },
  { name: 'Олія соняшникова нерафінована 900мл', slug: 'oliya-nerafinovana-900ml', description: 'Олія соняшникова нерафінована домашня. Фасування 900мл.', category_slug: 'oliya', unit: 'шт', featured: true },
];

// Reviews data
const reviews = [
  { author_name: 'Оксана М.', company: 'Продуктовий магазин', text: 'Замовляємо приправи та макарони регулярно. Ціни найкращі серед постачальників!', rating: 5 },
  { author_name: 'Андрій К.', company: 'Кафе "Смачна їжа"', text: 'Якісна продукція, швидка доставка. Особливо подобаються приправи.', rating: 5 },
  { author_name: 'Наталія П.', company: 'ФОП Наталія', text: 'Працюємо з Perfect 4 you вже півроку. Завжди все в наявності.', rating: 5 },
];

async function seed() {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Starting database seed...\n');

    // Clear existing data
    console.log('Clearing existing data...');
    await client.query('DELETE FROM products');
    await client.query('DELETE FROM subcategories');
    await client.query('DELETE FROM categories');
    await client.query('DELETE FROM reviews');
    console.log('✅ Existing data cleared\n');

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
      console.log(`  ✓ ${cat.name}`);
    }
    console.log(`✅ ${categories.length} categories inserted\n`);

    // Insert products
    console.log('Inserting products...');
    let sortOrder = 1;
    for (const prod of products) {
      await client.query(
        `INSERT INTO products (name, slug, description, category_id, unit, featured, is_visible, in_stock, sort_order) 
         VALUES ($1, $2, $3, $4, $5, $6, true, true, $7)`,
        [prod.name, prod.slug, prod.description, categoryIds[prod.category_slug], prod.unit, prod.featured, sortOrder++]
      );
    }
    console.log(`✅ ${products.length} products inserted\n`);

    // Insert reviews
    console.log('Inserting reviews...');
    let reviewOrder = 1;
    for (const rev of reviews) {
      await client.query(
        `INSERT INTO reviews (author_name, company, text, rating, is_visible, sort_order) 
         VALUES ($1, $2, $3, $4, true, $5)`,
        [rev.author_name, rev.company, rev.text, rev.rating, reviewOrder++]
      );
      console.log(`  ✓ ${rev.author_name}`);
    }
    console.log(`✅ ${reviews.length} reviews inserted\n`);

    // Show summary
    const catCount = await client.query('SELECT COUNT(*) FROM categories');
    const prodCount = await client.query('SELECT COUNT(*) FROM products');
    const revCount = await client.query('SELECT COUNT(*) FROM reviews');
    
    console.log('📊 Database Summary:');
    console.log(`   Categories: ${catCount.rows[0].count}`);
    console.log(`   Products: ${prodCount.rows[0].count}`);
    console.log(`   Reviews: ${revCount.rows[0].count}`);
    console.log('\n🎉 Seed completed successfully!');
    
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
