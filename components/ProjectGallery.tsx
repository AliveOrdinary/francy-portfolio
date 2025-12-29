'use client';

import Image from 'next/image';
import { GalleryBlock, SingleBlock, SeamlessPairBlock, SideBySideBlock } from '@/lib/types';
import { IMAGE_CONFIG } from '@/lib/constants';


interface ProjectGalleryProps {
  blocks: GalleryBlock[];
  projectTitle: string;
}

interface MediaItemProps {
  type: 'image' | 'video';
  src: string;
  alt: string;
  hasAudio?: boolean | undefined;
  className?: string;
  onClick?: () => void;
  priority?: boolean;
}

// Reusable media item component for both images and videos
function MediaItem({ type, src, alt, hasAudio = false, className = '', onClick, priority = false }: MediaItemProps) {
  if (type === 'video') {
    return (
      <video
        src={src}
        autoPlay
        muted={!hasAudio}
        loop
        playsInline
        className={`w-full h-auto rounded-2xl cursor-pointer transition-transform duration-500 ${className}`}
        onClick={onClick}
      />
    );
  }
  
  return (
    <div className={`relative cursor-zoom-in overflow-hidden rounded-2xl ${className}`} onClick={onClick}>
      <Image
        src={src}
        alt={alt}
        width={1600}
        height={900}
        sizes={IMAGE_CONFIG.SIZES.PROJECT_GALLERY}
        quality={IMAGE_CONFIG.QUALITY.THUMBNAIL_GALLERY}
        loading={priority ? 'eager' : 'lazy'}
        priority={priority}
        className="w-full h-auto object-cover block transition-transform duration-500"
      />
    </div>
  );
}

// Single full-width block
function SingleBlockComponent({ block, projectTitle, index }: { block: SingleBlock; projectTitle: string; index: number }) {
  return (
    <div className="w-full">
      <MediaItem
        type={block.mediaType}
        src={block.file}
        alt={block.caption || `${projectTitle} - ${index + 1}`}
        hasAudio={block.hasAudio}
        priority={index < 2}
      />
      {block.caption && (
        <p className="text-sm text-gray-500 mt-4 text-center font-mono">{block.caption}</p>
      )}
    </div>
  );
}

// Seamless pair - no gap, merged on desktop, equal heights
function SeamlessPairBlockComponent({ block, projectTitle, index }: { block: SeamlessPairBlock; projectTitle: string; index: number }) {
  const renderMedia = (type: 'image' | 'video', src: string, alt: string, hasAudio?: boolean, priority: boolean = false) => {
    if (type === 'video') {
      return (
        <video
          src={src}
          autoPlay
          muted={!hasAudio}
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      );
    }
    
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes="50vw"
        quality={IMAGE_CONFIG.QUALITY.THUMBNAIL_GALLERY}
        loading={priority ? 'eager' : 'lazy'}
        priority={priority}
        className="object-cover"
      />
    );
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2">
          <div className="relative aspect-square overflow-hidden rounded-2xl md:rounded-r-none">
            {renderMedia(
              block.leftType,
              block.leftFile,
              block.caption ? `${block.caption} - Left` : `${projectTitle} - ${index + 1} Left`,
              block.leftHasAudio,
              index < 2
            )}
          </div>
        </div>
        <div className="w-full md:w-1/2 mt-4 md:mt-0">
          <div className="relative aspect-square overflow-hidden rounded-2xl md:rounded-l-none">
            {renderMedia(
              block.rightType,
              block.rightFile,
              block.caption ? `${block.caption} - Right` : `${projectTitle} - ${index + 1} Right`,
              block.rightHasAudio,
              index < 2
            )}
          </div>
        </div>
      </div>
      {block.caption && (
        <p className="text-sm text-gray-500 mt-4 text-center font-mono">{block.caption}</p>
      )}
    </div>
  );
}

// Side by side - with gap, equal heights using aspect ratio
function SideBySideBlockComponent({ block, projectTitle, index }: { block: SideBySideBlock; projectTitle: string; index: number }) {
  const renderMedia = (type: 'image' | 'video', src: string, alt: string, hasAudio?: boolean, priority: boolean = false) => {
    if (type === 'video') {
      return (
        <video
          src={src}
          autoPlay
          muted={!hasAudio}
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover rounded-2xl"
        />
      );
    }
    
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes="50vw"
        quality={IMAGE_CONFIG.QUALITY.THUMBNAIL_GALLERY}
        loading={priority ? 'eager' : 'lazy'}
        priority={priority}
        className="object-cover rounded-2xl"
      />
    );
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        <div className="w-full md:w-1/2">
          <div className="relative aspect-square overflow-hidden rounded-2xl">
            {renderMedia(
              block.leftType,
              block.leftFile,
              block.caption ? `${block.caption} - Left` : `${projectTitle} - ${index + 1} Left`,
              block.leftHasAudio,
              index < 2
            )}
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <div className="relative aspect-square overflow-hidden rounded-2xl">
            {renderMedia(
              block.rightType,
              block.rightFile,
              block.caption ? `${block.caption} - Right` : `${projectTitle} - ${index + 1} Right`,
              block.rightHasAudio,
              index < 2
            )}
          </div>
        </div>
      </div>
      {block.caption && (
        <p className="text-sm text-gray-500 mt-4 text-center font-mono">{block.caption}</p>
      )}
    </div>
  );
}

export default function ProjectGallery({ blocks, projectTitle }: ProjectGalleryProps) {
  // Sort blocks by order
  const sortedBlocks = [...blocks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  if (sortedBlocks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 md:space-y-8">
      {sortedBlocks.map((block, index) => {
        switch (block.type) {
          case 'single':
            return <SingleBlockComponent key={index} block={block} projectTitle={projectTitle} index={index} />;
          case 'seamlessPair':
            return <SeamlessPairBlockComponent key={index} block={block} projectTitle={projectTitle} index={index} />;
          case 'sideBySide':
            return <SideBySideBlockComponent key={index} block={block} projectTitle={projectTitle} index={index} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
