'use client';

import { useEffect, useRef, RefObject } from 'react';

/**
 * Hook to control video autoplay based on viewport visibility.
 * Videos only play when visible, reducing memory/bandwidth on mobile.
 * Uses debouncing to prevent rapid play/pause during fast scrolling.
 */
export function useVideoAutoplay(threshold: number = 0.5): RefObject<HTMLVideoElement | null> {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Clear any pending timeout
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          
          // Debounce video play/pause to reduce rapid state changes during fast scroll
          timeoutRef.current = setTimeout(() => {
            if (entry.isIntersecting) {
              video.play().catch(() => {
                // Autoplay may be blocked by browser, that's fine
              });
            } else {
              video.pause();
            }
          }, 150);
        });
      },
      { threshold }
    );

    observer.observe(video);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      observer.disconnect();
    };
  }, [threshold]);

  return videoRef;
}
