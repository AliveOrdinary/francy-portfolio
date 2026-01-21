'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LazyVideo from '@/components/LazyVideo';

interface ProjectCardProps {
  title: string;
  slug: string;
  category?: string | undefined;
  image?: string | undefined;
  video?: string | undefined;
  color?: string; // Optional background color for the card
  priority?: boolean;
}

export default function ProjectCard({
  title,
  slug,
  image,
  video,
  color, // Keep for future use but default to neutral skeleton
  priority = false,
}: ProjectCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <Link href={`/projects/${slug}`} className="block group w-full">
      <div 
        className="relative w-full overflow-hidden rounded-2xl transition-transform duration-500"
        style={{ backgroundColor: isLoaded ? 'transparent' : '#f5f5f5' }}
      >
        {/* Skeleton loader - shows while media is loading */}
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 overflow-hidden bg-neutral-100" aria-label="Loading...">
            {/* Shimmer animation overlay */}
            <div 
              className="absolute inset-0 -translate-x-full animate-shimmer"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
              }}
            />
            {/* TODO: Add Lottie logo animation here when available */}
          </div>
        )}

        {/* Media */}
        <div className={`w-full transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          {video ? (
            <LazyVideo
              src={video}
              className="w-full h-auto object-cover block"
              onLoadedData={() => setIsLoaded(true)}
            />
          ) : image ? (
            <Image
              src={image}
              alt={title}
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-auto object-cover block"
              priority={priority}
              onLoad={() => setIsLoaded(true)}
              onError={() => {
                setHasError(true);
                setIsLoaded(true);
              }}
            />
          ) : (
            // Fallback when no media - use brand color
            <div 
              className="w-full aspect-video flex items-center justify-center"
              style={{ backgroundColor: color || '#B065FF' }}
            >
              <span className="text-white font-display text-2xl">{title}</span>
            </div>
          )}
        </div>

        {/* Error fallback */}
        {hasError && (
          <div 
            className="w-full aspect-video flex items-center justify-center bg-neutral-200"
          >
            <span className="text-neutral-500 font-display text-xl">{title}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
