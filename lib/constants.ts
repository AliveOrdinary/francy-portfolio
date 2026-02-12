// Image optimization constants
export const IMAGE_CONFIG = {
  QUALITY: {
    HERO: 100,
    GALLERY: 95,
    THUMBNAIL: 90,
    THUMBNAIL_GALLERY: 75 // Optimized quality for gallery thumbnails (full quality shown in viewer)
  },
  SIZES: {
    HERO: '100vw',
    GALLERY: '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw',
    THUMBNAIL: '(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw',
    PROJECT_GALLERY: '(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1400px' // Optimized for project detail pages
  },
  PRIORITY_THRESHOLD: {
    PROJECTS_PAGE: 4,
    HOME_PAGE: 1,
    GALLERY: 2
  }
} as const;