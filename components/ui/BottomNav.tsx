'use client';

import Link from 'next/link';

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-background/90 backdrop-blur-sm py-4 px-4 md:px-8">
      <div className="flex justify-center items-center gap-12 md:gap-24">
        <Link 
          href="/#works" 
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

