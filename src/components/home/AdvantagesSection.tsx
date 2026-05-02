import { ShieldCheck, Truck, CreditCard, Clock, Package, type LucideIcon } from 'lucide-react';
import { DEFAULT_ADVANTAGES } from '@/lib/constants';
import type { Advantage } from '@/lib/types';

// Map icon names to Lucide components
const iconMap: Record<string, LucideIcon> = {
  'shield-check': ShieldCheck,
  'package-check': Package,
  'package': Package,
  'truck': Truck,
  'credit-card': CreditCard,
  'clock': Clock,
  'layout-grid': Package,
};

interface AdvantagesSectionProps {
  advantages?: Advantage[];
}

export function AdvantagesSection({ advantages = DEFAULT_ADVANTAGES }: AdvantagesSectionProps) {
  return (
    <section className="py-20 lg:py-28 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(201,169,98,0.06),transparent_60%)] pointer-events-none" />
      <div className="container relative z-10">
        {/* Title */}
        <div className="text-center mb-14 reveal-up" data-reveal>
          <span className="kicker mb-5">
            <span>Переваги</span>
          </span>
          <h2 className="section-heading mt-4">
            Чому обирають <span className="text-[var(--color-accent)] italic font-[family-name:var(--font-heading)]">нас</span>
          </h2>
          <div className="section-divider mt-5">
            <span className="dot" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {advantages.map((advantage, idx) => {
            const IconComponent = iconMap[advantage.icon] || ShieldCheck;

            return (
              <div
                key={advantage.id}
                className="group card-premium lift p-7 reveal-up"
                data-reveal
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                {/* Icon */}
                <div className="icon-orb mb-5">
                  <IconComponent className="w-6 h-6" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3 group-hover:text-[var(--color-accent)] transition-colors font-[family-name:var(--font-heading)]">
                  {advantage.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                  {advantage.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
