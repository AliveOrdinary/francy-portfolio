'use client';

import { useEffect, useRef, RefObject } from 'react';

/**
 * Hook to control video autoplay based on viewport visibility.
 * Videos only play when visible, reducing memory/bandwidth on mobile.
 */
export function useVideoAutoplay(threshold: number = 0.5): RefObject<HTMLVideoElement | null> {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {
              // Autoplay may be blocked by browser, that's fine
            });
          } else {
            video.pause();
          }
        });
      },
      { threshold }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return videoRef;
}
