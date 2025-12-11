// API and configuration constants
export const SITE_CONFIG = {
  DEFAULT_TITLE: 'Eldho | Art Director & Graphic Designer',
  DEFAULT_DESCRIPTION: 'Eldhose Kuriyan is an Art Director and Graphic Designer based in Toronto, specializing in branding, typography, and illustration.',
  DEFAULT_KEYWORDS: ['Art Director', 'Graphic Designer', 'Branding', 'Typography', 'Illustration', 'Toronto', 'Portfolio'],
  CREATOR: 'AliveOrdinary'
} as const;

// Image optimization constants
export const IMAGE_CONFIG = {
  QUALITY: {
    HERO: 100,
    GALLERY: 95,
    THUMBNAIL: 90
  },
  SIZES: {
    HERO: '100vw',
    GALLERY: '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw',
    THUMBNAIL: '(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw'
  },
  PRIORITY_THRESHOLD: {
    PROJECTS_PAGE: 4,
    HOME_PAGE: 1,
    GALLERY: 2
  }
} as const;

// Content paths
export const CONTENT_PATHS = {
  BASE: 'content',
  PROJECTS: 'content/projects',
  PAGES: 'content/pages',
  GLOBAL: 'content/global'
} as const;

// Default navigation fallback
export const DEFAULT_NAVIGATION = [
  { text: 'Home', url: '/' },
  { text: 'Projects', url: '/projects' },
  { text: 'About', url: '/about' },
  { text: 'Contact', url: '/contact' }
];