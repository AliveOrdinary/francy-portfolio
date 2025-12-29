// Gallery block types
export interface SingleBlock {
  type: 'single';
  mediaType: 'image' | 'video';
  file: string;
  caption?: string;
  hasAudio?: boolean;
  order: number;
}

export interface SeamlessPairBlock {
  type: 'seamlessPair';
  leftType: 'image' | 'video';
  leftFile: string;
  leftHasAudio?: boolean;
  rightType: 'image' | 'video';
  rightFile: string;
  rightHasAudio?: boolean;
  caption?: string;
  order: number;
}

export interface SideBySideBlock {
  type: 'sideBySide';
  leftType: 'image' | 'video';
  leftFile: string;
  leftHasAudio?: boolean;
  rightType: 'image' | 'video';
  rightFile: string;
  rightHasAudio?: boolean;
  caption?: string;
  order: number;
}

export type GalleryBlock = SingleBlock | SeamlessPairBlock | SideBySideBlock;

// Helper type for the image viewer component
export interface ViewerMediaItem {
  type: 'image' | 'video';
  src: string;
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
  shortSummary: string;
  mainSummary?: string;
  year: number;
  services?: string[];
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

export interface AboutPageData {
  title: string;
  bio: string;
  whatIDo?: string;
  experience?: string[];
  achievements?: Achievement[];
  profileImage: string;
  content?: string;
}

export interface ContactPageData {
  title: string;
  email: string;
  phone?: string;
  socialMedia: Array<{ platform: string; url: string }>;
  content?: string;
} 