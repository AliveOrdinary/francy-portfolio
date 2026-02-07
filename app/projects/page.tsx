import ProjectCard from '@/components/ui/ProjectCard';
import { getAllProjects } from '../../lib/markdown';

export default function Projects() {
  const allProjects = getAllProjects();
  
  return (
    <div className="w-full py-8 md:py-12 min-h-screen">
      {allProjects.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {allProjects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              title={project.title}
              slug={project.slug}
              category={project.category as string | undefined}
              image={project.featuredImage}
              video={project.featuredVideo}
              priority={index < 4}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">No projects found.</p>
        </div>
      )}
    </div>
  );
}