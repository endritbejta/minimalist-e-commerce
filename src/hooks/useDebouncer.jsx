import { useEffect, useState } from "react";

const DEFAULT_DELAY = 300;

/**
 * Returns a value only after it has stayed unchanged for the given delay.
 * Useful for search inputs, resize work, and other user-driven updates.
 */
function useDebouncer(value, delay = DEFAULT_DELAY) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [value, delay]);

  return debouncedValue;
}

export default useDebouncer;