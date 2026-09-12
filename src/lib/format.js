/**
 * Formatting helpers.
 * Every price in the UI goes through `formatPrice` so currency rendering
 * stays consistent across cards, cart, search results and product pages.
 */

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Formats a numeric value as a USD price string.
 * Non-numeric input falls back to $0.00 rather than throwing.
 * @param {number|string} value - The amount to format.
 * @returns {string} A localized currency string, e.g. "$120.00".
 */
export const formatPrice = (value) => {
  const amount = Number(value);
  return priceFormatter.format(Number.isFinite(amount) ? amount : 0);
};

const wholePriceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/**
 * Formats a price for prose, dropping the pence on a round amount.
 * "Free shipping on orders over $100" reads better than "over $100.00"; an
 * amount with pence in it still shows them, so nothing is ever rounded away.
 * @param {number|string} value - The amount to format.
 * @returns {string} A localized currency string, e.g. "$100" or "$99.50".
 */
export const formatPriceCompact = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return formatPrice(amount);

  return Number.isInteger(amount) ? wholePriceFormatter.format(amount) : formatPrice(amount);
};

/**
 * Converts a slug into a human-readable title, e.g. "wireless-trackpad" -> "Wireless Trackpad".
 * @param {string} slug - The slug to humanize.
 * @returns {string} The title-cased label.
 */
export const humanizeSlug = (slug = '') =>
  slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
