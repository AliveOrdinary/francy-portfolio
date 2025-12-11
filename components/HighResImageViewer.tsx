'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import OptimizedImage from './OptimizedImage';
import { ProjectMediaItem } from '../lib/types';

interface HighResImageViewerProps {
  src: string;
  alt: string;
  priority?: boolean;
  aspectRatio?: 'video' | 'square' | 'portrait';
  quality?: number;
  sizes?: string;
  allProjectImages?: string[];
  allProjectMedia?: ProjectMediaItem[];
  currentIndex?: number;
  highResQuality?: number;
  children?: React.ReactNode;
  className?: string;
}

interface ImageDimensions {
  width: number;
  height: number;
}

const HighResImageViewer: React.FC<HighResImageViewerProps> = ({
  src,
  alt,
  priority = false,
  aspectRatio = 'video',
  quality = 95,
  sizes = '100vw',
  allProjectImages = [],
  allProjectMedia = [],
  currentIndex = 0,
  highResQuality = 100,
  children,
  className
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(currentIndex);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastTap, setLastTap] = useState(0);
  const [pinchDistance, setPinchDistance] = useState(0);
  const [initialPinchZoom, setInitialPinchZoom] = useState(1);
  const [, setImageDimensions] = useState<ImageDimensions | null>(null);
  const [highResLoaded, setHighResLoaded] = useState(false);
  const [isLoadingHighRes, setIsLoadingHighRes] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showMobileHint, setShowMobileHint] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const highResImageRef = useRef<HTMLImageElement>(null);

  // Use mixed media if available, otherwise fall back to images only
  const mediaArray = allProjectMedia.length > 0 ? allProjectMedia : allProjectImages.map(imgSrc => ({ type: 'image' as const, src: imgSrc, order: 0, hasAudio: false }));
  const currentMedia = mediaArray.length > 0 ? mediaArray[activeImageIndex] : { type: 'image' as const, src, order: 0, hasAudio: false };
  const currentImageSrc = currentMedia.src;
  
  // Helper function to check if current media is a video
  const isCurrentMediaVideo = () => {
    const src = currentMedia.src.toLowerCase();
    return src.endsWith('.mp4') || src.endsWith('.webm') || src.endsWith('.mov') || currentMedia.type === 'video';
  };
  
  // Haptic feedback utility
  const triggerHapticFeedback = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30]
      };
      navigator.vibrate(patterns[type]);
    }
  }, []);
  
  // Generate high-res URL (assumes same path with quality parameter)
  const getHighResUrl = useCallback((imageSrc: string) => {
    if (imageSrc.includes('?')) {
      return `${imageSrc}&quality=${highResQuality}`;
    }
    return `${imageSrc}?quality=${highResQuality}`;
  }, [highResQuality]);
  
  // Preload high-res image
  const preloadHighRes = useCallback((imageSrc: string) => {
    const img = new Image();
    img.onload = () => {
      setHighResLoaded(true);
      setIsLoadingHighRes(false);
    };
    img.onerror = () => {
      setIsLoadingHighRes(false);
    };
    img.src = getHighResUrl(imageSrc);
  }, [getHighResUrl]);
  
  // Preload adjacent images for smooth navigation
  const preloadAdjacentImages = useCallback(() => {
    if (mediaArray.length > 1) {
      const nextIndex = (activeImageIndex + 1) % mediaArray.length;
      const prevIndex = (activeImageIndex - 1 + mediaArray.length) % mediaArray.length;
      
      // Preload next and previous media (only if they are images)
      [mediaArray[nextIndex], mediaArray[prevIndex]].forEach(media => {
        if (media.type === 'image') {
          const img = new Image();
          img.src = getHighResUrl(media.src);
        }
      });
    }
  }, [mediaArray, activeImageIndex, getHighResUrl]);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
    setActiveImageIndex(currentIndex);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setHighResLoaded(false);
    setIsLoadingHighRes(true);
    triggerHapticFeedback('medium');
    
    // Show mobile gesture hint on first open
    if (typeof window !== 'undefined' && window.innerWidth < 768 && mediaArray.length > 1) {
      setShowMobileHint(true);
      setTimeout(() => setShowMobileHint(false), 3000);
    }
    
    // Start loading high-res version immediately
    const targetSrc = allProjectImages.length > 0 ? allProjectImages[currentIndex] : src;
    preloadHighRes(targetSrc);
  }, [currentIndex, allProjectImages, src, preloadHighRes, triggerHapticFeedback, mediaArray.length, setShowMobileHint]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, []);
  
  const nextImage = useCallback(() => {
    if (mediaArray.length > 1) {
      const newIndex = (activeImageIndex + 1) % mediaArray.length;
      setActiveImageIndex(newIndex);
      setZoom(1);
      setPosition({ x: 0, y: 0 });
      setHighResLoaded(false);
      setIsLoadingHighRes(true);
      const newMedia = mediaArray[newIndex];
      if (newMedia.type === 'image') {
        preloadHighRes(newMedia.src);
      }
      triggerHapticFeedback('light');
    }
  }, [mediaArray, activeImageIndex, preloadHighRes, triggerHapticFeedback]);

  const prevImage = useCallback(() => {
    if (mediaArray.length > 1) {
      const newIndex = (activeImageIndex - 1 + mediaArray.length) % mediaArray.length;
      setActiveImageIndex(newIndex);
      setZoom(1);
      setPosition({ x: 0, y: 0 });
      setHighResLoaded(false);
      setIsLoadingHighRes(true);
      const newMedia = mediaArray[newIndex];
      if (newMedia.type === 'image') {
        preloadHighRes(newMedia.src);
      }
      triggerHapticFeedback('light');
    }
  }, [mediaArray, activeImageIndex, preloadHighRes, triggerHapticFeedback]);

  const zoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev * 1.5, 5));
    triggerHapticFeedback('light');
  }, [triggerHapticFeedback]);

  const zoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev / 1.5, 0.5));
    triggerHapticFeedback('light');
  }, [triggerHapticFeedback]);

  const resetZoom = useCallback(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    triggerHapticFeedback('medium');
  }, [triggerHapticFeedback]);
  
  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
    triggerHapticFeedback('light');
  }, [triggerHapticFeedback]);
  
  
  // Mobile tap zone detection for navigation
  const handleMobileTap = useCallback((e: React.TouchEvent) => {
    const now = Date.now();
    const timeDiff = now - lastTap;
    
    // Double-tap to reset zoom
    if (timeDiff < 300 && timeDiff > 0) {
      e.preventDefault();
      triggerHapticFeedback('medium');
      resetZoom();
      setLastTap(now);
      return;
    }
    
    // Single tap for navigation (only if there are multiple media items)
    if (mediaArray.length > 1 && zoom === 1) {
      const touch = e.changedTouches[0];
      const rect = e.currentTarget.getBoundingClientRect();
      const tapX = touch.clientX - rect.left;
      const screenWidth = rect.width;
      
      // Left half = previous, right half = next
      if (tapX < screenWidth / 2) {
        prevImage();
      } else {
        nextImage();
      }
      
      triggerHapticFeedback('light');
    }
    
    setLastTap(now);
  }, [lastTap, resetZoom, triggerHapticFeedback, mediaArray.length, zoom, prevImage, nextImage]);
  
  // Pinch-to-zoom helpers
  const getDistance = (touch1: React.Touch, touch2: React.Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };
  
  const handlePinchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault(); // Prevent Chrome's default zoom behavior
      const distance = getDistance(e.touches[0], e.touches[1]);
      setPinchDistance(distance);
      setInitialPinchZoom(zoom);
    }
  }, [zoom]);
  
  const handlePinchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchDistance > 0) {
      e.preventDefault();
      const distance = getDistance(e.touches[0], e.touches[1]);
      const scale = distance / pinchDistance;
      const newZoom = Math.min(Math.max(initialPinchZoom * scale, 0.5), 5);
      setZoom(newZoom);
    }
  }, [pinchDistance, initialPinchZoom]);
  
  const handlePinchEnd = useCallback((e: React.TouchEvent) => {
    // Only reset if we're not in a pinch gesture anymore
    if (e.touches.length < 2) {
      setPinchDistance(0);
    }
    // Don't reset initialPinchZoom - let it maintain the current zoom level
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  }, [zoom, position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  }, [isDragging, zoom, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  }, [zoomIn, zoomOut]);

  const handleImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImageDimensions({
      width: img.naturalWidth,
      height: img.naturalHeight
    });
  }, []);
  
  
  
  // Touch gesture handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y
      });
    }
  }, [zoom, position]);
  
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    
    if (isDragging && zoom > 1) {
      e.preventDefault();
      setPosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      });
    }
  }, [isDragging, zoom, dragStart]);
  
  const handleTouchEnd = useCallback(() => {
    // Only handle drag ending, no swipe detection (using tap zones instead)
    setIsDragging(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;

      switch (e.key) {
        case 'Escape':
          closeModal();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
        case '+':
        case '=':
          e.preventDefault();
          zoomIn();
          break;
        case '-':
          e.preventDefault();
          zoomOut();
          break;
        case '0':
          e.preventDefault();
          resetZoom();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, closeModal, nextImage, prevImage, zoomIn, zoomOut, resetZoom]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);
  
  // Preload adjacent images when modal opens or image changes
  useEffect(() => {
    if (isModalOpen) {
      // Small delay to prioritize current image loading
      const timer = setTimeout(preloadAdjacentImages, 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isModalOpen, activeImageIndex, preloadAdjacentImages]);

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square';
      case 'portrait':
        return 'aspect-[3/4]';
      default:
        return 'aspect-video';
    }
  };

  return (
    <>
      <div 
        className={className || `w-full ${getAspectRatioClass()} cursor-pointer`}
        onClick={openModal}
      >
        {children ? (
          children
        ) : (
          <OptimizedImage
            src={src}
            alt={alt}
            priority={priority}
            quality={quality}
            sizes={sizes}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {isModalOpen && (
        <div 
          ref={modalRef}
          className="modal-backdrop fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
        >
          <div 
            className="modal-container relative w-full h-full flex items-center justify-center p-4"
          >
            <div 
              className="relative max-w-[90vw] max-h-[90vh] cursor-grab active:cursor-grabbing flex items-center justify-center"
              style={{
                transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                transformOrigin: 'center center',
                touchAction: 'none' // Prevent browser default touch behaviors
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              onTouchStart={(e) => {
                handleTouchStart(e);
                handlePinchStart(e);
              }}
              onTouchMove={(e) => {
                handleTouchMove(e);
                handlePinchMove(e);
              }}
              onTouchEnd={(e) => {
                handleMobileTap(e);
                handleTouchEnd();
                handlePinchEnd(e);
              }}
            >
              {isCurrentMediaVideo() ? (
                // Video content
                <video
                  src={currentImageSrc}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  className="max-w-full max-h-full object-contain select-none"
                  style={{ margin: '0 auto' }}
                  onLoadedData={() => {
                    setHighResLoaded(true);
                    setIsLoadingHighRes(false);
                  }}
                />
              ) : (
                <>
                  {/* Standard quality image (loads immediately) */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    ref={imageRef}
                    src={currentImageSrc}
                    alt={alt}
                    className={`max-w-full max-h-full object-contain select-none transition-opacity duration-300 block ${
                      highResLoaded ? 'opacity-0' : 'opacity-100'
                    }`}
                    onLoad={handleImageLoad}
                    draggable={false}
                    style={{ margin: '0 auto' }}
                  />
                  
                  {/* High-res overlay (loads on top when ready) */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    ref={highResImageRef}
                    src={getHighResUrl(currentImageSrc)}
                    alt={`${alt} (High Resolution)`}
                    className={`absolute inset-0 max-w-full max-h-full object-contain select-none transition-opacity duration-300 block ${
                      highResLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ margin: '0 auto' }}
                    onLoad={(e) => {
                      handleImageLoad(e);
                      setHighResLoaded(true);
                      setIsLoadingHighRes(false);
                    }}
                    onError={() => setIsLoadingHighRes(false)}
                    draggable={false}
                  />
                  
                  {/* Loading indicator for images */}
                  {isLoadingHighRes && (
                    <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                      Loading high quality...
                    </div>
                  )}
                </>
              )}
            </div>


            <button
              onClick={closeModal}
              className="hidden md:block absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
              aria-label="Close image viewer"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {mediaArray.length > 1 && (
              <>
                {/* Desktop navigation buttons */}
                <button
                  onClick={prevImage}
                  className="hidden md:block absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                  aria-label="Previous image"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15,18 9,12 15,6" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="hidden md:block absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                  aria-label="Next image"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9,18 15,12 9,6" />
                  </svg>
                </button>
                
              </>
            )}


            {/* Desktop controls */}
            <div className="absolute bottom-4 right-4 md:flex gap-2 hidden">
              {isCurrentMediaVideo() && currentMedia.hasAudio && (
                <button
                  onClick={toggleMute}
                  className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                  aria-label={isMuted ? "Unmute video" : "Mute video"}
                >
                  {isMuted ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <line x1="23" y1="9" x2="17" y2="15" />
                      <line x1="17" y1="9" x2="23" y2="15" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </svg>
                  )}
                </button>
              )}
              {!isCurrentMediaVideo() && (
                <>
                  <button
                    onClick={zoomOut}
                    className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                    aria-label="Zoom out"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                      <line x1="8" y1="11" x2="14" y2="11" />
                    </svg>
                  </button>
                  <button
                    onClick={resetZoom}
                    className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                    aria-label="Reset zoom"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="1,4 1,10 7,10" />
                      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                    </svg>
                  </button>
                  <button
                    onClick={zoomIn}
                    className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                    aria-label="Zoom in"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                      <line x1="11" y1="8" x2="11" y2="14" />
                      <line x1="8" y1="11" x2="14" y2="11" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Mobile gesture hint */}
            {showMobileHint && (
              <div className="md:hidden absolute bottom-36 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-4 py-3 rounded-lg text-sm z-50">
                <div className="text-center space-y-1">
                  <div>Tap sides to navigate</div>
                  <div>Pinch to zoom • Double tap to reset</div>
                </div>
              </div>
            )}

            {/* Mobile close button only */}
            <button
              onClick={closeModal}
              className="md:hidden absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all z-50"
              aria-label="Close image viewer"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default HighResImageViewer;
