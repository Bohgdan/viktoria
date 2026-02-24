import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen relative z-10 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-8xl font-bold text-[var(--color-accent)] mb-4">404</h1>
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
          Сторінку не знайдено
        </h2>
        <p className="text-[var(--color-text-secondary)] mb-8">
          На жаль, сторінка, яку ви шукаєте, не існує або була переміщена.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[var(--color-accent)] text-[var(--color-accent-dark)] font-medium hover:bg-[var(--color-accent-hover)] transition-colors"
          >
            <Home className="w-5 h-5" />
            На головну
          </Link>
          <Link
            href="/catalog"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-[var(--color-border)] text-[var(--color-text-primary)] font-medium hover:border-[var(--color-accent)] transition-colors"
          >
            <Search className="w-5 h-5" />
            Переглянути каталог
          </Link>
        </div>
      </div>
    </main>
  );
}
