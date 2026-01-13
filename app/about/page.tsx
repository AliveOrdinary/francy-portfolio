import Image from 'next/image';
import { getAboutPageData, getContactPageData } from '../../lib/markdown';

export default function About() {
  const aboutData = getAboutPageData();
  const contactData = getContactPageData();
  
  return (
    <div className="min-h-screen bg-white px-4 md:px-6">
      {/* Hero Section */}
      <div className="relative w-full ">
        {aboutData.profileImage && (
          <Image
            src={aboutData.profileImage}
            alt="Francis Xavier"
            width={1200}
            height={800}
            className="w-full h-auto rounded-2xl"
            sizes="100vw"
            priority
          />
        )}
      </div>
      
      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">
        {/* Bio */}
        {aboutData.bio && (
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-8 mb-12">
            <h2 className="text-base font-medium"></h2>
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
        <div className="border-t border-gray-200 my-12"></div>
        
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
        <div className="border-t border-gray-200 my-12"></div>
        
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