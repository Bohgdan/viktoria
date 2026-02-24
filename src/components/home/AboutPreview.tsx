import Link from 'next/link';
import { ArrowRight, Award, Users, TrendingUp, CheckCircle } from 'lucide-react';
import { PLACEHOLDER } from '@/lib/constants';
import { getYearsOnMarket } from '@/lib/utils';

export function AboutPreview() {
  const yearsOnMarket = getYearsOnMarket(PLACEHOLDER.yearsOnMarket);

  const stats = [
    { icon: Award, value: `${yearsOnMarket}+`, label: 'Років на ринку' },
    { icon: Users, value: '1000+', label: 'Постійних клієнтів' },
    { icon: TrendingUp, value: '300+', label: 'Позицій в каталозі' },
  ];

  const features = [
    'Прямий постачальник',
    'Найкращі ціни без посередників',
    'Доставка по всій Україні',
    'Оплата після отримання',
  ];

  return (
    <section className="section">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Image placeholder */}
          <div className="relative">
            <div className="aspect-[4/5] rounded-xl overflow-hidden bg-[var(--color-bg-card)]/60 backdrop-blur-sm border border-[var(--color-border)]">
              <div 
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: "url('/images/hero-bg.svg')" }}
              />
            </div>
            {/* Decorative accent */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-xl bg-[var(--color-accent-light)] -z-10" />
          </div>

          {/* Right - Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-2 font-[family-name:var(--font-heading)]">
              {PLACEHOLDER.companyName}
            </h2>
            <p className="text-[var(--color-accent)] font-medium mb-6">
              — надійний партнер у сфері гуртової торгівлі з {PLACEHOLDER.yearsOnMarket} року
            </p>

            <p className="text-[var(--color-text-secondary)] mb-6 leading-relaxed">
              {PLACEHOLDER.aboutShort.replace('{year}', PLACEHOLDER.yearsOnMarket)}
            </p>

            {/* Features list */}
            <ul className="space-y-3 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3 text-[var(--color-text-secondary)]">
                  <CheckCircle className="w-5 h-5 text-[var(--color-accent)] flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-4 border border-[var(--color-border)] rounded-xl">
                  <div className="text-2xl font-bold text-[var(--color-accent)] mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-[var(--color-text-muted)]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-accent)] text-[var(--color-accent-dark)] rounded-lg font-semibold hover:bg-[var(--color-accent-hover)] transition-colors group"
            >
              Дізнатися більше
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
