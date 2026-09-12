/**
 * Checkout logic: the delivery options and the order arithmetic.
 *
 * Framework-free and pure, like the rest of `lib/` — the totals a shopper is
 * asked to agree to are the one thing in this app that must not be able to
 * disagree with itself, so they are computed in one place and tested directly.
 */

/**
 * Order value above which standard delivery stops being charged for.
 *
 * The storefront promises this on every product page and in the shipping
 * policy, and both read it from here — a checkout that quietly charged for
 * delivery on an order the product page called free would be the worst kind of
 * copy drift.
 */
export const FREE_SHIPPING_THRESHOLD = 100;

export const SHIPPING_METHODS = [
  {
    id: 'standard',
    label: 'Standard',
    description: '5–7 business days',
    price: 6,
    // The only method the threshold applies to. A free upgrade to overnight
    // would be a promise this store cannot keep.
    freeOverThreshold: true,
  },
  {
    id: 'express',
    label: 'Express',
    description: '2–3 business days',
    price: 14,
    freeOverThreshold: false,
  },
  {
    id: 'overnight',
    label: 'Overnight',
    description: 'Next business day, order before 2pm',
    price: 28,
    freeOverThreshold: false,
  },
];

export const DEFAULT_SHIPPING_METHOD_ID = SHIPPING_METHODS[0].id;

/**
 * Estimated sales tax. A real store derives the rate from the delivery
 * address; a demo with no tax service quotes one flat rate and says
 * "estimated" in the UI rather than implying a figure it cannot stand behind.
 */
export const TAX_RATE = 0.0825;

const methodsById = new Map(SHIPPING_METHODS.map((method) => [method.id, method]));

/**
 * Resolves a delivery method id, falling back to the default.
 * Never returns undefined: an unknown id (a stale form value, a hand-edited
 * one) must still produce a priceable order rather than a NaN total.
 * @param {string} [methodId] - The selected method id.
 * @returns {Object} The matching method, or the default one.
 */
export const getShippingMethod = (methodId) =>
  methodsById.get(methodId) ?? methodsById.get(DEFAULT_SHIPPING_METHOD_ID);

/** Rounds to whole pence, so no line can carry a fraction the display hides. */
const roundMoney = (value) => Math.round(value * 100) / 100;

const toAmount = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0 ? amount : 0;
};

/**
 * What delivery costs for this order.
 *
 * Free over the threshold, and free outright with a coupon that carries
 * shipping. The threshold is measured against what the shopper actually pays
 * for the goods — discounting an order below it takes the free delivery with
 * it, which is the behaviour the discount was priced on.
 *
 * @param {string} [methodId] - The selected delivery method.
 * @param {number} [goodsTotal=0] - Value of the goods after any discount.
 * @param {{freeShipping?: boolean}} [coupon] - The applied coupon, when any.
 * @returns {number} The delivery charge.
 */
export const getShippingCost = (methodId, goodsTotal = 0, coupon) => {
  const method = getShippingMethod(methodId);
  if (coupon?.freeShipping) return 0;

  const goods = toAmount(goodsTotal);
  // Nothing to deliver, nothing to charge for.
  if (goods <= 0) return 0;

  if (method.freeOverThreshold && goods >= FREE_SHIPPING_THRESHOLD) return 0;

  return method.price;
};

/**
 * Every figure on the order, derived from the cart's subtotal and discount.
 *
 * The subtotal and discount are passed in rather than recomputed: the cart
 * already owns them, and a second implementation of the same sum is a second
 * chance for the two to drift apart.
 *
 * Tax is charged on the discounted goods only. Whether delivery is taxable
 * varies by jurisdiction, and guessing wrong on a demo is worse than being
 * consistent and labelling the figure an estimate.
 *
 * @param {Object} input - The order inputs.
 * @param {number} input.subtotal - Value of the goods before any discount.
 * @param {number} [input.discount=0] - Amount the coupon takes off.
 * @param {string} [input.shippingMethodId] - The selected delivery method.
 * @param {Object} [input.coupon] - The applied coupon, when any.
 * @returns {{subtotal: number, discount: number, shipping: number, tax: number, total: number}}
 *   Each line of the totals, rounded to whole pence.
 */
export const getOrderTotals = ({
  subtotal,
  discount = 0,
  shippingMethodId,
  coupon,
} = {}) => {
  const goods = toAmount(subtotal);
  // A discount can never exceed the goods, or the tax base would go negative.
  const appliedDiscount = Math.min(goods, toAmount(discount));
  const goodsTotal = roundMoney(goods - appliedDiscount);

  const shipping = getShippingCost(shippingMethodId, goodsTotal, coupon);
  const tax = roundMoney(goodsTotal * TAX_RATE);

  return {
    subtotal: roundMoney(goods),
    discount: roundMoney(appliedDiscount),
    shipping: roundMoney(shipping),
    tax,
    total: roundMoney(goodsTotal + shipping + tax),
  };
};

/**
 * How much more is needed to earn free standard delivery.
 * @param {number} [goodsTotal=0] - Value of the goods after any discount.
 * @returns {number} The shortfall, or 0 once the threshold is met.
 */
export const amountToFreeShipping = (goodsTotal = 0) =>
  roundMoney(Math.max(0, FREE_SHIPPING_THRESHOLD - toAmount(goodsTotal)));
