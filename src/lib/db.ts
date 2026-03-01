import { Pool, PoolClient } from 'pg';

// Create a connection pool (only if DATABASE_URL is set)
const pool = process.env.DATABASE_URL 
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    })
  : null;

// Helper function to execute queries
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function query(
  text: string,
  params?: (string | number | boolean | null | undefined)[]
): Promise<{ rows: any[]; rowCount: number | null }> {
  if (!pool) {
    console.warn('DATABASE_URL not configured, returning empty result');
    return { rows: [], rowCount: 0 };
  }
  
  let client: PoolClient | null = null;
  try {
    client = await pool.connect();
    return await client.query(text, params);
  } catch (error) {
    console.error('Database query error:', text, error);
    throw error;
  } finally {
    if (client) client.release();
  }
}

// Database query helpers
export const db = {
  // Generic query
  query,

  // Categories
  async getCategories() {
    const result = await query('SELECT *, is_active as is_visible FROM categories WHERE is_active = true ORDER BY sort_order');
    return result.rows;
  },

  async getCategoryBySlug(slug: string) {
    const result = await query(
      'SELECT *, is_active as is_visible FROM categories WHERE slug = $1 AND is_active = true',
      [slug]
    );
    return result.rows[0] || null;
  },

  async getCategoryById(id: string) {
    const result = await query(
      'SELECT *, is_active as is_visible FROM categories WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },

  // Subcategories
  async getSubcategories(categoryId?: string) {
    if (categoryId) {
      const result = await query(
        'SELECT * FROM subcategories WHERE category_id = $1 AND is_active = true ORDER BY sort_order',
        [categoryId]
      );
      return result.rows;
    }
    const result = await query(
      'SELECT * FROM subcategories WHERE is_active = true ORDER BY sort_order'
    );
    return result.rows;
  },

  async getSubcategoryBySlug(categorySlug: string, subcategorySlug: string) {
    const result = await query(
      `SELECT s.* FROM subcategories s 
       JOIN categories c ON s.category_id = c.id 
       WHERE c.slug = $1 AND s.slug = $2 AND s.is_active = true`,
      [categorySlug, subcategorySlug]
    );
    return result.rows[0] || null;
  },

  // Products
  async getProducts(options?: { categoryId?: string; subcategoryId?: string; featured?: boolean; limit?: number }) {
    let queryText = 'SELECT * FROM products WHERE is_visible = true';
    const params: (string | number | boolean)[] = [];
    let paramIndex = 1;

    if (options?.categoryId) {
      queryText += ` AND category_id = $${paramIndex++}`;
      params.push(options.categoryId);
    }
    if (options?.subcategoryId) {
      queryText += ` AND subcategory_id = $${paramIndex++}`;
      params.push(options.subcategoryId);
    }
    if (options?.featured) {
      queryText += ' AND featured = true';
    }
    queryText += ' ORDER BY sort_order';
    if (options?.limit) {
      queryText += ` LIMIT $${paramIndex}`;
      params.push(options.limit);
    }

    const result = await query(queryText, params);
    return result.rows;
  },

  async getProductBySlug(slug: string) {
    const result = await query(
      'SELECT * FROM products WHERE slug = $1 AND is_visible = true',
      [slug]
    );
    return result.rows[0] || null;
  },

  async getProductById(id: string) {
    const result = await query('SELECT * FROM products WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  // Reviews
  async getApprovedReviews() {
    const result = await query(
      `SELECT id, author_name, company, text, rating, is_visible, sort_order, created_at 
       FROM reviews WHERE is_visible = true ORDER BY sort_order, created_at DESC`
    );
    return result.rows;
  },

  // Requests
  async createContactRequest(data: {
    name: string;
    phone: string;
    email?: string;
    message?: string;
    type: string;
  }) {
    const result = await query(
      `INSERT INTO contact_requests (name, phone, email, message, status) 
       VALUES ($1, $2, $3, $4, 'new') RETURNING *`,
      [data.name, data.phone, data.email || null, data.message || null]
    );
    return result.rows[0];
  },

  async createCallbackRequest(data: { name: string; phone: string }) {
    const result = await query(
      `INSERT INTO callback_requests (name, phone, status) 
       VALUES ($1, $2, 'new') RETURNING *`,
      [data.name, data.phone]
    );
    return result.rows[0];
  },

  async createCalculatorRequest(data: {
    name: string;
    phone: string;
    email?: string;
    company?: string;
    items?: object;
    total_items?: number;
  }) {
    const result = await query(
      `INSERT INTO calculator_requests (name, phone, email, company, items, total_items, status) 
       VALUES ($1, $2, $3, $4, $5, $6, 'new') RETURNING *`,
      [
        data.name,
        data.phone,
        data.email || null,
        data.company || null,
        JSON.stringify(data.items || {}),
        data.total_items || 0,
      ]
    );
    return result.rows[0];
  },

  // Admin functions
  async getAllProducts(options?: { page?: number; limit?: number; search?: string }) {
    const page = options?.page || 1;
    const limit = options?.limit || 50;
    const offset = (page - 1) * limit;
    const search = options?.search;

    let whereClause = '';
    const params: (string | number)[] = [];
    let paramIndex = 1;

    if (search) {
      whereClause = `WHERE p.name ILIKE $${paramIndex} OR c.name ILIKE $${paramIndex} OR s.name ILIKE $${paramIndex}`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Get total count
    const countResult = await query(`
      SELECT COUNT(*)::int as total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories s ON p.subcategory_id = s.id
      ${whereClause}
    `, params);
    const total = countResult.rows[0]?.total || 0;

    // Get paginated products
    const result = await query(`
      SELECT p.*, 
             c.name as category_name, 
             s.name as subcategory_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories s ON p.subcategory_id = s.id
      ${whereClause}
      ORDER BY p.name
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `, [...params, limit, offset]);

    return {
      products: result.rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  },

  async updateProduct(id: string, data: Record<string, unknown>) {
    // Filter out undefined values to avoid overwriting fields with undefined
    const filteredData: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        filteredData[key] = value;
      }
    }
    
    const keys = Object.keys(filteredData);
    if (keys.length === 0) {
      const current = await query('SELECT * FROM products WHERE id = $1', [id]);
      return current.rows[0];
    }
    
    const values = Object.values(filteredData) as (string | number | boolean | null)[];
    const setClause = keys.map((key, i) => `${key} = $${i + 2}`).join(', ');
    
    const result = await query(
      `UPDATE products SET ${setClause}, updated_at = now() WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    return result.rows[0];
  },

  async createProduct(data: Record<string, unknown>) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
    
    const result = await query(
      `INSERT INTO products (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`,
      values as (string | number | boolean | null)[]
    );
    return result.rows[0];
  },

  async deleteProduct(id: string) {
    await query('DELETE FROM products WHERE id = $1', [id]);
  },

  async getAllCategories() {
    const result = await query('SELECT *, is_active as is_visible FROM categories ORDER BY sort_order');
    return result.rows;
  },

  async getAllSubcategories() {
    const result = await query(`
      SELECT s.*, c.name as category_name 
      FROM subcategories s
      LEFT JOIN categories c ON s.category_id = c.id
      ORDER BY s.sort_order
    `);
    return result.rows;
  },

  async createCategory(data: Record<string, unknown>) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
    
    const result = await query(
      `INSERT INTO categories (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`,
      values as (string | number | boolean | null)[]
    );
    return result.rows[0];
  },

  async updateCategory(id: string, data: Record<string, unknown>) {
    // Filter out undefined values
    const filteredData: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        filteredData[key] = value;
      }
    }
    
    const keys = Object.keys(filteredData);
    if (keys.length === 0) {
      // Nothing to update, just return the current category
      const current = await query('SELECT * FROM categories WHERE id = $1', [id]);
      return current.rows[0];
    }
    
    const values = Object.values(filteredData) as (string | number | boolean | null)[];
    const setClause = keys.map((key, i) => `${key} = $${i + 2}`).join(', ');
    
    const result = await query(
      `UPDATE categories SET ${setClause}, updated_at = now() WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    return result.rows[0];
  },

  async deleteCategory(id: string) {
    await query('DELETE FROM categories WHERE id = $1', [id]);
  },

  async createSubcategory(data: Record<string, unknown>) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
    
    const result = await query(
      `INSERT INTO subcategories (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`,
      values as (string | number | boolean | null)[]
    );
    return result.rows[0];
  },

  async deleteSubcategory(id: string) {
    await query('DELETE FROM subcategories WHERE id = $1', [id]);
  },

  async updateSubcategory(id: string, data: Record<string, unknown>) {
    // Filter out undefined values
    const filteredData: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        filteredData[key] = value;
      }
    }
    
    const keys = Object.keys(filteredData);
    if (keys.length === 0) {
      const current = await query('SELECT * FROM subcategories WHERE id = $1', [id]);
      return current.rows[0];
    }
    
    const values = Object.values(filteredData) as (string | number | boolean | null)[];
    const setClause = keys.map((key, i) => `${key} = $${i + 2}`).join(', ');
    
    const result = await query(
      `UPDATE subcategories SET ${setClause}, updated_at = now() WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    return result.rows[0];
  },

  async getAllRequests() {
    const contactRequests = await query(
      `SELECT id, name, phone, email, message, status, created_at, 'contact' as type FROM contact_requests ORDER BY created_at DESC`
    );
    const callbackRequests = await query(
      `SELECT id, name, phone, NULL as email, NULL as message, status, created_at, 'callback' as type FROM callback_requests ORDER BY created_at DESC`
    );
    const calculatorRequests = await query(
      `SELECT id, name, phone, email, COALESCE(company, '') || ' (' || COALESCE(total_items::text, '0') || ' позицій)' as message, status, created_at, 'calculator' as type FROM calculator_requests ORDER BY created_at DESC`
    );
    
    interface RequestRow { created_at: string; }
    const all = [
      ...contactRequests.rows,
      ...callbackRequests.rows,
      ...calculatorRequests.rows,
    ].sort((a: RequestRow, b: RequestRow) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    return all;
  },

  async updateRequestStatus(id: string, type: string, status: string) {
    const table = type === 'callback' ? 'callback_requests' : 
                  type === 'calculator' ? 'calculator_requests' : 'contact_requests';
    await query(`UPDATE ${table} SET status = $1 WHERE id = $2`, [status, id]);
  },

  async deleteRequest(id: string, type: string) {
    const table = type === 'callback' ? 'callback_requests' : 
                  type === 'calculator' ? 'calculator_requests' : 'contact_requests';
    await query(`DELETE FROM ${table} WHERE id = $1`, [id]);
  },

  async getAllReviews() {
    const result = await query('SELECT * FROM reviews ORDER BY created_at DESC');
    return result.rows;
  },

  async createReview(data: Record<string, unknown>) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
    
    const result = await query(
      `INSERT INTO reviews (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`,
      values as (string | number | boolean | null)[]
    );
    return result.rows[0];
  },

  async updateReview(id: string, data: Record<string, unknown>) {
    const keys = Object.keys(data);
    const values = Object.values(data) as (string | number | boolean | null | undefined)[];
    const setClause = keys.map((key, i) => `${key} = $${i + 2}`).join(', ');
    
    const result = await query(
      `UPDATE reviews SET ${setClause} WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    return result.rows[0];
  },

  async deleteReview(id: string) {
    await query('DELETE FROM reviews WHERE id = $1', [id]);
  },

  // Dashboard stats
  async getDashboardStats() {
    const [products, categories, contactRequests, callbackRequests, calculatorRequests, reviews] = await Promise.all([
      query('SELECT COUNT(*) as count FROM products'),
      query('SELECT COUNT(*) as count FROM categories'),
      query('SELECT COUNT(*) as count FROM contact_requests WHERE status = $1', ['new']),
      query('SELECT COUNT(*) as count FROM callback_requests WHERE status = $1', ['new']),
      query('SELECT COUNT(*) as count FROM calculator_requests WHERE status = $1', ['new']),
      query('SELECT COUNT(*) as count FROM reviews'),
    ]);

    return {
      products: parseInt(String(products.rows[0]?.count || '0')),
      categories: parseInt(String(categories.rows[0]?.count || '0')),
      newRequests: parseInt(String(contactRequests.rows[0]?.count || '0')) + 
                   parseInt(String(callbackRequests.rows[0]?.count || '0')) +
                   parseInt(String(calculatorRequests.rows[0]?.count || '0')),
      reviews: parseInt(String(reviews.rows[0]?.count || '0')),
    };
  },

  async getRecentRequests(limit = 5) {
    const result = await query(`
      (SELECT id, name, phone, status, created_at, 'contact' as type FROM contact_requests ORDER BY created_at DESC LIMIT $1)
      UNION ALL
      (SELECT id, name, phone, status, created_at, 'callback' as type FROM callback_requests ORDER BY created_at DESC LIMIT $1)
      ORDER BY created_at DESC LIMIT $1
    `, [limit]);
    return result.rows;
  },

  // Site Settings
  async getSettings() {
    const result = await query('SELECT key, value FROM site_settings');
    const settings: Record<string, unknown> = {};
    for (const row of result.rows) {
      settings[row.key] = row.value;
    }
    return settings;
  },

  async saveSettings(settings: Record<string, unknown>) {
    for (const [key, value] of Object.entries(settings)) {
      await query(
        `INSERT INTO site_settings (key, value, updated_at) 
         VALUES ($1, $2, now()) 
         ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = now()`,
        [key, String(value)]
      );
    }
    return settings;
  },

  async getSetting(key: string) {
    const result = await query('SELECT value FROM site_settings WHERE key = $1', [key]);
    return result.rows[0]?.value || null;
  },

  async setSetting(key: string, value: unknown) {
    await query(
      `INSERT INTO site_settings (key, value, updated_at) 
       VALUES ($1, $2, now()) 
       ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = now()`,
      [key, String(value)]
    );
  },
};

export default db;
