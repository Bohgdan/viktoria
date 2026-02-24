'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, FolderTree, ChevronDown, ChevronRight, Loader2, X, AlertCircle } from 'lucide-react';
import { createBrowserClient, isSupabaseConfigured } from '@/lib/supabase';
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
  sort_order: number;
}

// Mock data for demo mode
const MOCK_CATEGORIES: Category[] = [
  { id: 'c1', name: 'Спеції та приправи', slug: 'spetsii-ta-prypravy', description: 'Закарпатські спеції найвищої якості', image_url: null, sort_order: 1, subcategories: [
    { id: 's1', name: 'Паприка', slug: 'papryka', category_id: 'c1', sort_order: 1 },
    { id: 's2', name: 'Перець', slug: 'perets', category_id: 'c1', sort_order: 2 },
  ]},
  { id: 'c2', name: 'Макаронні вироби', slug: 'makaronni-vyroby', description: 'Угорські макарони', image_url: null, sort_order: 2, subcategories: [
    { id: 's3', name: 'Рожки', slug: 'rozhky', category_id: 'c2', sort_order: 1 },
    { id: 's4', name: 'Спіраль', slug: 'spiral', category_id: 'c2', sort_order: 2 },
  ]},
  { id: 'c3', name: 'Консервація', slug: 'konservatsiia', description: 'Якісна консервація', image_url: null, sort_order: 3, subcategories: [] },
  { id: 'c4', name: 'Олія та жири', slug: 'oliia-ta-zhyry', description: 'Соняшникова олія', image_url: null, sort_order: 4, subcategories: [] },
  { id: 'c5', name: 'Бакалія', slug: 'bakaliia', description: 'Сода, лимонна кислота', image_url: null, sort_order: 5, subcategories: [] },
];

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
  const [isUsingMock, setIsUsingMock] = useState(false);

  const supabase = isSupabaseConfigured() ? createBrowserClient() : null;

  useEffect(() => {
    if (!supabase) {
      setIsUsingMock(true);
      setCategories(MOCK_CATEGORIES);
      setExpandedIds(new Set(MOCK_CATEGORIES.map(c => c.id)));
      setIsLoading(false);
      return;
    }
    fetchCategories();
  }, []);

  async function fetchCategories() {
    if (!supabase) return;
    setIsLoading(true);
    try {
      const { data: cats, error: catsError } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order');

      if (catsError) throw catsError;

      const { data: subs, error: subsError } = await supabase
        .from('subcategories')
        .select('*')
        .order('sort_order');

      if (subsError) throw subsError;

      const categoriesWithSubs = (cats || []).map(cat => ({
        ...cat,
        subcategories: (subs || []).filter(s => s.category_id === cat.id),
      }));

      setCategories(categoriesWithSubs);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Помилка завантаження');
      setIsUsingMock(true);
      setCategories(MOCK_CATEGORIES);
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
    if (isUsingMock) {
      toast.error('Редагування недоступне в демо-режимі');
      return;
    }
    if (!supabase) return;
    
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
          await supabase.from('categories').update(data).eq('id', editingItem.id);
          toast.success('Категорію оновлено');
        } else {
          await supabase.from('categories').insert({ ...data, sort_order: categories.length });
          toast.success('Категорію додано');
        }
      } else {
        const data = {
          name: formData.name,
          slug,
          category_id: parentCategoryId,
        };

        if (editingItem) {
          await supabase.from('subcategories').update(data).eq('id', editingItem.id);
          toast.success('Підкатегорію оновлено');
        } else {
          const parent = categories.find(c => c.id === parentCategoryId);
          await supabase.from('subcategories').insert({ ...data, sort_order: parent?.subcategories?.length || 0 });
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
    if (isUsingMock) {
      toast.error('Видалення недоступне в демо-режимі');
      return;
    }
    if (!supabase) return;
    
    if (!confirm(`Видалити категорію "${category.name}" з усіма підкатегоріями?`)) return;

    try {
      await supabase.from('categories').delete().eq('id', category.id);
      toast.success('Категорію видалено');
      fetchCategories();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Помилка видалення');
    }
  }

  async function handleDeleteSubcategory(subcategory: Subcategory) {
    if (isUsingMock) {
      toast.error('Видалення недоступне в демо-режимі');
      return;
    }
    if (!supabase) return;
    
    if (!confirm(`Видалити підкатегорію "${subcategory.name}"?`)) return;

    try {
      await supabase.from('subcategories').delete().eq('id', subcategory.id);
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
      {/* Demo Mode Notice */}
      {isUsingMock && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-400">Демо-режим</p>
            <p className="text-sm text-yellow-400/70">
              Відображаються тестові дані. Редагування недоступне.
            </p>
          </div>
        </div>
      )}

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
