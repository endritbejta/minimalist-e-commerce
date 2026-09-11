import { useCallback, useMemo } from 'react';
import usePersistedReducer from '../hooks/usePersistedReducer';
import {
  CART_STORAGE_KEY,
  DEFAULT_QUANTITY,
  cartReducer,
  hydrateCart,
  initialCartState,
  persistCart,
} from '../lib/cartReducer';
import { findCoupon, getDiscountAmount } from '../lib/coupons';
import { CartContext } from './CartContext';

/**
 * CartProvider Component
 * Manages persisted cart state, including line quantities and subtotal calculations.
 * @param {Object} props - Component props.
 * @param {import('react').ReactNode} props.children - Subtree with access to cart state.
 */
export const CartProvider = ({ children }) => {
  const [state, dispatch] = usePersistedReducer(cartReducer, initialCartState, CART_STORAGE_KEY, {
    persist: persistCart,
    hydrate: hydrateCart,
  });

  const toggleCart = useCallback(() => dispatch({ type: 'TOGGLE_CART' }), [dispatch]);
  const openCart = useCallback(() => dispatch({ type: 'OPEN_CART' }), [dispatch]);
  const closeCart = useCallback(() => dispatch({ type: 'CLOSE_CART' }), [dispatch]);

  // Adding does not open the drawer. The disc flying into the cart and the
  // count ticking up already say the item went in, and the drawer used to slide
  // over the cart icon at the exact moment it bumped — hiding the confirmation
  // it was duplicating, and interrupting anyone adding more than one thing.
  const addToCart = useCallback((product, quantity = DEFAULT_QUANTITY) => {
    dispatch({ type: 'ADD_TO_CART', payload: { ...product, quantity } });
  }, [dispatch]);

  const updateQuantity = useCallback((lineId, amount) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { lineId, amount } });
  }, [dispatch]);

  const removeFromCart = useCallback((lineId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: lineId });
  }, [dispatch]);

  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), [dispatch]);

  /**
   * @param {string} code - The code the shopper typed.
   * @returns {boolean} Whether it was recognised.
   */
  const applyCoupon = useCallback((code) => {
    dispatch({ type: 'APPLY_COUPON', payload: code });
    return Boolean(findCoupon(code));
  }, [dispatch]);

  const removeCoupon = useCallback(() => dispatch({ type: 'REMOVE_COUPON' }), [dispatch]);

  const { cartCount, cartTotal } = useMemo(
    () =>
      state.items.reduce(
        (totals, item) => ({
          cartCount: totals.cartCount + item.quantity,
          cartTotal: totals.cartTotal + item.price * item.quantity,
        }),
        { cartCount: 0, cartTotal: 0 }
      ),
    [state.items]
  );

  const discount = getDiscountAmount(cartTotal, state.coupon);
  const orderTotal = cartTotal - discount;

  const value = useMemo(
    () => ({
      ...state,
      applyCoupon,
      removeCoupon,
      discount,
      orderTotal,
      toggleCart,
      openCart,
      closeCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartTotal,
    }),
    [
      state,
      applyCoupon,
      removeCoupon,
      discount,
      orderTotal,
      toggleCart,
      openCart,
      closeCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartTotal,
    ]
  );

  return <CartContext value={value}>{children}</CartContext>;
};
