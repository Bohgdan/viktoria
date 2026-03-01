'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Mail, Clock, Menu, X } from 'lucide-react';
import { NAV_ITEMS, PLACEHOLDER } from '@/lib/constants';
import { cn, formatPhone, getPhoneLink } from '@/lib/utils';
import { MobileMenu } from './MobileMenu';
import { useSettings } from '@/lib/SettingsContext';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { settings } = useSettings();

  // Use settings from DB, fallback to PLACEHOLDER
  const phone = settings.phone || PLACEHOLDER.phone;
  const email = settings.email || PLACEHOLDER.email;
  const workingHours = settings.working_hours || PLACEHOLDER.workingHours;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[100]">
        {/* Topbar */}
        <div className="bg-[#080a10] border-b border-[var(--color-border-light)]">
          <div className="container">
            <div className="h-9 flex items-center justify-between text-xs">
              <div className="hidden md:flex items-center gap-6">
                <span className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
                  <Clock className="w-3.5 h-3.5" />
                  {workingHours}
                </span>
                <a 
                  href={`mailto:${email}`}
                  className="flex items-center gap-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  {email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className={cn(
          "backdrop-blur-xl border-b border-[var(--color-border)] transition-all duration-300",
          isScrolled ? "bg-[#0b0d12]/95" : "bg-[#0b0d12]/85"
        )}>
          <div className="container">
            <div className="h-[72px] flex items-center justify-between gap-4">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
                <img
                  src="/images/logo.png"
                  alt={PLACEHOLDER.companyName}
                  className="h-10 md:h-12 w-auto object-contain"
                />
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-1">
                {NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'px-4 py-2 text-sm font-medium transition-colors rounded-full',
                        isActive
                          ? 'text-[var(--color-accent)] bg-[var(--color-accent-light)]'
                          : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]'
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Right Side: Phone + CTA */}
              <div className="hidden lg:flex items-center gap-4">
                <a
                  href={getPhoneLink(phone)}
                  className="flex items-center gap-2 text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-[var(--color-accent-light)] flex items-center justify-center">
                    <Phone className="w-5 h-5 text-[var(--color-accent)]" />
                  </div>
                  <span className="font-semibold">{formatPhone(phone)}</span>
                </a>
                <Link
                  href="/catalog"
                  className="px-6 py-2.5 bg-[var(--color-accent)] text-[var(--color-accent-dark)] rounded-full font-semibold hover:bg-[var(--color-accent-hover)] transition-colors"
                >
                  Каталог
                </Link>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-full text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors"
                aria-label={isMobileMenuOpen ? 'Закрити меню' : 'Відкрити меню'}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Header spacer: topbar (36px) + header (72px) = 108px */}
      <div className="h-[108px]" />
    </>
  );
}
