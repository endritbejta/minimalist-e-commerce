import { describe, expect, it } from 'vitest';
import {
  DEFAULT_SHIPPING_METHOD_ID,
  FREE_SHIPPING_THRESHOLD,
  TAX_RATE,
  amountToFreeShipping,
  getOrderTotals,
  getShippingCost,
  getShippingMethod,
} from './checkout';

const FREE_SHIP_COUPON = { code: 'FREESHIP', percentOff: 0, freeShipping: true };

describe('getShippingMethod', () => {
  it('resolves a known method', () => {
    expect(getShippingMethod('express').label).toBe('Express');
  });

  it('falls back to the default rather than returning undefined', () => {
    // An unknown id must still price the order; undefined here would reach the
    // totals as NaN and render "$NaN" at the moment of purchase.
    expect(getShippingMethod('teleport').id).toBe(DEFAULT_SHIPPING_METHOD_ID);
    expect(getShippingMethod(undefined).id).toBe(DEFAULT_SHIPPING_METHOD_ID);
  });
});

describe('getShippingCost', () => {
  it('charges the method price below the threshold', () => {
    const under = FREE_SHIPPING_THRESHOLD - 1;

    expect(getShippingCost('standard', under)).toBe(6);
    expect(getShippingCost('express', under)).toBe(14);
    expect(getShippingCost('overnight', under)).toBe(28);
  });

  it('gives standard delivery away at and above the threshold', () => {
    expect(getShippingCost('standard', FREE_SHIPPING_THRESHOLD)).toBe(0);
    expect(getShippingCost('standard', FREE_SHIPPING_THRESHOLD + 50)).toBe(0);
  });

  it('keeps charging for the faster methods however large the order', () => {
    expect(getShippingCost('express', FREE_SHIPPING_THRESHOLD * 10)).toBe(14);
    expect(getShippingCost('overnight', FREE_SHIPPING_THRESHOLD * 10)).toBe(28);
  });

  it('is free with a shipping coupon, whatever the method', () => {
    expect(getShippingCost('overnight', 20, FREE_SHIP_COUPON)).toBe(0);
    expect(getShippingCost('express', 20, FREE_SHIP_COUPON)).toBe(0);
  });

  it('is not made free by a percentage coupon', () => {
    expect(getShippingCost('standard', FREE_SHIPPING_THRESHOLD - 1, { percentOff: 20 })).toBe(6);
  });

  it('charges nothing when there is nothing to deliver', () => {
    expect(getShippingCost('standard', 0)).toBe(0);
    expect(getShippingCost('standard', -10)).toBe(0);
  });
});

describe('getOrderTotals', () => {
  it('adds delivery and tax to the discounted goods', () => {
    const totals = getOrderTotals({ subtotal: 80, shippingMethodId: 'standard' });

    expect(totals).toEqual({
      subtotal: 80,
      discount: 0,
      shipping: 6,
      tax: 6.6,
      total: 92.6,
    });
  });

  it('taxes the goods after the discount, not before', () => {
    const totals = getOrderTotals({
      subtotal: 200,
      discount: 40,
      shippingMethodId: 'express',
    });

    expect(totals.tax).toBe(Math.round(160 * TAX_RATE * 100) / 100);
    expect(totals.total).toBe(160 + 14 + totals.tax);
  });

  it('charges nothing for standard delivery once the threshold is met', () => {
    const totals = getOrderTotals({
      subtotal: FREE_SHIPPING_THRESHOLD,
      shippingMethodId: 'standard',
    });

    expect(totals.shipping).toBe(0);
  });

  it('loses the free delivery when a discount drops the order below the threshold', () => {
    // The threshold is measured on what is actually paid for the goods, so an
    // order that qualifies before a discount need not qualify after one.
    const subtotal = FREE_SHIPPING_THRESHOLD + 10;

    expect(getOrderTotals({ subtotal, shippingMethodId: 'standard' }).shipping).toBe(0);
    expect(
      getOrderTotals({ subtotal, discount: 20, shippingMethodId: 'standard' }).shipping
    ).toBe(6);
  });

  it('never lets a discount push the goods, tax or total negative', () => {
    const totals = getOrderTotals({ subtotal: 50, discount: 500 });

    expect(totals.discount).toBe(50);
    expect(totals.tax).toBe(0);
    // Nothing left to deliver, so nothing is charged for delivering it.
    expect(totals.shipping).toBe(0);
    expect(totals.total).toBe(0);
  });

  it('rounds every line to whole pence', () => {
    const totals = getOrderTotals({ subtotal: 33.33, discount: 3.33, shippingMethodId: 'standard' });

    for (const amount of Object.values(totals)) {
      expect(Math.round(amount * 100) / 100).toBe(amount);
    }
  });

  it('survives being called with nothing at all', () => {
    expect(getOrderTotals()).toEqual({
      subtotal: 0,
      discount: 0,
      shipping: 0,
      tax: 0,
      total: 0,
    });
  });

  it('shrugs off a non-numeric subtotal', () => {
    expect(getOrderTotals({ subtotal: 'abc' }).total).toBe(0);
  });
});

describe('amountToFreeShipping', () => {
  it('reports the shortfall', () => {
    expect(amountToFreeShipping(FREE_SHIPPING_THRESHOLD - 30)).toBe(30);
  });

  it('reports nothing once the threshold is met', () => {
    expect(amountToFreeShipping(FREE_SHIPPING_THRESHOLD)).toBe(0);
    expect(amountToFreeShipping(999)).toBe(0);
  });
});
