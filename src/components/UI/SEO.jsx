import { useLocation } from 'react-router-dom';
import { SITE, toAbsoluteUrl } from '../../lib/site';

/**
 * SEO Component
 * Declares the document metadata for a page.
 *
 * React 19 hoists `<title>`, `<meta>` and `<link>` into the document head on
 * its own, so this needs no third-party helmet library or provider.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.title] - Page title, prefixed to the site name.
 * @param {string} [props.description] - Short summary of the page.
 * @param {string} [props.keywords] - Comma-separated SEO keywords.
 * @param {string} [props.image] - Open Graph image; relative paths are made absolute.
 * @param {string} [props.type='website'] - Open Graph content type.
 * @param {boolean} [props.noindex=false] - Ask crawlers to skip this page.
 */
const SEO = ({
  title,
  description = SITE.description,
  keywords,
  image = SITE.defaultImage,
  type = 'website',
  noindex = false,
}) => {
  const { pathname } = useLocation();

  // Canonicals come from the route, not window.location, so query strings and
  // hashes cannot fragment a page into several canonical URLs.
  const url = toAbsoluteUrl(pathname);
  const absoluteImage = toAbsoluteUrl(image);
  const fullTitle = title ? `${title} | ${SITE.name}` : `${SITE.name} | ${SITE.tagline}`;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noindex && <meta name="robots" content="noindex, follow" />}
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={SITE.name} />
      {absoluteImage && <meta property="og:image" content={absoluteImage} />}

      {/* Twitter */}
      <meta name="twitter:card" content={absoluteImage ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {absoluteImage && <meta name="twitter:image" content={absoluteImage} />}
    </>
  );
};

export default SEO;
