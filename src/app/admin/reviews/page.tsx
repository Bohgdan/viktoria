'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Star, Loader2, X, Check, XIcon } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase';
import toast from 'react-hot-toast';

interface Review {
  id: string;
  author_name: string;
  company_name: string | null;
  text: string;
  rating: number;
  is_published: boolean;
  created_at: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    author_name: '',
    company_name: '',
    text: '',
    rating: 5,
    is_published: true,
  });

  const supabase = createBrowserClient();

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Помилка завантаження');
    } finally {
      setIsLoading(false);
    }
  }

  function openModal(review?: Review) {
    setEditingReview(review || null);
    setFormData({
      author_name: review?.author_name || '',
      company_name: review?.company_name || '',
      text: review?.text || '',
      rating: review?.rating || 5,
      is_published: review?.is_published ?? true,
    });
    setIsModalOpen(true);
  }

  async function handleSave() {
    if (!formData.author_name || !formData.text) {
      toast.error('Заповніть обов\'язкові поля');
      return;
    }

    setIsSaving(true);
    try {
      const data = {
        author_name: formData.author_name,
        company_name: formData.company_name || null,
        text: formData.text,
        rating: formData.rating,
        is_published: formData.is_published,
      };

      if (editingReview) {
        await supabase.from('reviews').update(data).eq('id', editingReview.id);
        toast.success('Відгук оновлено');
      } else {
        await supabase.from('reviews').insert(data);
        toast.success('Відгук додано');
      }

      setIsModalOpen(false);
      fetchReviews();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Помилка збереження');
    } finally {
      setIsSaving(false);
    }
  }

  async function togglePublished(review: Review) {
    try {
      await supabase.from('reviews').update({ is_published: !review.is_published }).eq('id', review.id);
      setReviews(prev => prev.map(r => r.id === review.id ? { ...r, is_published: !r.is_published } : r));
      toast.success(review.is_published ? 'Відгук приховано' : 'Відгук опубліковано');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Помилка');
    }
  }

  async function handleDelete(review: Review) {
    if (!confirm(`Видалити відгук від "${review.author_name}"?`)) return;

    try {
      await supabase.from('reviews').delete().eq('id', review.id);
      toast.success('Відгук видалено');
      fetchReviews();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Помилка видалення');
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('uk-UA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

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
            Відгуки
          </h1>
          <p className="text-[var(--color-text-muted)] mt-1">
            {reviews.length} відгуків ({reviews.filter(r => r.is_published).length} опубліковано)
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--color-accent)] text-[var(--color-accent-dark)] rounded-lg font-semibold hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Додати відгук
        </button>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className={`bg-[var(--color-bg-card)] border rounded-xl p-4 ${
              review.is_published ? 'border-[var(--color-border)]' : 'border-yellow-500/30 bg-yellow-500/5'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="font-semibold text-[var(--color-text-primary)]">{review.author_name}</p>
                {review.company_name && (
                  <p className="text-sm text-[var(--color-text-muted)]">{review.company_name}</p>
                )}
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-[var(--color-text-muted)]'}`}
                  />
                ))}
              </div>
            </div>

            <p className="text-[var(--color-text-secondary)] text-sm mb-4 line-clamp-3">{review.text}</p>

            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--color-text-muted)]">{formatDate(review.created_at)}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => togglePublished(review)}
                  className={`p-2 rounded-lg transition-colors ${
                    review.is_published
                      ? 'text-green-400 hover:bg-green-500/10'
                      : 'text-yellow-400 hover:bg-yellow-500/10'
                  }`}
                  title={review.is_published ? 'Приховати' : 'Опублікувати'}
                >
                  {review.is_published ? <Check className="w-4 h-4" /> : <XIcon className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => openModal(review)}
                  className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-accent)] hover:bg-[var(--color-bg-secondary)] rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(review)}
                  className="p-2 text-[var(--color-text-muted)] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-12 text-center">
          <Star className="w-12 h-12 mx-auto mb-3 text-[var(--color-text-muted)] opacity-50" />
          <p className="text-[var(--color-text-muted)]">Відгуків поки немає</p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[200]" onClick={() => setIsModalOpen(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl z-[201] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                {editingReview ? 'Редагувати відгук' : 'Новий відгук'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Автор *</label>
                <input
                  type="text"
                  value={formData.author_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, author_name: e.target.value }))}
                  className="w-full px-3 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)]"
                  placeholder="Ім'я автора"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Компанія</label>
                <input
                  type="text"
                  value={formData.company_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                  className="w-full px-3 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)]"
                  placeholder="Назва компанії (опціонально)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Текст *</label>
                <textarea
                  value={formData.text}
                  onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                  className="w-full px-3 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] resize-none"
                  rows={4}
                  placeholder="Текст відгуку"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Оцінка</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                      className="p-1"
                    >
                      <Star
                        className={`w-6 h-6 ${star <= formData.rating ? 'text-yellow-400 fill-yellow-400' : 'text-[var(--color-text-muted)]'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_published}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                  className="w-4 h-4 accent-[var(--color-accent)]"
                />
                <span className="text-sm text-[var(--color-text-secondary)]">Опублікувати</span>
              </label>
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
