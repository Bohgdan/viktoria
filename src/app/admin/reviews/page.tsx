'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Star, Loader2, X, Check, XIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface Review {
  id: string;
  author_name: string;
  author_company: string | null;
  content: string;
  rating: number;
  is_approved: boolean;
  is_visible: boolean;
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
    author_company: '',
    content: '',
    rating: 5,
    is_approved: true,
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/reviews');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
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
      author_company: review?.author_company || '',
      content: review?.content || '',
      rating: review?.rating || 5,
      is_approved: review?.is_approved ?? true,
    });
    setIsModalOpen(true);
  }

  async function handleSave() {
    if (!formData.author_name || !formData.content) {
      toast.error('Заповніть обов\'язкові поля');
      return;
    }

    setIsSaving(true);
    try {
      const data = {
        author_name: formData.author_name,
        author_company: formData.author_company || null,
        content: formData.content,
        rating: formData.rating,
        is_approved: formData.is_approved,
        is_visible: formData.is_approved,
      };

      if (editingReview) {
        const res = await fetch(`/api/admin/reviews/${editingReview.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to update');
        toast.success('Відгук оновлено');
      } else {
        const res = await fetch('/api/admin/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to create');
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
      const res = await fetch(`/api/admin/reviews/${review.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_approved: !review.is_approved, is_visible: !review.is_approved }),
      });
      if (!res.ok) throw new Error('Failed to update');
      setReviews(prev => prev.map(r => r.id === review.id ? { ...r, is_approved: !r.is_approved } : r));
      toast.success(review.is_approved ? 'Відгук приховано' : 'Відгук опубліковано');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Помилка');
    }
  }

  async function handleDelete(review: Review) {
    if (!confirm(`Видалити відгук від "${review.author_name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/reviews/${review.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
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
            {reviews.length} відгуків ({reviews.filter(r => r.is_approved).length} опубліковано)
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
              review.is_approved ? 'border-[var(--color-border)]' : 'border-yellow-500/30 bg-yellow-500/5'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="font-semibold text-[var(--color-text-primary)]">{review.author_name}</p>
                {review.author_company && (
                  <p className="text-sm text-[var(--color-text-muted)]">{review.author_company}</p>
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

            <p className="text-[var(--color-text-secondary)] text-sm mb-4 line-clamp-3">{review.content}</p>

            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--color-text-muted)]">{formatDate(review.created_at)}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => togglePublished(review)}
                  className={`p-2 rounded-lg transition-colors ${
                    review.is_approved
                      ? 'text-green-400 hover:bg-green-500/10'
                      : 'text-yellow-400 hover:bg-yellow-500/10'
                  }`}
                  title={review.is_approved ? 'Приховати' : 'Опублікувати'}
                >
                  {review.is_approved ? <Check className="w-4 h-4" /> : <XIcon className="w-4 h-4" />}
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
                  value={formData.author_company}
                  onChange={(e) => setFormData(prev => ({ ...prev, author_company: e.target.value }))}
                  className="w-full px-3 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)]"
                  placeholder="Назва компанії (опціонально)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Текст *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
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
                  checked={formData.is_approved}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_approved: e.target.checked }))}
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
