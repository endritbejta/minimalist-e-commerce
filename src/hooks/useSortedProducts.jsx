import { useMemo } from 'react';

/**
 * useSortedProducts Hook
 * Returns a sorted version of the provided products array based on the given criteria.
 * @param {Object[]} products - Array of product objects.
 * @param {string} sortBy - Sort criteria ('price-low', 'price-high', 'az', 'za', 'featured').
 * @returns {Object[]} The sorted products.
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
