import { getProjectData, getMarkdownContent, getAllProjects } from '@/lib/markdown';
import Image from 'next/image';
import ProjectGallery from '@/components/ProjectGallery';
import ExpandableSummary from '@/components/ExpandableSummary';

/**
 * Generate static params for all projects at build time
 */
export function generateStaticParams() {
  const projects = getAllProjects();
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
  
  const projectData = getProjectData(slug);
  const mainSummaryHtml = await getMarkdownContent(projectData.mainSummary || '');
  
  // Sort gallery blocks by order
  const sortedBlocks = projectData.galleryBlocks 
    ? [...projectData.galleryBlocks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : [];

  return (
    <article className="bg-background px-4 md:px-6 min-h-screen">
      {/* Hero Section */}
      <div className="w-full">
        <div className="w-full h-[60vh] md:h-[90vh] relative overflow-hidden rounded-2xl">
          {/* Mobile featured media */}
          {(projectData.featuredVideoMobile || projectData.featuredImageMobile) && (
            <div className="block md:hidden w-full h-full">
              {projectData.featuredVideoMobile ? (
                <video
                  src={projectData.featuredVideoMobile}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover"
                />
              ) : projectData.featuredImageMobile ? (
                <Image
                  src={projectData.featuredImageMobile}
                  alt={projectData.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="100vw"
                />
              ) : null}
            </div>
          )}
          
          {/* Desktop featured media (hidden on mobile if mobile variant exists) */}
          <div className={`${(projectData.featuredVideoMobile || projectData.featuredImageMobile) ? 'hidden md:block' : 'block'} w-full h-full`}>
            {projectData.featuredVideo ? (
              <video
                src={projectData.featuredVideo}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
              />
            ) : projectData.featuredImage ? (
              <Image
                src={projectData.featuredImage}
                alt={projectData.title}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
            ) : null}
          </div>
        </div>
      </div>

      <div className="w-full pt-8 md:pt-16">
        {/* Project Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4 space-y-8">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-2 text-gray-500">Services</h3>
              <div className="text-lg">
                {projectData.services?.map((service, index) => (
                  <div key={index}>{service}</div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-2 text-gray-500">Year</h3>
              <div className="text-lg">{projectData.year}</div>
            </div>
          </div>
          
          {projectData.mainSummary && (
            <div className="md:col-span-8">
              <ExpandableSummary 
                shortSummary={projectData.shortSummary}
                mainSummaryHtml={mainSummaryHtml}
              />
            </div>
          )}
        </div>

        {/* Gallery */}
        <ProjectGallery blocks={sortedBlocks} projectTitle={projectData.title} />
      </div>
    </article>
  );
}