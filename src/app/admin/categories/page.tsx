'use client';

import { useEffect, useState, useRef } from 'react';
import { Plus, Edit2, Trash2, FolderTree, ChevronDown, ChevronRight, Loader2, X, Upload, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { ConfirmModal } from '@/components/ui';
import toast from 'react-hot-toast';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  subcategories?: Subcategory[];
  products_count?: number;
}

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  category_name?: string;
  sort_order: number;
  products_count?: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'category' | 'subcategory'>('category');
  const [editingItem, setEditingItem] = useState<Category | Subcategory | null>(null);
  const [parentCategoryId, setParentCategoryId] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '', image_url: '' });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Delete confirmation state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ item: Category | Subcategory; type: 'category' | 'subcategory' } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/categories');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      
      // Combine categories with subcategories
      const categoriesWithSubs = (data.categories || []).map((cat: Category) => ({
        ...cat,
        subcategories: (data.subcategories || []).filter((s: Subcategory) => s.category_id === cat.id),
      }));
      
      setCategories(categoriesWithSubs);
      setExpandedIds(new Set(categoriesWithSubs.map((c: Category) => c.id)));
    } catch (error) {
      console.error('Error:', error);
      toast.error('Помилка завантаження');
    } finally {
      setIsLoading(false);
    }
  }

  // Generate slug from name (with Cyrillic transliteration)
  const generateSlug = (name: string) => {
    const map: Record<string, string> = {
      'а':'a','б':'b','в':'v','г':'h','ґ':'g','д':'d','е':'e','є':'ye',
      'ж':'zh','з':'z','и':'y','і':'i','ї':'yi','й':'y','к':'k','л':'l',
      'м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u',
      'ф':'f','х':'kh','ц':'ts','ч':'ch','ш':'sh','щ':'shch','ь':'',
      'ю':'yu','я':'ya','э':'e','ы':'y','ъ':'','ё':'yo'
    };
    return name
      .toLowerCase()
      .split('')
      .map(ch => map[ch] ?? ch)
      .join('')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  function toggleExpanded(id: string) {
    const newSet = new Set(expandedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedIds(newSet);
  }

  function openCategoryModal(category?: Category) {
    setModalType('category');
    setEditingItem(category || null);
    setFormData({
      name: category?.name || '',
      slug: category?.slug || '',
      description: category?.description || '',
      image_url: category?.image_url || '',
    });
    setImagePreview(category?.image_url || null);
    setIsModalOpen(true);
  }

  function openSubcategoryModal(categoryId: string, subcategory?: Subcategory) {
    setModalType('subcategory');
    setParentCategoryId(categoryId);
    setEditingItem(subcategory || null);
    setFormData({
      name: subcategory?.name || '',
      slug: subcategory?.slug || '',
      description: '',
      image_url: '',
    });
    setImagePreview(null);
    setIsModalOpen(true);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Дозволено лише зображення');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Файл занадто великий (макс. 5MB)');
      return;
    }

    setIsUploading(true);
    try {
      // Convert to data URL for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setImagePreview(dataUrl);
        setFormData(prev => ({ ...prev, image_url: dataUrl }));
      };
      reader.readAsDataURL(file);
      toast.success('Зображення готове');
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
      toast.error('Введіть назву');
      return;
    }

    setIsSaving(true);
    try {
      const slug = formData.slug || generateSlug(formData.name);

      if (modalType === 'category') {
        const data = {
          type: 'category',
          name: formData.name,
          slug,
          description: formData.description || null,
          image_url: formData.image_url || null,
        };

        if (editingItem) {
          const res = await fetch(`/api/admin/categories/${editingItem.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Failed to update');
          }
          toast.success('Категорію оновлено');
        } else {
          const res = await fetch('/api/admin/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...data, sort_order: categories.length }),
          });
          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Failed to create');
          }
          toast.success('Категорію додано');
        }
      } else {
        const data = {
          type: 'subcategory',
          name: formData.name,
          slug,
          category_id: parentCategoryId,
        };

        if (editingItem) {
          const res = await fetch(`/api/admin/categories/${editingItem.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'subcategory', name: formData.name, slug }),
          });
          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Failed to update');
          }
          toast.success('Підкатегорію оновлено');
        } else {
          const parent = categories.find(c => c.id === parentCategoryId);
          const res = await fetch('/api/admin/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...data, sort_order: parent?.subcategories?.length || 0 }),
          });
          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Failed to create');
          }
          toast.success('Підкатегорію додано');
        }
      }

      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Помилка збереження');
    } finally {
      setIsSaving(false);
    }
  }

  function openDeleteModal(item: Category | Subcategory, type: 'category' | 'subcategory') {
    setItemToDelete({ item, type });
    setDeleteModalOpen(true);
  }

  async function handleConfirmDelete() {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      const { item, type } = itemToDelete;
      const url = type === 'subcategory' 
        ? `/api/admin/categories/${item.id}?type=subcategory`
        : `/api/admin/categories/${item.id}`;
      
      const res = await fetch(url, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      
      toast.success(type === 'category' ? 'Категорію видалено' : 'Підкатегорію видалено');
      setDeleteModalOpen(false);
      setItemToDelete(null);
      fetchCategories();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Помилка видалення');
    } finally {
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[var(--color-text-primary)]">
            Категорії
          </h1>
          <p className="text-[var(--color-text-muted)] mt-1">
            {categories.length} категорій
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchCategories()}
            disabled={isLoading}
            className="p-2.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] rounded-lg transition-colors disabled:opacity-50"
            title="Оновити"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => openCategoryModal()}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--color-accent)] text-[var(--color-accent-dark)] rounded-lg font-semibold hover:bg-[var(--color-accent-hover)] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Додати категорію
          </button>
        </div>
      </div>

      {/* Categories Tree */}
      <div className="space-y-2">
        {categories.map((category) => {
          const isExpanded = expandedIds.has(category.id);
          return (
            <div key={category.id} className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl overflow-hidden">
              {/* Category Header */}
              <div className="flex items-center gap-3 p-4">
                <button
                  onClick={() => toggleExpanded(category.id)}
                  className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                >
                  {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </button>
                <div className="w-10 h-10 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center overflow-hidden">
                  {category.image_url ? (
                    <img src={category.image_url} alt={category.name} className="w-full h-full object-cover" />
                  ) : (
                    <FolderTree className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[var(--color-text-primary)]">{category.name}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{category.subcategories?.length || 0} підкатегорій</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openSubcategoryModal(category.id)}
                    className="p-2 text-[var(--color-text-muted)] hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                    title="Додати підкатегорію"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openCategoryModal(category)}
                    className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-accent)] hover:bg-[var(--color-bg-secondary)] rounded-lg transition-colors"
                    title="Редагувати"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openDeleteModal(category, 'category')}
                    className="p-2 text-[var(--color-text-muted)] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Видалити"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Subcategories */}
              {isExpanded && category.subcategories && category.subcategories.length > 0 && (
                <div className="border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                  {category.subcategories.map((sub) => (
                    <div key={sub.id} className="flex items-center gap-3 px-4 py-3 pl-16 hover:bg-[var(--color-bg-hover)]">
                      <div className="flex-1 min-w-0">
                        <p className="text-[var(--color-text-secondary)]">{sub.name}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openSubcategoryModal(category.id, sub)}
                          className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-accent)] rounded transition-colors"
                          title="Редагувати"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(sub, 'subcategory')}
                          className="p-1.5 text-[var(--color-text-muted)] hover:text-red-400 rounded transition-colors"
                          title="Видалити"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title={itemToDelete?.type === 'category' ? 'Видалити категорію?' : 'Видалити підкатегорію?'}
        message={
          itemToDelete?.type === 'category'
            ? `Ви впевнені, що хочете видалити категорію "${itemToDelete?.item.name}" з усіма підкатегоріями? Цю дію неможливо скасувати.`
            : `Ви впевнені, що хочете видалити підкатегорію "${itemToDelete?.item.name}"? Цю дію неможливо скасувати.`
        }
        confirmText="Видалити"
        cancelText="Скасувати"
        variant="danger"
        isLoading={isDeleting}
      />

      {/* Modal */}
      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[200]" onClick={() => setIsModalOpen(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl z-[201] max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                {editingItem ? 'Редагувати' : 'Додати'} {modalType === 'category' ? 'категорію' : 'підкатегорію'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Назва *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData(prev => ({ 
                      ...prev, 
                      name,
                      slug: prev.slug === generateSlug(prev.name) || !prev.slug ? generateSlug(name) : prev.slug
                    }));
                  }}
                  className="w-full px-3 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)]"
                  placeholder="Назва"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">URL (slug)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-zа-яіїєґ0-9-]/gi, '-') }))}
                    className="flex-1 px-3 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] font-mono text-sm"
                    placeholder="url-категорії"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, slug: generateSlug(prev.name) }))}
                    className="px-3 py-2 text-xs bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] transition-colors"
                    title="Згенерувати з назви"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {modalType === 'category' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Опис</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] resize-none"
                      rows={3}
                      placeholder="Опис категорії"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Зображення</label>
                    
                    {imagePreview && (
                      <div className="mb-3 relative w-full h-32 bg-[var(--color-bg-secondary)] rounded-lg overflow-hidden">
                        <img
                          src={imagePreview}
                          alt="Превью"
                          className="w-full h-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setFormData(prev => ({ ...prev, image_url: '' }));
                          }}
                          className="absolute top-2 right-2 p-1 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
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
                    
                    <input
                      type="url"
                      value={formData.image_url.startsWith('data:') ? '' : formData.image_url}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, image_url: e.target.value }));
                        if (e.target.value) {
                          setImagePreview(e.target.value);
                        }
                      }}
                      className="w-full mt-2 px-3 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)]"
                      placeholder="або введіть URL зображення"
                    />
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-[var(--color-border)]">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-[var(--color-text-secondary)]">
                Скасувати
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-[var(--color-accent)] text-[var(--color-accent-dark)] rounded-lg font-semibold hover:bg-[var(--color-accent-hover)] disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                Зберегти
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
