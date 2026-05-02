'use client';

const ROW_A = [
  'Паприка закарпатська',
  'Перець чорний преміум',
  'Угорські макарони',
  'Консервація Perfect',
  'Олія соняшникова',
  'Овочеве асорті',
  'Універсальна приправа',
];

const ROW_B = [
  'Спеції для бограчу',
  'Галушки',
  'Вермішель',
  'Часник мелений',
  'Лимонна кислота',
  'Сода харчова',
  'Прямий постачальник',
];

function Row({ items, direction }: { items: string[]; direction: 'left' | 'right' }) {
  const doubled = [...items, ...items, ...items];
  return (
    <div className={`marquee-track ${direction}`}>
      {doubled.map((item, i) => (
        <span
          key={i}
          className="mx-8 inline-flex items-center gap-6 text-base md:text-lg uppercase tracking-[0.18em] font-medium"
        >
          <span className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors duration-300">
            {item}
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] shadow-[0_0_12px_rgba(201,169,98,.7)]" />
        </span>
      ))}
    </div>
  );
}

export function MarqueeStrip() {
  return (
    <div className="relative py-6 bg-gradient-to-r from-[var(--color-bg)] via-[var(--color-bg-secondary)] to-[var(--color-bg)] border-y border-[var(--color-border)] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/30 to-transparent" />
      <div className="marquee-fade space-y-3">
        <Row items={ROW_A} direction="left" />
        <Row items={ROW_B} direction="right" />
      </div>
    </div>
  );
}
