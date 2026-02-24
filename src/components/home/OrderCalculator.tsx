'use client';

import { useState } from 'react';
import { ChevronRight, ChevronLeft, Store, Utensils, Building2, ShoppingBag, Check, Phone, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

// Type definitions
type BusinessType = 'cafe' | 'restaurant' | 'shop' | 'hotel' | 'catering';

interface FormData {
  businessType: BusinessType | '';
  businessName: string;
  city: string;
  name: string;
  phone: string;
  email: string;
  comment: string;
}

// Business types data
const BUSINESS_TYPES: Array<{
  id: BusinessType;
  name: string;
  icon: React.ReactNode;
  description: string;
  recommendedCategories: string[];
}> = [
  {
    id: 'cafe',
    name: 'Кав\'ярня / Кондитерська',
    icon: <Store className="w-8 h-8" />,
    description: 'Кава, чай, випічка, десерти',
    recommendedCategories: ['Кава та чай', 'Сухофрукти та горіхи', 'Спеції та приправи'],
  },
  {
    id: 'restaurant',
    name: 'Ресторан / Кафе',
    icon: <Utensils className="w-8 h-8" />,
    description: 'Повний асортимент для кухні',
    recommendedCategories: ['Спеції та приправи', 'Олії та соуси', 'Крупи та макарони', 'Борошно та цукор'],
  },
  {
    id: 'shop',
    name: 'Магазин / Маркет',
    icon: <ShoppingBag className="w-8 h-8" />,
    description: 'Роздрібний продаж продуктів',
    recommendedCategories: ['Кава та чай', 'Сухофрукти та горіхи', 'Консервація'],
  },
  {
    id: 'hotel',
    name: 'Готель / Санаторій',
    icon: <Building2 className="w-8 h-8" />,
    description: 'Харчування для гостей',
    recommendedCategories: ['Крупи та макарони', 'Олії та соуси', 'Кава та чай', 'Спеції та приправи'],
  },
  {
    id: 'catering',
    name: 'Кейтеринг / Їдальня',
    icon: <Utensils className="w-8 h-8" />,
    description: 'Масове харчування',
    recommendedCategories: ['Крупи та макарони', 'Борошно та цукор', 'Олії та соуси', 'Консервація'],
  },
];

export function OrderCalculator() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    businessType: '',
    businessName: '',
    city: '',
    name: '',
    phone: '',
    email: '',
    comment: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedBusiness = BUSINESS_TYPES.find(b => b.id === formData.businessType);

  const handleBusinessSelect = (businessId: BusinessType) => {
    setFormData(prev => ({ ...prev, businessType: businessId }));
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phone || !formData.name) {
      toast.error('Заповніть обов\'язкові поля');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/calculator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStep(3);
      } else {
        toast.error('Виникла помилка. Спробуйте ще раз');
      }
    } catch {
      toast.error('Виникла помилка. Спробуйте ще раз');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-[var(--color-bg-secondary)]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[var(--color-text-primary)] mb-4">
            Підберемо асортимент для вашого бізнесу
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Вкажіть тип вашого закладу — ми підготуємо персональну пропозицію з урахуванням специфіки
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  step >= s
                    ? 'bg-[var(--color-accent)] text-[var(--color-accent-dark)]'
                    : 'bg-[var(--color-bg-card)] text-[var(--color-text-muted)] border border-[var(--color-border)]'
                }`}
              >
                {step > s ? <Check className="w-5 h-5" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`w-16 h-1 rounded ${
                    step > s ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border)]'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Business Type Selection */}
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {BUSINESS_TYPES.map((business) => (
              <button
                key={business.id}
                onClick={() => handleBusinessSelect(business.id)}
                className="p-6 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-accent)] hover:shadow-lg transition-all duration-300 text-left group"
              >
                <div className="w-14 h-14 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center mb-4 group-hover:bg-[var(--color-accent)] group-hover:text-[var(--color-accent-dark)] transition-colors">
                  {business.icon}
                </div>
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                  {business.name}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {business.description}
                </p>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Contact Form */}
        {step === 2 && selectedBusiness && (
          <div className="max-w-2xl mx-auto">
            {/* Recommendations */}
            <div className="p-6 bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 rounded-xl mb-8">
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3">
                Рекомендовані категорії для {selectedBusiness.name.toLowerCase()}:
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedBusiness.recommendedCategories.map((cat) => (
                  <span
                    key={cat}
                    className="px-3 py-1 bg-[var(--color-accent)] text-[var(--color-accent-dark)] rounded-full text-sm font-medium"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Назва закладу
                  </label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                    placeholder="ТОВ, ФОП або назва"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Місто / Населений пункт
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                    placeholder="Ужгород, Мукачево..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Ваше ім'я *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                    placeholder="Контактна особа"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Телефон *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                    placeholder="+380..."
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Email (необов'язково)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                  Коментар
                </label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                  className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors resize-none"
                  rows={3}
                  placeholder="Додаткова інформація про ваші потреби"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors flex items-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Назад
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-[var(--color-accent)] text-[var(--color-accent-dark)] rounded-lg font-semibold hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Отримати пропозицію
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="max-w-lg mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-[var(--color-text-primary)] mb-4">
              Дякуємо за заявку!
            </h3>
            <p className="text-[var(--color-text-secondary)] mb-8">
              Наш менеджер зв'яжеться з вами протягом робочого дня та підготує персональну пропозицію
            </p>
            <a
              href="tel:+380501234567"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-accent)] text-[var(--color-accent-dark)] rounded-lg font-semibold hover:bg-[var(--color-accent-hover)] transition-colors"
            >
              <Phone className="w-5 h-5" />
              Зателефонувати зараз
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
