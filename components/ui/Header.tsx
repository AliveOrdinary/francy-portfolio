'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 py-6 px-4 md:px-8 mix-blend-difference text-white">
      <div className="flex justify-center items-center">
        <Link href="/" className="text-xl md:text-2xl font-display font-bold tracking-tight uppercase">
          FRANC/S
        </Link>
      </div>
    </header>
  );
}
