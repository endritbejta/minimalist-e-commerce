import { describe, expect, it } from 'vitest';
import {
  createOrder,
  createOrderNumber,
  findOrder,
  getOrders,
  sanitizeOrders,
  saveOrder,
} from './orders';

const ORDER = {
  orderNumber: 'ME-K3P9QW',
  placedAt: '2026-09-11T10:00:00.000Z',
  items: [{ lineId: '1', title: 'Classic Wristwatch', price: 120, quantity: 1 }],
  totals: { subtotal: 120, discount: 0, shipping: 6, tax: 9.9, total: 135.9 },
};

describe('createOrderNumber', () => {
  it('is prefixed and six characters long', () => {
    expect(createOrderNumber(() => 0)).toMatch(/^ME-[A-Z0-9]{6}$/);
    expect(createOrderNumber()).toMatch(/^ME-[A-Z0-9]{6}$/);
  });

  it('leaves out the characters that get misread aloud', () => {
    // 200 numbers is enough to hit every position in the alphabet.
    const codes = Array.from({ length: 200 }, () => createOrderNumber()).join('');

    expect(codes).not.toMatch(/[IO01]/);
  });

  it('does not index past the end of the alphabet', () => {
    // A `random` at the top of its range must not append `undefined`.
    expect(createOrderNumber(() => 0.999999)).toMatch(/^ME-[A-Z0-9]{6}$/);
    expect(createOrderNumber(() => 1)).toMatch(/^ME-[A-Z0-9]{6}$/);
  });

  it('varies between calls', () => {
    const codes = new Set(Array.from({ length: 50 }, () => createOrderNumber()));

    expect(codes.size).toBeGreaterThan(40);
  });
});

describe('createOrder', () => {
  const input = {
    items: [{ lineId: '1', title: 'Classic Wristwatch', price: 120, quantity: 1 }],
    totals: { subtotal: 120, total: 135.9 },
    details: { email: 'sam@example.com', firstName: 'Sam' },
    shippingMethodId: 'standard',
    orderNumber: 'ME-TESTAB',
    placedAt: ORDER.placedAt,
  };

  it('records what was bought, and when', () => {
    const order = createOrder(input);

    expect(order.orderNumber).toBe('ME-TESTAB');
    expect(order.placedAt).toBe(ORDER.placedAt);
    expect(order.shippingMethodId).toBe('standard');
    expect(order.totals.total).toBe(135.9);
  });

  it('copies the cart lines rather than holding on to them', () => {
    const order = createOrder(input);

    // Emptying the cart after checkout must not empty the order.
    input.items[0].quantity = 99;
    input.items.length = 0;

    expect(order.items).toHaveLength(1);
    expect(order.items[0].quantity).toBe(1);
  });

  it("keeps only the coupon's identity, not its arithmetic", () => {
    const order = createOrder({
      ...input,
      coupon: { code: 'MINIMAL10', label: '10% off', percentOff: 10 },
    });

    // The discount is already settled in `totals`; re-deriving it later from a
    // stored percentage is how an order total starts disagreeing with itself.
    expect(order.coupon).toEqual({ code: 'MINIMAL10', label: '10% off' });
  });

  it('records no coupon when none was applied', () => {
    expect(createOrder(input).coupon).toBeNull();
  });

  it('generates its own number and timestamp when not given one', () => {
    const order = createOrder({ items: [], totals: { total: 0 } });

    expect(order.orderNumber).toMatch(/^ME-[A-Z0-9]{6}$/);
    expect(Number.isNaN(Date.parse(order.placedAt))).toBe(false);
  });
});

describe('sanitizeOrders', () => {
  it('keeps a well-formed order', () => {
    expect(sanitizeOrders([ORDER])).toEqual([ORDER]);
  });

  it('drops anything that is not a usable order', () => {
    expect(
      sanitizeOrders([
        ORDER,
        null,
        'ME-K3P9QW',
        {},
        { ...ORDER, orderNumber: '' },
        { ...ORDER, items: 'one watch' },
        { ...ORDER, totals: undefined },
        { ...ORDER, totals: { total: 'free' } },
      ])
    ).toEqual([ORDER]);
  });

  it('treats a non-array as no orders', () => {
    expect(sanitizeOrders(undefined)).toEqual([]);
    expect(sanitizeOrders({ orders: [ORDER] })).toEqual([]);
  });
});

describe('storage without a browser', () => {
  // These run in Node, where there is no localStorage at all — the same
  // situation as a browser with site data blocked. Nothing may throw.
  it('reads back nothing rather than failing', () => {
    expect(getOrders()).toEqual([]);
    expect(findOrder('ME-K3P9QW')).toBeUndefined();
  });

  it('reports a failed write instead of pretending it worked', () => {
    expect(saveOrder(ORDER)).toBe(false);
  });

  it('refuses to store a malformed order', () => {
    expect(saveOrder({ orderNumber: 'ME-BAD' })).toBe(false);
    expect(saveOrder(undefined)).toBe(false);
  });

  it('looks up nothing for a missing order number', () => {
    expect(findOrder('')).toBeUndefined();
    expect(findOrder(undefined)).toBeUndefined();
  });
});
