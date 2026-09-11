/**
 * Cart state transitions.
 *
 * Kept apart from the provider so it can be exercised directly in tests and so
 * the provider module exports only a component (which Fast Refresh requires).
 */
import { createCartLine, getCartLineId, sanitizeCartItems } from './cart';
import { findCoupon } from './coupons';

export const CART_STORAGE_KEY = 'shopping-cart-v2';
export const DEFAULT_QUANTITY = 1;

export const initialCartState = {
  isOpen: false,
  items: [],
  coupon: null,
};

// Only the basket itself is durable. `isOpen` is view state — persisting it
// meant a returning visitor was greeted by an open drawer over a frozen page.
export const persistCart = (state) => ({ items: state.items, coupon: state.coupon });

export const hydrateCart = (stored, defaults) => {
  const items = sanitizeCartItems(stored?.items);

  return {
    ...defaults,
    items,
    // Re-resolved from the code rather than trusted as stored: the percentage
    // must come from the catalog, not from whatever is in localStorage.
    coupon: items.length > 0 ? findCoupon(stored?.coupon?.code) ?? null : null,
  };
};

const toQuantity = (value) => {
  const parsed = Math.trunc(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_QUANTITY;
};

/**
 * @param {Object} state - Current cart state.
 * @param {{type: string, payload?: any}} action - The action to apply.
 * @returns {Object} The next cart state.
 */
export const cartReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    case 'OPEN_CART':
      return { ...state, isOpen: true };
    case 'CLOSE_CART':
      return { ...state, isOpen: false };
    case 'ADD_TO_CART': {
      const quantity = toQuantity(action.payload.quantity);
      const lineId = getCartLineId(action.payload);
      const isExistingLine = state.items.some((item) => item.lineId === lineId);

      if (isExistingLine) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.lineId === lineId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, createCartLine(action.payload, quantity)],
      };
    }
    case 'REMOVE_FROM_CART': {
      const remaining = state.items.filter((item) => item.lineId !== action.payload);
      return { ...state, items: remaining, coupon: remaining.length > 0 ? state.coupon : null };
    }
    case 'UPDATE_QUANTITY': {
      const { lineId, amount } = action.payload;
      const quantityChange = Math.trunc(Number(amount));

      if (!Number.isFinite(quantityChange) || quantityChange === 0) {
        return state;
      }

      const updatedItems = state.items
        .map((item) =>
          item.lineId === lineId
            ? { ...item, quantity: item.quantity + quantityChange }
            : item
        )
        .filter((item) => item.quantity > 0);

      return {
        ...state,
        items: updatedItems,
        coupon: updatedItems.length > 0 ? state.coupon : null,
      };
    }
    case 'APPLY_COUPON': {
      const coupon = findCoupon(action.payload);
      return coupon ? { ...state, coupon } : state;
    }
    case 'REMOVE_COUPON':
      return { ...state, coupon: null };
    case 'CLEAR_CART':
      return { ...state, items: [], coupon: null };
    default:
      return state;
  }
};
