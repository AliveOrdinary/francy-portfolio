'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchUserPhotos, UnsplashPhoto } from '@/lib/unsplash';
import LoadingSpinner from './LoadingSpinner';
import HighResImageViewer from './HighResImageViewer';

interface SimpleUnsplashGalleryProps {
  username: string;
  photosPerPage?: number;
}

export default function SimpleUnsplashGallery({ 
  username,
  photosPerPage = 12 
}: SimpleUnsplashGalleryProps) {
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loadPhotos = useCallback(async (currentPage: number, reset = false) => {
    setLoading(true);
    setError(null);

    try {
      const newPhotos = await fetchUserPhotos(username, currentPage, photosPerPage);
      setHasMore(newPhotos.length === photosPerPage);

      if (reset) {
        setPhotos(newPhotos);
      } else {
        setPhotos(prev => [...prev, ...newPhotos]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load photos');
    } finally {
      setLoading(false);
    }
  }, [username, photosPerPage]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadPhotos(nextPage);
  };

  useEffect(() => {
    const loadInitialPhotos = async () => {
      if (username) {
        setPage(1);
        setPhotos([]);
        setError(null);
        await loadPhotos(1, true);
      }
    };
    
    loadInitialPhotos();
  }, [username, loadPhotos]);

  // Filter valid photos
  const validPhotos = photos.filter(photo => photo.urls.regular && photo.urls.full);
  const allImageUrls = validPhotos.map(photo => photo.urls.full);

  return (
    <div className="w-full">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Simple CSS Grid Masonry Layout */}
      <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {validPhotos.map((photo, index) => {
            // Calculate aspect ratio to determine height
            const aspectRatio = photo.width / photo.height;
            const isVertical = aspectRatio < 1;
            
            return (
              <div 
                key={photo.id} 
                className="break-inside-avoid mb-4 relative"
              >
                <HighResImageViewer
                  src={photo.urls.regular}
                  alt={photo.alt_description || photo.description || 'Photo by ' + photo.user.name}
                  priority={index < 4}
                  aspectRatio={isVertical ? 'portrait' : 'video'}
                  quality={90}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  allProjectImages={allImageUrls}
                  currentIndex={index}
                />
                
                {/* Simple info overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 pointer-events-none">
                  <p className="text-white text-sm">
                    {photo.likes} likes
                  </p>
                </div>
              </div>
            );
          })}
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      )}

      {!loading && hasMore && photos.length > 0 && (
        <div className="flex justify-center mt-12">
          <button
            onClick={loadMore}
            className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Load More Photos
          </button>
        </div>
      )}

      {!loading && photos.length === 0 && !error && (
        <div className="text-center py-12 text-gray-500">
          No photos found for this user.
        </div>
      )}
    </div>
  );
}