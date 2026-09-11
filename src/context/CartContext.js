import { createContext, use } from 'react';

/**
 * @typedef {Object} CartLine
 * @property {string} lineId - Identity of the line (variant + customization aware).
 * @property {string | number} id - Underlying product id.
 * @property {string | number} [variantId] - Selected variant id, when the product has variants.
 * @property {string} title - Product title shown in the cart.
 * @property {number} price - Unit price used to calculate cart totals.
 * @property {number} quantity - Quantity currently in the cart.
 * @property {string} [image] - Optional product image URL.
 * @property {Object|null} customization - Applied customization, when any.
 */

/**
 * @typedef {Object} CartContextValue
 * @property {boolean} isOpen - Whether the cart drawer is visible.
 * @property {CartLine[]} items - Lines currently in the cart.
 * @property {() => void} toggleCart - Opens the cart if closed, closes it if open.
 * @property {() => void} openCart - Opens the cart drawer.
 * @property {() => void} closeCart - Closes the cart drawer.
 * @property {(product: Object, quantity?: number) => void} addToCart - Adds a product to the cart. Does not open the drawer.
 * @property {(lineId: string, amount: number) => void} updateQuantity - Adds `amount` to a line's quantity. Removes it at 0.
 * @property {(lineId: string) => void} removeFromCart - Removes a line.
 * @property {() => void} clearCart - Removes all cart lines.
 * @property {number} cartCount - Sum of all line quantities.
 * @property {number} cartTotal - Sum of all line prices multiplied by quantity, before any discount.
 * @property {Object|null} coupon - The applied discount code, when one is active.
 * @property {(code: string) => boolean} applyCoupon - Applies a code; returns whether it was recognised.
 * @property {() => void} removeCoupon - Clears the applied code.
 * @property {number} discount - Amount the coupon takes off.
 * @property {number} orderTotal - What is actually payable: cartTotal less discount.
 */

export const CartContext = createContext(undefined);

/**
 * useCart Hook
 * Provides access to the global cart state and management functions.
 * @returns {CartContextValue} Cart lines, totals, and action helpers.
 */
export const useCart = () => {
  const context = use(CartContext);

  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
};
