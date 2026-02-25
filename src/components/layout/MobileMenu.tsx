'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react';
import { NAV_ITEMS, PLACEHOLDER } from '@/lib/constants';
import { cn, formatPhone, getPhoneLink, getViberLink, getTelegramLink, getWhatsAppLink } from '@/lib/utils';
import { useSettings } from '@/lib/SettingsContext';
import Image from 'next/image';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const { settings } = useSettings();

  // Use settings from DB, fallback to PLACEHOLDER
  const phone = settings.phone || PLACEHOLDER.phone;
  const email = settings.email || PLACEHOLDER.email;
  const address = settings.address || PLACEHOLDER.address;
  const viber = settings.viber || PLACEHOLDER.viber;
  const telegram = settings.telegram || PLACEHOLDER.telegram;
  const whatsapp = settings.whatsapp || settings.viber || PLACEHOLDER.whatsapp;
  const instagram = settings.instagram || PLACEHOLDER.instagram;
  const facebook = settings.facebook || PLACEHOLDER.facebook;

  return (
    <div
      className={cn(
        'fixed inset-0 z-[var(--z-fixed)] lg:hidden transition-all duration-300',
        isOpen ? 'visible' : 'invisible'
      )}
    >
      {/* Overlay */}
      <div
        className={cn(
          'absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0'
        )}
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div
        className={cn(
          'absolute top-[116px] left-0 right-0 bottom-0 bg-[var(--color-bg-primary)] overflow-y-auto transition-transform duration-300',
          isOpen ? 'translate-y-0' : '-translate-y-full'
        )}
      >
        <div className="container py-6">
          {/* Navigation */}
          <nav className="space-y-2 mb-8">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center px-4 py-3 rounded-lg text-lg font-medium transition-colors',
                    isActive
                      ? 'bg-[var(--color-accent-light)] text-[var(--color-accent)]'
                      : 'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Contact Info */}
          <div className="space-y-4 mb-8 pb-8 border-b border-[var(--color-border)]">
            <h3 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
              Контакти
            </h3>
            
            <a
              href={getPhoneLink(phone)}
              className="flex items-center gap-3 text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors"
            >
              <Phone className="w-5 h-5 text-[var(--color-accent)]" />
              <span className="font-medium">{formatPhone(phone)}</span>
            </a>

            <a
              href={`mailto:${email}`}
              className="flex items-center gap-3 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              <Mail className="w-5 h-5 text-[var(--color-accent)]" />
              <span>{email}</span>
            </a>

            <div className="flex items-start gap-3 text-[var(--color-text-secondary)]">
              <MapPin className="w-5 h-5 text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
              <span>{address}</span>
            </div>
          </div>

          {/* Messengers */}
          <div className="space-y-4 mb-8">
            <h3 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
              Месенджери
            </h3>
            
            <div className="flex gap-4">
              <a
                href={getViberLink(viber)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 rounded-full bg-[#7360f2] text-white hover:opacity-90 transition-opacity"
              >
                <Image src="/icons/viber.svg" alt="Viber" width={24} height={24} />
              </a>
              <a
                href={getTelegramLink(telegram)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 rounded-full bg-[#0088cc] text-white hover:opacity-90 transition-opacity"
              >
                <Image src="/icons/telegram.svg" alt="Telegram" width={24} height={24} />
              </a>
              <a
                href={getWhatsAppLink(whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 rounded-full bg-[#25d366] text-white hover:opacity-90 transition-opacity"
              >
                <Image src="/icons/whatsapp.svg" alt="WhatsApp" width={24} height={24} />
              </a>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
              Соцмережі
            </h3>
            
            <div className="flex gap-4">
              {instagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-bg-hover)] text-[var(--color-text-primary)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent-light)] transition-colors"
                >
                  <Instagram className="w-6 h-6" />
                </a>
              )}
              {facebook && (
                <a
                  href={facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-bg-hover)] text-[var(--color-text-primary)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent-light)] transition-colors"
                >
                  <Facebook className="w-6 h-6" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
