import { beforeEach, describe, expect, it } from 'vitest';
import { hasRevealed, markRevealed, resetRevealed } from './revealOnce';

describe('revealOnce', () => {
  beforeEach(resetRevealed);

  it('reports a heading as unseen until it is marked', () => {
    expect(hasRevealed('Shop All')).toBe(false);

    markRevealed('Shop All');

    expect(hasRevealed('Shop All')).toBe(true);
  });

  it('keeps headings apart from one another', () => {
    markRevealed('Shop All');

    expect(hasRevealed('Accessories')).toBe(false);
  });

  it('treats the same text as the same heading wherever it appears', () => {
    // A collection title and a product title that happen to match should not
    // both animate — the visitor has already seen those words reveal.
    markRevealed('Accessories');

    expect(hasRevealed('Accessories')).toBe(true);
  });

  it('is unbothered by being marked twice', () => {
    markRevealed('Shop All');
    markRevealed('Shop All');

    expect(hasRevealed('Shop All')).toBe(true);
  });

  it('ignores empty text', () => {
    markRevealed('');

    expect(hasRevealed('')).toBe(false);
  });
});
