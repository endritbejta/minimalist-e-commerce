import { describe, expect, it } from 'vitest';
import { products } from '../data/products';
import {
  COLLECTIONS,
  getCollection,
  getDisplayPrice,
  getProductByHandle,
  getProductsByCollection,
  getRecommendations,
} from './catalog';

describe('catalog', () => {
  it('resolves a product by handle', () => {
    expect(getProductByHandle('classic-wristwatch')?.id).toBe(1);
  });

  it('returns undefined for an unknown handle', () => {
    expect(getProductByHandle('no-such-product')).toBeUndefined();
  });

  it('rejects an unknown collection instead of rendering an empty one', () => {
    // An unrecognised handle used to render an indexable page titled after
    // whatever the URL contained.
    expect(getCollection('does-not-exist')).toBeUndefined();
  });

  it('exposes every collection present in the catalog', () => {
    const inData = new Set(products.map((product) => product.collection));
    const inNav = new Set(COLLECTIONS.map((collection) => collection.handle));

    for (const handle of inData) {
      expect(inNav.has(handle)).toBe(true);
    }
  });

  it('makes every product reachable from a collection', () => {
    const reachable = new Set(
      COLLECTIONS.flatMap((collection) =>
        getProductsByCollection(collection.handle).map((product) => product.id)
      )
    );

    expect(reachable.size).toBe(products.length);
  });

  it('returns the whole catalog for "all"', () => {
    expect(getProductsByCollection('all')).toHaveLength(products.length);
  });

  it('prefers the variant price, including a free one', () => {
    // `variant.price || product.price` silently charged the base price for a
    // variant priced at zero.
    expect(getDisplayPrice({ price: 30 }, { price: 45 })).toBe(45);
    expect(getDisplayPrice({ price: 30 }, { price: 0 })).toBe(0);
    expect(getDisplayPrice({ price: 30 }, undefined)).toBe(30);
  });
});

describe('getRecommendations', () => {
  const lineFor = (handle) => {
    const product = getProductByHandle(handle);
    return { id: product.id, collection: product.collection };
  };

  it('never suggests something already in the cart', () => {
    const cart = [lineFor('classic-wristwatch'), lineFor('minimalist-wallet')];
    const ids = getRecommendations(cart, 50).map((p) => p.id);

    expect(ids).not.toContain(lineFor('classic-wristwatch').id);
    expect(ids).not.toContain(lineFor('minimalist-wallet').id);
  });

  it('puts products from the cart’s own collections first', () => {
    const cart = [lineFor('classic-wristwatch')];
    const suggestions = getRecommendations(cart, 50);
    const firstOther = suggestions.findIndex((p) => p.collection !== 'accessories');
    const lastAccessory = suggestions.map((p) => p.collection).lastIndexOf('accessories');

    expect(lastAccessory).toBeLessThan(firstOther);
  });

  it('still fills the row when the cart is empty', () => {
    expect(getRecommendations([], 6)).toHaveLength(6);
  });

  it('honours the limit', () => {
    expect(getRecommendations([], 3)).toHaveLength(3);
  });

  it('returns nothing once everything is in the cart', () => {
    const wholeCatalog = products.map((p) => ({ id: p.id, collection: p.collection }));

    expect(getRecommendations(wholeCatalog)).toEqual([]);
  });

  it('copes with lines that have no collection', () => {
    expect(() => getRecommendations([{ id: 1 }], 4)).not.toThrow();
    expect(getRecommendations([{ id: 1 }], 4)).toHaveLength(4);
  });
});
