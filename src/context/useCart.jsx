import { useContext } from 'react';
import CartContext from './cartContextValue.jsx';

/**
 * Reads the current cart state and cart action helpers from CartProvider.
 *
 * @returns {Object} Cart state, derived totals, and action helpers.
 * @throws {Error} When called outside of CartProvider.
 */
export const useCart = () => {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
};
