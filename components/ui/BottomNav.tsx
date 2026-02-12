'use client';

import Link from 'next/link';

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-white py-4 px-4 md:px-8">
      {/* Left faux corner - positioned at content edge (matching main px-4) */}
      <svg 
        className="absolute -top-4 left-4 md:left-6 w-4 h-4"
        viewBox="0 0 16 16"
        fill="white"
      >
        <path d="M16 16 L0 16 L0 0 Q0 16 16 16 Z" />
      </svg>
      
      {/* Right faux corner - positioned at content edge */}
      <svg 
        className="absolute -top-4 right-4 md:right-6 w-4 h-4"
        viewBox="0 0 16 16"
        fill="white"
      >
        <path d="M0 16 L16 16 L16 0 Q16 16 0 16 Z" />
      </svg>
      
      <div className="flex justify-center items-center gap-12 md:gap-24">
        <Link 
          href="/projects" 
          className="text-sm md:text-base font-display font-medium tracking-widest uppercase hover:text-primary transition-colors"
        >
          WORKS
        </Link>
        <Link 
          href="/about" 
          className="text-sm md:text-base font-display font-medium tracking-widest uppercase hover:text-primary transition-colors"
        >
          ABOUT
        </Link>
      </div>
    </nav>
  );
}

