'use client';

import Link from 'next/link';

export default function BottomNav() {
  return (
    <nav className="sticky bottom-0 left-0 w-full z-50 bg-white py-4 px-4 md:px-8">
      <div className="flex justify-center items-center gap-12 md:gap-24">
        <Link 
          href="/projects" 
          className="text-sm md:text-base font-display font-bold tracking-widest uppercase hover:text-primary transition-colors"
        >
          WORKS
        </Link>
        <Link 
          href="/about" 
          className="text-sm md:text-base font-display font-bold tracking-widest uppercase hover:text-primary transition-colors"
        >
          ABOUT
        </Link>
      </div>
    </nav>
  );
}

