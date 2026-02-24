'use client';

import { useState } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import { showToast } from '@/components/ui';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export function OrderModal({ isOpen, onClose, product }: OrderModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    comment: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.phone.trim()) {
      showToast.error("Заповніть обов'язкові поля");
      return;
    }

    setIsSubmitting(true);

    try {
      // В реальному проекті тут буде API-запит
      // Симулюємо затримку мережі
      await new Promise(resolve => setTimeout(resolve, 800));
      
      console.log('Order submission:', {
        product: product.name,
        name: formData.name,
        phone: formData.phone,
        comment: formData.comment,
      });

      showToast.success('Заявку надіслано! Ми зв\'яжемося з вами.');
      setFormData({ name: '', phone: '', comment: '' });
      onClose();
    } catch (error) {
      console.error('Order error:', error);
      showToast.error('Помилка відправки. Спробуйте ще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-xl animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)]">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Замовити товар
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5">
          {/* Product name */}
          <div className="mb-4 p-3 bg-[var(--color-bg-secondary)] rounded-lg">
            <p className="text-sm text-[var(--color-text-muted)]">Товар:</p>
            <p className="font-medium text-[var(--color-text-primary)]">{product.name}</p>
          </div>

          {/* Name input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
              Ваше ім&apos;я *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-colors"
              placeholder="Введіть ім'я"
              required
            />
          </div>

          {/* Phone input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
              Телефон *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-colors"
              placeholder="+380..."
              required
            />
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
              Кількість / коментар
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-colors resize-none"
              placeholder="Вкажіть кількість або додатковий коментар"
              rows={3}
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "w-full py-3 rounded-lg font-medium text-[var(--color-accent-dark)] flex items-center justify-center gap-2 transition-colors",
              isSubmitting 
                ? "bg-[var(--color-primary)]/70 cursor-not-allowed"
                : "bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]"
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Надсилання...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Надіслати заявку
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
