import { useMemo } from 'react';

/**
 * Custom hook to sort an array of products based on a sort criteria.
 * @param {Array} products - The array of product objects.
 * @param {string} sortBy - The sorting criteria ('price-low', 'price-high', 'az', 'za', or 'featured').
 * @returns {Array} - The sorted array of products.
 */
export const useSortedProducts = (products, sortBy) => {
  return useMemo(() => {
    if (!products) return [];
    
    const sorted = [...products];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'az':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'za':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return sorted;
    }
  }, [products, sortBy]);
};
