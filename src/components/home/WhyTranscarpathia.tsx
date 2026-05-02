'use client';

import { useScrollAnimation } from '@/hooks';

export function WhyTranscarpathia() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.2 });

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-36 overflow-hidden has-grain"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80')",
            backgroundAttachment: 'fixed',
          }}
        />
        {/* Dark overlay + warm tint */}
        <div className="absolute inset-0 bg-[#0c0c0c]/82" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c0c0c]/40 via-transparent to-[#0c0c0c]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,169,98,0.10),transparent_60%)]" />
      </div>

      {/* Content */}
      <div className="container relative z-10">
        <div
          className={`max-w-3xl mx-auto text-center transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-10 blur-md'
          }`}
        >
          <span className="kicker mb-6">
            <span>Закарпаття</span>
          </span>

          <h2 className="section-heading mt-4 mb-7">
            Смаки <span className="italic text-[var(--color-accent)] font-[family-name:var(--font-heading)]">Закарпаття</span>
            <br className="hidden md:block" /> у кожній упаковці
          </h2>

          <div className="section-divider mb-7">
            <span className="dot" />
          </div>

          <p className="text-lg md:text-xl text-[var(--color-text-secondary)] mb-8 leading-relaxed">
            Закарпаття — регіон із багатовіковими кулінарними традиціями, де українська,
            угорська та європейська кухні переплітаються у неповторну палітру смаків.
            Наші спеції вирощені в унікальному мікрокліматі закарпатських долин, а макарони
            виготовлені за рецептурами, що передаються з покоління в покоління.
          </p>

          <p className="text-[var(--color-accent)] font-medium text-lg uppercase tracking-[0.18em] font-[family-name:var(--font-heading)] italic">
            Perfect 4 You — автентичний смак Закарпаття з 2013 року
          </p>
        </div>
      </div>
    </section>
  );
}
