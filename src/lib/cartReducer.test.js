import { describe, expect, it } from 'vitest';
import { cartReducer, hydrateCart, initialCartState, persistCart } from './cartReducer';

const TEE = {
  id: 21,
  handle: 'customizable-t-shirt',
  title: 'Customizable T-shirt',
  collection: 'apparel',
  price: 30,
};

const black = { ...TEE, variantId: 211, title: 'Customizable T-shirt - Black' };
const red = { ...TEE, variantId: 213, title: 'Customizable T-shirt - Red' };

const add = (state, product, quantity = 1) =>
  cartReducer(state, { type: 'ADD_TO_CART', payload: { ...product, quantity } });

describe('cartReducer', () => {
  it('keeps different variants of one product as separate lines', () => {
    // The original reducer keyed lines on the product id, so adding black then
    // red produced a single line of "Black x2" — the wrong shirt gets shipped.
    const state = add(add(initialCartState, black), red);

    expect(state.items).toHaveLength(2);
    expect(state.items.map((item) => item.variantId)).toEqual([211, 213]);
    expect(state.items.every((item) => item.quantity === 1)).toBe(true);
  });

  it('merges repeat adds of the same variant', () => {
    const state = add(add(initialCartState, black), black, 2);

    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(3);
  });

  it('separates identical variants with different customizations', () => {
    const plain = { ...black };
    const customized = {
      ...black,
      customization: {
        emblem: { id: 'emblem-1', name: 'Legacy Badge' },
        includeFrontEmblem: true,
        position: 'front-center',
        includeBackEmblem: false,
      },
    };

    const state = add(add(initialCartState, plain), customized);

    expect(state.items).toHaveLength(2);
  });

  it('merges identical customizations', () => {
    const customization = {
      emblem: { id: 'emblem-2', name: 'Heritage Crest' },
      includeFrontEmblem: true,
      position: 'front-left',
      includeBackEmblem: true,
      backEmblemSize: 'big',
      backEmblemAlignment: 'top',
    };
    const item = { ...black, customization };

    const state = add(add(initialCartState, item), item);

    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(2);
  });

  it('drops a line when its quantity reaches zero', () => {
    const state = add(initialCartState, black);
    const { lineId } = state.items[0];

    const next = cartReducer(state, {
      type: 'UPDATE_QUANTITY',
      payload: { lineId, amount: -1 },
    });

    expect(next.items).toHaveLength(0);
  });

  it('ignores a non-numeric quantity change', () => {
    const state = add(initialCartState, black);
    const { lineId } = state.items[0];

    const next = cartReducer(state, {
      type: 'UPDATE_QUANTITY',
      payload: { lineId, amount: 'lots' },
    });

    expect(next).toBe(state);
  });

  it('falls back to a quantity of 1 for nonsense input', () => {
    expect(add(initialCartState, black, -5).items[0].quantity).toBe(1);
    expect(add(initialCartState, black, NaN).items[0].quantity).toBe(1);
  });

  it('leaves the cart untouched for an unknown action', () => {
    const state = add(initialCartState, black);
    expect(cartReducer(state, { type: 'NOT_A_REAL_ACTION' })).toBe(state);
  });
});

describe('cart persistence', () => {
  it('does not persist the drawer open state', () => {
    // A persisted `isOpen: true` meant the site loaded with the cart drawer
    // open over a scroll-locked page.
    const state = cartReducer(add(initialCartState, black), { type: 'OPEN_CART' });

    expect(state.isOpen).toBe(true);
    expect(persistCart(state)).not.toHaveProperty('isOpen');
  });

  it('leaves the drawer alone when an item is added', () => {
    // Adding is confirmed by the flight and the count, not by taking over the
    // screen — and a shopper adding several things should not have to dismiss
    // a drawer between each one.
    const opened = cartReducer(initialCartState, { type: 'OPEN_CART' });

    expect(add(initialCartState, black).isOpen).toBe(false);
    expect(add(opened, black).isOpen).toBe(true);
  });

  it('always rehydrates with the drawer closed', () => {
    const restored = hydrateCart({ isOpen: true, items: [] }, initialCartState);
    expect(restored.isOpen).toBe(false);
  });

  it('discards malformed persisted data', () => {
    const restored = hydrateCart(
      {
        items: [
          { lineId: 'ok', title: 'Fine', price: 10, quantity: 1 },
          { lineId: 'bad-qty', title: 'Nope', price: 10, quantity: -3 },
          { title: 'No line id', price: 10, quantity: 1 },
          'not an object',
          null,
        ],
      },
      initialCartState
    );

    expect(restored.items).toHaveLength(1);
    expect(restored.items[0].lineId).toBe('ok');
  });

  it('survives a corrupted payload', () => {
    expect(hydrateCart({ items: 'garbage' }, initialCartState).items).toEqual([]);
    expect(hydrateCart(null, initialCartState).items).toEqual([]);
  });
});
