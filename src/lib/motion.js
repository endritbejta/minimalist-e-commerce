/**
 * Motion constants and helpers shared between JS and CSS.
 * The exit duration lives here because both the modal provider (which unmounts
 * the view) and the modal component (which animates it out) must agree on it.
 */

export const MODAL_EXIT_DURATION = 200;

/**
 * Whether the user has asked the OS to reduce motion.
 * @returns {boolean} True when animations should be skipped or shortened.
 */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
