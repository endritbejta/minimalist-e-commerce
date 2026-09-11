/**
 * Remembers which headings have already played their reveal.
 *
 * Scope is the page load: the record survives client-side navigation, so
 * moving between collections and back does not replay the same heading, but a
 * genuine reload starts fresh. Swap the Set for sessionStorage to carry it
 * across reloads in a tab, or localStorage to retire the effect permanently
 * once a visitor has seen it.
 */
const revealed = new Set();

/**
 * Whether this text has already revealed itself.
 * @param {string} key - The heading text.
 * @returns {boolean} True when it has played before.
 */
export const hasRevealed = (key) => revealed.has(key);

/**
 * Records that this text has now revealed itself.
 * @param {string} key - The heading text.
 */
export const markRevealed = (key) => {
  if (key) revealed.add(key);
};

/**
 * Forgets everything. Exists for tests.
 */
export const resetRevealed = () => {
  revealed.clear();
};
