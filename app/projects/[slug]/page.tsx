import { getProjectData, getMarkdownContent, getAllProjects } from '@/lib/markdown';
import { ProjectData, ProjectImageItem, ProjectVideoItem, ProjectMediaItem } from '@/lib/types';
import Image from 'next/image';
import ProjectGallery from '@/components/ProjectGallery';

/**
 * Combines and sorts project images and videos into a unified media array
 */
function combineAndSortMedia(projectData: ProjectData): ProjectMediaItem[] { 
  const combinedMedia: ProjectMediaItem[] = [];
  
  if (projectData.projectImages?.length) {
    projectData.projectImages.forEach((item: ProjectImageItem, index: number) => {
      combinedMedia.push({
        type: 'image',
        src: item.image,
        caption: item.caption,
        order: item.order ?? index + 1 
      });
    });
  }
  
  if (projectData.projectVideos?.length) {
    projectData.projectVideos.forEach((item: ProjectVideoItem, index: number) => {
      combinedMedia.push({
        type: 'video',
        src: item.video,
        caption: item.caption,
        hasAudio: item.hasAudio ?? false, 
        order: item.order ?? (projectData.projectImages?.length ?? 0) + index + 1 
      });
    });
  }
  
  return combinedMedia.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

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
  
  const sortedMedia = combineAndSortMedia(projectData);

  return (
    <article className="bg-background px-6 md:px-8 min-h-screen">
      {/* Hero Section */}
      <div className="w-full">
        <div className="w-full h-[60vh] md:h-[80vh] relative overflow-hidden rounded-2xl">
          {projectData.featuredVideo ? (
            <video
              src={projectData.featuredVideo}
              autoPlay
              muted
              loop
              playsInline
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
          
          {/* Title Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <h1 className="text-5xl md:text-8xl font-display font-black text-white uppercase tracking-tighter mix-blend-difference">
              {projectData.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="w-full py-12 md:py-24">
        {/* Project Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
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
          
          <div className="md:col-span-8">
            <div 
              className="prose prose-lg prose-neutral max-w-none font-sans"
              dangerouslySetInnerHTML={{ __html: mainSummaryHtml }}
            />
          </div>
        </div>

        {/* Gallery */}
        <ProjectGallery media={sortedMedia} projectTitle={projectData.title} />
      </div>
    </article>
  );
} 