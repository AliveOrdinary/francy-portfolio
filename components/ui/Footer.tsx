import { getContactPageData, getHomePageData } from '@/lib/markdown';

/**
 * Site-wide footer. On desktop it sits on the same line as the floating
 * nav pill (pill: bottom 24px, ~44px tall, so its centre is ~46px up).
 * On phones it stacks above the pill.
 */
export default function Footer() {
  const home = getHomePageData();
  const contact = getContactPageData();
  return (
    <footer className="label flex flex-col md:flex-row md:justify-between gap-1.5 text-gray-500 px-4 md:px-6 pt-20 md:pt-28 pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-[37px]">
      <span>© {new Date().getFullYear()} {home.name || 'Francis Xavier'}</span>
      <a href={`mailto:${contact.email}`} className="hover:text-foreground transition-colors">{contact.email}</a>
    </footer>
  );
}
