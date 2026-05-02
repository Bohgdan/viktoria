'use client';

import { Calendar, Users, Package, Truck } from 'lucide-react';
import { useCountUp } from '@/hooks';

interface StatItem {
  icon: typeof Calendar;
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  isYear?: boolean;
}

const STATS: StatItem[] = [
  { icon: Calendar, value: 2013, label: 'Рік заснування', isYear: true },
  { icon: Users, value: 1000, suffix: '+', label: 'Постійних клієнтів' },
  { icon: Package, value: 300, suffix: '+', label: 'Позицій в каталозі' },
  { icon: Truck, value: 0, label: 'Вся Україна', isYear: true },
];

function AnimatedStat({ stat, index }: { stat: StatItem; index: number }) {
  const { ref, formattedCount } = useCountUp({
    end: stat.value,
    duration: 2500,
    delay: index * 200,
    suffix: stat.suffix || '',
    prefix: stat.prefix || '',
    separator: stat.isYear ? '' : ' ',
  });

  const Icon = stat.icon;
  
  // Special case for "Вся Україна" which is text, not number
  const displayValue = stat.label === 'Вся Україна' ? 'Вся Україна' : formattedCount;
  const displayLabel = stat.label === 'Вся Україна' ? 'Географія поставок' : stat.label;

  return (
    <div
      className="group card-premium lift p-7 text-center reveal-up"
      style={{ transitionDelay: `${index * 90}ms` }}
      data-reveal
      ref={ref as React.RefObject<HTMLDivElement>}
    >
      <div className="icon-orb mx-auto mb-5">
        <Icon className="w-6 h-6" />
      </div>
      <div className="text-3xl md:text-4xl font-bold text-[var(--color-accent)] mb-2 font-[family-name:var(--font-heading)] count-up tracking-tight">
        {displayValue}
      </div>
      <div className="text-sm uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
        {displayLabel}
      </div>
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="section relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {STATS.map((stat, index) => (
            <AnimatedStat key={stat.label} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
