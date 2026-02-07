import Image from 'next/image';
import { getAboutPageData, getContactPageData } from '../../lib/markdown';
import { getOptimizedPath, isImagePath } from '@/lib/getOptimizedPath';

export default function About() {
  const aboutData = getAboutPageData();
  const contactData = getContactPageData();
  
  // Optimize image paths
  const optimizedProfileImage = isImagePath(aboutData.profileImage) 
    ? getOptimizedPath(aboutData.profileImage) 
    : aboutData.profileImage;
    
  // Check if mobile image exists and optimize it
  const hasMobileImage = !!aboutData.profileImageMobile;
  const optimizedMobileImage = hasMobileImage && aboutData.profileImageMobile && isImagePath(aboutData.profileImageMobile)
    ? getOptimizedPath(aboutData.profileImageMobile)
    : aboutData.profileImageMobile;

  return (
    <div className="min-h-screen bg-white">
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
               <div className="absolute inset-0 md:hidden pointer-events-none">
                 <Image
                   src={aboutData.mobileOverlay}
                   alt=""
                   fill
                   className="object-contain"
                   sizes="100vw"
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
        {aboutData.bio && (
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-8 mb-12">
            <div aria-hidden="true" />
            <p className="text-xl leading-relaxed text-gray-700">
              {aboutData.bio}
            </p>
          </div>
        )}
        
        {/* What I Do Section */}
        {aboutData.whatIDo && (
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-8 mb-12">
            <h2 className="text-xl font-medium">What I do</h2>
            <p className="text-xl leading-relaxed text-gray-700">
              {aboutData.whatIDo}
            </p>
          </div>
        )}
        
        {/* Where I've Been Section */}
        {aboutData.experience && aboutData.experience.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-8 mb-12">
            <h2 className="text-xl font-medium">Where I&apos;ve Been</h2>
            <div className="space-y-4">
              {aboutData.experience.map((item, index) => (
                <p key={index} className="text-xl leading-relaxed text-gray-700">
                  {item}
                </p>
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