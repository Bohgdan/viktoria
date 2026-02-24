'use client';

const MARQUEE_ITEMS = [
  'Паприка закарпатська',
  'Перець чорний преміум',
  'Угорські макарони',
  'Консервація Perfect',
  'Олія соняшникова',
  'Овочеве асорті',
  'Універсальна приправа',
  'Спеції для бограчу',
  'Галушки',
  'Вермішель',
  'Часник мелений',
  'Лимонна кислота',
  'Сода харчова',
];

export function MarqueeStrip() {
  // Duplicate content for seamless loop
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="py-6 bg-[var(--color-bg-secondary)] border-y border-[var(--color-border)] overflow-hidden">
      <div className="animate-marquee flex whitespace-nowrap">
        {items.map((item, index) => (
          <span
            key={index}
            className="mx-6 text-lg md:text-xl text-[var(--color-text-muted)] font-medium tracking-wide uppercase"
          >
            {item}
            <span className="mx-6 text-[var(--color-accent)]">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
