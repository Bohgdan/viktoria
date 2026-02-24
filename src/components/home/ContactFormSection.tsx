'use client';

import { useState } from 'react';
import { Send, CheckCircle, Phone, Mail, MapPin } from 'lucide-react';
import { PLACEHOLDER } from '@/lib/constants';
import { formatPhone, getPhoneLink, getViberLink, getTelegramLink, getWhatsAppLink, isValidPhone } from '@/lib/utils';
import { Button, Input, Textarea } from '@/components/ui';
import Image from 'next/image';

export function ContactFormSection() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError("Введіть ваше ім'я");
      return;
    }

    if (!formData.phone.trim() || !isValidPhone(formData.phone)) {
      setError('Введіть коректний номер телефону');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit');
      }

      setIsSuccess(true);
      setFormData({ name: '', phone: '', message: '' });
    } catch {
      setError(PLACEHOLDER.formError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section relative">
      {/* Decorative waves */}
      <div className="decorative-waves" />

      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Form */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-4 font-[family-name:var(--font-heading)] uppercase tracking-wide">
              {PLACEHOLDER.formTitle}
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-8">
              {PLACEHOLDER.formSubtitle}
            </p>

            {isSuccess ? (
              <div className="p-6 bg-[var(--color-success-bg)] border border-[var(--color-success)] rounded-xl text-center">
                <CheckCircle className="w-12 h-12 mx-auto text-[var(--color-success)] mb-4" />
                <p className="text-[var(--color-text-primary)]">{PLACEHOLDER.formSuccess}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  name="name"
                  label={PLACEHOLDER.formFields.name}
                  placeholder="Іван Петренко"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

                <Input
                  name="phone"
                  type="tel"
                  label={PLACEHOLDER.formFields.phone}
                  placeholder="+380 XX XXX XX XX"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />

                <Textarea
                  name="message"
                  label={PLACEHOLDER.formFields.message}
                  placeholder="Ваше запитання або повідомлення..."
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                />

                {error && (
                  <p className="text-[var(--color-error)] text-sm">{error}</p>
                )}

                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  leftIcon={<Send className="w-4 h-4" />}
                  className="w-full sm:w-auto uppercase tracking-wider"
                >
                  {isSubmitting ? PLACEHOLDER.formFields.submitting : PLACEHOLDER.formFields.submit}
                </Button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="lg:pl-8">
            <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-6">
              Контактна інформація
            </h3>

            <div className="space-y-6 mb-8">
              {/* Phone */}
              <a
                href={getPhoneLink(PLACEHOLDER.phone)}
                className="flex items-center gap-4 p-4 bg-[var(--color-bg-card)]/60 backdrop-blur-sm border border-[var(--color-border)] rounded-xl hover:border-[var(--color-accent)] transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--color-accent-light)] flex items-center justify-center group-hover:bg-[var(--color-accent)] transition-colors">
                  <Phone className="w-6 h-6 text-[var(--color-accent)] group-hover:text-[var(--color-accent-dark)] transition-colors" />
                </div>
                <div>
                  <p className="text-sm text-[var(--color-text-muted)]">Телефон</p>
                  <p className="font-medium text-[var(--color-text-primary)]">
                    {formatPhone(PLACEHOLDER.phone)}
                  </p>
                </div>
              </a>

              {/* Email */}
              <a
                href={`mailto:${PLACEHOLDER.email}`}
                className="flex items-center gap-4 p-4 bg-[var(--color-bg-card)]/60 backdrop-blur-sm border border-[var(--color-border)] rounded-xl hover:border-[var(--color-accent)] transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--color-accent-light)] flex items-center justify-center group-hover:bg-[var(--color-accent)] transition-colors">
                  <Mail className="w-6 h-6 text-[var(--color-accent)] group-hover:text-[var(--color-accent-dark)] transition-colors" />
                </div>
                <div>
                  <p className="text-sm text-[var(--color-text-muted)]">Email</p>
                  <p className="font-medium text-[var(--color-text-primary)]">
                    {PLACEHOLDER.email}
                  </p>
                </div>
              </a>

              {/* Address */}
              <div className="flex items-center gap-4 p-4 bg-[var(--color-bg-card)]/60 backdrop-blur-sm border border-[var(--color-border)] rounded-xl">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-accent-light)] flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-[var(--color-accent)]" />
                </div>
                <div>
                  <p className="text-sm text-[var(--color-text-muted)]">Адреса</p>
                  <p className="font-medium text-[var(--color-text-primary)]">
                    {PLACEHOLDER.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Messengers */}
            <h4 className="text-lg font-medium text-[var(--color-text-primary)] mb-4">
              Напишіть нам у месенджер
            </h4>
            <div className="flex flex-wrap gap-3">
              <a
                href={getViberLink(PLACEHOLDER.viber)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#7360f2] text-white hover:opacity-90 transition-opacity"
              >
                <Image src="/icons/viber.svg" alt="" width={24} height={24} />
                <span className="font-medium">Viber</span>
              </a>
              <a
                href={getTelegramLink(PLACEHOLDER.telegram)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#0088cc] text-white hover:opacity-90 transition-opacity"
              >
                <Image src="/icons/telegram.svg" alt="" width={24} height={24} />
                <span className="font-medium">Telegram</span>
              </a>
              <a
                href={getWhatsAppLink(PLACEHOLDER.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#25d366] text-white hover:opacity-90 transition-opacity"
              >
                <Image src="/icons/whatsapp.svg" alt="" width={24} height={24} />
                <span className="font-medium">WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
