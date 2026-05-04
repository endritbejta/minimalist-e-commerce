import { useState, useEffect } from "react";

/**
 * A custom hook that manages state and syncs it with localStorage.
 * @param {string} key - The key to use in localStorage.
 * @param {any} initialValue - The default initial value if none is found in storage.
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
