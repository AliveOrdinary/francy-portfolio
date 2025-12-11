'use client';

import Link from 'next/link';
import Image from 'next/image';

interface ProjectCardProps {
  title: string;
  slug: string;
  category?: string | undefined;
  image?: string | undefined;
  video?: string | undefined;
  color?: string; // Optional background color for the card
  priority?: boolean;
}

export default function ProjectCard({
  title,
  slug,
  category,
  image,
  video,
  color = '#B065FF', // Default purple from design
  priority = false,
}: ProjectCardProps) {
  return (
    <Link href={`/projects/${slug}`} className="block group w-full">
      <div 
        className="relative w-full overflow-hidden rounded-2xl transition-transform duration-500"
        style={{ backgroundColor: color }}
      >
        {/* Content Overlay */}
        <div className="absolute inset-0 z-10 flex flex-col justify-center items-center p-6 text-center mix-blend-difference text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h3 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter mb-2">
            {title}
          </h3>
          {category && (
            <p className="text-sm md:text-base font-sans tracking-widest uppercase">
              {category}
            </p>
          )}
        </div>

        {/* Media */}
        <div className="w-full">
          {video ? (
            <video
              src={video}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-auto object-cover block"
            />
          ) : image ? (
            <Image
              src={image}
              alt={title}
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-auto object-cover block"
              priority={priority}
            />
          ) : (
            <div className="w-full aspect-video flex items-center justify-center bg-primary">
              <span className="text-white font-display text-2xl">{title}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Title below card (optional, based on design preference, but design shows text inside or large) */}
      {/* Keeping it simple for now as per "SANJO" card which had text inside or very large */}
    </Link>
  );
}
