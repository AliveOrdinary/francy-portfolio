import Image from 'next/image';
import Link from 'next/link';
import type { HeaderLink } from '@/lib/types';

interface HeaderProps {
  location?: string | undefined;
  links?: HeaderLink[] | undefined;
}

export default function Header({ location, links = [] }: HeaderProps) {
  return (
    <header className="sticky top-0 left-0 w-full z-50 px-4 md:px-6 bg-background">
      <div className="grid grid-cols-2 md:grid-cols-3 items-center h-[68px]">
        <Link href="/" aria-label="Francis Xavier, home" className="justify-self-start">
          <Image src="/images/optimized/Type.webp" alt="Francis" width={110} height={62} priority />
        </Link>
        <p className="label hidden md:block justify-self-center text-gray-500">{location}</p>
        <nav aria-label="Social links" className="label justify-self-end flex gap-4 md:gap-7">
          {links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-60 transition-opacity"
            >
              <span className="hidden md:inline">{link.text}</span>
              <span className="md:hidden" aria-hidden={!link.short}>{link.short || link.text}</span>
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
