import { describe, expect, it } from 'vitest';
import {
  FLY_SIZE_PX,
  buildFlightKeyframes,
  getFlightStyle,
} from './flyToCart';

const rect = (left, top, width = 100, height = 40) => ({ left, top, width, height });

// A button low on the page, and a cart icon up in the header.
const BUTTON = rect(200, 600, 120, 48);
const CART = rect(1200, 20, 40, 40);

const translationOf = (keyframe) => {
  const [, x, y] = keyframe.transform.match(/translate3d\((-?[\d.]+)px, (-?[\d.]+)px/);
  return { x: Number(x), y: Number(y) };
};

describe('getFlightStyle', () => {
  it('centres the disc over the button it left from', () => {
    const style = getFlightStyle(BUTTON);

    // Button centre is (260, 624); a 64px disc starts 32px up and to the left.
    expect(style.left).toBe(`${260 - FLY_SIZE_PX / 2}px`);
    expect(style.top).toBe(`${624 - FLY_SIZE_PX / 2}px`);
    expect(style.position).toBe('fixed');
  });
});

describe('buildFlightKeyframes', () => {
  it('starts at rest and lands on the cart centre', () => {
    const [start, , end] = buildFlightKeyframes(BUTTON, CART);

    expect(translationOf(start)).toEqual({ x: 0, y: 0 });
    // Button centre (260, 624) -> cart centre (1220, 40).
    expect(translationOf(end)).toEqual({ x: 960, y: -584 });
  });

  it('arcs above the straight line rather than sliding flat', () => {
    const [, middle] = buildFlightKeyframes(BUTTON, CART);
    const { x, y } = translationOf(middle);
    const straightLineY = -584 / 2;

    expect(x).toBeCloseTo(480);
    expect(y).toBeLessThan(straightLineY);
  });

  it('shrinks as it travels so it reads as entering the cart', () => {
    const frames = buildFlightKeyframes(BUTTON, CART);
    const scaleOf = (f) => Number(f.transform.match(/scale\(([\d.]+)\)/)[1]);

    expect(scaleOf(frames[0])).toBe(1);
    expect(scaleOf(frames[1])).toBeLessThan(scaleOf(frames[0]));
    expect(scaleOf(frames[2])).toBeLessThan(scaleOf(frames[1]));
  });

  it('caps the arc height on very long journeys', () => {
    const farAway = rect(20000, 600);
    const [, middle] = buildFlightKeyframes(BUTTON, farAway);
    const straightLineY = (620 - 624) / 2;

    // Arc is clamped to 180px, so the peak never runs off into the distance.
    expect(translationOf(middle).y).toBeGreaterThanOrEqual(straightLineY - 180);
  });

  it('handles an origin and target in the same place', () => {
    const frames = buildFlightKeyframes(BUTTON, BUTTON);
    expect(translationOf(frames[2])).toEqual({ x: 0, y: 0 });
  });
});
