import Link from 'next/link';
import { Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react';
import { PLACEHOLDER } from '@/lib/constants';
import { formatPhone, getPhoneLink } from '@/lib/utils';

const catalogLinks = [
  { label: 'Спеції та приправи', href: '/catalog/spetsii-ta-prypravy' },
  { label: 'Макаронні вироби', href: '/catalog/makaronni-vyroby' },
  { label: 'Консервація', href: '/catalog/konservatsiia' },
  { label: 'Олія та жири', href: '/catalog/oliia-ta-zhyry' },
  { label: 'Бакалія', href: '/catalog/bakaliia' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-bg-primary)] border-t border-[var(--color-border)] relative z-10">
      {/* Main Footer */}
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16">
          {/* Company Info */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <span className="text-2xl font-bold font-[family-name:var(--font-heading)] text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                Perfect
                <span className="text-[var(--color-accent)]"> 4 </span>
                You
              </span>
            </Link>
            <p className="text-[var(--color-text-muted)] mb-6 text-sm leading-relaxed">
              Надійний партнер у сфері гуртової торгівлі з 2013 року. Закарпатські спеції, угорські макарони, якісна консервація. Понад 1000 постійних клієнтів.
            </p>
            
            {/* Social Media */}
            <div className="flex gap-3">
              <a
                href={PLACEHOLDER.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-bg-card)] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] hover:bg-[var(--color-bg-hover)] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={PLACEHOLDER.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-bg-card)] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] hover:bg-[var(--color-bg-hover)] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Catalog Links */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
              Каталог
            </h3>
            <nav className="space-y-3">
              {catalogLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors text-sm"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
              Контакти
            </h3>
            <div className="space-y-4">
              <a
                href={getPhoneLink(PLACEHOLDER.phone)}
                className="flex items-center gap-3 text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
              >
                <Phone className="w-5 h-5 flex-shrink-0 text-[var(--color-accent)]" />
                <span>{formatPhone(PLACEHOLDER.phone)}</span>
              </a>
              <a
                href={`mailto:${PLACEHOLDER.email}`}
                className="flex items-center gap-3 text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
              >
                <Mail className="w-5 h-5 flex-shrink-0 text-[var(--color-accent)]" />
                <span>{PLACEHOLDER.email}</span>
              </a>
              <div className="flex items-start gap-3 text-[var(--color-text-muted)]">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5 text-[var(--color-accent)]" />
                <span>{PLACEHOLDER.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[var(--color-border)]">
        <div className="container py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[var(--color-text-muted)]">
            <p>
              © 2013-{currentYear} {PLACEHOLDER.companyName} — Оптовий постачальник продуктів харчування
            </p>
            <p className="flex items-center gap-1">
              Розробка сайту
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
