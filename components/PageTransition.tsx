'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Handles scroll-to-top on route changes.
 * Only applies slide-up animation on project detail pages.
 */
export default function PageTransition({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const pathname = usePathname();
  
  // Only animate on project detail pages (e.g., /projects/crums)
  const isProjectPage = pathname.startsWith('/projects/') && pathname !== '/projects/';

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return (
    <div 
      key={pathname}
      className={isProjectPage ? 'animate-page-enter' : ''}
    >
      {children}
    </div>
  );
}
