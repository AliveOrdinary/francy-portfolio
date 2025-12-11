export interface ProjectImageItem {
  image: string;
  caption?: string | undefined;
  order?: number;
}

export interface ProjectVideoItem {
  video: string;
  caption?: string | undefined;
  order?: number;
  hasAudio?: boolean;
}

export interface ProjectMediaItem {
  type: 'image' | 'video';
  src: string;
  caption?: string | undefined;
  order: number;
  hasAudio?: boolean;
}

export interface ProjectData {
  title: string;
  slug: string;
  category?: 'Branding' | 'Photography' | 'Illustration';
  featuredImage?: string;
  featuredVideo?: string;
  featuredVideoHasAudio?: boolean;
  shortSummary: string;
  mainSummary?: string;
  year: number;
  services?: string[];
  projectImages?: ProjectImageItem[];
  projectVideos?: ProjectVideoItem[];
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