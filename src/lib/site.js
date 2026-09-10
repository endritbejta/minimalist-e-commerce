import { BsInstagram, BsTwitter, BsFacebook } from 'react-icons/bs';

/**
 * Site-wide identity and metadata.
 * The brand name previously appeared in four different forms across the header,
 * footer, loader and meta tags; everything now reads from here.
 */
export const SITE = {
  name: 'Minimalist Essentials',
  shortName: 'Minimalist',
  legalName: 'Minimalist Essentials Inc.',
  tagline: 'Quality over quantity, always.',
  description:
    'Curating the finest minimalist tech, accessories, and apparel for your modern lifestyle. Quality over quantity, always.',
  url: 'https://endrits-e-commerce.netlify.app',
  email: 'support@example.com',
  // Used for social cards when a page has no image of its own. Points at a
  // real asset — the previous default was '/og-image.jpg', which did not exist
  // and which the SPA redirect answered with HTML.
  defaultImage:
    'https://images.unsplash.com/photo-1623150502742-6a849aa94be4?q=80&w=1200&auto=format&fit=crop',
};

export const SOCIAL_LINKS = [
  { name: 'Instagram', href: 'https://instagram.com', Icon: BsInstagram },
  { name: 'Twitter', href: 'https://twitter.com', Icon: BsTwitter },
  { name: 'Facebook', href: 'https://facebook.com', Icon: BsFacebook },
];

/**
 * Turns a path or relative URL into an absolute one for canonical and Open
 * Graph tags, which crawlers will not resolve relatively.
 * @param {string} [pathOrUrl] - A path ("/x"), absolute URL, or nothing.
 * @returns {string|undefined} An absolute URL, or undefined when given nothing.
 */
export const toAbsoluteUrl = (pathOrUrl) => {
  if (!pathOrUrl) return undefined;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;

  return `${SITE.url}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
};
