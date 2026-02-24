'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff, Lock, User, Loader2 } from 'lucide-react';
import { PLACEHOLDER } from '@/lib/constants';
import toast from 'react-hot-toast';

// Simple hardcoded credentials for MVP
// In production, use Supabase Auth or similar
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'perfect4you2013',
};

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (
      formData.username === ADMIN_CREDENTIALS.username &&
      formData.password === ADMIN_CREDENTIALS.password
    ) {
      localStorage.setItem('admin_auth', 'authenticated');
      toast.success('Вхід виконано успішно');
      router.push('/admin');
    } else {
      toast.error('Невірний логін або пароль');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="/images/logo.png"
            alt={PLACEHOLDER.companyName}
            width={180}
            height={54}
            className="h-14 w-auto object-contain mx-auto mb-4"
          />
          <h1 className="text-2xl font-serif font-bold text-[var(--color-text-primary)]">
            Панель адміністратора
          </h1>
          <p className="text-[var(--color-text-muted)] mt-2">
            Увійдіть для управління сайтом
          </p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl p-6 space-y-5"
        >
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
              Логін
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                placeholder="Введіть логін"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
              Пароль
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full pl-10 pr-12 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                placeholder="Введіть пароль"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[var(--color-accent)] text-[var(--color-accent-dark)] rounded-lg font-semibold hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Увійти'
            )}
          </button>
        </form>

        {/* Back to site */}
        <p className="text-center text-[var(--color-text-muted)] text-sm mt-6">
          <a href="/" className="hover:text-[var(--color-accent)] transition-colors">
            ← Повернутися на сайт
          </a>
        </p>
      </div>
    </div>
  );
}
