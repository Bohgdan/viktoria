'use client';

import { useEffect, useState, useRef } from 'react';
import { Plus, Search, Edit2, Trash2, Package, Loader2, X, Upload, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number | null;
  unit: string;
  min_order_qty: number;
  image_url: string | null;
  image_data?: string | null;
  in_stock: boolean;
  featured: boolean;
  subcategory_id: string;
  category_id?: string;
  category_name?: string;
  subcategory_name?: string;
}

interface Subcategory {
  id: string;
  name: string;
  category_id: string;
  category_name?: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    unit: 'кг',
    min_order_qty: '1',
    subcategory_id: '',
    image_url: '',
    in_stock: true,
    is_featured: false,
  });

  useEffect(() => {
    fetchProducts();
    fetchSubcategories();
  }, []);

  async function fetchProducts() {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Помилка завантаження товарів');
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchSubcategories() {
    try {
      const res = await fetch('/api/admin/categories');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setSubcategories(data.subcategories || []);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  }

  function openCreateModal() {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      unit: 'кг',
      min_order_qty: '1',
      subcategory_id: subcategories[0]?.id || '',
      image_url: '',
      in_stock: true,
      is_featured: false,
    });
    setImagePreview(null);
    setImageData(null);
    setIsModalOpen(true);
  }

  function openEditModal(product: Product) {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price?.toString() || '',
      unit: product.unit,
      min_order_qty: product.min_order_qty.toString(),
      subcategory_id: product.subcategory_id || '',
      image_url: product.image_url || '',
      in_stock: product.in_stock,
      is_featured: product.featured,
    });
    // Set preview from existing image
    if (product.image_data) {
      setImagePreview(`/api/images/${product.id}`);
    } else if (product.image_url) {
      setImagePreview(product.image_url);
    } else {
      setImagePreview(null);
    }
    setImageData(null);
    setIsModalOpen(true);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Дозволено лише зображення');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Файл занадто великий (макс. 5MB)');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      if (editingProduct) {
        // Upload directly to existing product
        formData.append('productId', editingProduct.id);
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error('Upload failed');

        const data = await res.json();
        setImagePreview(data.imageUrl);
        toast.success('Зображення завантажено');
      } else {
        // Get base64 for new product
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error('Upload failed');

        const data = await res.json();
        setImageData(data.imageData);
        setImagePreview(data.imageData);
        toast.success('Зображення готове до збереження');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Помилка завантаження');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  async function handleSave() {
    if (!formData.name) {
      toast.error('Введіть назву товару');
      return;
    }

    setIsSaving(true);
    try {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-zа-яіїєґ0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

      // Get category_id from selected subcategory
      const selectedSubcategory = subcategories.find(s => s.id === formData.subcategory_id);
      const categoryId = selectedSubcategory?.category_id || null;

      const productData = {
        name: formData.name,
        slug,
        description: formData.description || null,
        price: formData.price ? parseFloat(formData.price) : null,
        unit: formData.unit,
        min_order_qty: parseInt(formData.min_order_qty) || 1,
        category_id: categoryId,
        subcategory_id: formData.subcategory_id || null,
        image_url: formData.image_url || null,
        image_data: imageData || null,
        in_stock: formData.in_stock,
        is_featured: formData.is_featured,
        is_active: true,
      };

      if (editingProduct) {
        const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });
        if (!res.ok) throw new Error('Failed to update');
        toast.success('Товар оновлено');
      } else {
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });
        if (!res.ok) throw new Error('Failed to create');
        toast.success('Товар додано');
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Помилка збереження');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(product: Product) {
    if (!confirm(`Видалити товар "${product.name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Товар видалено');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Помилка видалення');
    }
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.subcategory_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group subcategories by category for select
  const groupedSubcategories = subcategories.reduce((acc, sub) => {
    const catName = sub.category_name || 'Інше';
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(sub);
    return acc;
  }, {} as Record<string, Subcategory[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[var(--color-text-primary)]">
            Товари
          </h1>
          <p className="text-[var(--color-text-muted)] mt-1">
            {products.length} товарів у каталозі
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--color-accent)] text-[var(--color-accent-dark)] rounded-lg font-semibold hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Додати товар
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
        <input
          type="text"
          placeholder="Пошук товарів..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
        />
      </div>

      {/* Products Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="px-4 py-3 text-left text-sm font-medium text-[var(--color-text-muted)]">Назва</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[var(--color-text-muted)] hidden md:table-cell">Категорія</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[var(--color-text-muted)] hidden sm:table-cell">Ціна</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[var(--color-text-muted)]">Статус</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-[var(--color-text-muted)]">Дії</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {filteredProducts.map((product) => {
                  const productImageUrl = product.image_data 
                    ? `/api/images/${product.id}` 
                    : product.image_url;
                  return (
                  <tr key={product.id} className="hover:bg-[var(--color-bg-hover)]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-[var(--color-bg-secondary)] flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {productImageUrl ? (
                            <img 
                              src={productImageUrl} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-5 h-5 text-[var(--color-text-muted)]" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-[var(--color-text-primary)] truncate">{product.name}</p>
                          <p className="text-xs text-[var(--color-text-muted)] md:hidden">
                            {product.category_name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-sm text-[var(--color-text-secondary)]">{product.category_name}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{product.subcategory_name}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-[var(--color-text-primary)]">
                        {product.price ? `${product.price} ₴/${product.unit}` : 'За запитом'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        product.in_stock
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {product.in_stock ? 'В наявності' : 'Немає'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-accent)] hover:bg-[var(--color-bg-secondary)] rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          className="p-2 text-[var(--color-text-muted)] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-12 text-center">
          <Package className="w-12 h-12 mx-auto mb-3 text-[var(--color-text-muted)] opacity-50" />
          <p className="text-[var(--color-text-muted)]">
            {searchQuery ? 'Товарів не знайдено' : 'Товарів поки немає'}
          </p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[200]" onClick={() => setIsModalOpen(false)} />
          <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl z-[201] flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                {editingProduct ? 'Редагувати товар' : 'Новий товар'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                  Назва *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)]"
                  placeholder="Назва товару"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                  Підкатегорія *
                </label>
                <select
                  value={formData.subcategory_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, subcategory_id: e.target.value }))}
                  className="w-full px-3 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)]"
                >
                  <option value="">Оберіть підкатегорію</option>
                  {Object.entries(groupedSubcategories).map(([catName, subs]) => (
                    <optgroup key={catName} label={catName}>
                      {subs.map(sub => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                  Опис
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] resize-none"
                  rows={3}
                  placeholder="Опис товару"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                    Ціна
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-3 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)]"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                    Одиниця
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                    className="w-full px-3 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)]"
                  >
                    <option value="кг">кг</option>
                    <option value="шт">шт</option>
                    <option value="л">л</option>
                    <option value="уп">уп</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                    Мін. замовлення
                  </label>
                  <input
                    type="number"
                    value={formData.min_order_qty}
                    onChange={(e) => setFormData(prev => ({ ...prev, min_order_qty: e.target.value }))}
                    className="w-full px-3 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)]"
                    placeholder="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                  Зображення
                </label>
                
                {/* Image Preview */}
                {(imagePreview || formData.image_url) && (
                  <div className="mb-3 relative w-full h-40 bg-[var(--color-bg-secondary)] rounded-lg overflow-hidden">
                    <img
                      src={imagePreview || formData.image_url}
                      alt="Превью"
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setImageData(null);
                        setFormData(prev => ({ ...prev, image_url: '' }));
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                {/* Upload Button */}
                <div className="flex gap-2 mb-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex-1 px-3 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Завантаження...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Завантажити фото
                      </>
                    )}
                  </button>
                </div>
                
                {/* URL Input */}
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, image_url: e.target.value }));
                    if (e.target.value) {
                      setImagePreview(e.target.value);
                      setImageData(null);
                    }
                  }}
                  className="w-full px-3 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)]"
                  placeholder="або введіть URL зображення"
                />
                <p className="text-xs text-[var(--color-text-muted)] mt-1">Завантажте фото або вставте пряме посилання на зображення</p>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.in_stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, in_stock: e.target.checked }))}
                    className="w-4 h-4 accent-[var(--color-accent)]"
                  />
                  <span className="text-sm text-[var(--color-text-secondary)]">В наявності</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                    className="w-4 h-4 accent-[var(--color-accent)]"
                  />
                  <span className="text-sm text-[var(--color-text-secondary)]">Рекомендований</span>
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-4 border-t border-[var(--color-border)]">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                Скасувати
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-[var(--color-accent)] text-[var(--color-accent-dark)] rounded-lg font-semibold hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingProduct ? 'Зберегти' : 'Створити'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
