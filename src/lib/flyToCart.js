/**
 * Geometry for the add-to-cart flight.
 *
 * Kept free of DOM access so the maths can be exercised directly in tests: the
 * caller passes plain rectangles and gets back a style object and a keyframe
 * list ready for Element.animate().
 */

export const FLY_DURATION_MS = 620;
export const FLY_SIZE_PX = 64;
export const FLY_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

const centerOf = (rect) => ({
  x: rect.left + rect.width / 2,
  y: rect.top + rect.height / 2,
});

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

/**
 * Keyframes describing an arc from the button to the cart.
 *
 * The midpoint is lifted above the straight line so the disc travels along a
 * curve rather than sliding flatly across the page, and it shrinks as it goes
 * so it reads as being drawn into the cart.
 *
 * @param {{left: number, top: number, width: number, height: number}} originRect - The clicked button.
 * @param {{left: number, top: number, width: number, height: number}} targetRect - The cart button.
 * @returns {Object[]} Keyframes for Element.animate().
 */
export const buildFlightKeyframes = (originRect, targetRect) => {
  const origin = centerOf(originRect);
  const target = centerOf(targetRect);

  const dx = target.x - origin.x;
  const dy = target.y - origin.y;

  // Longer journeys arc higher, but not without limit.
  const arc = Math.min(180, 60 + Math.abs(dx) * 0.35);

  // Built through one helper so every frame is written the same way.
  const frame = (x, y, scale, opacity, offset) => ({
    transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
    opacity,
    offset,
  });

  return [
    frame(0, 0, 1, 1, 0),
    frame(dx * 0.5, dy * 0.5 - arc, 0.7, 1, 0.55),
    frame(dx, dy, 0.15, 0.2, 1),
  ];
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
