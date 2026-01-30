'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 left-0 w-full z-50 py-4 px-4 md:px-8">
      <div className="flex justify-center items-center">
        <Link href="/" className="text-xl md:text-2xl font-display font-bold tracking-tight uppercase">
          <Image src="/images/Type.png" alt="Logo" width={120} height={60} />
        </Link>
      </div>
    </header>
  );
}
