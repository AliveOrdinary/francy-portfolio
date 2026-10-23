// Gallery block types
export interface SingleBlock {
  type: 'single';
  mediaType: 'image' | 'video';
  file: string;
  alt?: string;
  /** Show a tall image (e.g. a full web page) inside a scrollable browser frame */
  frame?: boolean;
  caption?: string;
  hasAudio?: boolean;
  order: number;
}

export interface SeamlessPairBlock {
  type: 'seamlessPair';
  leftType: 'image' | 'video';
  leftFile: string;
  leftAlt?: string;
  leftHasAudio?: boolean;
  rightType: 'image' | 'video';
  rightFile: string;
  rightAlt?: string;
  rightHasAudio?: boolean;
  caption?: string;
  order: number;
}

export interface SideBySideBlock {
  type: 'sideBySide';
  leftType: 'image' | 'video';
  leftFile: string;
  leftAlt?: string;
  leftHasAudio?: boolean;
  rightType: 'image' | 'video';
  rightFile: string;
  rightAlt?: string;
  rightHasAudio?: boolean;
  caption?: string;
  order: number;
}

export interface TextBlock {
  type: 'text';
  label?: string;
  heading?: string;
  body?: string;
  /** Rendered HTML for body, filled in at build time */
  bodyHtml?: string;
  order: number;
}

export type GalleryBlock = SingleBlock | SeamlessPairBlock | SideBySideBlock | TextBlock;

// Helper type for the image viewer component
export interface ViewerMediaItem {
  type: 'image' | 'video';
  src: string;
  alt?: string | undefined;
  caption?: string;
  hasAudio?: boolean;
}

export interface ProjectData {
  title: string;
  slug: string;
  category?: 'Branding' | 'Photography' | 'Illustration';
  featuredImage?: string;
  featuredVideo?: string;
  featuredVideoHasAudio?: boolean;
  featuredImageMobile?: string;
  featuredVideoMobile?: string;
  summary?: string;
  year: number;
  client?: string;
  industry?: string;
  services?: string[];
  studio?: string;
  studioUrl?: string;
  role?: string;
  credits?: Array<{ label: string; value: string }>;
  galleryBlocks?: GalleryBlock[];
  featured: boolean;
  order: number;
  content?: string;
}

export interface GlobalData {
  siteTitle: string;
  siteDescription: string;
  navigation: Array<{ text: string; url: string }>;
  footerText: string;
  logo?: string;
}

export interface HomePageData {
  title: string;
  introText: string;
  whatIDo?: string;
  featuredProjectsHeading: string;
  content?: string;
}

export interface Achievement {
  year: number;
  description: string;
}

export interface ExperienceItem {
  role: string;
  organisation: string;
  url?: string;
  location?: string;
  years?: string;
  description?: string;
}

export interface EducationItem {
  qualification: string;
  school: string;
  location?: string;
  year?: string;
}

export interface AboutPageData {
  title: string;
  bio: string;
  /** A paragraph, or a list of short lines */
  whatIDo?: string | string[];
  /** Structured entries; plain strings still work */
  experience?: Array<ExperienceItem | string>;
  education?: EducationItem[];
  achievements?: Achievement[];
  profileImage: string;
  profileImageMobile?: string;
  mobileOverlay?: string;
  content?: string;
}

export interface ContactPageData {
  title: string;
  email: string;
  phone?: string;
  socialMedia: Array<{ platform: string; url: string }>;
  content?: string;
} 