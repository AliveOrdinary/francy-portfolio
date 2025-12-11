import Link from 'next/link';
import { getContactPageData } from '../../lib/markdown';

export default function Contact() {
  const contactData = getContactPageData();
  
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="max-w-2xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-display font-medium mb-6">Get in Touch</h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            I&apos;m always open to discussing new projects, creative ideas or opportunities to be part of your vision.
          </p>
        </div>
        
        <div className="space-y-12">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-gray-500">Contact Information</h3>
            <ul className="space-y-4">
              <li className="flex flex-col">
                <span className="text-sm text-gray-500 mb-1">Email</span>
                <a 
                  href={`mailto:${contactData.email}`} 
                  className="text-2xl md:text-3xl font-display hover:text-primary transition-colors"
                >
                  {contactData.email}
                </a>
              </li>
              {contactData.phone && (
                <li className="flex flex-col">
                  <span className="text-sm text-gray-500 mb-1">Phone</span>
                  <a 
                    href={`tel:${contactData.phone}`} 
                    className="text-2xl md:text-3xl font-display hover:text-primary transition-colors"
                  >
                    {contactData.phone}
                  </a>
                </li>
              )}
            </ul>
          </div>
          
          {contactData.socialMedia && contactData.socialMedia.length > 0 && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-gray-500">Connect with Me</h3>
              <ul className="flex flex-wrap gap-4">
                {contactData.socialMedia.map((social, index) => (
                  <li key={index}>
                    <Link
                      href={social.url}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block px-6 py-3 bg-white border border-gray-200 rounded-full hover:border-primary hover:text-primary transition-all"
                    >
                      {social.platform}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 