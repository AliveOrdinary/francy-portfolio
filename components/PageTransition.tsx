'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Handles scroll-to-top on route changes.
 * Page motion is handled per element (see components/motion).
 */
export default function PageTransition({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const pathname = usePathname();
  

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return (
    <div key={pathname}>
      {children}
    </div>
  );
}
