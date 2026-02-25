'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)]">
      <div className="text-center p-8 max-w-lg">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
          Щось пішло не так
        </h2>
        <p className="text-[var(--color-text-muted)] mb-6">
          Виникла помилка при завантаженні сторінки. Спробуйте оновити сторінку.
        </p>
        {error.digest && (
          <p className="text-xs text-[var(--color-text-light)] mb-4">
            Код помилки: {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
        >
          Спробувати знову
        </button>
      </div>
    </div>
  );
}
