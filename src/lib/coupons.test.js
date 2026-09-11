import { describe, expect, it } from 'vitest';
import { findCoupon, getDiscountAmount } from './coupons';

describe('findCoupon', () => {
  it('accepts a code however it was typed', () => {
    expect(findCoupon('minimal10')?.code).toBe('MINIMAL10');
    expect(findCoupon('  MiNiMaL10  ')?.code).toBe('MINIMAL10');
  });

  it('rejects anything it does not know', () => {
    expect(findCoupon('NOPE')).toBeUndefined();
    expect(findCoupon('')).toBeUndefined();
    expect(findCoupon('   ')).toBeUndefined();
    expect(findCoupon(undefined)).toBeUndefined();
  });
});

describe('getDiscountAmount', () => {
  it('takes the stated percentage off', () => {
    expect(getDiscountAmount(180, { percentOff: 10 })).toBe(18);
    expect(getDiscountAmount(345, { percentOff: 20 })).toBe(69);
  });

  it('rounds to whole pence', () => {
    // 10% of 33.33 is 3.333, which must not leak a third of a penny into the
    // total and make the two printed figures disagree.
    expect(getDiscountAmount(33.33, { percentOff: 10 })).toBe(3.33);
  });

  it('discounts nothing without a coupon', () => {
    expect(getDiscountAmount(180, undefined)).toBe(0);
    expect(getDiscountAmount(180, { percentOff: 0 })).toBe(0);
  });

  it('never exceeds the subtotal or goes negative', () => {
    expect(getDiscountAmount(0, { percentOff: 20 })).toBe(0);
    expect(getDiscountAmount(-50, { percentOff: 20 })).toBe(0);
    expect(getDiscountAmount(100, { percentOff: 150 })).toBe(100);
  });

  it('shrugs off a non-numeric subtotal', () => {
    expect(getDiscountAmount('abc', { percentOff: 10 })).toBe(0);
  });
});
