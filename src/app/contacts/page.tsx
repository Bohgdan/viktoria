'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { PLACEHOLDER } from '@/lib/constants';
import { formatPhone, getPhoneLink, getViberLink, getTelegramLink, getWhatsAppLink, isValidEmail, isValidPhone } from '@/lib/utils';
import { Breadcrumbs } from '@/components/catalog';
import { Input, Textarea, Button, showToast } from '@/components/ui';
import { useSettings } from '@/lib/SettingsContext';

// Metadata should be in a separate file for client components, but we include it in page structure
// export const metadata: Metadata = {
//   title: `Контакти | ${PLACEHOLDER.companyName}`,
//   description: `Зв'яжіться з ${PLACEHOLDER.companyName}. Адреса, телефон, email, месенджери.`,
// };

export default function ContactsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { settings } = useSettings();

  // Use settings from DB, fallback to PLACEHOLDER
  const phone = settings.phone || PLACEHOLDER.phone;
  const email = settings.email || PLACEHOLDER.email;
  const address = settings.address || PLACEHOLDER.address;
  const workingHours = settings.working_hours || PLACEHOLDER.workingHours;
  const viber = settings.viber || PLACEHOLDER.viber;
  const telegram = settings.telegram || PLACEHOLDER.telegram;
  const whatsapp = settings.whatsapp || PLACEHOLDER.whatsapp;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Вкажіть ваше ім\'я';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Вкажіть номер телефону';
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = 'Невірний формат телефону';
    }
    
    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = 'Невірний формат email';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Напишіть повідомлення';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error('Submit failed');
      
      showToast.success('Повідомлення надіслано! Ми зв\'яжемося з вами найближчим часом.');
      setFormData({ name: '', phone: '', email: '', message: '' });
    } catch {
      showToast.error('Помилка при надсиланні. Спробуйте ще раз або зателефонуйте нам.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const breadcrumbs = [
    { label: 'Контакти' },
  ];

  return (
    <main className="min-h-screen relative z-10">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbs} />

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-text-primary)] mb-4">
          Контакти
        </h1>
        
        <p className="text-lg text-[var(--color-text-secondary)] mb-12 max-w-3xl">
          Зв&apos;яжіться з нами будь-яким зручним способом. Ми завжди раді допомогти!
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">
              Наші контакти
            </h2>
            
            <div className="space-y-6">
              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-[var(--color-accent)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">
                    Телефон
                  </h3>
                  <a
                    href={getPhoneLink(phone)}
                    className="text-lg text-[var(--color-accent)] hover:underline"
                  >
                    {formatPhone(phone)}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-[var(--color-accent)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">
                    Email
                  </h3>
                  <a
                    href={`mailto:${email}`}
                    className="text-lg text-[var(--color-accent)] hover:underline"
                  >
                    {email}
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-[var(--color-accent)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">
                    Адреса
                  </h3>
                  <p className="text-[var(--color-text-secondary)]">
                    {address}
                  </p>
                </div>
              </div>

              {/* Working hours */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-[var(--color-accent)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">
                    Графік роботи
                  </h3>
                  <p className="text-[var(--color-text-secondary)]">
                    {workingHours}
                  </p>
                </div>
              </div>
            </div>

            {/* Messengers */}
            <div className="mt-8">
              <h3 className="font-semibold text-[var(--color-text-primary)] mb-4">
                Ми в месенджерах
              </h3>
              <div className="flex gap-3">
                <a
                  href={getViberLink(viber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#7360f2] text-white hover:opacity-90 transition-opacity"
                >
                  <Image src="/icons/viber.svg" alt="" width={24} height={24} />
                  <span className="font-medium">Viber</span>
                </a>
                <a
                  href={getTelegramLink(telegram)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#0088cc] text-white hover:opacity-90 transition-opacity"
                >
                  <Image src="/icons/telegram.svg" alt="" width={24} height={24} />
                  <span className="font-medium">Telegram</span>
                </a>
                <a
                  href={getWhatsAppLink(whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#25d366] text-white hover:opacity-90 transition-opacity"
                >
                  <Image src="/icons/whatsapp.svg" alt="" width={24} height={24} />
                  <span className="font-medium">WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="mt-8">
              <h3 className="font-semibold text-[var(--color-text-primary)] mb-4">
                Ми на карті
              </h3>
              <div className="aspect-video bg-[var(--color-bg-card)]/60 backdrop-blur-sm border border-[var(--color-border)] rounded-xl flex items-center justify-center">
                <div className="text-center text-[var(--color-text-muted)]">
                  <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Тут буде карта</p>
                  <p className="text-sm">Google Maps / OpenStreetMap</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-[var(--color-bg-card)]/60 backdrop-blur-sm border border-[var(--color-border)] rounded-xl p-6 md:p-8">
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
                Напишіть нам
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-6">
                Залиште повідомлення і ми зв&apos;яжемося з вами найближчим часом
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Ваше ім'я"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Введіть ваше ім'я"
                  error={errors.name}
                  required
                />

                <Input
                  label="Телефон"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+380 XX XXX XXXX"
                  error={errors.phone}
                  required
                />

                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  error={errors.email}
                  hint="Необов'язково"
                />

                <Textarea
                  label="Повідомлення"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Опишіть ваш запит..."
                  rows={5}
                  error={errors.message}
                  required
                />

                <Button
                  type="submit"
                  className="w-full"
                  isLoading={isSubmitting}
                >
                  <Send className="w-5 h-5" />
                  Надіслати повідомлення
                </Button>

                <p className="text-xs text-[var(--color-text-muted)] text-center">
                  Надсилаючи форму, ви погоджуєтеся з обробкою персональних даних
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
