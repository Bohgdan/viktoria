'use client';

import { useState } from 'react';
import { Save, Loader2, Phone, Mail, MapPin, Clock, Globe, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Settings {
  phone: string;
  email: string;
  address: string;
  working_hours: string;
  instagram: string;
  facebook: string;
  telegram: string;
  viber: string;
  site_title: string;
  site_description: string;
}

const DEFAULT_SETTINGS: Settings = {
  phone: '+380 (50) 517-25-93',
  email: 'fop.payk@ukr.net',
  address: 'Україна, Закарпатська обл.',
  working_hours: 'Пн–Пт: 9:00–18:00, Сб: 9:00-14:00',
  instagram: '',
  facebook: '',
  telegram: '+380505172593',
  viber: '+380505172593',
  site_title: 'Perfect 4 you - Оптові поставки бакалії',
  site_description: 'Прямі поставки спецій, макаронів та бакалії з Закарпаття. Понад 1000 постійних клієнтів з 2013 року.',
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    setIsSaving(true);
    // In a real application, this would save to the database
    // For now, settings are managed via constants.ts
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Налаштування збережено');
    }, 500);
  }

  const updateSetting = (key: keyof Settings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Note */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-blue-400">Інформація</p>
          <p className="text-sm text-blue-400/70">
            Налаштування зберігаються локально. Для зміни контактних даних на сайті 
            відредагуйте файл src/lib/constants.ts
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[var(--color-text-primary)]">
            Налаштування
          </h1>
          <p className="text-[var(--color-text-muted)] mt-1">
            Загальні налаштування сайту
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--color-accent)] text-[var(--color-accent-dark)] rounded-lg font-semibold hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Зберегти
        </button>
      </div>

      {/* Contact Info */}
      <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
          Контактна інформація
        </h2>
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              <Phone className="w-4 h-4" />
              Телефон
            </label>
            <input
              type="text"
              value={settings.phone}
              onChange={(e) => updateSetting('phone', e.target.value)}
              className="w-full px-3 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)]"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              <Mail className="w-4 h-4" />
              Email
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => updateSetting('email', e.target.value)}
              className="w-full px-3 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)]"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              <MapPin className="w-4 h-4" />
              Адреса
            </label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => updateSetting('address', e.target.value)}
              className="w-full px-3 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)]"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              <Clock className="w-4 h-4" />
              Години роботи
            </label>
            <input
              type="text"
              value={settings.working_hours}
              onChange={(e) => updateSetting('working_hours', e.target.value)}
              className="w-full px-3 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)]"
            />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
          Соціальні мережі
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Instagram
            </label>
            <input
              type="text"
              value={settings.instagram}
              onChange={(e) => updateSetting('instagram', e.target.value)}
              className="w-full px-3 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)]"
              placeholder="https://instagram.com/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Facebook
            </label>
            <input
              type="text"
              value={settings.facebook}
              onChange={(e) => updateSetting('facebook', e.target.value)}
              className="w-full px-3 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)]"
              placeholder="https://facebook.com/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Telegram
            </label>
            <input
              type="text"
              value={settings.telegram}
              onChange={(e) => updateSetting('telegram', e.target.value)}
              className="w-full px-3 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)]"
              placeholder="@username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Viber
            </label>
            <input
              type="text"
              value={settings.viber}
              onChange={(e) => updateSetting('viber', e.target.value)}
              className="w-full px-3 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)]"
              placeholder="+380..."
            />
          </div>
        </div>
      </div>

      {/* SEO Settings */}
      <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5" />
          SEO налаштування
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Заголовок сайту
            </label>
            <input
              type="text"
              value={settings.site_title}
              onChange={(e) => updateSetting('site_title', e.target.value)}
              className="w-full px-3 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              Опис сайту
            </label>
            <textarea
              value={settings.site_description}
              onChange={(e) => updateSetting('site_description', e.target.value)}
              className="w-full px-3 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] resize-none"
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Admin Credentials Info */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
        <p className="text-sm text-yellow-400">
          <strong>Дані для входу в адмін-панель:</strong><br />
          Логін: admin<br />
          Пароль: perfect4you2013<br />
          <span className="text-yellow-400/70">(Змініть пароль у коді перед продакшеном)</span>
        </p>
      </div>
    </div>
  );
}
