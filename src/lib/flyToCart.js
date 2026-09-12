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
export const FLY_SIZE_PX = 42;
// A disc much over a tenth of a phone's width reads as a lump rather than a
// product, so narrow screens get a smaller one again.
export const FLY_SIZE_COMPACT_PX = 37;
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

/**
 * The middle of a rectangle.
 * @param {{left: number, top: number, width: number, height: number}} rect - Any rectangle.
 * @returns {{x: number, y: number}} Its centre point.
 */
export const centerOf = (rect) => ({
  x: rect.left + rect.width / 2,
  y: rect.top + rect.height / 2,
});

/**
 * Where a flight should start.
 *
 * The pointer wins when there is one, so the disc appears under the finger or
 * cursor rather than jumping to the middle of a wide button. A keyboard
 * activation has no coordinates, and falls back to the button's centre.
 *
 * @param {{left: number, top: number, width: number, height: number}} originRect - The activated control.
 * @param {{x: number, y: number}} [pointer] - Where the click landed, if it came from a pointer.
 * @returns {{x: number, y: number}} The point the disc launches from.
 */
export const getFlightOrigin = (originRect, pointer) => pointer ?? centerOf(originRect);

/**
 * How much of the flight is spent winding up before the disc sets off.
 */
const RECOIL_FRACTION = 0.18;

/**
 * How far the flight bows away from the straight line to the cart.
 *
 * Scaled to the journey rather than to the wind-up, which is capped: a card
 * sitting just below the header has a short trip, and a bow sized for a
 * full-page journey would throw the disc off the bottom of the screen on its
 * way somewhere a few inches above.
 *
 * @param {number} distance - Straight-line distance from the button to the cart.
 * @returns {number} The bow depth, in pixels.
 */
const getDipDepth = (distance) => Math.min(260, distance * 0.25);

/**
 * The wind-up: where the disc pulls back to before it sets off, and the control
 * that bends that retreat into a curve — a straight slide reads as the disc
 * slipping rather than being drawn back.
 *
 * Two of them drop and two lift, so the pull-back already tells you which way
 * the disc is about to go: the routes that swing low wind up downward, and the
 * ones that arc over lift instead. Every one of them still retreats
 * horizontally away from the cart, which is what makes it read as a wind-up
 * rather than as the flight starting early.
 *
 * `back` is the wind-up distance and `awayX` points horizontally away from the
 * cart.
 */
const WIND_UPS = {
  drop: {
    settle: (back, awayX) => ({ x: awayX * back * 0.45, y: back * 1.15 }),
    control: (back, awayX) => ({ x: awayX * back * 0.7, y: back * 0.3 }),
  },
  dropShallow: {
    settle: (back, awayX) => ({ x: awayX * back * 0.5, y: back * 0.8 }),
    control: (back, awayX) => ({ x: awayX * back * 0.75, y: back * 0.2 }),
  },
  lift: {
    settle: (back, awayX) => ({ x: awayX * back * 0.45, y: -back * 0.95 }),
    control: (back, awayX) => ({ x: awayX * back * 0.7, y: -back * 0.22 }),
  },
  // Retreats before it lifts, rather than doing both at once: the control sits
  // further back than the settle and a shade *below* the button, so the disc
  // slides away almost level and only then swings up. It leaves at about 5
  // degrees where `lift` leaves at 30, which is what keeps the two arcing
  // routes from opening the same way.
  liftShallow: {
    settle: (back, awayX) => ({ x: awayX * back * 0.55, y: -back * 0.72 }),
    control: (back, awayX) => ({ x: awayX * back * 0.95, y: back * 0.1 }),
  },
};

/**
 * The four routes, as the two control points of the flight's curve.
 *
 * Each is `[along, offLine]`: how far along the line from the button to the
 * cart, and how far to the side of it — in multiples of the dip depth, positive
 * above the line. Stating them against the line rather than as raw x and y
 * multipliers is what makes the shapes legible, and it is what the two upper
 * routes needed.
 *
 * Those two used to be the lower pair reflected across the line. It was a tidy
 * idea, but the page is not symmetric: there is open room below a product card,
 * while above the cart there is the header edge and then nothing. A reflected
 * dip therefore launched the disc near-vertically out of the button and sailed
 * it over the header before dropping in. They are their own shapes now — first
 * control low and well along, so the disc leaves along the line and curves up
 * rather than shooting off it, and second control placed early enough that the
 * descent into the cart begins around two-thirds of the way across.
 */
const ROUTES = {
  dipUnder: { windUp: WIND_UPS.drop, controls: [[0.22, -1.55], [0.72, -0.42]] },
  dipLate: { windUp: WIND_UPS.dropShallow, controls: [[0.52, -1.7], [0.84, -0.22]] },
  archOver: { windUp: WIND_UPS.lift, controls: [[0.5, 0.6], [0.54, 1.15]] },
  archEarly: { windUp: WIND_UPS.liftShallow, controls: [[0.38, 0.75], [0.48, 1.3]] },
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
 * @param {{x: number, y: number}} origin - Where the disc launches from.
 * @param {number} [size=FLY_SIZE_PX] - Diameter of the flying disc.
 * @returns {Object} Inline style positioning the element before it animates.
 */
export const getFlightStyle = (origin, size = FLY_SIZE_PX) => {
  return {
    position: 'fixed',
    left: `${origin.x - size / 2}px`,
    top: `${origin.y - size / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
  };
};

// Quadratic Bézier through three points.
const quadraticAt = (u, p0, p1, p2) => {
  const m = 1 - u;

  return {
    x: m * m * p0.x + 2 * m * u * p1.x + u * u * p2.x,
    y: m * m * p0.y + 2 * m * u * p1.y + u * u * p2.y,
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
 * @param {{x: number, y: number}} origin - Where the disc launches from.
 * @param {{x: number, y: number}} target - The centre of the cart control.
 * @param {string} [path='dipUnder'] - Which route to trace; see FLIGHT_PATHS.
 * @returns {Object[]} Keyframes for Element.animate().
 */
export const buildFlightKeyframes = (origin, target, path = 'dipUnder') => {
  const dx = target.x - origin.x;
  const dy = target.y - origin.y;

  // Longer journeys wind up further, but not without limit.
  const distance = Math.hypot(dx, dy);
  const back = Math.min(130, 50 + distance * 0.07);
  // Away from the cart horizontally — the direction the wind-up travels.
  const awayX = -Math.sign(dx || 1);

  const route = ROUTES[path] ?? ROUTES.dipUnder;
  const recoil = route.windUp.settle(back, awayX);
  const recoilControl = route.windUp.control(back, awayX);

  // The unit vector along the line to the cart. The zero guard is for a button
  // sitting exactly on the cart, which has no direction to speak of.
  const safeDistance = distance || 1;
  const ux = dx / safeDistance;
  const uy = dy / safeDistance;
  const dip = getDipDepth(distance);

  /**
   * A point `along` the way to the cart and `offLine` to the side of it,
   * measured in dip depths, positive above the line.
   */
  const chordAt = (along, offLine) => ({
    x: dx * along + uy * offLine * dip,
    y: dy * along - ux * offLine * dip,
  });

  const [c1, c2] = route.controls.map(([along, offLine]) => chordAt(along, offLine));
  const destination = { x: dx, y: dy };
  const ORIGIN = { x: 0, y: 0 };

  return Array.from({ length: SAMPLE_COUNT }, (_, index) => {
    const t = index / (SAMPLE_COUNT - 1);
    let point;
    let scale;

    if (t <= RECOIL_FRACTION) {
      // Wind-up: ease out along the pull-back curve, swelling as it loads.
      const u = t / RECOIL_FRACTION;
      const eased = 1 - (1 - u) * (1 - u);
      point = quadraticAt(eased, ORIGIN, recoilControl, recoil);
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
