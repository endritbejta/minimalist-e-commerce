/**
 * Generates public/sitemap.xml from the catalog.
 *
 * robots.txt advertises a sitemap, so one has to exist — and generating it
 * from the product data means it cannot drift as the catalog changes.
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { products } from '../src/data/products.js';

const SITE_URL = 'https://endrits-e-commerce.netlify.app';

const STATIC_PATHS = [
  '/',
  '/shipping-policy',
  '/returns-exchanges',
  '/faq',
  '/contact-us',
  '/privacy-policy',
  '/terms-of-service',
];

const collections = ['all', ...new Set(products.map((product) => product.collection))];

const paths = [
  ...STATIC_PATHS,
  ...collections.map((handle) => `/collections/${handle}`),
  ...products.map((product) => `/products/${product.handle}`),
];

const lastmod = new Date().toISOString().split('T')[0];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map(
    (path) => `  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`
  )
  .join('\n')}
</urlset>
`;

const outputPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../public/sitemap.xml'
);

writeFileSync(outputPath, xml);
console.log(`Wrote ${paths.length} URLs to public/sitemap.xml`);
