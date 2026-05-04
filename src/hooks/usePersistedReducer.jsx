import { useReducer, useEffect } from "react";

const DEFAULT_OPTIONS = {
  mergeStoredState: true,
  serialize: JSON.stringify,
  deserialize: JSON.parse,
  onError: (error) => console.warn(error),
};

const getLocalStorage = () => {
  if (typeof window === "undefined" || !window.localStorage) {
    return null;
  }

  return window.localStorage;
};

const isPlainObject = (value) => {
  return value !== null && typeof value === "object" && !Array.isArray(value);
};

const getErrorMessage = (error) => {
  return error instanceof Error ? error.message : String(error);
};

/**
 * Creates a reducer whose state is hydrated from localStorage and saved after updates.
 *
 * Keep `storageKey` stable for the lifetime of the component. If the stored value is
 * an object, it is shallow-merged with `initialState` by default so newly added state
 * fields still receive their defaults.
 *
 * @param {import('react').Reducer<any, any>} reducer - Reducer used to update state.
 * @param {any} initialState - Default state used when storage is empty or unreadable.
 * @param {string} storageKey - localStorage key used for persistence.
 * @param {Object} [options]
 * @param {boolean} [options.mergeStoredState=true] - Merge stored objects with `initialState`.
 * @param {(state: any) => string} [options.serialize=JSON.stringify] - Converts state before saving.
 * @param {(value: string) => any} [options.deserialize=JSON.parse] - Converts saved text back to state.
 * @param {(error: unknown) => void} [options.onError=console.warn] - Handles storage/serialization errors.
 * @returns {[any, import('react').Dispatch<any>]} Current state and dispatch function.
 *
 * @example
 * const [state, dispatch] = usePersistedReducer(cartReducer, initialState, 'shopping-cart-v1');
 */
function usePersistedReducer(reducer, initialState, storageKey, options = {}) {
  const {
    mergeStoredState,
    serialize,
    deserialize,
    onError,
  } = { ...DEFAULT_OPTIONS, ...options };

  const [state, dispatch] = useReducer(reducer, initialState, (defaultVal) => {
    const storage = getLocalStorage();
    if (!storage) {
      return defaultVal;
    }

    try {
      const saved = storage.getItem(storageKey);
      if (!saved) return defaultVal;

      const parsed = deserialize(saved);

      if (mergeStoredState && isPlainObject(defaultVal) && isPlainObject(parsed)) {
        return { ...defaultVal, ...parsed };
      }

      return parsed;
    } catch (error) {
      onError(`Error hydrating state for key "${storageKey}": ${getErrorMessage(error)}`);
      return defaultVal;
    }
  });

  useEffect(() => {
    const storage = getLocalStorage();
    if (!storage) {
      return;
    }

    try {
      storage.setItem(storageKey, serialize(state));
    } catch (error) {
      onError(`Error saving state for key "${storageKey}": ${getErrorMessage(error)}`);
    }
  }, [onError, serialize, state, storageKey]);

  return [state, dispatch];
}

export default usePersistedReducer;
