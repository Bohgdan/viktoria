'use client';

import { useEffect, useRef } from 'react';

/**
 * Playful pink cursor: arrow by default, pointing hand on hover over interactive elements.
 * Uses two SVGs from /public/icons/. Hides on touch devices.
 */
export function CustomCursor() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    if (isCoarse) return;

    const wrap = wrapRef.current;
    if (!wrap) return;

    document.documentElement.classList.add('has-custom-cursor');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let visible = false;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!visible) {
        visible = true;
        wrap.style.opacity = '1';
      }
      wrap.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    };

    const onLeave = () => { visible = false; wrap.style.opacity = '0'; };
    const onEnter = () => { visible = true; wrap.style.opacity = '1'; };
    const onDown = () => wrap.classList.add('is-down');
    const onUp = () => wrap.classList.remove('is-down');

    const hoverSelector =
      'a, button, [role="button"], input, textarea, select, label, [data-cursor="hover"]';

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && t.closest(hoverSelector)) wrap.classList.add('is-hover');
    };
    const onOut = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && t.closest(hoverSelector)) wrap.classList.remove('is-hover');
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('mouseenter', onEnter);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('mouseenter', onEnter);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, []);

  return (
    <div ref={wrapRef} className="cursor-wrap" aria-hidden="true">
      <span className="cursor-img cursor-arrow" />
      <span className="cursor-img cursor-hand" />
    </div>
  );
}
