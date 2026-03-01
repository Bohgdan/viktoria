'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

interface UseCountUpOptions {
  start?: number;
  end: number;
  duration?: number;
  delay?: number;
  startOnView?: boolean;
  separator?: string;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

function easeOutQuart(x: number): number {
  return 1 - Math.pow(1 - x, 4);
}

export function useCountUp(options: UseCountUpOptions) {
  const {
    start = 0,
    end,
    duration = 2000,
    delay = 0,
    startOnView = true,
    separator = ' ',
    decimals = 0,
    prefix = '',
    suffix = '',
  } = options;

  const [count, setCount] = useState(start);
  const ref = useRef<HTMLElement>(null);
  const animationRef = useRef<number | null>(null);
  const hasStartedRef = useRef(false);

  const formatNumber = useCallback((num: number): string => {
    const fixed = num.toFixed(decimals);
    const parts = fixed.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return prefix + parts.join('.') + suffix;
  }, [decimals, separator, prefix, suffix]);

  const startAnimation = useCallback(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    // Check for reduced motion preference
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(end);
      return;
    }

    const startTime = performance.now() + delay;
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      
      if (elapsed < 0) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const currentCount = start + (end - start) * easedProgress;
      
      setCount(currentCount);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [start, end, duration, delay]);

  useEffect(() => {
    if (!startOnView) {
      startAnimation();
      return;
    }

    const element = ref.current;
    if (!element) {
      // Fallback: if ref not attached, just show final value after delay
      const timeout = setTimeout(() => {
        if (!hasStartedRef.current) {
          setCount(end);
          hasStartedRef.current = true;
        }
      }, 1000);
      return () => clearTimeout(timeout);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStartedRef.current) {
          startAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [startOnView, startAnimation, end]);

  return {
    ref,
    count,
    formattedCount: formatNumber(count),
    hasStarted: hasStartedRef.current,
    startAnimation,
  };
}
