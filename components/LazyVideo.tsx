'use client';

import { useVideoAutoplay } from '@/lib/useVideoAutoplay';

interface LazyVideoProps {
  src: string;
  hasAudio?: boolean | undefined;
  className?: string;
  onClick?: (() => void) | undefined;
  priority?: boolean; // For hero videos - uses preload but still pauses when offscreen
}

/**
 * Video component with lazy loading and viewport-based autoplay.
 * Only plays when visible, pauses when scrolled out of view.
 * Use priority={true} for hero/above-fold videos.
 */
export default function LazyVideo({ 
  src, 
  hasAudio = false, 
  className = '', 
  onClick,
  priority = false 
}: LazyVideoProps) {
  const videoRef = useVideoAutoplay(0.3);

  return (
    <video
      ref={videoRef}
      src={src}
      muted={!hasAudio}
      loop
      playsInline
      preload={priority ? "metadata" : "none"}
      className={className}
      onClick={onClick}
    />
  );
}
