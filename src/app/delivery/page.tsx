import type { Metadata } from 'next';
import { Truck, Clock, MapPin, CreditCard, Package, ThermometerSnowflake, Phone, CheckCircle } from 'lucide-react';
import { PLACEHOLDER } from '@/lib/constants';
import { formatPhone, getPhoneLink } from '@/lib/utils';
import { Breadcrumbs } from '@/components/catalog';

export const metadata: Metadata = {
  title: `Доставка та оплата | ${PLACEHOLDER.companyName}`,
  description: `Умови доставки та оплати від ${PLACEHOLDER.companyName}. Швидка доставка по всій Україні.`,
};

const DELIVERY_ZONES = [
  { zone: 'Київ та область', time: '1-2 дні', minOrder: '2 000 грн' },
  { zone: 'Центральна Україна', time: '2-3 дні', minOrder: '5 000 грн' },
  { zone: 'Західна Україна', time: '3-4 дні', minOrder: '7 000 грн' },
  { zone: 'Східна Україна', time: '3-4 дні', minOrder: '7 000 грн' },
  { zone: 'Південна Україна', time: '2-3 дні', minOrder: '5 000 грн' },
];

const DELIVERY_FEATURES = [
  {
    icon: Truck,
    title: 'Власний автопарк',
    description: 'Доставка здійснюється нашим власним транспортом з досвідченими водіями.',
  },
  {
    icon: ThermometerSnowflake,
    title: 'Температурний режим',
    description: 'Рефрижератори забезпечують збереження оптимальної температури під час перевезення.',
  },
  {
    icon: Package,
    title: 'Надійна упаковка',
    description: 'Використовуємо спеціальну тару та упаковку для захисту товару.',
  },
  {
    icon: Clock,
    title: 'Вчасна доставка',
    description: 'Гарантуємо доставку в погоджений час. Попереджаємо про час прибуття.',
  },
];

const PAYMENT_METHODS = [
  {
    icon: CreditCard,
    title: 'Безготівковий розрахунок',
    description: 'Оплата на розрахунковий рахунок компанії. Виставляємо рахунок-фактуру.',
    details: ['Для юридичних осіб та ФОП', 'Можлива післяплата', 'Робота з ПДВ'],
  },
  {
    icon: Package,
    title: 'Готівка при отриманні',
    description: 'Оплата готівкою при отриманні товару від кур\'єра.',
    details: ['Для замовлень до 20 000 грн', 'Перерахунок товару на місці', 'Видача касового чеку'],
  },
];

const FAQ = [
  {
    question: 'Яка мінімальна сума замовлення?',
    answer: 'Мінімальна сума замовлення залежить від регіону доставки. Для Києва та області — від 2 000 грн, для інших регіонів — від 5 000 грн.',
  },
  {
    question: 'Як швидко здійснюється доставка?',
    answer: 'По Києву та області доставка здійснюється протягом 1-2 днів з моменту підтвердження замовлення. Для інших регіонів — 2-4 дні залежно від віддаленості.',
  },
  {
    question: 'Чи можна отримати зразки продукції?',
    answer: 'Так, ми надаємо зразки продукції для нових клієнтів. Зв\'яжіться з нашим менеджером для уточнення умов.',
  },
  {
    question: 'Що робити, якщо товар не відповідає якості?',
    answer: 'Ми гарантуємо якість всієї продукції. У випадку виявлення невідповідності якості, зв\'яжіться з нами протягом 24 годин для оформлення повернення або заміни.',
  },
  {
    question: 'Чи є знижки для постійних клієнтів?',
    answer: 'Так, ми пропонуємо спеціальні умови та знижки для постійних партнерів. Розмір знижки залежить від обсягу та регулярності замовлень.',
  },
];

export default function DeliveryPage() {
  const breadcrumbs = [
    { label: 'Доставка та оплата' },
  ];

  return (
    <main className="min-h-screen relative z-10">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbs} />

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-text-primary)] mb-4">
          Доставка та оплата
        </h1>
        
        <p className="text-lg text-[var(--color-text-secondary)] mb-12 max-w-3xl">
          Ми доставляємо продукцію по всій території України власним автопарком 
          з дотриманням усіх умов зберігання.
        </p>

        {/* Delivery Features */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
            Переваги нашої доставки
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {DELIVERY_FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-[var(--color-bg-card)]/60 backdrop-blur-sm border border-[var(--color-border)] rounded-xl p-6"
                >
                  <div className="w-12 h-12 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[var(--color-accent)]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Delivery Zones Table */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-[var(--color-accent)]" />
            Зони доставки
          </h2>
          
          <div className="bg-[var(--color-bg-card)]/60 backdrop-blur-sm border border-[var(--color-border)] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)]">
                    <th className="text-left py-4 px-6 font-semibold text-[var(--color-text-primary)]">
                      Регіон
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-[var(--color-text-primary)]">
                      Термін доставки
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-[var(--color-text-primary)]">
                      Мін. замовлення
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {DELIVERY_ZONES.map((zone, index) => (
                    <tr
                      key={index}
                      className="border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-bg-secondary)]/50 transition-colors"
                    >
                      <td className="py-4 px-6 text-[var(--color-text-primary)]">
                        {zone.zone}
                      </td>
                      <td className="py-4 px-6 text-[var(--color-text-secondary)]">
                        {zone.time}
                      </td>
                      <td className="py-4 px-6 text-[var(--color-accent)] font-medium">
                        {zone.minOrder}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <p className="mt-4 text-sm text-[var(--color-text-muted)]">
            * Точні терміни доставки залежать від наявності товару на складі та погодних умов.
          </p>
        </section>

        {/* Payment Methods */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
            Способи оплати
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PAYMENT_METHODS.map((method, index) => {
              const Icon = method.icon;
              return (
                <div
                  key={index}
                  className="bg-[var(--color-bg-card)]/60 backdrop-blur-sm border border-[var(--color-border)] rounded-xl p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-[var(--color-accent)]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                        {method.title}
                      </h3>
                      <p className="text-[var(--color-text-secondary)] mb-4">
                        {method.description}
                      </p>
                      <ul className="space-y-2">
                        {method.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                            <CheckCircle className="w-4 h-4 text-[var(--color-success)]" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
            Часті запитання
          </h2>
          
          <div className="space-y-4">
            {FAQ.map((faq, index) => (
              <div
                key={index}
                className="bg-[var(--color-bg-card)]/60 backdrop-blur-sm border border-[var(--color-border)] rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                  {faq.question}
                </h3>
                <p className="text-[var(--color-text-secondary)]">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="bg-[var(--color-bg-card)]/60 backdrop-blur-sm border border-[var(--color-border)] rounded-xl p-8 text-center">
          <h2 className="text-xl md:text-2xl font-bold text-[var(--color-text-primary)] mb-2">
            Є запитання щодо доставки?
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-4">
            Зв&apos;яжіться з нами, і наш менеджер надасть детальну консультацію
          </p>
          <a
            href="/contacts"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--color-accent)] text-[var(--color-accent-dark)] font-medium hover:bg-[var(--color-accent-hover)] transition-colors"
          >
            Контакти
          </a>
        </section>
      </div>
    </main>
  );
}
