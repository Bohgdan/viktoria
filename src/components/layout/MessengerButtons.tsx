'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X, ChevronUp } from 'lucide-react';
import { PLACEHOLDER } from '@/lib/constants';
import { getViberLink, getTelegramLink, getWhatsAppLink, cn } from '@/lib/utils';
import { useSettings } from '@/lib/SettingsContext';
import Image from 'next/image';

export function MessengerButtons() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { settings } = useSettings();

  // Use settings from DB, fallback to PLACEHOLDER
  const viber = settings.viber || PLACEHOLDER.viber;
  const telegram = settings.telegram || PLACEHOLDER.telegram;
  const whatsapp = settings.whatsapp || settings.viber || PLACEHOLDER.whatsapp;

  // Show scroll-to-top button after scrolling
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const messengers = [
    {
      name: 'Viber',
      href: getViberLink(viber),
      color: '#7360f2',
      icon: '/icons/viber.svg',
    },
    {
      name: 'Telegram',
      href: getTelegramLink(telegram),
      color: '#0088cc',
      icon: '/icons/telegram.svg',
    },
    {
      name: 'WhatsApp',
      href: getWhatsAppLink(whatsapp),
      color: '#25d366',
      icon: '/icons/whatsapp.svg',
    },
  ];

  return (
    <div className="messenger-buttons fixed bottom-6 right-6 z-[var(--z-fixed)] flex flex-col items-end gap-3">
      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className={cn(
          'w-12 h-12 rounded-full bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-secondary)] shadow-lg flex items-center justify-center hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-all duration-300',
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        )}
        aria-label="На початок сторінки"
      >
        <ChevronUp className="w-5 h-5" />
      </button>

      {/* Messenger buttons */}
      <div className="flex flex-col items-end gap-2">
        {/* Individual messenger buttons - shown when expanded */}
        {messengers.map((messenger, index) => (
          <a
            key={messenger.name}
            href={messenger.href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all duration-300 text-white font-medium',
              isExpanded
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-4 pointer-events-none'
            )}
            style={{
              backgroundColor: messenger.color,
              transitionDelay: isExpanded ? `${index * 50}ms` : '0ms',
            }}
          >
            <Image src={messenger.icon} alt="" width={24} height={24} />
            <span className="hidden sm:inline">{messenger.name}</span>
          </a>
        ))}

        {/* Main toggle button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            'w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300',
            isExpanded
              ? 'bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-primary)]'
              : 'bg-[var(--color-accent)] text-[var(--color-accent-dark)]'
          )}
          aria-label={isExpanded ? 'Закрити месенджери' : 'Відкрити месенджери'}
        >
          {isExpanded ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
        </button>
      </div>
    </div>
  );
}
