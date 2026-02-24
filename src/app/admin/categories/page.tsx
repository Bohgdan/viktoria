'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, FolderTree, ChevronDown, ChevronRight, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  subcategories?: Subcategory[];
}

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  category_name?: string;
  sort_order: number;
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
  const [formData, setFormData] = useState({ name: '', description: '' });

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
      description: category?.description || '',
    });
    setIsModalOpen(true);
  }

  function openSubcategoryModal(categoryId: string, subcategory?: Subcategory) {
    setModalType('subcategory');
    setParentCategoryId(categoryId);
    setEditingItem(subcategory || null);
    setFormData({
      name: subcategory?.name || '',
      description: '',
    });
    setIsModalOpen(true);
  }

  async function handleSave() {
    if (!formData.name) {
      toast.error('Введіть назву');
      return;
    }

    setIsSaving(true);
    try {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-zа-яіїєґ0-9\s-]/g, '')
        .replace(/\s+/g, '-');

      if (modalType === 'category') {
        const data = {
          name: formData.name,
          slug,
          description: formData.description || null,
        };

        if (editingItem) {
          const res = await fetch(`/api/admin/categories/${editingItem.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
          if (!res.ok) throw new Error('Failed to update');
          toast.success('Категорію оновлено');
        } else {
          const res = await fetch('/api/admin/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...data, sort_order: categories.length }),
          });
          if (!res.ok) throw new Error('Failed to create');
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
            body: JSON.stringify({ name: formData.name, slug }),
          });
          if (!res.ok) throw new Error('Failed to update');
          toast.success('Підкатегорію оновлено');
        } else {
          const parent = categories.find(c => c.id === parentCategoryId);
          const res = await fetch('/api/admin/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...data, sort_order: parent?.subcategories?.length || 0 }),
          });
          if (!res.ok) throw new Error('Failed to create');
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

  async function handleDeleteCategory(category: Category) {
    if (!confirm(`Видалити категорію "${category.name}" з усіма підкатегоріями?`)) return;

    try {
      const res = await fetch(`/api/admin/categories/${category.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Категорію видалено');
      fetchCategories();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Помилка видалення');
    }
  }

  async function handleDeleteSubcategory(subcategory: Subcategory) {
    if (!confirm(`Видалити підкатегорію "${subcategory.name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/categories/${subcategory.id}?type=subcategory`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Підкатегорію видалено');
      fetchCategories();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Помилка видалення');
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
        <button
          onClick={() => openCategoryModal()}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--color-accent)] text-[var(--color-accent-dark)] rounded-lg font-semibold hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Додати категорію
        </button>
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
                <div className="w-10 h-10 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center">
                  <FolderTree className="w-5 h-5" />
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
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category)}
                    className="p-2 text-[var(--color-text-muted)] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
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
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSubcategory(sub)}
                          className="p-1.5 text-[var(--color-text-muted)] hover:text-red-400 rounded transition-colors"
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

      {/* Modal */}
      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[200]" onClick={() => setIsModalOpen(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl z-[201]">
            <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                {editingItem ? 'Редагувати' : 'Додати'} {modalType === 'category' ? 'категорію' : 'підкатегорію'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Назва *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)]"
                  placeholder="Назва"
                />
              </div>
              {modalType === 'category' && (
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
