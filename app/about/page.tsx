import Image from 'next/image';
import { getAboutPageData, getContactPageData, getMarkdownContent } from '../../lib/markdown';
import { getOptimizedPath, isImagePath } from '@/lib/getOptimizedPath';
import type { ExperienceItem, EducationItem } from '@/lib/types';

const sectionGrid = 'grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-8 mb-12';

function ExperienceEntry({ item }: { item: ExperienceItem | string }) {
  if (typeof item === 'string') {
    return <p className="text-xl leading-relaxed text-gray-700">{item}</p>;
  }
  return (
    <div>
      <p className="text-xl leading-relaxed text-gray-900">
        {item.url ? (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 hover:opacity-70 transition-opacity"
          >
            {item.organisation}
          </a>
        ) : (
          <span className="font-medium">{item.organisation}</span>
        )}
        {item.location && <span className="text-gray-500">, {item.location}</span>}
      </p>
      <p className="text-lg text-gray-700">
        {item.role}
        {item.years && <span className="text-gray-500"> · {item.years}</span>}
      </p>
      {item.description && (
        <p className="text-lg leading-relaxed text-gray-600 mt-1">{item.description}</p>
      )}
    </div>
  );
}

function EducationEntry({ item }: { item: EducationItem }) {
  return (
    <div>
      <p className="text-xl leading-relaxed text-gray-900 font-medium">{item.qualification}</p>
      <p className="text-lg text-gray-700">
        {item.school}
        {item.location && `, ${item.location}`}
        {item.year && <span className="text-gray-500"> · {item.year}</span>}
      </p>
    </div>
  );
}

export default async function About() {
  const aboutData = getAboutPageData();
  const contactData = getContactPageData();
  const bioHtml = aboutData.bio ? await getMarkdownContent(aboutData.bio.trim()) : '';
  
  // Optimize image paths
  const optimizedProfileImage = isImagePath(aboutData.profileImage) 
    ? getOptimizedPath(aboutData.profileImage) 
    : aboutData.profileImage;
    
  // Check if mobile image exists and optimize it
  const hasMobileImage = !!aboutData.profileImageMobile;
  const optimizedMobileImage = hasMobileImage && aboutData.profileImageMobile && isImagePath(aboutData.profileImageMobile)
    ? getOptimizedPath(aboutData.profileImageMobile)
    : aboutData.profileImageMobile;

  const whatIDo = aboutData.whatIDo;

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative w-full">
        {aboutData.profileImage && (
          <div className="relative w-full h-auto rounded-2xl overflow-hidden">
             {hasMobileImage ? (
               <picture>
                 <source media="(max-width: 768px)" srcSet={optimizedMobileImage as string} />
                 <Image
                   src={optimizedProfileImage}
                   alt="Francis Xavier"
                   width={1200}
                   height={800}
                   className="w-full h-auto object-cover"
                   sizes="100vw"
                   priority
                 />
               </picture>
             ) : (
               <Image
                 src={optimizedProfileImage}
                 alt="Francis Xavier"
                 width={1200}
                 height={800}
                 className="w-full h-auto object-cover"
                 sizes="100vw"
                 priority
               />
             )}
             
             {/* Mobile Overlay - only visible on mobile */}
             {aboutData.mobileOverlay && (
               <div className="absolute left-[10%] bottom-[10%] w-1/2 h-auto md:hidden pointer-events-none">
                 <Image
                   src={aboutData.mobileOverlay}
                   alt=""
                   width={400}
                   height={200}
                   className="w-full h-auto object-contain"
                   sizes="50vw"
                   priority
                 />
               </div>
             )}
          </div>
        )}
      </div>
      
      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">
        {/* Bio */}
        {bioHtml && (
          <div className={sectionGrid}>
            <div aria-hidden="true" />
            <div
              className="project-summary text-xl leading-relaxed text-gray-700"
              dangerouslySetInnerHTML={{ __html: bioHtml }}
            />
          </div>
        )}
        
        {/* What I Do Section */}
        {whatIDo && whatIDo.length > 0 && (
          <div className={sectionGrid}>
            <h2 className="text-xl font-medium">What I do</h2>
            {Array.isArray(whatIDo) ? (
              <ul className="space-y-1">
                {whatIDo.map((line, index) => (
                  <li key={index} className="text-xl leading-relaxed text-gray-700">{line}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xl leading-relaxed text-gray-700">{whatIDo}</p>
            )}
          </div>
        )}
        
        {/* Where I've Been Section */}
        {aboutData.experience && aboutData.experience.length > 0 && (
          <div className={sectionGrid}>
            <h2 className="text-xl font-medium">Experience</h2>
            <div className="space-y-6">
              {aboutData.experience.map((item, index) => (
                <ExperienceEntry key={index} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* Education Section */}
        {aboutData.education && aboutData.education.length > 0 && (
          <div className={sectionGrid}>
            <h2 className="text-xl font-medium">Education</h2>
            <div className="space-y-6">
              {aboutData.education.map((item, index) => (
                <EducationEntry key={index} item={item} />
              ))}
            </div>
          </div>
        )}
        
        {/* Divider */}
        <div className="border-t border-gray-200 my-12" />
        
        {/* Contact Section */}
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-8 mb-12">
          <h2 className="text-xl font-medium">Contact</h2>
          <div className="space-y-2">
            <a 
              href={`mailto:${contactData.email}`} 
              className="block text-xl text-gray-700 hover:text-black transition-colors"
            >
              {contactData.email}
            </a>
            {contactData.phone && (
              <a 
                href={`tel:${contactData.phone.replace(/\s/g, '')}`}
                className="block text-xl text-gray-700 hover:text-black transition-colors"
              >
                {contactData.phone}
              </a>
            )}
          </div>
        </div>
        
        {/* Divider */}
        <div className="border-t border-gray-200 my-12" />
        
        {/* Social Section */}
        {contactData.socialMedia && contactData.socialMedia.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-8">
            <h2 className="text-xl font-medium">Social</h2>
            <div className="space-y-2">
              {contactData.socialMedia.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-xl text-gray-700 hover:text-black transition-colors"
                >
                  {social.platform}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}