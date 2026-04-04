'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface ScrollRevealOptions {
  y?: number;
  x?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
  children?: boolean;
}

export const useScrollReveal = <T extends HTMLElement>(options: ScrollRevealOptions = {}) => {
  const ref = useRef<T>(null);
  const { y = 40, x = 0, duration = 0.8, delay = 0, stagger = 0.1, children = false } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const targets = children ? el.children : el;
    gsap.set(targets, { opacity: 0, y, x });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.to(targets, {
            opacity: 1,
            y: 0,
            x: 0,
            duration,
            delay,
            stagger: children ? stagger : 0,
            ease: 'power3.out',
          });
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [y, x, duration, delay, stagger, children]);

  return ref;
};

export const useCountUp = (end: number, duration = 2000) => {
  const ref = useRef<HTMLElement>(null);
  const counted = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = String(end);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          const start = 0;
          const startTime = performance.now();

          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + (end - start) * eased);
            el.textContent = current.toLocaleString();
            if (progress < 1) requestAnimationFrame(animate);
          };

          requestAnimationFrame(animate);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return ref;
};
