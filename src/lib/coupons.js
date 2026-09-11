/**
 * Discount codes.
 *
 * A demo store has no backend to validate against, so the codes live here and
 * are checked in the browser. Real discounts have to be applied server-side —
 * anything in this file is visible to, and editable by, the shopper.
 */

export const COUPONS = [
  { code: 'MINIMAL10', percentOff: 10, label: '10% off' },
  { code: 'ESSENTIALS20', percentOff: 20, label: '20% off' },
  { code: 'FREESHIP', percentOff: 0, label: 'Free shipping' },
];

const normalize = (code) => String(code ?? '').trim().toUpperCase();

/**
 * Looks up a discount code, ignoring case and surrounding spaces.
 * @param {string} code - What the shopper typed.
 * @returns {{code: string, percentOff: number, label: string}|undefined} The coupon, when it exists.
 */
export const findCoupon = (code) => {
  const wanted = normalize(code);
  if (!wanted) return undefined;

  return COUPONS.find((coupon) => coupon.code === wanted);
};

/**
 * The amount a coupon takes off a subtotal.
 * Rounded to whole pence so the discount and the total cannot disagree by a
 * fraction that the formatted prices would hide.
 * @param {number} subtotal - The pre-discount total.
 * @param {{percentOff: number}} [coupon] - The applied coupon, if any.
 * @returns {number} The amount to deduct, never more than the subtotal.
 */
export const getDiscountAmount = (subtotal, coupon) => {
  const base = Number(subtotal);
  if (!coupon?.percentOff || !Number.isFinite(base) || base <= 0) return 0;

  return Math.min(base, Math.round(base * coupon.percentOff) / 100);
};
