import { describe, expect, it } from 'vitest';
import {
  FLIGHT_PATHS,
  FLY_SIZE_PX,
  buildFlightKeyframes,
  getFlightStyle,
  pickFlightPath,
} from './flyToCart';

const rect = (left, top, width = 100, height = 40) => ({ left, top, width, height });

// A button low on the page, and a cart icon up in the header.
const BUTTON = rect(200, 600, 120, 48);
const CART = rect(1200, 20, 40, 40);

const pointsOf = (frames) =>
  frames.map((frame) => {
    const [, x, y] = frame.transform.match(/translate3d\((-?[\d.]+)px, (-?[\d.]+)px/);
    return { x: Number(x), y: Number(y) };
  });

const scaleOf = (frame) => Number(frame.transform.match(/scale\(([\d.]+)\)/)[1]);

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
  it.each(FLIGHT_PATHS)('%s starts at rest and lands on the cart centre', (path) => {
    const points = pointsOf(buildFlightKeyframes(BUTTON, CART, path));

    expect(points.at(0)).toEqual({ x: 0, y: 0 });
    // Button centre (260, 624) -> cart centre (1220, 40).
    expect(points.at(-1).x).toBeCloseTo(960, 1);
    expect(points.at(-1).y).toBeCloseTo(-584, 1);
  });

  it.each(FLIGHT_PATHS)('%s shrinks steadily once it is under way', (path) => {
    const frames = buildFlightKeyframes(BUTTON, CART, path);
    const inFlight = frames.slice(Math.ceil(frames.length * 0.2));

    expect(scaleOf(frames.at(0))).toBe(1);
    inFlight.slice(1).forEach((frame, index) => {
      expect(scaleOf(frame)).toBeLessThanOrEqual(scaleOf(inFlight[index]));
    });
  });

  it.each(FLIGHT_PATHS)('%s stays fully opaque until it is nearly there', (path) => {
    const frames = buildFlightKeyframes(BUTTON, CART, path);
    const midway = frames[Math.floor(frames.length / 2)];

    expect(midway.opacity).toBe(1);
    expect(frames.at(-1).opacity).toBeLessThan(0.3);
  });

  it('traces four visibly different routes', () => {
    // Compare the midpoint of each route; if two coincide they would look the
    // same in flight.
    const midpoints = FLIGHT_PATHS.map((path) => {
      const points = pointsOf(buildFlightKeyframes(BUTTON, CART, path));
      return points[Math.floor(points.length / 2)];
    });

    midpoints.forEach((a, i) => {
      midpoints.slice(i + 1).forEach((b) => {
        expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThan(40);
      });
    });
  });

  it.each(FLIGHT_PATHS)('%s winds up away from the cart before setting off', (path) => {
    const points = pointsOf(buildFlightKeyframes(BUTTON, CART, path));

    // The cart is up and to the right, so a wind-up travels left and the disc
    // must be measurably behind where it started before it heads off.
    const pullBack = -Math.min(...points.map((p) => p.x));
    expect(pullBack).toBeGreaterThan(30);

    // And the recoil happens early, not somewhere in the middle.
    const furthestBack = points.findIndex((p) => p.x === Math.min(...points.map((q) => q.x)));
    expect(furthestBack).toBeLessThan(points.length * 0.3);
  });

  it.each(FLIGHT_PATHS)('%s swells slightly during the wind-up, then shrinks', (path) => {
    const frames = buildFlightKeyframes(BUTTON, CART, path);
    const peak = Math.max(...frames.map(scaleOf));

    expect(peak).toBeGreaterThan(1);
    expect(scaleOf(frames.at(-1))).toBeLessThan(0.2);
  });

  it('hookBack pulls back furthest of the four', () => {
    const pullBackFor = (path) =>
      -Math.min(...pointsOf(buildFlightKeyframes(BUTTON, CART, path)).map((p) => p.x));

    const others = FLIGHT_PATHS.filter((p) => p !== 'hookBack').map(pullBackFor);
    expect(pullBackFor('hookBack')).toBeGreaterThan(Math.max(...others));
  });

  it('dipUnder drops below the button before climbing', () => {
    const points = pointsOf(buildFlightKeyframes(BUTTON, CART, 'dipUnder'));

    expect(Math.max(...points.map((p) => p.y))).toBeGreaterThan(40);
  });

  it('sweepPast overshoots the cart before curling back', () => {
    const points = pointsOf(buildFlightKeyframes(BUTTON, CART, 'sweepPast'));

    expect(Math.max(...points.map((p) => p.x))).toBeGreaterThan(960);
  });

  it('falls back to a known route when handed an unknown one', () => {
    const unknown = pointsOf(buildFlightKeyframes(BUTTON, CART, 'not-a-route'));
    const fallback = pointsOf(buildFlightKeyframes(BUTTON, CART, 'soarOver'));

    expect(unknown).toEqual(fallback);
  });

  it('handles an origin and target in the same place', () => {
    const points = pointsOf(buildFlightKeyframes(BUTTON, BUTTON, 'soarOver'));
    expect(points.at(-1)).toEqual({ x: 0, y: 0 });
  });
});

describe('pickFlightPath', () => {
  it('only ever returns a route that exists', () => {
    for (let i = 0; i < 200; i += 1) {
      expect(FLIGHT_PATHS).toContain(pickFlightPath());
    }
  });

  it('reaches every route over enough clicks', () => {
    const seen = new Set(Array.from({ length: 400 }, pickFlightPath));
    expect(seen.size).toBe(FLIGHT_PATHS.length);
  });
});
