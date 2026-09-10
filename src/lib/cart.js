/**
 * Cart line helpers.
 *
 * A cart line is identified by everything that makes it a distinct thing to
 * pick, pack and charge for — the variant and the applied customization, not
 * just the product id. Keying on the product id alone silently merges a black
 * shirt with a red one.
 */

const customizationKey = (customization) => {
  if (!customization?.emblem) return '';

  const front = customization.includeFrontEmblem
    ? `f:${customization.position}`
    : 'f:none';
  const back = customization.includeBackEmblem
    ? `b:${customization.backEmblemSize}:${customization.backEmblemAlignment}`
    : 'b:none';

  return `${customization.emblem.id}|${front}|${back}`;
};

/**
 * Builds the stable identity for a cart line.
 * @param {Object} product - A product, optionally carrying `variantId` and `customization`.
 * @returns {string} The line id used to merge, update and remove cart entries.
 */
export const getCartLineId = (product) => {
  const base = product?.variantId ?? product?.id;
  const customization = customizationKey(product?.customization);

  return customization ? `${base}::${customization}` : String(base);
};

/**
 * Normalizes a product into the minimal shape the cart needs to persist.
 * Keeping the stored line small means a catalog change (a new description, a
 * new photo) cannot resurrect stale data out of localStorage.
 * @param {Object} product - The product being added.
 * @param {number} quantity - Already-validated quantity.
 * @returns {Object} The cart line.
 */
export const createCartLine = (product, quantity) => ({
  lineId: getCartLineId(product),
  id: product.id,
  variantId: product.variantId,
  handle: product.handle,
  title: product.title,
  collection: product.collection,
  price: Number(product.price) || 0,
  image: product.image || product.images?.[0],
  customization: product.customization ?? null,
  quantity,
});

const isPositiveInteger = (value) => Number.isInteger(value) && value > 0;

/**
 * Validates a cart line rehydrated from localStorage.
 * localStorage is user-writable, so anything coming back out of it is treated
 * as untrusted input rather than as state we wrote earlier.
 * @param {any} line - The candidate line.
 * @returns {boolean} Whether the line is safe to render and total up.
 */
const isValidLine = (line) =>
  Boolean(line) &&
  typeof line === 'object' &&
  typeof line.lineId === 'string' &&
  typeof line.title === 'string' &&
  Number.isFinite(Number(line.price)) &&
  isPositiveInteger(line.quantity);

/**
 * Drops anything malformed from a rehydrated cart and de-duplicates lines that
 * share an id.
 * @param {any} items - The persisted items array.
 * @returns {Object[]} A clean list of cart lines.
 */
export const sanitizeCartItems = (items) => {
  if (!Array.isArray(items)) return [];

  const byLineId = new Map();

  for (const line of items) {
    if (!isValidLine(line)) continue;

    const existing = byLineId.get(line.lineId);
    byLineId.set(
      line.lineId,
      existing
        ? { ...existing, quantity: existing.quantity + line.quantity }
        : { ...line, price: Number(line.price) }
    );
  }

  return [...byLineId.values()];
};
