/**
 * localStorage access.
 *
 * Reaching for `window.localStorage` is not safe to do bare: the property
 * access itself throws when the browser is set to block site data, and there
 * is no storage at all when this code runs outside a browser (the unit tests,
 * or any future prerender). Everything that persists goes through here so that
 * guard is written once.
 */

const getStorage = () => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    return window.localStorage;
  } catch {
    return null;
  }
};

export default getStorage;

/**
 * Reads and parses a stored JSON value.
 * @param {string} key - The storage key.
 * @returns {any} The parsed value, or undefined when absent or unreadable.
 */
export const readJson = (key) => {
  const storage = getStorage();
  if (!storage) return undefined;

  try {
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    // Malformed JSON is treated as no value rather than thrown at the caller:
    // stored data is user-writable, so this is an expected input, not a bug.
    return undefined;
  }
};

/**
 * Serializes a value into storage.
 * @param {string} key - The storage key.
 * @param {any} value - The value to store.
 * @returns {boolean} Whether the write succeeded.
 */
export const writeJson = (key, value) => {
  const storage = getStorage();
  if (!storage) return false;

  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    // Out of quota, or storage blocked mid-session.
    return false;
  }
};
