'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Невірний email або пароль');
        } else {
          toast.error(error.message);
        }
        setIsLoading(false);
        return;
      }

      toast.success('Вхід виконано успішно');
      router.push('/admin');
      router.refresh();
    } catch {
      toast.error('Помилка з\'єднання. Спробуйте пізніше.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <span className="text-4xl font-serif font-bold">
              <span className="text-[var(--color-accent)]">Perfect</span>
              <span className="text-[var(--color-text-primary)]">4you</span>
            </span>
          </div>
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
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
              placeholder="Введіть email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
              Пароль
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 pr-12 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
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
