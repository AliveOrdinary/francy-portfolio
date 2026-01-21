'use client';

import { useEffect, useState } from 'react';

interface SkeletonLoaderProps {
  className?: string;
  showLogo?: boolean;
}

/**
 * Skeleton loader with shimmer animation.
 * Designed to be easily replaceable with a Lottie animation later.
 */
export default function SkeletonLoader({ 
  className = '',
  showLogo = true 
}: SkeletonLoaderProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div 
      className={`relative overflow-hidden bg-neutral-100 ${className}`}
      aria-label="Loading..."
      role="status"
    >
      {/* Shimmer animation overlay */}
      <div 
        className="absolute inset-0 -translate-x-full animate-shimmer"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
        }}
      />
      
      {/* Optional centered logo placeholder - swap this for Lottie later */}
      {showLogo && mounted && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-neutral-200 animate-pulse" />
        </div>
      )}
    </div>
  );
}
