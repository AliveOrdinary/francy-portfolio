'use client';

import { useVideoAutoplay } from '@/lib/useVideoAutoplay';

interface LazyVideoProps {
  src: string;
  hasAudio?: boolean | undefined;
  className?: string;
  onClick?: (() => void) | undefined;
}

/**
 * Video component with lazy loading and viewport-based autoplay.
 * Only plays when visible, pauses when scrolled out of view.
 */
export default function LazyVideo({ 
  src, 
  hasAudio = false, 
  className = '', 
  onClick 
}: LazyVideoProps) {
  const videoRef = useVideoAutoplay(0.3);

  return (
    <video
      ref={videoRef}
      src={src}
      muted={!hasAudio}
      loop
      playsInline
      preload="none"
      className={className}
      onClick={onClick}
    />
  );
}
