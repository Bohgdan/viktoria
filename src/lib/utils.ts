import slugifyLib from 'slugify';

// ============================================
// PRICE FORMATTING
// ============================================

/**
 * Format price in Ukrainian Hryvnia
 * @example formatPrice(1500) => "1 500 ₴"
 */
export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined) {
    return "Ціна за запитом";
  }
  
  return new Intl.NumberFormat('uk-UA', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price) + ' ₴';
}

/**
 * Format price with unit
 * @example formatPriceWithUnit(150, "кг") => "150 ₴/кг"
 */
export function formatPriceWithUnit(price: number | null | undefined, unit: string): string {
  if (price === null || price === undefined) {
    return "Ціна за запитом";
  }
  
  return `${formatPrice(price)}/${unit}`;
}

// ============================================
// SLUG GENERATION
// ============================================

/**
 * Generate URL-friendly slug from text
 * @example slugify("Молочні продукти") => "molochni-produkty"
 */
export function slugify(text: string): string {
  return slugifyLib(text, {
    lower: true,
    strict: true,
    locale: 'uk',
  });
}

/**
 * Generate unique slug by appending number if needed
 */
export function generateUniqueSlug(text: string, existingSlugs: string[] = []): string {
  let slug = slugify(text);
  let counter = 1;
  
  while (existingSlugs.includes(slug)) {
    slug = `${slugify(text)}-${counter}`;
    counter++;
  }
  
  return slug;
}

// ============================================
// TEXT UTILITIES
// ============================================

/**
 * Truncate text to specified length with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Capitalize first letter
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Remove HTML tags from string
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

// ============================================
// PHONE FORMATTING
// ============================================

/**
 * Format phone number for display
 * @example formatPhone("+380501234567") => "+380 (50) 123-45-67"
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 12 && cleaned.startsWith('380')) {
    return `+380 (${cleaned.slice(3, 5)}) ${cleaned.slice(5, 8)}-${cleaned.slice(8, 10)}-${cleaned.slice(10)}`;
  }
  
  return phone;
}

/**
 * Get phone number for tel: link
 */
export function getPhoneLink(phone: string): string {
  return `tel:${phone.replace(/\D/g, '')}`;
}

// ============================================
// MESSENGER LINKS
// ============================================

export function getViberLink(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  return `viber://chat?number=%2B${cleaned}`;
}

export function getTelegramLink(username: string): string {
  // Handle both @username and https://t.me/username formats
  if (username.startsWith('@')) {
    return `https://t.me/${username.slice(1)}`;
  }
  if (username.startsWith('http')) {
    return username;
  }
  return `https://t.me/${username}`;
}

export function getWhatsAppLink(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  return `https://wa.me/${cleaned}`;
}

// ============================================
// DATE FORMATTING
// ============================================

/**
 * Format date in Ukrainian locale
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format date with time
 */
export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('uk-UA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get relative time (e.g., "2 години тому")
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Щойно';
  if (diffMins < 60) return `${diffMins} хв. тому`;
  if (diffHours < 24) return `${diffHours} год. тому`;
  if (diffDays < 7) return `${diffDays} дн. тому`;
  
  return formatDate(dateString);
}

// ============================================
// YEARS CALCULATION
// ============================================

/**
 * Calculate years on market from start year
 */
export function getYearsOnMarket(startYear: string | number): number {
  const start = typeof startYear === 'string' ? parseInt(startYear, 10) : startYear;
  return new Date().getFullYear() - start;
}

// ============================================
// VALIDATION
// ============================================

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 15;
}

// ============================================
// CLASS NAME UTILITIES
// ============================================

/**
 * Merge class names conditionally
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

// ============================================
// IMAGE UTILITIES
// ============================================

/**
 * Get placeholder image URL based on type
 */
export function getPlaceholderImage(type: 'product' | 'category' | 'hero' = 'product'): string {
  switch (type) {
    case 'product':
      return '/images/placeholder-product.svg';
    case 'category':
      return '/images/placeholder-category.svg';
    case 'hero':
      return '/images/hero-bg.jpg';
    default:
      return '/images/placeholder-product.svg';
  }
}

/**
 * Check if URL is valid image
 */
export function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return url.startsWith('/');
  }
}

// ============================================
// ARRAY UTILITIES
// ============================================

/**
 * Group array items by key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    return {
      ...groups,
      [groupKey]: [...(groups[groupKey] || []), item],
    };
  }, {} as Record<string, T[]>);
}

/**
 * Remove duplicates from array
 */
export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}

/**
 * Sort array by sort_order field
 */
export function sortBySortOrder<T extends { sort_order: number }>(array: T[]): T[] {
  return [...array].sort((a, b) => a.sort_order - b.sort_order);
}
