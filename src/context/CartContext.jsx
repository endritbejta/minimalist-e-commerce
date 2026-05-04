import { useCallback, useMemo } from 'react';
import usePersistedReducer from '../hooks/usePersistedReducer';
import CartContext from './cartContextValue.jsx';

const STORAGE_KEY = 'shopping-cart-v1';
const DEFAULT_QUANTITY = 1;

const initialState = {
  isOpen: false,
  items: [],
};

/**
 * @typedef {Object} CartItem
 * @property {string | number} id - Unique product or variant identifier.
 * @property {string} title - Product title shown in the cart.
 * @property {number} price - Unit price used to calculate cart totals.
 * @property {number} quantity - Quantity currently in the cart.
 * @property {string} [image] - Optional product image URL.
 */

/**
 * @typedef {Object} CartState
 * @property {boolean} isOpen - Whether the cart drawer is visible.
 * @property {CartItem[]} items - Products currently in the cart.
 */

/**
 * @typedef {CartState & Object} CartContextValue
 * @property {() => void} toggleCart - Opens the cart if closed, closes it if open.
 * @property {() => void} openCart - Opens the cart drawer.
 * @property {() => void} closeCart - Closes the cart drawer.
 * @property {(product: Omit<CartItem, 'quantity'> & Partial<Pick<CartItem, 'quantity'>>, quantity?: number) => void} addToCart - Adds a product and opens the cart.
 * @property {(id: CartItem['id'], amount: number) => void} updateQuantity - Adds `amount` to an item's quantity. Removes it when quantity reaches 0.
 * @property {(id: CartItem['id']) => void} removeFromCart - Removes an item by id.
 * @property {() => void} clearCart - Removes all cart items.
 * @property {number} cartCount - Sum of all item quantities.
 * @property {number} cartTotal - Sum of all item prices multiplied by quantity.
 */

const getQuantity = (quantity) => {
  const parsedQuantity = Number(quantity);
  return Number.isFinite(parsedQuantity) && parsedQuantity > 0
    ? parsedQuantity
    : DEFAULT_QUANTITY;
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    case 'OPEN_CART':
      return { ...state, isOpen: true };
    case 'CLOSE_CART':
      return { ...state, isOpen: false };
    case 'ADD_TO_CART': {
      const quantity = getQuantity(action.payload.quantity);
      const existingItem = state.items.some((item) => item.id === action.payload.id);

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) => {
            if (item.id !== action.payload.id) {
              return item;
            }

            return { ...item, quantity: item.quantity + quantity };
          }),
        };
      }

      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity }],
      };
    }
    case 'REMOVE_FROM_CART':
      return { ...state, items: state.items.filter((item) => item.id !== action.payload) };
    case 'UPDATE_QUANTITY': {
      const { id, amount } = action.payload;
      const quantityChange = Number(amount);

      if (!Number.isFinite(quantityChange)) {
        return state;
      }

      const updatedItems = state.items
        .map((item) => {
          if (item.id === id) {
            return { ...item, quantity: Math.max(0, item.quantity + quantityChange) };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);

      return { ...state, items: updatedItems };
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      return state;
  }
};

/**
 * CartProvider Component
 * Manages persisted cart state, including item quantities and subtotal calculations.
 * @param {Object} props - Component props.
 * @param {ReactNode} props.children - Subtree with access to cart state.
 */
export const CartProvider = ({ children }) => {
  const [state, dispatch] = usePersistedReducer(cartReducer, initialState, STORAGE_KEY);

  const toggleCart = useCallback(() => {
    dispatch({ type: 'TOGGLE_CART' });
  }, [dispatch]);

  const openCart = useCallback(() => {
    dispatch({ type: 'OPEN_CART' });
  }, [dispatch]);

  const closeCart = useCallback(() => {
    dispatch({ type: 'CLOSE_CART' });
  }, [dispatch]);

  const addToCart = useCallback((product, quantity = DEFAULT_QUANTITY) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: { ...product, quantity },
    });

    dispatch({ type: 'OPEN_CART' });
  }, [dispatch]);

  const updateQuantity = useCallback((id, amount) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, amount } });
  }, [dispatch]);

  const removeFromCart = useCallback((id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  }, [dispatch]);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, [dispatch]);

  const cartCount = useMemo(() => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  }, [state.items]);

  const cartTotal = useMemo(() => {
    return state.items.reduce((total, item) => {
      return total + (Number(item.price) || 0) * item.quantity;
    }, 0);
  }, [state.items]);

  const value = useMemo(() => ({
    ...state,
    toggleCart,
    openCart,
    closeCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
  }), [
    state,
    toggleCart,
    openCart,
    closeCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
  ]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
