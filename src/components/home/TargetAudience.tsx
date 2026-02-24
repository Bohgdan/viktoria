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
    <section className="section">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="section-title mb-4">
            Для кого <span className="accent-text">наша продукція</span>
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto">
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
                className="group p-6 border border-[var(--color-border)] rounded-xl hover:border-[var(--color-accent)] transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-14 h-14 mb-4 rounded-xl bg-[var(--color-accent-light)] flex items-center justify-center group-hover:bg-[var(--color-accent)] transition-colors duration-300">
                  <IconComponent className="w-7 h-7 text-[var(--color-accent)] group-hover:text-[var(--color-accent-dark)] transition-colors duration-300" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2 group-hover:text-[var(--color-accent)] transition-colors">
                  {item.title}
                </h3>
                <p className="text-[var(--color-text-secondary)] text-sm">
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
