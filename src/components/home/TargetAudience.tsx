import { Store, Utensils, Warehouse, Factory } from 'lucide-react';
import { TARGET_AUDIENCE } from '@/lib/constants';

// Map icon names to Lucide components
const iconMap: Record<string, React.ElementType> = {
  store: Store,
  utensils: Utensils,
  warehouse: Warehouse,
  factory: Factory,
};

export function TargetAudience() {
  return (
    <section className="section relative">
      <div className="container">
        <div className="text-center mb-14 reveal-up" data-reveal>
          <span className="kicker mb-5">
            <span>Аудиторія</span>
          </span>
          <h2 className="section-heading mt-4">
            Для кого <span className="text-[var(--color-accent)] italic font-[family-name:var(--font-heading)]">наша продукція</span>
          </h2>
          <div className="section-divider mt-5">
            <span className="dot" />
          </div>
          <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto mt-5 leading-relaxed">
            Ми працюємо з різними сегментами бізнесу, забезпечуючи кожного клієнта
            якісними продуктами та індивідуальним підходом
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TARGET_AUDIENCE.map((item, index) => {
            const IconComponent = item.icon ? iconMap[item.icon] : Store;

            return (
              <div
                key={index}
                className="group card-premium lift p-7 reveal-up"
                data-reveal
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Icon */}
                <div className="icon-orb mb-5">
                  <IconComponent className="w-6 h-6" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3 group-hover:text-[var(--color-accent)] transition-colors font-[family-name:var(--font-heading)]">
                  {item.title}
                </h3>
                <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
