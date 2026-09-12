import { useCallback, useSyncExternalStore } from 'react';

const noop = () => {};

const getList = (query) => {
  // No `matchMedia` outside a browser, and the property access itself can
  // throw in restricted contexts.
  try {
    if (typeof window === 'undefined' || !window.matchMedia) return null;
    return window.matchMedia(query);
  } catch {
    return null;
  }
};

/**
 * useMediaQuery Hook
 * Tracks whether a CSS media query currently matches.
 *
 * For the cases where a breakpoint has to be known to JavaScript and not only
 * to CSS — state that stops making sense at a certain width, rather than
 * layout, which belongs in a Tailwind class.
 *
 * Subscribes through `useSyncExternalStore`, so the value is read during render
 * rather than copied into state by an effect: there is no first paint at the
 * wrong breakpoint, and nothing to keep in sync.
 *
 * @param {string} query - A media query, e.g. '(min-width: 1024px)'.
 * @returns {boolean} Whether it matches right now.
 */
export default function useMediaQuery(query) {
  const subscribe = useCallback(
    (onChange) => {
      const list = getList(query);
      if (!list) return noop;

      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    [query]
  );

  const getSnapshot = useCallback(() => getList(query)?.matches ?? false, [query]);

  // Without `matchMedia` nothing matches, which leaves the caller on its
  // narrow-screen branch — the safer default, since that is the one whose
  // controls are always present.
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
