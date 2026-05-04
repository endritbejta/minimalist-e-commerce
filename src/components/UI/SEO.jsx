import { Helmet } from 'react-helmet-async';

/**
 * SEO Component
 * Dynamically injects meta tags into the document head for search engine optimization and social sharing.
 * @param {Object} props - Component props.
 * @param {string} props.title - The title of the page.
 * @param {string} props.description - A short summary of the page content.
 * @param {string} [props.keywords] - Comma-separated SEO keywords.
 * @param {string} [props.image] - URL for the Open Graph image.
 * @param {string} [props.url] - Canonical URL for the page.
 * @param {string} [props.type='website'] - Open Graph content type.
 */
const SEO = ({ 
  title, 
  description, 
  keywords, 
  image = '/og-image.jpg', 
  url = window.location.href, 
  type = 'website' 
}) => {
  const siteName = 'Minimalist Essentials';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{fullTitle}</title>
      <meta name='description' content={description} />
      {keywords && <meta name='keywords' content={keywords} />}
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;
