'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Cat buddy — a cute cat sitting at the bottom-right corner whose eyes follow
 * the cursor. Click for a playful pounce. Hidden on touch and admin pages.
 */
export function FloatingPlayables() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const leftPupilRef = useRef<SVGEllipseElement>(null);
  const rightPupilRef = useRef<SVGEllipseElement>(null);
  const [hidden, setHidden] = useState(false);
  const [pouncing, setPouncing] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) { setHidden(true); return; }
    if (document.body.classList.contains('admin-page')) { setHidden(true); return; }

    const onMove = (e: MouseEvent) => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const tx = (dx / dist) * Math.min(2.2, dist / 80);
      const ty = (dy / dist) * Math.min(2.2, dist / 80);
      if (leftPupilRef.current) leftPupilRef.current.setAttribute('transform', `translate(${tx} ${ty})`);
      if (rightPupilRef.current) rightPupilRef.current.setAttribute('transform', `translate(${tx} ${ty})`);
    };

    const onAdminChange = () => setHidden(document.body.classList.contains('admin-page'));
    const observer = new MutationObserver(onAdminChange);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      observer.disconnect();
    };
  }, []);

  if (hidden) return null;

  const handlePounce = () => {
    setPouncing(true);
    setTimeout(() => setPouncing(false), 700);
  };

  return (
    <div
      ref={wrapRef}
      className={`cat-buddy ${pouncing ? 'is-pouncing' : ''}`}
      onClick={handlePounce}
      role="button"
      aria-label="Cat buddy"
      title="Привіт! Натисни 😺"
    >
      <svg viewBox="0 0 64 56" xmlns="http://www.w3.org/2000/svg" className="cat-svg">
        <defs>
          <linearGradient id="cb-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a2a20" />
            <stop offset="100%" stopColor="#1a1410" />
          </linearGradient>
          <linearGradient id="cb-belly" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d4b890" />
            <stop offset="100%" stopColor="#a88862" />
          </linearGradient>
        </defs>
        <path className="cat-tail" d="M52 30 q10 -2 10 -10 q0 -3 -3 -3" fill="none" stroke="url(#cb-body)" strokeWidth="6" strokeLinecap="round" />
        <ellipse cx="30" cy="38" rx="22" ry="14" fill="url(#cb-body)" />
        <ellipse cx="30" cy="44" rx="14" ry="8" fill="url(#cb-belly)" opacity="0.7" />
        <circle cx="14" cy="26" r="13" fill="url(#cb-body)" />
        <path d="M5 18 L4 8 L13 16 Z" fill="url(#cb-body)" />
        <path d="M23 18 L24 8 L15 16 Z" fill="url(#cb-body)" />
        <path d="M7 16 L7 11 L11 15 Z" fill="#c9a962" opacity="0.7" />
        <path d="M21 16 L21 11 L17 15 Z" fill="#c9a962" opacity="0.7" />
        <ellipse cx="10" cy="26" rx="2.2" ry="2.8" fill="#f5f0e8" />
        <ellipse cx="18" cy="26" rx="2.2" ry="2.8" fill="#f5f0e8" />
        <ellipse ref={leftPupilRef} cx="10" cy="26" rx="1.1" ry="1.8" fill="#0c0c0c" />
        <ellipse ref={rightPupilRef} cx="18" cy="26" rx="1.1" ry="1.8" fill="#0c0c0c" />
        <path d="M13 30 q1 1 2 0" fill="none" stroke="#c9a962" strokeWidth="1.2" strokeLinecap="round" />
        <g stroke="#f5f0e8" strokeWidth="0.6" strokeLinecap="round" opacity="0.7" fill="none">
          <path d="M3 28 L9 30" />
          <path d="M3 31 L9 31.5" />
          <path d="M19 30 L25 28" />
          <path d="M19 31.5 L25 31" />
        </g>
        <ellipse cx="20" cy="50" rx="3.5" ry="2.5" fill="#1a1410" />
        <ellipse cx="32" cy="51" rx="3.5" ry="2.5" fill="#1a1410" />
        <ellipse cx="44" cy="50" rx="3.5" ry="2.5" fill="#1a1410" />
      </svg>
      <span className="cat-bubble">мяу!</span>
    </div>
  );
}
