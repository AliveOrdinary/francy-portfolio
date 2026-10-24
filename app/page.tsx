import Image from 'next/image';
import Link from 'next/link';
import LazyVideo from '@/components/LazyVideo';
import { getFeaturedProjects, getHomePageData, getContactPageData } from '@/lib/markdown';
import { getOptimizedPath, isImagePath, isVideoPath } from '@/lib/getOptimizedPath';
import type { ProjectData } from '@/lib/types';
import Letters from '@/components/motion/Letters';

// Staggered layout, repeating every three projects:
// large on the left, smaller and lower on the right, then wide in the middle
const POSITIONS = [
  'md:col-start-1 md:col-end-8',
  'md:col-start-9 md:col-end-13 md:mt-12',
  'md:col-start-3 md:col-end-11',
];
const DEFAULT_RATIOS: Array<NonNullable<ProjectData['homeRatio']>> = ['1/1', '4/5', '16/9'];

function Thumb({ project, ratio, priority }: { project: ProjectData; ratio: string; priority: boolean }) {
  const src = project.homeThumbnail || project.featuredVideo || project.featuredImage;
  if (!src) return null;
  const style = { aspectRatio: ratio };
  if (isVideoPath(src)) {
    return (
      <div className="w-full overflow-hidden rounded-md bg-neutral-100" style={style}>
        <LazyVideo src={src} priority={priority} className="w-full h-full object-cover" />
      </div>
    );
  }
  const optimized = isImagePath(src) ? getOptimizedPath(src) : src;
  return (
    <div className="relative w-full overflow-hidden rounded-md bg-neutral-100" style={style}>
      <Image
        src={optimized}
        alt={project.title}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}

export default function Home() {
  const home = getHomePageData();
  const contact = getContactPageData();
  const projects = getFeaturedProjects();
  const count = String(projects.length).padStart(2, '0');

  return (
    <div className="w-full">
      {/* Name */}
      <section className="pt-[7vh] md:pt-[9vh]">
        <h1 className="font-normal leading-[0.86] tracking-[-0.045em] text-[20vw] md:text-[17.2vw] md:whitespace-nowrap">
          <Letters text={home.name || 'Francis Xavier'} once />
        </h1>
      </section>

      {/* Role · intro · availability */}
      <section data-reveal className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-5 md:gap-8 pt-7 md:pt-10">
        {home.role && <p className="label">{home.role}</p>}
        <p className="text-[22px] md:text-[28px] leading-[1.25] tracking-[-0.01em] max-w-[620px]">
          {home.introText}
        </p>
        <div className="label md:justify-self-end md:text-right">
          {home.availability && (
            <p>
              <span className="inline-block w-2 h-2 rounded-full bg-[#2bb24c] mr-2 align-[1px]" aria-hidden="true" />
              {home.availability}
            </p>
          )}
          <a href={`mailto:${contact.email}`} className="hover:opacity-60 transition-opacity">
            {contact.email}
          </a>
        </div>
      </section>

      {/* Selected work */}
      {projects.length > 0 && (
        <section id="work" className="pt-16 md:pt-28 scroll-mt-20">
          <div data-reveal="line" className="label flex justify-between border-t border-gray-200 pt-3.5 mb-6">
            <span>{home.featuredProjectsHeading || 'Selected work'}</span>
            <span>({count})</span>
          </div>
          <div className="flex flex-col gap-9 md:grid md:grid-cols-12 md:gap-x-5 md:gap-y-20 md:items-start">
            {projects.map((project, index) => {
              const ratio = project.homeRatio || DEFAULT_RATIOS[index % 3];
              const tags = project.homeTags?.length ? project.homeTags : project.services ?? [];
              return (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  data-reveal="media"
                  className={`group block ${POSITIONS[index % 3]}`}
                >
                  <h2 className="text-xl font-medium tracking-[-0.01em] mb-3">{project.title}</h2>
                  <div className="transition-opacity group-hover:opacity-90">
                    <Thumb project={project} ratio={ratio} priority={index < 2} />
                  </div>
                  <div className="label flex justify-between gap-4 mt-3 text-gray-500">
                    <span>{tags.join(' · ')}</span>
                    <span>{project.year}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

    </div>
  );
}
