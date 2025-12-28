'use client';

import Image from 'next/image';
import { ProjectMediaItem } from '@/lib/types';
import HighResImageViewer from '@/components/HighResImageViewer';
import { IMAGE_CONFIG } from '@/lib/constants';

interface ProjectGalleryProps {
  media: ProjectMediaItem[];
  projectTitle: string;
}

export default function ProjectGallery({ media, projectTitle }: ProjectGalleryProps) {
  return (
    <div className="space-y-4 md:space-y-8">
      {media.map((item, index) => (
        <div key={index} className="w-full">
          <HighResImageViewer
            src={item.src}
            alt={item.caption || `${projectTitle} - ${index + 1}`}
            allProjectMedia={media}
            currentIndex={index}
            className="w-full"
          >
            {item.type === 'video' ? (
              <video
                src={item.src}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-auto rounded-2xl cursor-pointer transition-transform duration-500 "
              />
            ) : (
              <div className="relative cursor-zoom-in overflow-hidden rounded-2xl">
                <Image
                  src={item.src}
                  alt={item.caption || `${projectTitle} - ${index + 1}`}
                  width={1600}
                  height={900}
                  sizes={IMAGE_CONFIG.SIZES.PROJECT_GALLERY}
                  quality={IMAGE_CONFIG.QUALITY.THUMBNAIL_GALLERY}
                  loading={index < 2 ? 'eager' : 'lazy'}
                  priority={index < 2}
                  className="w-full h-auto object-cover block transition-transform duration-500"
                />
              </div>
            )}
          </HighResImageViewer>
          {item.caption && (
            <p className="text-sm text-gray-500 mt-4 text-center font-mono">{item.caption}</p>
          )}
        </div>
      ))}
    </div>
  );
}
