'use client';

import { useState } from 'react';
import Image from 'next/image';
import LazyVideo from '@/components/LazyVideo';
import HighResImageViewer from '@/components/HighResImageViewer';
import { GalleryBlock, SingleBlock, SeamlessPairBlock, SideBySideBlock, ViewerMediaItem } from '@/lib/types';
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
        className={`w-full h-auto rounded-2xl cursor-pointer transition-transform duration-500 ${className}`}
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
        className="w-full h-auto object-cover block transition-transform duration-500"
      />
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
      <MediaItem
        type={block.mediaType}
        src={block.file}
        alt={block.caption || `${projectTitle} - ${index + 1}`}
        hasAudio={block.hasAudio}
        priority={index < 2}
        onClick={() => onMediaClick(index)}
      />
      {block.caption && (
        <p className="text-sm text-gray-500 mt-4 text-center font-mono">{block.caption}</p>
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
              block.caption ? `${block.caption} - Left` : `${projectTitle} - ${index + 1} Left`,
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
              block.caption ? `${block.caption} - Right` : `${projectTitle} - ${index + 1} Right`,
              block.rightHasAudio,
              index < 2,
              mediaStartIndex + 1
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
              block.caption ? `${block.caption} - Left` : `${projectTitle} - ${index + 1} Left`,
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
              block.caption ? `${block.caption} - Right` : `${projectTitle} - ${index + 1} Right`,
              block.rightHasAudio,
              index < 2,
              mediaStartIndex + 1
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

// Helper to extract all media items from blocks for the viewer
function extractAllMedia(blocks: GalleryBlock[]): ViewerMediaItem[] {
  const media: ViewerMediaItem[] = [];
  
  for (const block of blocks) {
    switch (block.type) {
      case 'single':
        media.push({
          type: block.mediaType,
          src: block.file, // Use original path for high-res viewer
          hasAudio: block.hasAudio || false
        });
        break;
      case 'seamlessPair':
        media.push({
          type: block.leftType,
          src: block.leftFile,
          hasAudio: block.leftHasAudio || false
        });
        media.push({
          type: block.rightType,
          src: block.rightFile,
          hasAudio: block.rightHasAudio || false
        });
        break;
      case 'sideBySide':
        media.push({
          type: block.leftType,
          src: block.leftFile,
          hasAudio: block.leftHasAudio || false
        });
        media.push({
          type: block.rightType,
          src: block.rightFile,
          hasAudio: block.rightHasAudio || false
        });
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
      <div className="space-y-4 md:space-y-8">
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
          className="hidden"
        />
      )}
    </>
  );
}
