'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Reveals elements marked with `data-reveal` as they scroll into view by
 * setting `data-in`. The styles live in globals.css and only apply when the
 * <html> element has the `motion` class (added in layout.tsx unless the
 * visitor prefers reduced motion), so without JavaScript nothing is hidden.
 */
export default function ScrollMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains('motion')) return;

    // After the first page view, don't replay the homepage name intro
    const markSeen = window.setTimeout(() => {
      root.classList.add('intro-seen');
      try {
        sessionStorage.setItem('intro-seen', '1');
      } catch {}
    }, 1500);

    const pending = () => Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-in])'));

    if (!('IntersectionObserver' in window)) {
      pending().forEach((el) => el.setAttribute('data-in', ''));
      return () => window.clearTimeout(markSeen);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-in', '');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );

    // Wait a frame so the new page's elements are in the DOM
    const frame = requestAnimationFrame(() => pending().forEach((el) => observer.observe(el)));

    return () => {
      window.clearTimeout(markSeen);
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
