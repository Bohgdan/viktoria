// ============================================
// DATABASE TYPES
// ============================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  image_url: string | null;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
  // Joined data
  subcategories?: Category[];
  parent?: Category;
  products_count?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number | null;
  old_price: number | null;
  unit: string;
  min_order_qty: number;
  category_id: string | null;
  image_url: string | null;
  image_data?: string | null;
  images: string[];
  in_stock: boolean;
  is_visible: boolean;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // Joined data
  category?: Category;
}

export interface Review {
  id: string;
  author_name: string;
  company: string | null;
  author_company?: string | null; // Alias for company (for backward compatibility)
  text: string;
  rating: number;
  is_visible: boolean;
  sort_order: number;
  created_at: string;
}

export interface SiteSetting {
  key: string;
  value: string | number | boolean | object;
  updated_at: string;
}

export interface ContactRequest {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  message: string | null;
  status?: 'new' | 'processing' | 'completed';
  is_read: boolean;
  created_at: string;
}

export interface Advantage {
  id: string;
  title: string;
  description: string | null;
  icon: string;
  sort_order: number;
  is_visible: boolean;
}

// ============================================
// FORM TYPES
// ============================================

export interface ContactFormData {
  name: string;
  phone: string;
  email?: string;
  message?: string;
}

export interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  price: number | null;
  old_price: number | null;
  unit: string;
  min_order_qty: number;
  category_id: string | null;
  image_url: string | null;
  images: string[];
  in_stock: boolean;
  featured: boolean;
  sort_order: number;
}

export interface CategoryFormData {
  name: string;
  slug: string;
  parent_id: string | null;
  image_url: string | null;
  sort_order: number;
  is_visible: boolean;
}

export interface ReviewFormData {
  author_name: string;
  company: string;
  text: string;
  rating: number;
  is_visible: boolean;
  sort_order: number;
}

// ============================================
// UI TYPES
// ============================================

export interface NavItem {
  label: string;
  href: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface TargetAudienceItem {
  title: string;
  description: string;
  icon?: string;
}

// ============================================
// SETTINGS MAP TYPE
// ============================================

export interface SiteSettings {
  company_name: string;
  phone_primary: string;
  phone_secondary: string;
  email: string;
  address: string;
  viber: string;
  telegram: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  about_text: string;
  years_on_market: string;
  hero_title: string;
  hero_subtitle: string;
  min_order: string;
  delivery_info: string;
  payment_info: string;
  working_hours: string;
  google_maps_embed: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// ============================================
// PAGINATION TYPES
// ============================================

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
