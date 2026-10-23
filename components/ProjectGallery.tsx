'use client';

import { useState } from 'react';
import Image from 'next/image';
import LazyVideo from '@/components/LazyVideo';
import HighResImageViewer from '@/components/HighResImageViewer';
import { GalleryBlock, SingleBlock, SeamlessPairBlock, SideBySideBlock, TextBlock, ViewerMediaItem } from '@/lib/types';
import { IMAGE_CONFIG } from '@/lib/constants';
import { getOptimizedPath, isImagePath } from '@/lib/getOptimizedPath';


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
      <LazyVideo
        src={src}
        hasAudio={hasAudio}
        className={`w-full h-auto rounded-2xl cursor-pointer ${className}`}
        onClick={onClick}
      />
    );
  }
  
  // Use optimized path for images in gallery (faster loading)
  const optimizedSrc = isImagePath(src) ? getOptimizedPath(src) : src;
  
  return (
    <div className={`relative cursor-zoom-in overflow-hidden rounded-2xl ${className}`} onClick={onClick}>
      <Image
        src={optimizedSrc}
        alt={alt}
        width={1600}
        height={900}
        sizes={IMAGE_CONFIG.SIZES.PROJECT_GALLERY}
        quality={IMAGE_CONFIG.QUALITY.THUMBNAIL_GALLERY}
        loading={priority ? 'eager' : 'lazy'}
        priority={priority}
        className="w-full h-auto object-cover block"
      />
    </div>
  );
}

// Tall image (such as a full web page) shown in a browser-style window that scrolls
function ScrollFrame({ src, alt, onOpen }: { src: string; alt: string; onOpen: () => void }) {
  // Use the original file: the build's WebP step caps images at 2400px tall, which would blur a full-page design
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100">
      <div className="flex items-center justify-between h-10 px-4 border-b border-neutral-200">
        <div className="flex gap-2" aria-hidden="true">
          <span className="w-3 h-3 rounded-full bg-neutral-300" />
          <span className="w-3 h-3 rounded-full bg-neutral-300" />
          <span className="w-3 h-3 rounded-full bg-neutral-300" />
        </div>
        <button
          type="button"
          onClick={onOpen}
          className="text-xs font-mono text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          View full size
        </button>
      </div>
      <div className="h-[70vh] md:h-[80vh] overflow-y-auto overscroll-contain bg-white" tabIndex={0} aria-label={`${alt} (scrollable)`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} loading="lazy" className="block w-full h-auto" />
      </div>
    </div>
  );
}

// Single full-width block
function SingleBlockComponent({ 
  block, 
  projectTitle, 
  index,
  onMediaClick 
}: { 
  block: SingleBlock; 
  projectTitle: string; 
  index: number;
  onMediaClick: (mediaIndex: number) => void;
}) {
  return (
    <div className="w-full">
      {block.frame && block.mediaType === 'image' ? (
        <ScrollFrame
          src={block.file}
          alt={block.alt || block.caption || `${projectTitle} - ${index + 1}`}
          onOpen={() => onMediaClick(index)}
        />
      ) : (
      <MediaItem
        type={block.mediaType}
        src={block.file}
        alt={block.alt || block.caption || `${projectTitle} - ${index + 1}`}
        hasAudio={block.hasAudio}
        priority={index < 2}
        onClick={() => onMediaClick(index)}
      />
      )}
      {block.caption && (
        <p className="caption label text-gray-500 mt-3.5">{block.caption}</p>
      )}
    </div>
  );
}

// Seamless pair - no gap, merged on desktop, equal heights
function SeamlessPairBlockComponent({ 
  block, 
  projectTitle, 
  index,
  onMediaClick,
  mediaStartIndex 
}: { 
  block: SeamlessPairBlock; 
  projectTitle: string; 
  index: number;
  onMediaClick: (mediaIndex: number) => void;
  mediaStartIndex: number;
}) {
  const renderMedia = (
    type: 'image' | 'video', 
    src: string, 
    alt: string, 
    hasAudio?: boolean, 
    priority: boolean = false,
    mediaIndex: number = 0
  ) => {
    if (type === 'video') {
      return (
        <div className="absolute inset-0 cursor-pointer" onClick={() => onMediaClick(mediaIndex)}>
          <LazyVideo
            src={src}
            hasAudio={hasAudio}
            className="w-full h-full object-cover"
          />
        </div>
      );
    }
    
    // Use optimized path for images in gallery
    const optimizedSrc = isImagePath(src) ? getOptimizedPath(src) : src;
    
    return (
      <div className="absolute inset-0 cursor-zoom-in" onClick={() => onMediaClick(mediaIndex)}>
        <Image
          src={optimizedSrc}
          alt={alt}
          fill
          sizes="50vw"
          quality={IMAGE_CONFIG.QUALITY.THUMBNAIL_GALLERY}
          loading={priority ? 'eager' : 'lazy'}
          priority={priority}
          className="object-cover"
        />
      </div>
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
              block.leftAlt || (block.caption ? `${block.caption} - Left` : `${projectTitle} - ${index + 1} Left`),
              block.leftHasAudio,
              index < 2,
              mediaStartIndex
            )}
          </div>
        </div>
        <div className="w-full md:w-1/2 mt-4 md:mt-0">
          <div className="relative aspect-square overflow-hidden rounded-2xl md:rounded-l-none">
            {renderMedia(
              block.rightType,
              block.rightFile,
              block.rightAlt || (block.caption ? `${block.caption} - Right` : `${projectTitle} - ${index + 1} Right`),
              block.rightHasAudio,
              index < 2,
              mediaStartIndex + 1
            )}
          </div>
        </div>
      </div>
      {block.caption && (
        <p className="caption label text-gray-500 mt-3.5">{block.caption}</p>
      )}
    </div>
  );
}

// Side by side - with gap, equal heights using aspect ratio
function SideBySideBlockComponent({ 
  block, 
  projectTitle, 
  index,
  onMediaClick,
  mediaStartIndex 
}: { 
  block: SideBySideBlock; 
  projectTitle: string; 
  index: number;
  onMediaClick: (mediaIndex: number) => void;
  mediaStartIndex: number;
}) {
  const renderMedia = (
    type: 'image' | 'video', 
    src: string, 
    alt: string, 
    hasAudio?: boolean, 
    priority: boolean = false,
    mediaIndex: number = 0
  ) => {
    if (type === 'video') {
      return (
        <div className="absolute inset-0 cursor-pointer" onClick={() => onMediaClick(mediaIndex)}>
          <LazyVideo
            src={src}
            hasAudio={hasAudio}
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
      );
    }
    
    // Use optimized path for images in gallery
    const optimizedSrc = isImagePath(src) ? getOptimizedPath(src) : src;
    
    return (
      <div className="absolute inset-0 cursor-zoom-in" onClick={() => onMediaClick(mediaIndex)}>
        <Image
          src={optimizedSrc}
          alt={alt}
          fill
          sizes="50vw"
          quality={IMAGE_CONFIG.QUALITY.THUMBNAIL_GALLERY}
          loading={priority ? 'eager' : 'lazy'}
          priority={priority}
          className="object-cover rounded-2xl"
        />
      </div>
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
              block.leftAlt || (block.caption ? `${block.caption} - Left` : `${projectTitle} - ${index + 1} Left`),
              block.leftHasAudio,
              index < 2,
              mediaStartIndex
            )}
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <div className="relative aspect-square overflow-hidden rounded-2xl">
            {renderMedia(
              block.rightType,
              block.rightFile,
              block.rightAlt || (block.caption ? `${block.caption} - Right` : `${projectTitle} - ${index + 1} Right`),
              block.rightHasAudio,
              index < 2,
              mediaStartIndex + 1
            )}
          </div>
        </div>
      </div>
      {block.caption && (
        <p className="caption label text-gray-500 mt-3.5">{block.caption}</p>
      )}
    </div>
  );
}

// Text section: a small label over a thin rule, then heading and text in the middle column
function TextBlockComponent({ block }: { block: TextBlock }) {
  return (
    <section className="pt-16 md:pt-28 pb-2 md:pb-4">
      <div className="label flex justify-between border-t border-gray-200 pt-3.5 mb-5 md:mb-6">
        <span>{block.label}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] md:gap-8">
        <span className="hidden md:block" aria-hidden="true" />
        <div className="max-w-[640px]">
          {block.heading && (
            <h2 className="text-2xl md:text-[28px] font-normal leading-tight tracking-[-0.01em] mb-3">{block.heading}</h2>
          )}
          {block.bodyHtml && (
            <div
              className="project-summary text-base md:text-lg leading-relaxed text-gray-600"
              dangerouslySetInnerHTML={{ __html: block.bodyHtml }}
            />
          )}
        </div>
      </div>
    </section>
  );
}

// Helper to extract all media items from blocks for the viewer
function extractAllMedia(blocks: GalleryBlock[]): ViewerMediaItem[] {
  const media: ViewerMediaItem[] = [];
  
  for (const block of blocks) {
    switch (block.type) {
      case 'single':
        media.push({
          type: block.mediaType,
          src: block.file, // Use original path for high-res viewer
          alt: block.alt || block.caption,
          hasAudio: block.hasAudio || false
        });
        break;
      case 'seamlessPair':
        media.push({
          type: block.leftType,
          src: block.leftFile,
          alt: block.leftAlt || block.caption,
          hasAudio: block.leftHasAudio || false
        });
        media.push({
          type: block.rightType,
          src: block.rightFile,
          alt: block.rightAlt || block.caption,
          hasAudio: block.rightHasAudio || false
        });
        break;
      case 'sideBySide':
        media.push({
          type: block.leftType,
          src: block.leftFile,
          alt: block.leftAlt || block.caption,
          hasAudio: block.leftHasAudio || false
        });
        media.push({
          type: block.rightType,
          src: block.rightFile,
          alt: block.rightAlt || block.caption,
          hasAudio: block.rightHasAudio || false
        });
        break;
      case 'text':
        // Text sections have no media
        break;
    }
  }
  
  return media;
}

export default function ProjectGallery({ blocks, projectTitle }: ProjectGalleryProps) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  
  // Sort blocks by order
  const sortedBlocks = [...blocks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  if (sortedBlocks.length === 0) {
    return null;
  }

  // Extract all media for the viewer (using original paths)
  const allMedia = extractAllMedia(sortedBlocks);
  
  // Handle media click - open viewer at specific index
  const handleMediaClick = (mediaIndex: number) => {
    setActiveMediaIndex(mediaIndex);
    setViewerOpen(true);
  };

  // Track media index across blocks
  let currentMediaIndex = 0;

  return (
    <>
      <div className="space-y-4 md:space-y-8 scroll-optimize">
        {sortedBlocks.map((block, index) => {
          const mediaStartIndex = currentMediaIndex;
          
          // Update current index based on block type
          switch (block.type) {
            case 'single':
              currentMediaIndex += 1;
              return (
                <SingleBlockComponent 
                  key={index} 
                  block={block} 
                  projectTitle={projectTitle} 
                  index={mediaStartIndex}
                  onMediaClick={handleMediaClick}
                />
              );
            case 'seamlessPair':
              currentMediaIndex += 2;
              return (
                <SeamlessPairBlockComponent 
                  key={index} 
                  block={block} 
                  projectTitle={projectTitle} 
                  index={index}
                  onMediaClick={handleMediaClick}
                  mediaStartIndex={mediaStartIndex}
                />
              );
            case 'sideBySide':
              currentMediaIndex += 2;
              return (
                <SideBySideBlockComponent 
                  key={index} 
                  block={block} 
                  projectTitle={projectTitle} 
                  index={index}
                  onMediaClick={handleMediaClick}
                  mediaStartIndex={mediaStartIndex}
                />
              );
            case 'text':
              return <TextBlockComponent key={index} block={block} />;
            default:
              return null;
          }
        })}
      </div>

      {/* HighResImageViewer with external control */}
      {allMedia.length > 0 && (
        <HighResImageViewer
          src={allMedia[activeMediaIndex]?.src || ''}
          alt={`${projectTitle} - Media ${activeMediaIndex + 1}`}
          allProjectMedia={allMedia}
          currentIndex={activeMediaIndex}
          isOpen={viewerOpen}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </>
  );
}
