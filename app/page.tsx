import ProjectCard from '@/components/ui/ProjectCard';
import { getFeaturedProjects } from '@/lib/markdown';

export default function Home() {
  const featuredProjects = getFeaturedProjects();
  
  return (
    <div className="w-full px-6"> 
      {/* Projects Grid */}
      {featuredProjects.length > 0 && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 pb-20">
          {featuredProjects.map((project, index) => (
            <div 
              key={project.slug} 
              className={`${index % 3 === 0 ? 'md:col-span-2' : 'md:col-span-1'}`}
            >
              <ProjectCard
                title={project.title}
                slug={project.slug}
                category={project.category as string | undefined}
                image={project.featuredImage}
                video={project.featuredVideo}
                priority={index < 2}
              />
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
