import type { Metadata } from 'next';
import Image from 'next/image';
import { CheckCircle, Award, Truck, Users, Clock, ShieldCheck, MapPin, Mountain } from 'lucide-react';
import { PLACEHOLDER } from '@/lib/constants';
import { Breadcrumbs } from '@/components/catalog';

export const metadata: Metadata = {
  title: `Про нас | ${PLACEHOLDER.companyName}`,
  description: `${PLACEHOLDER.companyName} - надійний оптовий постачальник продуктів харчування. ${PLACEHOLDER.yearsExperience} на ринку.`,
};

const STATS = [
  { value: 'з 2013', label: 'року на ринку' },
  { value: '1000+', label: 'постійних клієнтів' },
  { value: '300+', label: 'позицій в каталозі' },
  { value: 'Вся', label: 'Україна — географія' },
];

const FEATURES = [
  {
    icon: ShieldCheck,
    title: 'Гарантія якості',
    description: 'Ми ретельно перевіряємо кожну партію товару перед відправкою клієнтам. Всі продукти мають необхідні сертифікати якості.',
  },
  {
    icon: Truck,
    title: 'Швидка доставка',
    description: 'Доставка по всій Україні власним автопарком. Гарантуємо дотримання температурного режиму та збереження товару.',
  },
  {
    icon: Users,
    title: 'Індивідуальний підхід',
    description: 'За кожним клієнтом закріплюється персональний менеджер. Враховуємо всі побажання та пропонуємо оптимальні рішення.',
  },
  {
    icon: Award,
    title: 'Найкращі ціни',
    description: 'Працюємо напряму з виробниками та імпортерами. Пропонуємо конкурентні ціни та гнучку систему знижок.',
  },
  {
    icon: Clock,
    title: 'Стабільні постачання',
    description: 'Налагоджені відносини з постачальниками гарантують безперебійні поставки товару в потрібних обсягах.',
  },
  {
    icon: CheckCircle,
    title: 'Зручне замовлення',
    description: 'Замовлення через телефон, месенджери або на сайті. Швидке оформлення та підтвердження заявки.',
  },
];

const HISTORY = [
  { year: '2013', text: 'Заснування компанії Perfect 4 You у Закарпатті. Перші поставки спецій та приправ.' },
  { year: '2015', text: 'Розширення асортименту макаронними виробами за угорськими рецептами.' },
  { year: '2017', text: 'Вихід на всеукраїнський ринок. Додавання консервації та олії до каталогу.' },
  { year: '2020', text: 'Понад 500 постійних клієнтів по всій Україні. Модернізація логістики.' },
  { year: '2023', text: 'Формування повного каталогу з 300+ позицій. Запуск онлайн-платформи.' },
  { year: 'Сьогодні', text: 'Понад 1000 постійних клієнтів. Лідер оптових поставок закарпатських спецій.' },
];

export default function AboutPage() {
  const breadcrumbs = [
    { label: 'Про нас' },
  ];

  return (
    <main className="min-h-screen relative z-10">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbs} />

        {/* Hero Section */}
        <section className="mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-text-primary)] mb-6">
            {PLACEHOLDER.aboutTitle}
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-lg text-[var(--color-text-secondary)] mb-6">
                {PLACEHOLDER.aboutText}
              </p>
              <p className="text-lg text-[var(--color-text-secondary)] mb-6">
                Наша особлива експертиза — це автентичні закарпатські спеції, що дарують 
                стравам неповторний аромат та насичений смак, та добірні угорські макарони, 
                які стали фаворитами серед наших клієнтів.
              </p>
              <p className="text-lg text-[var(--color-text-secondary)]">
                Працюємо з роздрібними магазинами, ресторанами, готелями, кафе, 
                оптовими базами та виробниками продуктів харчування по всій Україні.
              </p>
            </div>
            
            <div className="relative aspect-video rounded-xl overflow-hidden bg-[var(--color-bg-card)]/60 backdrop-blur-sm border border-[var(--color-border)]">
              <Image
                src="/images/hero-bg.svg"
                alt="Про компанію"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, index) => (
              <div
                key={index}
                className="bg-[var(--color-bg-card)]/60 backdrop-blur-sm border border-[var(--color-border)] rounded-xl p-6 text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-[var(--color-accent)] mb-2">
                  {stat.value}
                </div>
                <div className="text-[var(--color-text-secondary)]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-8 text-center">
            Чому обирають нас
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-[var(--color-bg-card)]/60 backdrop-blur-sm border border-[var(--color-border)] rounded-xl p-6 hover:border-[var(--color-accent)] transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[var(--color-accent)]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[var(--color-text-secondary)]">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* History Timeline */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-8 text-center">
            Наша історія
          </h2>
          
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-[var(--color-border)] md:-translate-x-1/2" />
            
            <div className="space-y-8">
              {HISTORY.map((item, index) => (
                <div
                  key={index}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-[var(--color-accent)] md:-translate-x-1/2 z-10" />
                  
                  {/* Content */}
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <div className="bg-[var(--color-bg-card)]/60 backdrop-blur-sm border border-[var(--color-border)] rounded-xl p-4">
                      <div className="text-[var(--color-accent)] font-bold mb-1">
                        {item.year}
                      </div>
                      <div className="text-[var(--color-text-secondary)]">
                        {item.text}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[var(--color-bg-card)]/60 backdrop-blur-sm border border-[var(--color-border)] rounded-xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-4">
            Готові до співпраці?
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-6 max-w-2xl mx-auto">
            Зв&apos;яжіться з нами сьогодні та отримайте персональну пропозицію 
            з найкращими умовами для вашого бізнесу.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contacts"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[var(--color-accent)] text-[var(--color-accent-dark)] font-medium hover:bg-[var(--color-accent-hover)] transition-colors"
            >
              Контакти
            </a>
            <a
              href="/catalog"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-[var(--color-border)] text-[var(--color-text-primary)] font-medium hover:border-[var(--color-accent)] transition-colors"
            >
              Переглянути каталог
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
