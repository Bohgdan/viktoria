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
      className="bg-[var(--color-bg-card)]/60 backdrop-blur-sm border border-[var(--color-border)] rounded-xl p-6 text-center hover:border-[var(--color-accent)]/50 transition-all duration-300 group"
    >
      <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center group-hover:bg-[var(--color-accent)]/20 transition-colors">
        <Icon className="w-7 h-7 text-[var(--color-accent)]" />
      </div>
      <div 
        ref={ref as React.RefObject<HTMLDivElement>}
        className="text-3xl md:text-4xl font-bold text-[var(--color-accent)] mb-2 font-[family-name:var(--font-heading)] count-up"
      >
        {displayValue}
      </div>
      <div className="text-sm text-[var(--color-text-muted)]">
        {displayLabel}
      </div>
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="section">
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
