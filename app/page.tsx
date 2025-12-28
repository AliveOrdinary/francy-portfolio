import ProjectCard from '@/components/ui/ProjectCard';
import { getFeaturedProjects } from '@/lib/markdown';

export default function Home() {
  const featuredProjects = getFeaturedProjects();
  
  return (
    <div className="w-full px-6"> 
      {/* Projects Grid */}
      {featuredProjects.length > 0 && (
        <section className="grid grid-cols-1 gap-6 pb-20">
          {featuredProjects.map((project, index) => (
            <div 
              key={project.slug} 
              className="w-full"
            >
              <ProjectCard
                title={project.title}
                slug={project.slug}
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
