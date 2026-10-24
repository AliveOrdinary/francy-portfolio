import Image from 'next/image';
import { getAboutPageData, getContactPageData, getGlobalData, getHomePageData, getMarkdownContent } from '../../lib/markdown';
import { getOptimizedPath, isImagePath } from '@/lib/getOptimizedPath';
import type { ExperienceItem, EducationItem } from '@/lib/types';
import type { CSSProperties } from 'react';

const row = 'grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-1 md:gap-8 py-5 md:py-6 border-b border-gray-100 items-baseline';

function SectionLabel({ title, count }: { title: string; count?: number }) {
  return (
    <div data-reveal="line" className="label flex justify-between border-t border-gray-200 pt-3.5 mb-2">
      <span>{title}</span>
      {count ? <span>({String(count).padStart(2, '0')})</span> : <span />}
    </div>
  );
}

function ExperienceRow({ item }: { item: ExperienceItem | string }) {
  if (typeof item === 'string') {
    return <div data-reveal="row" className={row}><span /><p className="text-xl md:text-2xl">{item}</p><span /></div>;
  }
  const detail = [item.location, item.description].filter(Boolean).join(' · ');
  return (
    <div data-reveal="row" className={row}>
      <span className="text-base text-gray-500">{item.years}</span>
      <div>
        <p className="text-xl md:text-2xl leading-tight tracking-[-0.01em]">
          {item.url ? (
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-[5px] hover:opacity-60 transition-opacity">
              {item.organisation}
            </a>
          ) : (
            item.organisation
          )}
        </p>
        {detail && <p className="text-base leading-relaxed text-gray-500 mt-1.5 max-w-[560px]">{detail}</p>}
      </div>
      <span className="label md:justify-self-end md:text-right mt-1.5 md:mt-0">{item.role}</span>
    </div>
  );
}

function EducationRow({ item }: { item: EducationItem }) {
  return (
    <div data-reveal="row" className={row}>
      <span className="text-base text-gray-500">{item.year}</span>
      <div>
        <p className="text-xl md:text-2xl leading-tight tracking-[-0.01em]">{item.qualification}</p>
        <p className="text-base text-gray-500 mt-1.5">
          {item.school}
          {item.location && `, ${item.location}`}
        </p>
      </div>
      <span />
    </div>
  );
}

export default async function About() {
  const aboutData = getAboutPageData();
  const contactData = getContactPageData();
  const home = getHomePageData();
  const global = getGlobalData();

  // First paragraph of the bio is the large lead; the rest is body text
  const paragraphs = (aboutData.bio || '').trim().split(/\n\s*\n/);
  const lead = paragraphs[0] || '';
  const restHtml = paragraphs.length > 1 ? await getMarkdownContent(paragraphs.slice(1).join('\n\n')) : '';

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
  const services = Array.isArray(whatIDo) ? whatIDo : whatIDo ? [whatIDo] : [];
  const contactLinks = global.headerLinks ?? [];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative w-full">
        {aboutData.profileImage && (
          <div data-reveal="media" className="relative w-full h-auto rounded-2xl overflow-hidden">
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
      
      {/* Intro */}
      <section data-reveal className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-4 md:gap-8 pt-8 md:pt-14">
        <p className="label">About</p>
        <div className="max-w-[640px]">
          <p className="text-[22px] md:text-[28px] leading-[1.25] tracking-[-0.01em] mb-5">{lead}</p>
          {restHtml && (
            <div
              className="project-summary text-lg leading-relaxed text-gray-600"
              dangerouslySetInnerHTML={{ __html: restHtml }}
            />
          )}
        </div>
        <div className="label md:justify-self-end md:text-right">
          {home.availability && (
            <p>
              <span className="inline-block w-2 h-2 rounded-full bg-[#2bb24c] mr-2 align-[1px]" aria-hidden="true" />
              {home.availability}
            </p>
          )}
          {global.location && <p>{global.location}</p>}
        </div>
      </section>

      {/* What I do */}
      {services.length > 0 && (
        <section className="pt-16 md:pt-24">
          <SectionLabel title="What I do" count={services.length} />
          <ul className="grid grid-cols-1 md:grid-cols-4 gap-1.5 md:gap-5 pt-3">
            {services.map((line, index) => (
              <li key={index} data-reveal style={{ '--i': index } as CSSProperties} className="text-xl md:text-[22px] leading-tight tracking-[-0.01em]">{line}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Experience */}
      {aboutData.experience && aboutData.experience.length > 0 && (
        <section className="pt-16 md:pt-24">
          <SectionLabel title="Experience" count={aboutData.experience.length} />
          {aboutData.experience.map((item, index) => <ExperienceRow key={index} item={item} />)}
        </section>
      )}

      {/* Education */}
      {aboutData.education && aboutData.education.length > 0 && (
        <section className="pt-16 md:pt-24">
          <SectionLabel title="Education" count={aboutData.education.length} />
          {aboutData.education.map((item, index) => <EducationRow key={index} item={item} />)}
        </section>
      )}

      {/* Contact */}
      <section className="pt-16 md:pt-24">
        <SectionLabel title="Contact" />
        <a
          href={`mailto:${contactData.email}`}
          data-reveal
          className="block pt-4 text-[9vw] md:text-[6vw] leading-none tracking-[-0.035em] hover:opacity-60 transition-opacity break-all"
        >
          {contactData.email}
        </a>
        <p className="label mt-3 flex flex-wrap gap-x-2">
          {contactData.phone && (
            <a href={`tel:${contactData.phone.replace(/\s/g, '')}`} className="hover:opacity-60">{contactData.phone}</a>
          )}
          {contactLinks.map((link) => (
            <span key={link.url}>
              <span aria-hidden="true">· </span>
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:opacity-60">{link.text}</a>
            </span>
          ))}
        </p>
      </section>
    </div>
  );
}
