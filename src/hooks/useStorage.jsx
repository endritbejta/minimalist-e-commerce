import { useState, useEffect } from "react";

/**
 * useStorage Hook
 * Manages state and automatically syncs it with localStorage.
 * @param {string} key - localStorage key.
 * @param {any} initialValue - Default value if nothing is stored.
 * @returns {[any, Function]} The stored value and a setter function.
 */
function useStorage(key, initialValue) {
  // Initialize state from localStorage or use the provided initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage whenever the state changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useStorage;
