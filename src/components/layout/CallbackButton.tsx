'use client';

import { useState, useEffect } from 'react';
import { Phone, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export function CallbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hide button when footer is visible
  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Дякуємо! Ми зателефонуємо вам найближчим часом');
        setFormData({ name: '', phone: '' });
        setIsOpen(false);
      } else {
        toast.error('Виникла помилка. Спробуйте ще раз');
      }
    } catch {
      toast.error('Виникла помилка. Спробуйте ще раз');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-14 h-14 md:w-16 md:h-16 rounded-full bg-[var(--color-accent)] text-[var(--color-accent-dark)] shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 z-[200] flex items-center justify-center"
        aria-label="Замовити дзвінок"
      >
        <Phone className="w-6 h-6 md:w-7 md:h-7" />
      </button>

      {/* Popup Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-[300]"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Popup */}
          <div className="fixed bottom-24 right-6 md:bottom-28 md:right-8 w-[320px] bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl shadow-2xl z-[301] overflow-hidden animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                Замовити дзвінок
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Ваше ім'я"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                  required
                />
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="+380..."
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[var(--color-accent)] text-[var(--color-accent-dark)] rounded-lg font-semibold hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Phone className="w-5 h-5" />
                    Зателефонуйте мені
                  </>
                )}
              </button>
            </form>
          </div>
        </>
      )}
    </>
  );
}
