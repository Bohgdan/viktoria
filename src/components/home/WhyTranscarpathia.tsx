'use client';

import { useScrollAnimation } from '@/hooks';

export function WhyTranscarpathia() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.2 });

  return (
    <section 
      ref={ref}
      className="relative py-20 md:py-32 overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80')",
            backgroundAttachment: 'fixed'
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[#0c0c0c]/75" />
      </div>

      {/* Content */}
      <div className="container relative z-10">
        <div 
          className={`max-w-3xl mx-auto text-center transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-text-primary)] mb-6 font-[family-name:var(--font-heading)]">
            Смаки Закарпаття — у кожній упаковці
          </h2>
          
          <p className="text-lg md:text-xl text-[var(--color-text-secondary)] mb-8 leading-relaxed">
            Закарпаття — регіон із багатовіковими кулінарними традиціями, де українська, 
            угорська та європейська кухні переплітаються у неповторну палітру смаків. 
            Наші спеції вирощені в унікальному мікрокліматі закарпатських долин, а макарони 
            виготовлені за рецептурами, що передаються з покоління в покоління.
          </p>

          <div className="w-24 h-[2px] mx-auto bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent mb-6" />
          
          <p className="text-[var(--color-accent)] font-medium text-lg">
            Perfect 4 You — автентичний смак Закарпаття з 2013 року
          </p>
        </div>
      </div>
    </section>
  );
}
