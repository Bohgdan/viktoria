'use client';

import { useEffect, useRef } from 'react';

/**
 * Floating playful illustrations that gently follow the cursor with parallax.
 * Inspired by yourmainstays.com — small decorative emojis/illustrations that
 * "play" with the user. Hidden on mobile / reduced-motion / admin pages.
 */
export function FloatingPlayables() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (document.body.classList.contains('admin-page')) return;

    const layer = layerRef.current;
    if (!layer) return;

    const items = Array.from(layer.querySelectorAll<HTMLElement>('.playable'));
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let raf = 0;

    const positions = items.map(() => ({ x: 0, y: 0 }));

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const tick = () => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (mouseX - cx) / cx;
      const dy = (mouseY - cy) / cy;

      items.forEach((el, i) => {
        const depth = parseFloat(el.dataset.depth || '20');
        const tx = -dx * depth;
        const ty = -dy * depth;
        positions[i].x += (tx - positions[i].x) * 0.08;
        positions[i].y += (ty - positions[i].y) * 0.08;
        el.style.transform = `translate3d(${positions[i].x}px, ${positions[i].y}px, 0)`;
      });
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden hidden md:block"
    >
      <span className="playable" data-depth="40" style={{ top: '12%', left: '6%' }}>🌶️</span>
      <span className="playable" data-depth="25" style={{ top: '22%', right: '8%' }}>🧄</span>
      <span className="playable" data-depth="55" style={{ top: '46%', left: '4%' }}>🍯</span>
      <span className="playable" data-depth="35" style={{ top: '60%', right: '5%' }}>🌿</span>
      <span className="playable" data-depth="60" style={{ bottom: '14%', left: '10%' }}>🥖</span>
      <span className="playable" data-depth="30" style={{ bottom: '20%', right: '12%' }}>🫙</span>
      <span className="playable" data-depth="45" style={{ top: '78%', left: '48%' }}>🌽</span>
    </div>
  );
}
