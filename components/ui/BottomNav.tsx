'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/#work', label: 'Work', match: (p: string) => p === '/' || p.startsWith('/projects') },
  { href: '/about', label: 'About', match: (p: string) => p.startsWith('/about') },
  { href: '/contact', label: 'Contact', match: (p: string) => p.startsWith('/contact') },
];

/**
 * Floating pill navigation. Light and frosted so it sits quietly over the work;
 * slides away while scrolling down and comes back on scroll up.
 */
export default function BottomNav() {
  const pathname = usePathname() || '/';
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > lastY.current && y > 80);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      aria-label="Main"
      className={`fixed left-1/2 z-50 bottom-[calc(1rem+env(safe-area-inset-bottom))] md:bottom-6 flex gap-0.5 p-1 rounded-full
        bg-white/70 backdrop-blur-xl backdrop-saturate-150 border border-black/10 shadow-[0_4px_16px_rgba(25,16,33,0.06)]
        transition-all duration-300 ease-out
        ${hidden ? 'opacity-0 -translate-x-1/2 translate-y-[140%] pointer-events-none' : 'opacity-100 -translate-x-1/2 translate-y-0'}`}
    >
      {LINKS.map((link) => {
        const active = link.match(pathname);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? 'page' : undefined}
            className={`label px-3.5 md:px-4 py-2 rounded-full text-foreground transition-colors ${
              active ? 'bg-black/[0.07]' : 'hover:bg-black/[0.04]'
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
