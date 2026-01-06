import { getProjectData, getMarkdownContent, getAllProjects } from '@/lib/markdown';
import { notFound } from 'next/navigation';
import ProjectGallery from '@/components/ProjectGallery';
import ExpandableSummary from '@/components/ExpandableSummary';
import HeroMedia from '@/components/HeroMedia';

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
  
  const mainSummaryHtml = await getMarkdownContent(projectData.mainSummary || '');
  
  // Sort gallery blocks by order
  const sortedBlocks = projectData.galleryBlocks 
    ? [...projectData.galleryBlocks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : [];

  return (
    <article className="bg-background px-4 md:px-6 min-h-screen">
      {/* Hero Section - Uses LazyVideo for optimized loading */}
      <div className="w-full">
        <HeroMedia
          video={projectData.featuredVideo}
          videoMobile={projectData.featuredVideoMobile}
          image={projectData.featuredImage}
          imageMobile={projectData.featuredImageMobile}
          title={projectData.title}
        />
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