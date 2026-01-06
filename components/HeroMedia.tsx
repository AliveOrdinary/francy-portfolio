'use client';

import LazyVideo from '@/components/LazyVideo';
import Image from 'next/image';

interface HeroMediaProps {
  video?: string | undefined;
  videoMobile?: string | undefined;
  image?: string | undefined;
  imageMobile?: string | undefined;
  title: string;
}

/**
 * Hero media component with optimized video loading.
 * Uses LazyVideo instead of raw <video> to enable viewport-based play/pause.
 * Reduces memory usage on mobile by only playing visible videos.
 */
export default function HeroMedia({ 
  video, 
  videoMobile, 
  image, 
  imageMobile,
  title 
}: HeroMediaProps) {
  const hasMobileVariant = videoMobile || imageMobile;

  return (
    <div className="w-full h-[60vh] md:h-[90vh] relative overflow-hidden rounded-2xl">
      {/* Mobile featured media */}
      {hasMobileVariant && (
        <div className="block md:hidden w-full h-full">
          {videoMobile ? (
            <LazyVideo
              src={videoMobile}
              className="w-full h-full object-cover"
              priority
            />
          ) : imageMobile ? (
            <Image
              src={imageMobile}
              alt={title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          ) : null}
        </div>
      )}
      
      {/* Desktop featured media (hidden on mobile if mobile variant exists) */}
      <div className={`${hasMobileVariant ? 'hidden md:block' : 'block'} w-full h-full`}>
        {video ? (
          <LazyVideo
            src={video}
            className="w-full h-full object-cover"
            priority
          />
        ) : image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : null}
      </div>
    </div>
  );
}
