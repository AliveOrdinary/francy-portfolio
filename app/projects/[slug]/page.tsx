import { getProjectData, getMarkdownContent, getAllProjects } from '@/lib/markdown';
import { notFound } from 'next/navigation';
import ProjectGallery from '@/components/ProjectGallery';
import HeroMedia from '@/components/HeroMedia';
import Link from 'next/link';
import Image from 'next/image';
import LazyVideo from '@/components/LazyVideo';
import type { Metadata } from 'next';
import { getOptimizedPath, isImagePath, isVideoPath } from '@/lib/getOptimizedPath';
import type { ProjectData } from '@/lib/types';
import Letters from '@/components/motion/Letters';

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  try {
    const project = getProjectData(slug);
    return {
      title: `${project.title} · Francis Xavier`,
      description: project.summary?.trim(),
    };
  } catch {
    return {};
  }
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <dt className="text-gray-500">{label}</dt>
      <dd>{children}</dd>
    </>
  );
}

function NextThumb({ project }: { project: ProjectData }) {
  const src = project.homeThumbnail || project.featuredImage || project.featuredVideo;
  if (!src) return null;
  if (isVideoPath(src)) {
    return (
      <div className="w-full aspect-[4/5] overflow-hidden rounded-md bg-neutral-100">
        <LazyVideo src={src} className="w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div className="relative w-full aspect-[4/5] overflow-hidden rounded-md bg-neutral-100">
      <Image src={isImagePath(src) ? getOptimizedPath(src) : src} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
    </div>
  );
}

/**
 * Generate static params for all projects at build time
 * Returns a placeholder when no projects exist to prevent build failures with output: export
 */
export function generateStaticParams() {
  const projects = getAllProjects();
  
  // If no projects exist, return a placeholder to prevent build failure
  // The page component will handle showing a "not found" state
  if (projects.length === 0) {
    return [{ slug: '_placeholder' }];
  }
  
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function Project(
  props: {
    params: Promise<{ slug: string }>;
  }
) {
  const params = await props.params;
  const { slug } = params;
  
  // Handle placeholder slug - show 404
  if (slug === '_placeholder') {
    notFound();
  }
  
  // Try to get project data, show 404 if not found
  let projectData;
  try {
    projectData = getProjectData(slug);
  } catch {
    notFound();
  }
  
  const allProjects = getAllProjects();
  const position = allProjects.findIndex((p) => p.slug === projectData.slug);
  const nextProject = allProjects.length > 1 ? allProjects[(position + 1) % allProjects.length] : undefined;
  const pad = (n: number) => String(n).padStart(2, '0');
  
  // Sort gallery blocks by order, and render markdown for text sections
  const sortedBlocks = projectData.galleryBlocks 
    ? await Promise.all(
        [...projectData.galleryBlocks]
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map(async (block) =>
            block.type === 'text' && block.body
              ? { ...block, bodyHtml: await getMarkdownContent(block.body) }
              : block
          )
      )
    : [];

  return (
    <article className="bg-background">
      {/* Title */}
      <div className="label flex justify-between pt-8 md:pt-10">
        <span>Work / {pad(position + 1)}</span>
        <span>{projectData.year}</span>
      </div>
      <h1 className="font-normal text-[15vw] md:text-[11vw] leading-[0.9] tracking-[-0.045em] mt-4 mb-6 md:mb-8">
        <Letters text={projectData.title} />
      </h1>

      {/* Hero */}
      <div data-reveal="media" className="w-full">
        <HeroMedia
          video={projectData.featuredVideo}
          videoMobile={projectData.featuredVideoMobile}
          image={projectData.featuredImage}
          imageMobile={projectData.featuredImageMobile}
          title={projectData.title}
        />
      </div>

      {/* Details · summary · services and role */}
      <section data-reveal className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-6 md:gap-8 pt-8 md:pt-12">
        <dl className="label grid grid-cols-[auto_1fr] gap-x-4 gap-y-2.5 content-start">
          {projectData.client && <Detail label="Client">{projectData.client}</Detail>}
          {projectData.industry && <Detail label="Industry">{projectData.industry}</Detail>}
          {projectData.studio && (
            <Detail label="Studio">
              {projectData.studioUrl ? (
                <a href={projectData.studioUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-[3px] hover:opacity-60">
                  {projectData.studio}
                </a>
              ) : (
                projectData.studio
              )}
            </Detail>
          )}
          <Detail label="Year">{projectData.year}</Detail>
        </dl>
        {projectData.summary && (
          <p className="text-[22px] md:text-[28px] leading-[1.25] tracking-[-0.01em] max-w-[640px]">
            {projectData.summary.trim()}
          </p>
        )}
        <dl className="label grid grid-cols-[auto_1fr] gap-x-4 gap-y-2.5 content-start">
          {projectData.services && projectData.services.length > 0 && (
            <Detail label="Services">
              {projectData.services.map((service) => <span key={service} className="block">{service}</span>)}
            </Detail>
          )}
          {projectData.role && <Detail label="Role">{projectData.role}</Detail>}
          {projectData.credits?.map((credit) => (
            <Detail key={credit.label} label={credit.label}>{credit.value}</Detail>
          ))}
        </dl>
      </section>

      {/* Gallery */}
      <div className="w-full">
        <ProjectGallery blocks={sortedBlocks} projectTitle={projectData.title} />
      </div>

      {/* Next project */}
      {nextProject && (
        <section className="pt-24 md:pt-36">
          <div data-reveal="line" className="label flex justify-between border-t border-gray-200 pt-3.5 mb-6">
            <span>Next project</span>
            <span>{pad(((position + 1) % allProjects.length) + 1)} / {pad(allProjects.length)}</span>
          </div>
          <Link
            href={`/projects/${nextProject.slug}`}
            data-reveal="media"
            className="group grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6 md:gap-8 items-end"
          >
            <div>
              <p className="label text-gray-500 mb-3.5">
                {[...(nextProject.homeTags?.length ? nextProject.homeTags : nextProject.services ?? []), nextProject.year].join(' · ')}
              </p>
              <p className="text-[15vw] md:text-[9vw] leading-[0.9] tracking-[-0.045em] group-hover:opacity-70 transition-opacity">
                {nextProject.title} <span aria-hidden="true">→</span>
              </p>
            </div>
            <NextThumb project={nextProject} />
          </Link>
        </section>
      )}
    </article>
  );
}
