import { describe, expect, it } from 'vitest';
import { formatPrice, humanizeSlug } from './format';

describe('formatPrice', () => {
  it('renders two decimals everywhere', () => {
    // Search used a no-decimal Intl formatter while four other components
    // hand-rolled `$${x.toFixed(2)}`, so the same product read $120 and $120.00.
    expect(formatPrice(120)).toBe('$120.00');
    expect(formatPrice(29.5)).toBe('$29.50');
  });

  it('does not throw on bad input', () => {
    expect(formatPrice(undefined)).toBe('$0.00');
    expect(formatPrice('not a price')).toBe('$0.00');
  });
});

describe('humanizeSlug', () => {
  it('title-cases every word, not just the first', () => {
    // The old `handle.replace('-', ' ')` replaced only the first hyphen.
    expect(humanizeSlug('wireless-trackpad')).toBe('Wireless Trackpad');
    expect(humanizeSlug('customizable-t-shirt')).toBe('Customizable T Shirt');
  });

  it('handles an empty slug', () => {
    expect(humanizeSlug('')).toBe('');
    expect(humanizeSlug()).toBe('');
  });
});
