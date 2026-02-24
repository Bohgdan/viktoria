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
    <section className="py-16 lg:py-20">
      <div className="container">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-[family-name:var(--font-heading)] text-[var(--color-text-primary)]">
          Чому обирають <span className="text-[var(--color-accent)]">нас</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {advantages.map((advantage) => {
            const IconComponent = iconMap[advantage.icon] || ShieldCheck;
            
            return (
              <div
                key={advantage.id}
                className="group p-7 rounded-xl bg-[var(--color-bg-card)]/60 backdrop-blur-sm border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-12 h-12 mb-5 rounded-lg bg-[var(--color-accent)] flex items-center justify-center">
                  <IconComponent className="w-6 h-6 text-[var(--color-accent-dark)]" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
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
