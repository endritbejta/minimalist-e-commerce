import { useEffect, useReducer, useRef } from "react";
import getStorage from "../lib/storage";

const identity = (value) => value;
const warn = (message) => console.warn(message);

const getErrorMessage = (error) =>
  error instanceof Error ? error.message : String(error);

/**
 * usePersistedReducer Hook
 * A useReducer that mirrors part of its state to localStorage.
 *
 * `persist` picks the slice worth saving and `hydrate` decides how a stored
 * value re-enters state. Splitting the two keeps ephemeral UI flags out of
 * storage and gives the caller a place to validate untrusted stored data.
 *
 * @param {Function} reducer - State transition logic.
 * @param {any} initialState - The starting state.
 * @param {string} storageKey - localStorage key.
 * @param {Object} [options] - Configuration options.
 * @param {(state: any) => any} [options.persist] - Selects the slice to store.
 * @param {(stored: any, initialState: any) => any} [options.hydrate] - Rebuilds state from a stored value.
 * @param {Function} [options.serialize=JSON.stringify] - Serializer for the stored slice.
 * @param {Function} [options.deserialize=JSON.parse] - Deserializer for the stored slice.
 * @param {Function} [options.onError] - Called with a message when storage fails.
 * @returns {[any, Function]} Current state and dispatch function.
 */
function usePersistedReducer(reducer, initialState, storageKey, options = {}) {
  const {
    persist = identity,
    hydrate = identity,
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    onError = warn,
  } = options;

  const [state, dispatch] = useReducer(reducer, initialState, (defaultVal) => {
    const storage = getStorage();
    if (!storage) return defaultVal;

    try {
      const saved = storage.getItem(storageKey);
      if (!saved) return defaultVal;

      return hydrate(deserialize(saved), defaultVal);
    } catch (error) {
      onError(`Error hydrating state for key "${storageKey}": ${getErrorMessage(error)}`);
      return defaultVal;
    }
  });

  const lastWrittenRef = useRef(null);

  useEffect(() => {
    const storage = getStorage();
    if (!storage) return;

    try {
      const payload = serialize(persist(state));

      // Toggling a UI-only flag leaves the persisted slice untouched; skipping
      // the write avoids pointless main-thread serialization.
      if (payload === lastWrittenRef.current) return;

      storage.setItem(storageKey, payload);
      lastWrittenRef.current = payload;
    } catch (error) {
      onError(`Error saving state for key "${storageKey}": ${getErrorMessage(error)}`);
    }
    // Inline option callbacks would re-run this effect every render; the
    // payload comparison above makes that harmless rather than wasteful.
  }, [onError, persist, serialize, state, storageKey]);

  return [state, dispatch];
}

export default usePersistedReducer;
