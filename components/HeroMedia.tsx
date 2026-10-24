'use client';

import LazyVideo from '@/components/LazyVideo';
import Image from 'next/image';
import { getOptimizedPath, isImagePath } from '@/lib/getOptimizedPath';

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

  // Use optimized WebP paths for images
  const optimizedImage = image && isImagePath(image) ? getOptimizedPath(image) : image;
  const optimizedImageMobile = imageMobile && isImagePath(imageMobile) ? getOptimizedPath(imageMobile) : imageMobile;

  return (
    <div
      className={`w-full relative overflow-hidden rounded-2xl ${
        // A separate phone version can fill a tall box; otherwise keep the
        // landscape shape so nothing gets cropped. Desktop always 16:9,
        // capped at 90% of the screen height.
        hasMobileVariant ? 'h-[60vh]' : 'aspect-video'
      } md:h-auto md:aspect-video md:max-h-[90vh]`}
    >
      {/* Mobile featured media */}
      {hasMobileVariant && (
        <div className="block md:hidden w-full h-full">
          {videoMobile ? (
            <LazyVideo
              src={videoMobile}
              className="w-full h-full object-cover"
              priority
            />
          ) : optimizedImageMobile ? (
            <Image
              src={optimizedImageMobile}
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
        ) : optimizedImage ? (
          <Image
            src={optimizedImage}
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

