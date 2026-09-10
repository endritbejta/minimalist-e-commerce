import { createContext, use } from 'react';

/**
 * @typedef {Object} FlyToCartContextValue
 * @property {(element: HTMLElement|null) => void} registerCartTarget - Ref callback the cart button uses to declare itself the flight destination.
 * @property {(options: {image?: string, originRect: DOMRect}) => Promise<void>} flyToCart - Animates a disc from `originRect` to the cart; resolves when it lands.
 */

export const FlyToCartContext = createContext(undefined);

/**
 * useFlyToCart Hook
 * Access to the add-to-cart flight animation.
 * @returns {FlyToCartContextValue} The flight controls.
 */
export const useFlyToCart = () => {
  const context = use(FlyToCartContext);

  if (context === undefined) {
    throw new Error('useFlyToCart must be used within a FlyToCartProvider');
  }

  return context;
};
