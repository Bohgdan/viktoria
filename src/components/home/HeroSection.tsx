'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Send, Loader2 } from 'lucide-react';
import { PLACEHOLDER } from '@/lib/constants';

export function HeroSection() {
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        if (rect.bottom > 0) {
          setScrollY(window.scrollY);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, type: 'callback' }),
      });
      if (response.ok) {
        setIsSuccess(true);
        setFormData({ name: '', phone: '' });
      }
    } catch {
      // Error handling
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image with Parallax */}
      <div className="absolute inset-0">
        {/* Food flat-lay photo background - spices/grains dark aesthetic with parallax */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
          style={{ 
            backgroundImage: "url('/images/hero-food.jpg')",
            transform: `translateY(${scrollY * 0.3}px) scale(1.1)`,
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[#0b0d12]/70" />
        {/* Additional gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0d12]/30 via-transparent to-[#0b0d12]/90" />
        
        {/* Decorative wavy lines */}
        <div className="decorative-waves" />
        
        {/* Accent glow at top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[2px] bg-gradient-to-r from-transparent via-[var(--color-accent)]/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="container relative z-10 py-20 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div>
            {/* Logo mark */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm font-medium text-[var(--color-accent)] uppercase tracking-[0.2em]">
                {PLACEHOLDER.companyName}
              </span>
              <div className="h-[1px] w-12 bg-[var(--color-accent)]/50" />
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[56px] font-bold text-[var(--color-text-primary)] mb-6 leading-[1.15] font-[family-name:var(--font-heading)] uppercase tracking-wide">
              {PLACEHOLDER.heroTitle}
            </h1>

            {/* Subtitle */}
            <p className="text-base lg:text-lg text-[var(--color-text-secondary)] mb-10 max-w-lg leading-relaxed">
              {PLACEHOLDER.heroSubtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--color-accent)] text-[var(--color-accent-dark)] rounded-lg font-semibold text-lg hover:bg-[var(--color-accent-hover)] transition-all duration-300 group uppercase tracking-wide"
              >
                Каталог
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contacts"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-[var(--color-text-light)] text-[var(--color-text-primary)] rounded-lg font-semibold text-lg hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all duration-300"
              >
                Отримати прайс
              </Link>
            </div>

            {/* Messenger pills */}
            <div className="flex flex-wrap gap-3 mt-10">
              <a
                href={`viber://chat?number=${PLACEHOLDER.phone.replace(/\D/g, '')}`}
                className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--color-text-light)] rounded-full text-[var(--color-text-secondary)] text-sm font-medium hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.006 2c-5.473 0-9.994 4.068-9.994 9.037 0 2.42 1.037 4.61 2.746 6.21l-.47 3.48a.48.48 0 0 0 .67.51l3.24-1.47c1.14.43 2.39.67 3.7.67 5.47 0 9.99-4.07 9.99-9.04S17.476 2 12.006 2zm5.19 12.23c-.23.65-1.35 1.28-1.87 1.33-.5.05-.96.23-3.22-.68-2.73-1.1-4.47-3.87-4.6-4.05-.14-.17-1.1-1.47-1.1-2.8 0-1.34.7-2 .95-2.27.25-.27.55-.34.73-.34.18 0 .37 0 .53.01.17 0 .4-.06.62.48.23.55.78 1.9.85 2.04.07.13.12.29.02.46-.09.17-.14.28-.28.43-.14.15-.29.34-.42.45-.14.12-.28.26-.12.51.16.25.72 1.18 1.55 1.92 1.06.94 1.96 1.23 2.24 1.37.28.14.44.12.6-.07.17-.19.7-.82.89-1.1.19-.28.37-.23.63-.14.26.1 1.63.77 1.91.91.28.14.46.21.53.33.07.11.07.67-.16 1.31z"/>
                </svg>
                Viber
              </a>
              <a
                href={`https://t.me/${PLACEHOLDER.telegram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--color-text-light)] rounded-full text-[var(--color-text-secondary)] text-sm font-medium hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.66-.52.36-1 .53-1.42.52-.47-.01-1.37-.27-2.04-.49-.82-.27-1.47-.42-1.42-.88.03-.24.37-.49 1.02-.75 3.98-1.73 6.63-2.87 7.96-3.44 3.79-1.56 4.58-1.83 5.09-1.84.11 0 .37.03.54.18.14.12.18.28.2.45-.01.06.01.24 0 .38z"/>
                </svg>
                Telegram
              </a>
              <a
                href={`https://wa.me/${PLACEHOLDER.phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--color-text-light)] rounded-full text-[var(--color-text-secondary)] text-sm font-medium hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>

          {/* Right Column - Order Form */}
          <div className="lg:flex lg:justify-end">
            <div className="bg-[var(--color-bg-card)]/80 backdrop-blur-xl border border-[var(--color-border)] rounded-xl p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2 font-[family-name:var(--font-heading)]">
                Швидке замовлення
              </h3>
              <p className="text-[var(--color-text-muted)] text-sm mb-6">
                Залиште контакти і ми зателефонуємо вам
              </p>

              {isSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-accent-light)] flex items-center justify-center">
                    <svg className="w-8 h-8 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-[var(--color-text-primary)] text-lg font-medium">Дякуємо!</p>
                  <p className="text-[var(--color-text-muted)] text-sm mt-1">Ми зв&apos;яжемося з вами найближчим часом</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <input
                      type="text"
                      placeholder="Ваше ім'я *"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-transparent border-b border-[var(--color-border)] py-3 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Телефон *"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full bg-transparent border-b border-[var(--color-border)] py-3 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 mt-2 bg-[var(--color-accent)] text-[var(--color-accent-dark)] rounded-lg font-semibold hover:bg-[var(--color-accent-hover)] transition-all disabled:opacity-50 uppercase tracking-wide"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Замовити дзвінок
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
