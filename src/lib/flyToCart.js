/**
 * Geometry for the add-to-cart flight.
 *
 * Kept free of DOM access so the maths can be exercised directly in tests: the
 * caller passes plain rectangles and gets back a style object and a keyframe
 * list ready for Element.animate().
 */

export const FLY_DURATION_MS = 1000;
// The disc never grows past this, however wide the screen gets. It is a token
// standing in for a product, not a picture of one, so there is nothing to gain
// from more pixels — past about this size it stops reading as a thing being
// carried and starts reading as a panel sliding across the page.
export const FLY_SIZE_PX = 52;
// A disc much over a tenth of a phone's width reads as a lump rather than a
// product, so narrow screens get a smaller one again.
export const FLY_SIZE_COMPACT_PX = 44;
const COMPACT_VIEWPORT_PX = 640;
export const FLY_EASING = 'cubic-bezier(.53,.45,.33,1.06)';

/**
 * The four routes a disc can take. One is chosen at random per click so
 * repeated adds do not trace the same line over and over.
 */
export const FLIGHT_PATHS = ['dipUnder', 'dipLate', 'archOver', 'archEarly'];

// The curve is sampled into this many keyframes. Element.animate() interpolates
// linearly between them, so enough points are needed for the path to read as a
// curve rather than a series of straight segments.
const SAMPLE_COUNT = 30;

const centerOf = (rect) => ({
  x: rect.left + rect.width / 2,
  y: rect.top + rect.height / 2,
});

/**
 * How much of the flight is spent winding up before the disc sets off.
 */
const RECOIL_FRACTION = 0.18;

/**
 * Reflects a point across the straight line from the button to the cart.
 * Mirroring a low route this way produces its exact counterpart above the line,
 * so an inverted route keeps the character of the one it came from.
 * @param {{x: number, y: number}} point - The point to reflect.
 * @param {number} dx - Horizontal distance to the cart.
 * @param {number} dy - Vertical distance to the cart.
 * @returns {{x: number, y: number}} The reflected point.
 */
const mirrorAcrossPath = (point, dx, dy) => {
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared === 0) return { ...point };

  const projection = (point.x * dx + point.y * dy) / lengthSquared;

  return {
    x: 2 * projection * dx - point.x,
    y: 2 * projection * dy - point.y,
  };
};

/**
 * The two shapes every route is built from, in a space where the button sits at
 * (0, 0), the cart at (dx, dy), and y grows downward — so the cart is usually at
 * a negative y and "dipping down" means a positive one.
 *
 * Both drop beneath the button and run low before climbing into the cart; they
 * differ in how deep the dip is and how late the climb comes.
 *
 * A shape is two phases. First the disc pulls back to `recoil`, away from the
 * cart, as a wind-up. Then it travels from there along a cubic Bézier shaped by
 * `controls`. Doing the recoil as its own phase, rather than as a backward
 * control point on one long curve, is what makes it visible at all — a single
 * Bézier absorbs the backward pull into the forward swing.
 *
 * `back` is the wind-up distance and `awayX` points horizontally away from the
 * cart.
 */
const BASE_SHAPES = {
  // Drops deepest, then climbs steeply at the end.
  dip: {
    recoil: (back, awayX) => ({ x: awayX * back * 0.45, y: back * 1.15 }),
    controls: (dx, dy, back) => [
      { x: dx * 0.15, y: back * 1.4 },
      { x: dx * 1.05, y: dy * 0.12 },
    ],
  },
  // A shallower dip held further across, with an even later climb.
  dipHeld: {
    recoil: (back, awayX) => ({ x: awayX * back * 0.5, y: back * 0.8 }),
    controls: (dx, dy, back) => [
      { x: dx * 0.4, y: back * 1.1 },
      { x: dx * 1.14, y: dy * 0.04 },
    ],
  },
};

/**
 * The routes. Two run below the line of travel; the other two are those same
 * two reflected across it, so they arc above instead — the same motion turned
 * upside down rather than a different idea.
 *
 * Only the flight is mirrored. The wind-up stays a pull back and down for every
 * route, so the gesture that starts the animation always reads the same way.
 */
const ROUTES = {
  dipUnder: { shape: BASE_SHAPES.dip },
  dipLate: { shape: BASE_SHAPES.dipHeld },
  archOver: { shape: BASE_SHAPES.dip, inverted: true },
  archEarly: { shape: BASE_SHAPES.dipHeld, inverted: true },
};

/**
 * Picks a route at random.
 * @returns {string} One of FLIGHT_PATHS.
 */
export const pickFlightPath = () =>
  FLIGHT_PATHS[Math.floor(Math.random() * FLIGHT_PATHS.length)];

/**
 * The disc diameter for a given viewport width.
 * @param {number} viewportWidth - Width of the window, in CSS pixels.
 * @returns {number} The diameter to use.
 */
export const getFlightSize = (viewportWidth) =>
  viewportWidth < COMPACT_VIEWPORT_PX ? FLY_SIZE_COMPACT_PX : FLY_SIZE_PX;

/**
 * Fixed-position placement for the flying element, centred over its origin.
 * @param {{left: number, top: number, width: number, height: number}} originRect - The clicked button.
 * @param {number} [size=FLY_SIZE_PX] - Diameter of the flying disc.
 * @returns {Object} Inline style positioning the element before it animates.
 */
export const getFlightStyle = (originRect, size = FLY_SIZE_PX) => {
  const origin = centerOf(originRect);

  return {
    position: 'fixed',
    left: `${origin.x - size / 2}px`,
    top: `${origin.y - size / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
  };
};

// Cubic Bézier through four points.
const cubicAt = (u, p0, p1, p2, p3) => {
  const m = 1 - u;
  const a = m * m * m;
  const b = 3 * m * m * u;
  const c = 3 * m * u * u;
  const d = u * u * u;

  return {
    x: a * p0.x + b * p1.x + c * p2.x + d * p3.x,
    y: a * p0.y + b * p1.y + c * p2.y + d * p3.y,
  };
};

/**
 * Keyframes tracing one of the routes from the button to the cart.
 *
 * The disc shrinks as it travels and fades only at the very end, so it reads as
 * being drawn into the cart rather than dissolving on the way.
 *
 * @param {{left: number, top: number, width: number, height: number}} originRect - The clicked button.
 * @param {{left: number, top: number, width: number, height: number}} targetRect - The cart button.
 * @param {string} [path='dipUnder'] - Which route to trace; see FLIGHT_PATHS.
 * @returns {Object[]} Keyframes for Element.animate().
 */
export const buildFlightKeyframes = (originRect, targetRect, path = 'dipUnder') => {
  const origin = centerOf(originRect);
  const target = centerOf(targetRect);

  const dx = target.x - origin.x;
  const dy = target.y - origin.y;

  // Longer journeys wind up further, but not without limit.
  const distance = Math.hypot(dx, dy);
  const back = Math.min(130, 50 + distance * 0.07);
  // Away from the cart horizontally — the direction the wind-up travels.
  const awayX = -Math.sign(dx || 1);

  const route = ROUTES[path] ?? ROUTES.dipUnder;
  const recoil = route.shape.recoil(back, awayX);
  const controls = route.shape.controls(dx, dy, back);
  const [c1, c2] = route.inverted
    ? controls.map((point) => mirrorAcrossPath(point, dx, dy))
    : controls;
  const destination = { x: dx, y: dy };

  return Array.from({ length: SAMPLE_COUNT }, (_, index) => {
    const t = index / (SAMPLE_COUNT - 1);
    let point;
    let scale;

    if (t <= RECOIL_FRACTION) {
      // Wind-up: ease out into the pull-back, swelling slightly as it loads.
      const u = t / RECOIL_FRACTION;
      const eased = 1 - (1 - u) * (1 - u);
      point = { x: recoil.x * eased, y: recoil.y * eased };
      scale = 1 + 0.08 * eased;
    } else {
      // Flight: from the wound-up position to the cart.
      const u = (t - RECOIL_FRACTION) / (1 - RECOIL_FRACTION);
      point = cubicAt(u, recoil, c1, c2, destination);
      scale = 1.08 - 0.93 * Math.pow(u, 1.5);
    }

    const opacity = t < 0.85 ? 1 : 1 - 0.8 * ((t - 0.85) / 0.15);

    return {
      transform: `translate3d(${point.x.toFixed(2)}px, ${point.y.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`,
      opacity: Number(opacity.toFixed(3)),
      offset: Number(t.toFixed(4)),
    };
  });
};

/**
 * The little squash the cart icon does as the item lands.
 * @returns {Object[]} Keyframes for Element.animate().
 */
export const buildCartBumpKeyframes = () => [
  { transform: 'scale(1)' },
  { transform: 'scale(1.28)', offset: 0.4 },
  { transform: 'scale(0.94)', offset: 0.7 },
  { transform: 'scale(1)' },
];
