import { useContext } from 'react';
import CartContext from './cartContextValue.jsx';

/**
 * useCart Hook
 * Provides access to the global cart state and management functions.
 * @returns {Object} Cart items, totals, and action helpers.
 */
export const useCart = () => {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
};
