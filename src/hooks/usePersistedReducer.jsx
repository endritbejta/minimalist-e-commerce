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
 * usePersistedReducer Hook
 * A replacement for useReducer that persists state to localStorage.
 * @param {Function} reducer - State transition logic.
 * @param {any} initialState - The starting state.
 * @param {string} storageKey - localStorage key.
 * @param {Object} [options] - Configuration options.
 * @returns {[any, Function]} Current state and dispatch function.
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
