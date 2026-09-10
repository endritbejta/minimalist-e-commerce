import { createContext, use } from 'react';

/**
 * @typedef {Object} CustomizationContextValue
 * @property {Object|null} customization - The customization currently applied to the product.
 * @property {(next: Object|null) => void} setCustomization - Replaces the customization.
 * @property {(patch: Object) => void} updateCustomization - Merges a partial update in.
 * @property {() => void} clearCustomization - Clears the customization.
 */

export const CustomizationContext = createContext(undefined);

/**
 * useCustomization Hook
 * Provides access to the in-progress product customization.
 * @returns {CustomizationContextValue} Customization state and helpers.
 */
export const useCustomization = () => {
  const context = use(CustomizationContext);

  if (context === undefined) {
    throw new Error('useCustomization must be used within a CustomizationProvider');
  }

  return context;
};
