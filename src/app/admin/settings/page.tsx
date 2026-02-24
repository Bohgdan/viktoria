'use client';

import { useEffect, useState } from 'react';
import { Save, Loader2, Phone, Mail, MapPin, Clock, Globe } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase';
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
  phone: '+380 50 123 45 67',
  email: 'info@perfect4you.com.ua',
  address: 'м. Ужгород, вул. Гагаріна, 45',
  working_hours: 'Пн–Пт: 9:00–18:00',
  instagram: 'https://instagram.com/perfect4you',
  facebook: 'https://facebook.com/perfect4you',
  telegram: '@perfect4you',
  viber: '+380501234567',
  site_title: 'Perfect 4 you - Оптові поставки бакалії',
  site_description: 'Прямі поставки спецій, макаронів та бакалії з Закарпаття. Понад 1000 постійних клієнтів з 2013 року.',
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const supabase = createBrowserClient();

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('key, value');

      if (error) throw error;

      if (data && data.length > 0) {
        const settingsObj = data.reduce((acc, item) => {
          acc[item.key as keyof Settings] = item.value;
          return acc;
        }, {} as Partial<Settings>);
        
        setSettings({ ...DEFAULT_SETTINGS, ...settingsObj });
      }
    } catch (error) {
      console.error('Error:', error);
      // Use default settings if table doesn't exist yet
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      const entries = Object.entries(settings);
      
      for (const [key, value] of entries) {
        await supabase
          .from('settings')
          .upsert({ key, value }, { onConflict: 'key' });
      }

      toast.success('Налаштування збережено');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Помилка збереження');
    } finally {
      setIsSaving(false);
    }
  }

  const updateSetting = (key: keyof Settings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
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
