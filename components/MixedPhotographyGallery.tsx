'use client';

import { ProjectData } from '@/lib/types';
import ProjectCard from '@/components/ui/ProjectCard';
import SimpleUnsplashGallery from './SimpleUnsplashGallery';

interface MixedPhotographyGalleryProps {
  cmsPhotos: ProjectData[];
  username: string;
}

export default function MixedPhotographyGallery({ 
  cmsPhotos,
  username
}: MixedPhotographyGalleryProps) {

  return (
    <div className="w-full space-y-12">
      {/* CMS Photography Projects */}
      {cmsPhotos.length > 0 && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {cmsPhotos.map((project, index) => (
              <ProjectCard
                key={project.slug}
                title={project.title}
                slug={project.slug}
                category={project.category as string | undefined}
                image={project.featuredImage}
                video={project.featuredVideo}
                priority={index < 4}
              />
            ))}
          </div>
        </div>
      )}

      {/* Unsplash Photos with Clean Layout */}
      <div>
        <SimpleUnsplashGallery username={username} />
      </div>
    </div>
  );
}