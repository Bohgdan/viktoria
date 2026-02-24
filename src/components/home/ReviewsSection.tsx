'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote, MessageSquare } from 'lucide-react';
import type { Review } from '@/lib/types';
import { PLACEHOLDER } from '@/lib/constants';

interface ReviewsSectionProps {
  reviews?: Review[];
}

// Demo reviews for empty state
const demoReviews: Review[] = [
  {
    id: '1',
    author_name: 'Олександр Петренко',
    company: 'ТОВ "Смак"',
    text: 'Працюємо з компанією вже третій рік. Завжди свіжа продукція, чудовий сервіс та пунктуальна доставка. Рекомендую!',
    rating: 5,
    is_visible: true,
    sort_order: 1,
    created_at: '',
  },
  {
    id: '2',
    author_name: 'Марія Ковальчук',
    company: 'Ресторан "Київський"',
    text: 'Дуже задоволені співпрацею. Широкий асортимент, конкурентні ціни. Особливо подобається можливість оплати по факту.',
    rating: 5,
    is_visible: true,
    sort_order: 2,
    created_at: '',
  },
  {
    id: '3',
    author_name: 'Іван Мельник',
    company: 'Маркет "Свіжість"',
    text: 'Надійний постачальник з якісною продукцією. Менеджери завжди на зв\'язку, оперативно вирішують будь-які питання.',
    rating: 5,
    is_visible: true,
    sort_order: 3,
    created_at: '',
  },
];

export function ReviewsSection({ reviews = demoReviews }: ReviewsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (reviews.length === 0) {
    return (
      <section className="section">
        <div className="container">
          <h2 className="section-title">Відгуки клієнтів</h2>
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 mx-auto text-[var(--color-text-muted)] mb-4" />
            <p className="text-[var(--color-text-secondary)]">{PLACEHOLDER.noReviews}</p>
          </div>
        </div>
      </section>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  const currentReview = reviews[currentIndex];

  return (
    <section className="section relative overflow-hidden">
      {/* Background texture overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-[0.06]"
        style={{ backgroundImage: "url('/images/hero-bg.svg')" }}
      />
      <div className="absolute inset-0 bg-[var(--color-bg-primary)]/90" />

      <div className="container relative z-10">
        <h2 className="section-title">
          Що кажуть <span className="accent-text">клієнти</span>
        </h2>

        <div className="max-w-4xl mx-auto">
          {/* Main review card */}
          <div className="relative bg-[var(--color-bg-card)]/80 backdrop-blur-sm border border-[var(--color-border)] rounded-2xl p-8 md:p-12">
            {/* Quote icon */}
            <Quote className="absolute top-6 left-6 w-12 h-12 text-[var(--color-accent)]/20" />

            {/* Review content */}
            <div className="relative">
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < currentReview.rating
                        ? 'text-[var(--color-accent)] fill-[var(--color-accent)]'
                        : 'text-[var(--color-border)]'
                    }`}
                  />
                ))}
              </div>

              {/* Text */}
              <blockquote className="text-lg md:text-xl text-[var(--color-text-primary)] mb-6 italic leading-relaxed">
                &ldquo;{currentReview.text}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-[var(--color-accent-dark)] font-semibold text-lg">
                  {currentReview.author_name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-[var(--color-text-primary)]">
                    {currentReview.author_name}
                  </p>
                  {currentReview.company && (
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      {currentReview.company}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          {reviews.length > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={goToPrevious}
                className="p-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
                aria-label="Попередній відгук"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Dots */}
              <div className="flex gap-2">
                {reviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      index === currentIndex
                        ? 'bg-[var(--color-accent)] w-8'
                        : 'bg-[var(--color-border)] hover:bg-[var(--color-text-muted)]'
                    }`}
                    aria-label={`Відгук ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={goToNext}
                className="p-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
                aria-label="Наступний відгук"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
