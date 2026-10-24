'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

/**
 * The work now lives on the homepage. Old links to /projects
 * (saved, or on LinkedIn and Behance) land on the homepage's work section.
 */
export default function Projects() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/#work');
  }, [router]);

  return (
    <p className="label pt-10">
      <Link href="/#work" className="underline underline-offset-[3px]">Go to work</Link>
    </p>
  );
}
