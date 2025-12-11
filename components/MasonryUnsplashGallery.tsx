'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchUserPhotos, UnsplashPhoto } from '@/lib/unsplash';
import OptimizedImage from './OptimizedImage';
import LoadingSpinner from './LoadingSpinner';

interface MasonryUnsplashGalleryProps {
  username: string;
  photosPerPage?: number;
}

interface PhotoWithLayout extends UnsplashPhoto {
  isVertical: boolean;
}

export default function MasonryUnsplashGallery({ 
  username,
  photosPerPage = 12 
}: MasonryUnsplashGalleryProps) {
  const [photos, setPhotos] = useState<PhotoWithLayout[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadPhotos = useCallback(async (currentPage: number, reset = false) => {
    setLoading(true);
    setError(null);

    try {
      const newPhotos = await fetchUserPhotos(username, currentPage, photosPerPage);
      
      // Determine if each photo is vertical or horizontal
      const photosWithLayout: PhotoWithLayout[] = newPhotos.map(photo => ({
        ...photo,
        isVertical: photo.height > photo.width
      }));

      setHasMore(newPhotos.length === photosPerPage);

      if (reset) {
        setPhotos(photosWithLayout);
      } else {
        setPhotos(prev => [...prev, ...photosWithLayout]);
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

  // Smart grouping based on image orientation
  const createSmartGroups = (photos: PhotoWithLayout[]) => {
    const groups = [];
    let i = 0;
    let groupIndex = 0;

    while (i < photos.length) {
      const currentPhoto = photos[i];
      
      // If we find a vertical image, create a group with pattern A or B
      if (currentPhoto.isVertical) {
        const group = {
          type: 'mixed' as const,
          photos: [currentPhoto],
          patternType: (groupIndex % 2 === 0 ? 'A' : 'B') as 'A' | 'B' // Alternate patterns
        };
        
        // Add up to 2 more photos for the horizontal slots
        for (let j = 1; j <= 2 && i + j < photos.length; j++) {
          group.photos.push(photos[i + j]);
        }
        
        groups.push(group);
        i += group.photos.length;
        groupIndex++;
      } 
      // If we have horizontal images, group them in sets of 3
      else {
        const horizontalGroup = [];
        
        // Collect up to 3 horizontal images
        while (horizontalGroup.length < 3 && i < photos.length && !photos[i].isVertical) {
          horizontalGroup.push(photos[i]);
          i++;
        }
        
        groups.push({
          type: 'horizontal' as const,
          photos: horizontalGroup
        });
      }
    }

    return groups;
  };

  const photoGroups = createSmartGroups(photos);

  const renderGroup = (group: { type: 'mixed' | 'horizontal'; photos: PhotoWithLayout[]; patternType?: 'A' | 'B' }, groupIndex: number) => {
    if (group.photos.length === 0) return null;

    if (group.type === 'horizontal') {
      // Render horizontal images in a simple grid
      return (
        <div key={groupIndex} className="mb-8 w-full">
          <div className={`grid gap-4 ${
            group.photos.length === 1 ? 'grid-cols-1' :
            group.photos.length === 2 ? 'grid-cols-1 lg:grid-cols-2' :
            'grid-cols-1 lg:grid-cols-3'
          }`}>
            {group.photos.map((photo: PhotoWithLayout, _photoIndex: number) => (
              <div key={photo.id} className="relative h-[300px] group">
                <OptimizedImage
                  src={photo.urls.regular}
                  alt={photo.alt_description || 'Photo by ' + photo.user.name}
                  fill
                  className="object-cover rounded-lg transition-transform duration-500 group-hover:scale-105"
                  sizes={
                    group.photos.length === 1 ? "100vw" :
                    group.photos.length === 2 ? "(max-width: 1024px) 100vw, 50vw" :
                    "(max-width: 1024px) 100vw, 33vw"
                  }
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-sm font-medium">{photo.likes} likes</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Mixed layout with vertical image
    const [verticalPhoto, ...horizontalPhotos] = group.photos;
    const isPatternA = group.patternType === 'A';

    return (
      <div key={groupIndex} className="mb-8 w-full">
        {isPatternA ? (
          // Pattern A: Vertical left, two horizontal stacked right
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-auto lg:h-[500px]">
            {/* Vertical image - takes 1/3 width */}
            <div className="relative h-[300px] lg:h-full group">
              <OptimizedImage
                src={verticalPhoto.urls.regular}
                alt={verticalPhoto.alt_description || 'Photo by ' + verticalPhoto.user.name}
                fill
                className="object-cover rounded-lg transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
              <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-sm font-medium">{verticalPhoto.likes} likes</p>
              </div>
            </div>
            
            {/* Two horizontal images stacked - takes 2/3 width */}
            <div className="lg:col-span-2 flex flex-col gap-4 h-[300px] lg:h-full">
              {horizontalPhotos[0] && (
                <div className="relative flex-1 group">
                  <OptimizedImage
                    src={horizontalPhotos[0].urls.regular}
                    alt={horizontalPhotos[0].alt_description || 'Photo by ' + horizontalPhotos[0].user.name}
                    fill
                    className="object-cover rounded-lg transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 67vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                  <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-sm font-medium">{horizontalPhotos[0].likes} likes</p>
                  </div>
                </div>
              )}
              
              {horizontalPhotos[1] && (
                <div className="relative flex-1 group">
                  <OptimizedImage
                    src={horizontalPhotos[1].urls.regular}
                    alt={horizontalPhotos[1].alt_description || 'Photo by ' + horizontalPhotos[1].user.name}
                    fill
                    className="object-cover rounded-lg transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 67vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                  <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-sm font-medium">{horizontalPhotos[1].likes} likes</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Pattern B: Two horizontal stacked left, vertical right
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-auto lg:h-[500px]">
            {/* Two horizontal images stacked - takes 2/3 width */}
            <div className="lg:col-span-2 flex flex-col gap-4 h-[300px] lg:h-full">
              {horizontalPhotos[0] && (
                <div className="relative flex-1 group">
                  <OptimizedImage
                    src={horizontalPhotos[0].urls.regular}
                    alt={horizontalPhotos[0].alt_description || 'Photo by ' + horizontalPhotos[0].user.name}
                    fill
                    className="object-cover rounded-lg transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 67vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                  <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-sm font-medium">{horizontalPhotos[0].likes} likes</p>
                  </div>
                </div>
              )}
              
              {horizontalPhotos[1] && (
                <div className="relative flex-1 group">
                  <OptimizedImage
                    src={horizontalPhotos[1].urls.regular}
                    alt={horizontalPhotos[1].alt_description || 'Photo by ' + horizontalPhotos[1].user.name}
                    fill
                    className="object-cover rounded-lg transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 67vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                  <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-sm font-medium">{horizontalPhotos[1].likes} likes</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Vertical image - takes 1/3 width */}
            <div className="relative h-[300px] lg:h-full group">
              <OptimizedImage
                src={verticalPhoto.urls.regular}
                alt={verticalPhoto.alt_description || 'Photo by ' + verticalPhoto.user.name}
                fill
                className="object-cover rounded-lg transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
              <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-sm font-medium">{verticalPhoto.likes} likes</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="w-full">
        {photoGroups.map((group, index) => renderGroup(group, index))}
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