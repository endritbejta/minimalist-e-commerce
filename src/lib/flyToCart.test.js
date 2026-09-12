import { describe, expect, it } from 'vitest';
import {
  FLIGHT_PATHS,
  FLY_SIZE_COMPACT_PX,
  FLY_SIZE_PX,
  buildFlightKeyframes,
  centerOf,
  getFlightOrigin,
  getFlightSize,
  getFlightStyle,
  pickFlightPath,
} from './flyToCart';

const rect = (left, top, width = 100, height = 40) => ({ left, top, width, height });

// A button low on the page, and a cart icon up in the header.
const BUTTON = rect(200, 600, 120, 48);
const CART = rect(1200, 20, 40, 40);

// Both ends of a flight are points; these are the centres of the two above.
const FROM = { x: 260, y: 624 };
const TO = { x: 1220, y: 40 };

const pointsOf = (frames) =>
  frames.map((frame) => {
    const [, x, y] = frame.transform.match(/translate3d\((-?[\d.]+)px, (-?[\d.]+)px/);
    return { x: Number(x), y: Number(y) };
  });

const scaleOf = (frame) => Number(frame.transform.match(/scale\(([\d.]+)\)/)[1]);

describe('getFlightSize', () => {
  it('uses a smaller disc on phone-width screens', () => {
    expect(getFlightSize(375)).toBe(FLY_SIZE_COMPACT_PX);
    expect(getFlightSize(639)).toBe(FLY_SIZE_COMPACT_PX);
    expect(getFlightSize(640)).toBe(FLY_SIZE_PX);
    expect(getFlightSize(1440)).toBe(FLY_SIZE_PX);
  });

  it('keeps the compact disc a sensible fraction of a small screen', () => {
    // A disc wider than about a fifth of the screen reads as a lump.
    expect(FLY_SIZE_COMPACT_PX / 375).toBeLessThan(0.2);
  });

  it('caps the disc however wide the screen gets', () => {
    // There is no viewport big enough to grow it past the ceiling.
    for (const width of [640, 1280, 1920, 3840]) {
      expect(getFlightSize(width)).toBe(FLY_SIZE_PX);
    }
  });
});

describe('centerOf', () => {
  it('finds the middle of a rectangle', () => {
    expect(centerOf(BUTTON)).toEqual(FROM);
    expect(centerOf(CART)).toEqual(TO);
  });
});

describe('getFlightOrigin', () => {
  it('launches from the pointer when there is one', () => {
    // Clicking the left edge of a wide button should start the disc there,
    // not throw it to the middle of the button first.
    const leftEdge = { x: 205, y: 620 };
    expect(getFlightOrigin(BUTTON, leftEdge)).toEqual(leftEdge);
  });

  it('falls back to the centre for a keyboard activation', () => {
    // Enter and Space report no coordinates, so there is no pointer to use.
    expect(getFlightOrigin(BUTTON, undefined)).toEqual(FROM);
  });
});

describe('getFlightStyle', () => {
  it('centres the disc over the button it left from', () => {
    const style = getFlightStyle(FROM);

    // Button centre is (260, 624); a 64px disc starts 32px up and to the left.
    expect(style.left).toBe(`${260 - FLY_SIZE_PX / 2}px`);
    expect(style.top).toBe(`${624 - FLY_SIZE_PX / 2}px`);
    expect(style.position).toBe('fixed');
  });

  it('stays centred at the compact size too', () => {
    const style = getFlightStyle(FROM, FLY_SIZE_COMPACT_PX);

    expect(style.left).toBe(`${260 - FLY_SIZE_COMPACT_PX / 2}px`);
    expect(style.top).toBe(`${624 - FLY_SIZE_COMPACT_PX / 2}px`);
    expect(style.width).toBe(`${FLY_SIZE_COMPACT_PX}px`);
  });
});

describe('buildFlightKeyframes', () => {
  it.each(FLIGHT_PATHS)('%s starts at rest and lands on the cart centre', (path) => {
    const points = pointsOf(buildFlightKeyframes(FROM, TO, path));

    expect(points.at(0)).toEqual({ x: 0, y: 0 });
    // Button centre (260, 624) -> cart centre (1220, 40).
    expect(points.at(-1).x).toBeCloseTo(960, 1);
    expect(points.at(-1).y).toBeCloseTo(-584, 1);
  });

  it.each(FLIGHT_PATHS)('%s shrinks steadily once it is under way', (path) => {
    const frames = buildFlightKeyframes(FROM, TO, path);
    const inFlight = frames.slice(Math.ceil(frames.length * 0.2));

    expect(scaleOf(frames.at(0))).toBe(1);
    inFlight.slice(1).forEach((frame, index) => {
      expect(scaleOf(frame)).toBeLessThanOrEqual(scaleOf(inFlight[index]));
    });
  });

  it.each(FLIGHT_PATHS)('%s stays fully opaque until it is nearly there', (path) => {
    const frames = buildFlightKeyframes(FROM, TO, path);
    const midway = frames[Math.floor(frames.length / 2)];

    expect(midway.opacity).toBe(1);
    expect(frames.at(-1).opacity).toBeLessThan(0.3);
  });

  it('traces four visibly different routes', () => {
    // Compare the midpoint of each route; if two coincide they would look the
    // same in flight.
    const midpoints = FLIGHT_PATHS.map((path) => {
      const points = pointsOf(buildFlightKeyframes(FROM, TO, path));
      return points[Math.floor(points.length / 2)];
    });

    midpoints.forEach((a, i) => {
      midpoints.slice(i + 1).forEach((b) => {
        expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThan(40);
      });
    });
  });

  it.each(FLIGHT_PATHS)('%s winds up away from the cart before setting off', (path) => {
    const points = pointsOf(buildFlightKeyframes(FROM, TO, path));

    // The cart is up and to the right, so a wind-up travels left and the disc
    // must be measurably behind where it started before it heads off.
    const pullBack = -Math.min(...points.map((p) => p.x));
    expect(pullBack).toBeGreaterThan(30);

    // And the recoil happens early, not somewhere in the middle.
    const furthestBack = points.findIndex((p) => p.x === Math.min(...points.map((q) => q.x)));
    expect(furthestBack).toBeLessThan(points.length * 0.3);
  });

  it.each(FLIGHT_PATHS)('%s swells slightly during the wind-up, then shrinks', (path) => {
    const frames = buildFlightKeyframes(FROM, TO, path);
    const peak = Math.max(...frames.map(scaleOf));

    expect(peak).toBeGreaterThan(1);
    expect(scaleOf(frames.at(-1))).toBeLessThan(0.2);
  });

  const DX = 960;
  const DY = -584;
  const LENGTH = Math.hypot(DX, DY);

  /**
   * Each sample as how far along the line to the cart it sits, and how far off
   * that line. Positive `off` is below the line, negative above it.
   *
   * Measured against distance travelled rather than against the keyframe index:
   * "near the cart" is a place, not a moment, and the two part company on a
   * curve that covers ground unevenly.
   */
  const samplesFrom = (path) =>
    pointsOf(buildFlightKeyframes(FROM, TO, path)).map((p) => ({
      along: (p.x * DX + p.y * DY) / (LENGTH * LENGTH),
      off: p.y - ((p.x * DX + p.y * DY) / (LENGTH * LENGTH)) * DY,
    }));

  const deviationsFrom = (path) => samplesFrom(path).map((s) => s.off);

  // Where the flight proper begins, once the wind-up has finished.
  const flightOnly = (path) => samplesFrom(path).filter((s) => s.along > 0);

  it.each(['dipUnder', 'dipLate'])('%s runs below the straight line', (path) => {
    const deviations = deviationsFrom(path);
    expect(Math.max(...deviations)).toBeGreaterThan(100);
    expect(deviations[Math.floor(deviations.length / 2)]).toBeGreaterThan(0);
  });

  it.each(['archOver', 'archEarly'])('%s arcs above the straight line', (path) => {
    const deviations = deviationsFrom(path);
    expect(Math.min(...deviations)).toBeLessThan(-100);
    expect(deviations[Math.floor(deviations.length / 2)]).toBeLessThan(0);
  });

  it('swings the four routes by comparable amounts', () => {
    // The arcing routes are no longer the dipping ones reflected — the page is
    // not symmetric enough for that — but they should still read as one family
    // rather than as two big curves and two timid ones.
    const swings = FLIGHT_PATHS.map((path) =>
      Math.max(...deviationsFrom(path).map(Math.abs))
    );

    expect(Math.min(...swings) / Math.max(...swings)).toBeGreaterThan(0.6);
  });

  it.each(['archOver', 'archEarly'])('%s never climbs above the cart', (path) => {
    // The cart sits in the header, so there is nothing above it to fly through.
    // Reflecting a dip used to sail the disc up over the header before dropping
    // it back down; `y` here is relative to the button, and the cart is at -584.
    const highest = Math.min(...pointsOf(buildFlightKeyframes(FROM, TO, path)).map((p) => p.y));

    expect(highest).toBeGreaterThanOrEqual(-584);
  });

  it.each(['archOver', 'archEarly'])('%s leaves along the line, not straight off it', (path) => {
    const flight = flightOnly(path);
    const [first, second] = flight;

    // How much ground it covers toward the cart over its first step, against
    // how far it moves sideways. A near-vertical launch out of the button
    // barely advances and swings a long way off.
    const advance = (second.along - first.along) * LENGTH;
    const sideways = Math.abs(second.off - first.off);

    expect(advance).toBeGreaterThan(sideways);
  });

  it.each(FLIGHT_PATHS)('%s comes into the cart close to straight', (path) => {
    const samples = samplesFrom(path);
    const peak = Math.max(...samples.map((s) => Math.abs(s.off)));
    const tail = Math.max(
      ...samples.filter((s) => s.along > 0.85).map((s) => Math.abs(s.off))
    );

    // The disc used to still be most of its widest swing off the line with a
    // sixth of the ground left, so it arrived hooking sideways into the cart
    // instead of running into it.
    expect(tail / peak).toBeLessThan(0.5);
  });

  it('winds up downward on two routes and upward on the other two', () => {
    // The pull-back tells you which way the disc is about to go: the routes
    // that swing low drop into it, the ones that arc over lift instead.
    const windUpEnd = (path) => {
      const points = pointsOf(buildFlightKeyframes(FROM, TO, path));
      return points[Math.ceil(points.length * 0.18)].y;
    };

    // y grows downward, so a positive end means the disc dropped.
    const dropped = FLIGHT_PATHS.filter((path) => windUpEnd(path) > 0);
    const lifted = FLIGHT_PATHS.filter((path) => windUpEnd(path) < 0);

    expect(dropped).toEqual(['dipUnder', 'dipLate']);
    expect(lifted).toEqual(['archOver', 'archEarly']);
  });

  it('opens archEarly by going back, not by rising', () => {
    const points = pointsOf(buildFlightKeyframes(FROM, TO, 'archEarly'));
    const windUp = points.slice(0, Math.ceil(points.length * 0.18) + 1);
    const furthestBack = windUp.reduce((a, b) => (b.x < a.x ? b : a));
    const totalLift = -windUp.at(-1).y;

    // By the time it is as far back as it gets, most of the lift should still
    // be ahead of it. Rising in lockstep with the retreat reads as the disc
    // setting off upward rather than being drawn back first.
    expect(-furthestBack.y / totalLift).toBeLessThan(0.45);

    // And the very first movement is near enough level.
    const [, first] = windUp;
    expect(Math.abs(first.y)).toBeLessThan(Math.abs(first.x) * 0.25);
  });

  it('opens the two arcing routes differently', () => {
    // archOver lifts as it retreats; archEarly slides back and then lifts. If
    // both opened the same way there would be no reason to have two.
    const opening = (path) => {
      const points = pointsOf(buildFlightKeyframes(FROM, TO, path));
      const [, first] = points;
      return Math.abs(Math.atan2(-first.y, -first.x) * (180 / Math.PI));
    };

    expect(opening('archOver') - opening('archEarly')).toBeGreaterThan(15);
  });

  it.each(FLIGHT_PATHS)('%s still retreats from the cart however it winds up', (path) => {
    const points = pointsOf(buildFlightKeyframes(FROM, TO, path));

    // Lifting instead of dropping must not turn the wind-up into an early
    // start: the horizontal retreat is what makes it read as a wind-up at all.
    expect(-Math.min(...points.map((p) => p.x))).toBeGreaterThan(20);
  });

  it.each(FLIGHT_PATHS)('%s curves through the wind-up instead of sliding back', (path) => {
    const points = pointsOf(buildFlightKeyframes(FROM, TO, path));
    const windUp = points.slice(0, Math.ceil(points.length * 0.18) + 1);
    const settled = windUp.at(-1);
    const chord = Math.hypot(settled.x, settled.y);

    // How far the pull-back bows off the straight chord to where it ends up.
    // A linear retreat sits exactly on that chord and measures zero.
    const bow = Math.max(
      ...windUp.map((p) => Math.abs((p.x * settled.y - p.y * settled.x) / chord))
    );

    expect(bow).toBeGreaterThan(10);
  });

  it('falls back to a known route when handed an unknown one', () => {
    const unknown = pointsOf(buildFlightKeyframes(FROM, TO, 'not-a-route'));
    const fallback = pointsOf(buildFlightKeyframes(FROM, TO, 'dipUnder'));

    expect(unknown).toEqual(fallback);
  });

  it('handles an origin and target in the same place', () => {
    const points = pointsOf(buildFlightKeyframes(FROM, FROM, 'dipUnder'));
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
