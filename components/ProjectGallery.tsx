'use client';

import Image from 'next/image';
import { ProjectMediaItem } from '@/lib/types';
import HighResImageViewer from '@/components/HighResImageViewer';

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
                className="w-full h-auto rounded-lg cursor-pointer transition-transform duration-500 hover:scale-[1.02]"
              />
            ) : (
              <div className="relative cursor-zoom-in overflow-hidden rounded-lg">
                <Image
                  src={item.src}
                  alt={item.caption || `${projectTitle} - ${index + 1}`}
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full h-auto object-cover block transition-transform duration-500 hover:scale-[1.02]"
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
