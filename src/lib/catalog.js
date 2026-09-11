/**
 * Catalog access layer.
 * The single place that knows how to look products and collections up.
 * Components should never reach into `data/products` directly — going through
 * here keeps lookups, collection validity and nav links in one source of truth.
 */
import { products } from '../data/products';
import { humanizeSlug } from './format';

export const ALL_COLLECTION_HANDLE = 'all';

/**
 * Every browsable collection, in nav order. Derived from the catalog so a new
 * collection in the data can never end up unreachable from the navigation.
 */
export const COLLECTIONS = [
  { handle: ALL_COLLECTION_HANDLE, title: 'Shop All' },
  ...[...new Set(products.map((product) => product.collection))]
    .filter(Boolean)
    .sort()
    .map((handle) => ({ handle, title: humanizeSlug(handle) })),
];

const collectionsByHandle = new Map(
  COLLECTIONS.map((collection) => [collection.handle, collection])
);

const productsByHandle = new Map(
  products.map((product) => [product.handle, product])
);

/**
 * Looks up a single product by its URL handle.
 * @param {string} handle - The product handle from the route.
 * @returns {Object|undefined} The product, or undefined when no product matches.
 */
export const getProductByHandle = (handle) => productsByHandle.get(handle);

/**
 * Resolves a collection handle to its metadata.
 * @param {string} handle - The collection handle from the route.
 * @returns {{handle: string, title: string}|undefined} The collection, or undefined when unknown.
 */
export const getCollection = (handle) => collectionsByHandle.get(handle);

/**
 * Returns the products in a collection. The reserved "all" handle returns the
 * full catalog.
 * @param {string} handle - The collection handle.
 * @returns {Object[]} Matching products (empty for an unknown handle).
 */
export const getProductsByCollection = (handle) => {
  if (handle === ALL_COLLECTION_HANDLE) return products;
  return products.filter((product) => product.collection === handle);
};

/**
 * The image used for cards, cart lines and social previews.
 * @param {Object} product - A product or variant-flavoured product object.
 * @returns {string|undefined} An absolute image URL, when the product has one.
 */
export const getPrimaryImage = (product) =>
  product?.image || product?.images?.[0];

/**
 * Returns the display price for a product, honouring the selected variant.
 * Uses `??` so a genuinely free variant is not masked by the base price.
 * @param {Object} product - The base product.
 * @param {Object} [variant] - The selected variant, when one is active.
 * @returns {number} The price to display and charge.
 */
export const getDisplayPrice = (product, variant) =>
  variant?.price ?? product?.price ?? 0;

/**
 * Products worth suggesting alongside what is already in the cart.
 *
 * Anything already in the cart is excluded — suggesting what someone has just
 * added is noise — and products sharing a collection with the cart's contents
 * come first, so the row reads as related rather than arbitrary.
 *
 * @param {Object[]} [cartItems=[]] - The current cart lines.
 * @param {number} [limit=8] - Most suggestions to return.
 * @returns {Object[]} Suggested products, related ones first.
 */
export const getRecommendations = (cartItems = [], limit = 8) => {
  const inCart = new Set(cartItems.map((item) => item.id));
  const cartCollections = new Set(
    cartItems.map((item) => item.collection).filter(Boolean)
  );

  const candidates = products.filter((product) => !inCart.has(product.id));
  const related = candidates.filter((product) => cartCollections.has(product.collection));
  const rest = candidates.filter((product) => !cartCollections.has(product.collection));

  return [...related, ...rest].slice(0, limit);
};
