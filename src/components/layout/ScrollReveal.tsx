'use client';

import { useEffect } from 'react';

/**
 * Global scroll reveal observer.
 * Adds `is-visible` to any element with `data-reveal` (or .reveal-up/.reveal-blur/.reveal-scale)
 * when it enters the viewport. Pairs with CSS in globals.css.
 */
export function ScrollReveal() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const selector = '[data-reveal], .reveal-up, .reveal-blur, .reveal-scale';
    const targets = Array.from(document.querySelectorAll<HTMLElement>(selector));

    if (prefersReducedMotion) {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    targets.forEach((el) => io.observe(el));

    // Re-scan on DOM mutation (route changes within app)
    const mo = new MutationObserver(() => {
      document
        .querySelectorAll<HTMLElement>(selector)
        .forEach((el) => {
          if (!el.classList.contains('is-visible')) io.observe(el);
        });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
