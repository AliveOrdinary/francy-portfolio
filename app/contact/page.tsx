import { getContactPageData, getGlobalData, getHomePageData } from '../../lib/markdown';
import Letters from '@/components/motion/Letters';

export const metadata = {
  title: 'Contact · Francis Xavier',
};

export default function Contact() {
  const contactData = getContactPageData();
  const global = getGlobalData();
  const home = getHomePageData();
  const links = global.headerLinks ?? [];

  return (
    <div className="w-full">
      <div className="label flex justify-between pt-8 md:pt-10">
        <span>Contact</span>
        {/* The header already shows the location on desktop */}
        <span className="md:hidden">{global.location}</span>
      </div>

      {/* Email, large */}
      <a
        href={`mailto:${contactData.email}`}
        className="block mt-4 text-[8.6vw] md:text-[8.4vw] leading-[0.95] tracking-[-0.045em] break-all hover:opacity-60 transition-opacity"
      >
        <Letters text={contactData.email} delay={0.1} />
      </a>

      <section data-reveal style={{ '--i': 8 } as React.CSSProperties} className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-5 md:gap-8 pt-8 md:pt-12">
        <div className="label">
          {home.availability && (
            <p>
              <span className="inline-block w-2 h-2 rounded-full bg-[#2bb24c] mr-2 align-[1px]" aria-hidden="true" />
              {home.availability}
            </p>
          )}
        </div>
        {contactData.intro && (
          <p className="text-[22px] md:text-[28px] leading-[1.25] tracking-[-0.01em] max-w-[640px]">
            {contactData.intro}
          </p>
        )}
        <dl className="label grid grid-cols-[auto_1fr] gap-x-4 gap-y-2.5 content-start md:justify-self-end">
          <dt className="text-gray-500">Email</dt>
          <dd><a href={`mailto:${contactData.email}`} className="hover:opacity-60">{contactData.email}</a></dd>
          {contactData.phone && (
            <>
              <dt className="text-gray-500">Phone</dt>
              <dd><a href={`tel:${contactData.phone.replace(/\s/g, '')}`} className="hover:opacity-60">{contactData.phone}</a></dd>
            </>
          )}
          {links.map((link) => (
            <div key={link.url} className="contents">
              <dt className="text-gray-500">{link.text}</dt>
              <dd>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:opacity-60">
                  {link.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                </a>
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
