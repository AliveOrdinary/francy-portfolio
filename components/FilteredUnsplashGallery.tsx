'use client';

import { useState, useEffect, useCallback } from 'react';
import { searchUserPhotos, UnsplashPhoto } from '@/lib/unsplash';
import OptimizedImage from './OptimizedImage';
import LoadingSpinner from './LoadingSpinner';

interface FilteredUnsplashGalleryProps {
  username: string;
  searchQuery: string;
  initialPhotos?: UnsplashPhoto[];
  photosPerPage?: number;
}

export default function FilteredUnsplashGallery({ 
  username,
  searchQuery,
  initialPhotos = [], 
  photosPerPage = 12 
}: FilteredUnsplashGalleryProps) {
  const [photos, setPhotos] = useState<UnsplashPhoto[]>(initialPhotos);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadPhotos = useCallback(async (currentPage: number, reset = false) => {
    setLoading(true);
    setError(null);

    try {
      const response = await searchUserPhotos(username, searchQuery, currentPage, photosPerPage);
      setHasMore(currentPage < response.total_pages);

      if (reset) {
        setPhotos(response.results);
      } else {
        setPhotos(prev => [...prev, ...response.results]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load photos');
    } finally {
      setLoading(false);
    }
  }, [username, searchQuery, photosPerPage]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadPhotos(nextPage);
  };

  useEffect(() => {
    const loadInitialPhotos = async () => {
      setPage(1);
      setPhotos([]);
      await loadPhotos(1, true);
    };
    
    loadInitialPhotos();
  }, [username, searchQuery, loadPhotos]);

  return (
    <div className="w-full">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {photos.map((photo) => (
          <div key={photo.id} className="group relative">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 relative">
              <OptimizedImage
                src={photo.urls.regular}
                alt={photo.alt_description || photo.description || 'Photo by ' + photo.user.name}
                fill
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="text-white">
                <p className="text-xs opacity-75">
                  {photo.likes} likes • {new Date(photo.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      )}

      {!loading && hasMore && photos.length > 0 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Load More Photos
          </button>
        </div>
      )}

      {!loading && photos.length === 0 && !error && (
        <div className="text-center py-12 text-gray-500">
          No {searchQuery.toLowerCase()} photos found for this user.
        </div>
      )}
    </div>
  );
}