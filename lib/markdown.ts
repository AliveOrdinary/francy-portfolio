import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { 
  GlobalData, 
  ProjectData, 
  HomePageData, 
  AboutPageData, 
  ContactPageData 
} from './types';

const contentDirectory = path.join(process.cwd(), 'content');

/**
 * Get global site data from markdown file
 */
export function getGlobalData(): GlobalData {
  try {
    const fullPath = path.join(contentDirectory, 'global/info.md');
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);
    
    return data as GlobalData;
  } catch (error) {
    console.error('Error reading global data:', error);
    throw new Error('Failed to load global data');
  }
}

/**
 * Get page data from markdown file
 */
export function getPageData(pageName: string): HomePageData | AboutPageData | ContactPageData {
  try {
    const fullPath = path.join(contentDirectory, `pages/${pageName}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      ...data,
      content
    } as HomePageData | AboutPageData | ContactPageData;
  } catch (error) {
    console.error(`Error reading page data for ${pageName}:`, error);
    throw new Error(`Failed to load page data for ${pageName}`);
  }
}

/**
 * Get home page specific data
 */
export function getHomePageData(): HomePageData {
  return getPageData('home') as HomePageData;
}

/**
 * Get about page specific data
 */
export function getAboutPageData(): AboutPageData {
  return getPageData('about') as AboutPageData;
}

/**
 * Get contact page specific data
 */
export function getContactPageData(): ContactPageData {
  return getPageData('contact') as ContactPageData;
}

/**
 * Convert markdown content to HTML
 */
export async function getMarkdownContent(content: string): Promise<string> {
  try {
    const processedContent = await remark()
      .use(html)
      .process(content);
    
    return processedContent.toString();
  } catch (error) {
    console.error('Error processing markdown content:', error);
    throw new Error('Failed to process markdown content');
  }
}

/**
 * Get all projects sorted by order
 */
export function getAllProjects(): ProjectData[] {
  try {
    const projectsDirectory = path.join(contentDirectory, 'projects');
    
    if (!fs.existsSync(projectsDirectory)) {
      console.warn('Projects directory does not exist');
      return [];
    }
    
    const fileNames = fs.readdirSync(projectsDirectory).filter(name => name.endsWith('.md'));
    
    const allProjectsData = fileNames.map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(projectsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      
      return {
        slug,
        ...data
      } as ProjectData;
    });
    
    // Sort by order field
    return allProjectsData.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  } catch (error) {
    console.error('Error reading projects:', error);
    return [];
  }
}

/**
 * Get specific project data by slug
 */
export function getProjectData(slug: string): ProjectData {
  try {
    const fullPath = path.join(contentDirectory, `projects/${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      slug,
      content,
      ...data
    } as ProjectData;
  } catch (error) {
    console.error(`Error reading project data for ${slug}:`, error);
    throw new Error(`Failed to load project data for ${slug}`);
  }
}

/**
 * Get only featured projects
 */
export function getFeaturedProjects(): ProjectData[] {
  const allProjects = getAllProjects();
  return allProjects.filter(project => project.featured);
}

/**
 * Get projects by category
 */
export function getProjectsByCategory(category: 'Branding' | 'Photography' | 'Illustration'): ProjectData[] {
  const allProjects = getAllProjects();
  return allProjects.filter(project => {
    // Default to 'Branding' for existing projects without category field
    const projectCategory = project.category || 'Branding';
    return projectCategory === category;
  });
} 