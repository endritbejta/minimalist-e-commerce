/**
 * Placed orders.
 *
 * A confirmation page that only works until the shopper reloads is not a
 * confirmation, so a placed order is written down and the confirmation route
 * reads it back by order number. There is no backend, so "written down" means
 * this browser's localStorage: the record never leaves the device, and clearing
 * site data clears it.
 *
 * The stored record therefore holds a delivery address, which is why only the
 * most recent few are kept and why nothing here is sent anywhere.
 */
import { readJson, writeJson } from './storage';

export const ORDERS_STORAGE_KEY = 'orders-v1';

/** Orders kept on the device. Old ones fall off rather than accumulating. */
export const MAX_STORED_ORDERS = 10;

const ORDER_PREFIX = 'ME';

// No I, O, 0 or 1: an order number gets read aloud and typed back in.
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CODE_LENGTH = 6;

/**
 * Builds a human-readable order number, e.g. "ME-K3P9QW".
 * The source of randomness is injectable so the format can be tested without
 * betting on what `Math.random` returns.
 * @param {() => number} [random=Math.random] - Returns a float in [0, 1).
 * @returns {string} The order number.
 */
export const createOrderNumber = (random = Math.random) => {
  let code = '';

  for (let index = 0; index < CODE_LENGTH; index += 1) {
    const position = Math.floor(random() * CODE_ALPHABET.length);
    // A `random` that returns exactly 1 (or anything out of range) must not
    // index past the end of the alphabet and append `undefined`.
    code += CODE_ALPHABET[Math.min(Math.max(position, 0), CODE_ALPHABET.length - 1)];
  }

  return `${ORDER_PREFIX}-${code}`;
};

/**
 * Builds the record for a placed order.
 *
 * The cart lines are copied, not referenced: the order is what was bought at
 * the moment it was placed, and must not change afterwards because the catalog
 * did or because the cart was emptied.
 *
 * @param {Object} input - The order inputs.
 * @param {Object[]} input.items - The cart lines being ordered.
 * @param {Object} input.totals - The figures from `getOrderTotals`.
 * @param {Object} input.details - The submitted contact and address details.
 * @param {string} input.shippingMethodId - The chosen delivery method.
 * @param {Object} [input.coupon] - The applied coupon, when any.
 * @param {string} [input.orderNumber] - Override, for tests.
 * @param {string} [input.placedAt] - ISO timestamp override, for tests.
 * @returns {Object} The order record.
 */
export const createOrder = ({
  items = [],
  totals,
  details = {},
  shippingMethodId,
  coupon = null,
  orderNumber = createOrderNumber(),
  placedAt = new Date().toISOString(),
} = {}) => ({
  orderNumber,
  placedAt,
  items: items.map((item) => ({ ...item })),
  totals: { ...totals },
  details: { ...details },
  shippingMethodId,
  coupon: coupon ? { code: coupon.code, label: coupon.label } : null,
});

const isNonEmptyString = (value) => typeof value === 'string' && value.length > 0;

/**
 * Validates an order read back out of storage.
 * localStorage is user-writable, so a stored order is untrusted input — the
 * same treatment `lib/cart.js` gives rehydrated cart lines.
 * @param {any} order - The candidate record.
 * @returns {boolean} Whether it is safe to render.
 */
const isValidOrder = (order) =>
  Boolean(order) &&
  typeof order === 'object' &&
  isNonEmptyString(order.orderNumber) &&
  isNonEmptyString(order.placedAt) &&
  Array.isArray(order.items) &&
  Boolean(order.totals) &&
  typeof order.totals === 'object' &&
  Number.isFinite(Number(order.totals.total));

/**
 * Drops anything malformed from a stored order list.
 * @param {any} orders - The persisted value.
 * @returns {Object[]} The orders worth showing.
 */
export const sanitizeOrders = (orders) =>
  Array.isArray(orders) ? orders.filter(isValidOrder) : [];

/**
 * Every order placed on this device, newest first.
 * @returns {Object[]} The stored orders.
 */
export const getOrders = () => sanitizeOrders(readJson(ORDERS_STORAGE_KEY));

/**
 * Looks up one order.
 * @param {string} orderNumber - The number from the confirmation URL.
 * @returns {Object|undefined} The order, when this device placed it.
 */
export const findOrder = (orderNumber) => {
  if (!isNonEmptyString(orderNumber)) return undefined;

  const wanted = orderNumber.trim().toUpperCase();
  return getOrders().find((order) => order.orderNumber.toUpperCase() === wanted);
};

/**
 * Stores a placed order, newest first, capped at `MAX_STORED_ORDERS`.
 * @param {Object} order - The record from `createOrder`.
 * @returns {boolean} Whether it was stored. A full or blocked storage returns
 *   false; the caller still has the order in memory and shows the confirmation.
 */
export const saveOrder = (order) => {
  if (!isValidOrder(order)) return false;

  const existing = getOrders().filter(
    (stored) => stored.orderNumber !== order.orderNumber
  );

  return writeJson(ORDERS_STORAGE_KEY, [order, ...existing].slice(0, MAX_STORED_ORDERS));
};
