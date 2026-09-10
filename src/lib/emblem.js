/**
 * Emblem customization options and placement geometry.
 *
 * The customizer preview and the product page both draw the same emblem, so
 * the option lists and the placement maths live here rather than being
 * duplicated (and drifting) between the two components.
 */

/**
 * Front placements. Left/right are described from the wearer's point of view,
 * which is why the horizontal offsets are mirrored relative to the viewer.
 */
export const POSITIONS = [
  { id: 'front-left', label: 'Left', left: '65%' },
  { id: 'front-center', label: 'Center', left: '50%' },
  { id: 'front-right', label: 'Right', left: '35%' },
];

export const EMBLEMS = [
  { id: 'emblem-1', name: 'Legacy Badge', path: '/assets/emblems/old-emblem-1.png' },
  { id: 'emblem-2', name: 'Heritage Crest', path: '/assets/emblems/old-emblem-2.png' },
  { id: 'emblem-3', name: 'Classic Icon', path: '/assets/emblems/old-emblem-3.png' },
  { id: 'emblem-4', name: 'Signature Logo', path: '/assets/emblems/old-emblem.png' },
];

export const BACK_SIZES = [
  { id: 'small', label: 'Small', scale: '14%', topWhenAlignedTop: '24%' },
  { id: 'medium', label: 'Medium', scale: '26%', topWhenAlignedTop: '28%' },
  { id: 'big', label: 'Big', scale: '40%', topWhenAlignedTop: '32%' },
];

export const BACK_ALIGNMENTS = [
  { id: 'top', label: 'Top', top: '24%' },
  { id: 'center', label: 'Center', top: '38%' },
  { id: 'bottom', label: 'Bottom', top: '60%' },
];

export const DEFAULT_POSITION = 'front-center';
export const DEFAULT_BACK_SIZE = 'medium';
export const DEFAULT_BACK_ALIGNMENT = 'center';

const FRONT_SCALE = '16%';

const findById = (list, id, fallbackIndex = 0) =>
  list.find((entry) => entry.id === id) ?? list[fallbackIndex];

/**
 * Placement styles for the front emblem.
 * @param {string} positionId - One of the POSITIONS ids.
 * @returns {Object} Inline style object positioning the emblem on the garment.
 */
export const getFrontPlacement = (positionId) => {
  const position = findById(POSITIONS, positionId, 1);

  return {
    top: '35%',
    left: position.left,
    transform: 'translate(-50%, -50%)',
    width: FRONT_SCALE,
    height: FRONT_SCALE,
  };
};

/**
 * Placement styles for the back emblem. Larger emblems sit slightly lower when
 * top-aligned so they clear the collar.
 * @param {string} sizeId - One of the BACK_SIZES ids.
 * @param {string} alignmentId - One of the BACK_ALIGNMENTS ids.
 * @returns {Object} Inline style object positioning the emblem on the garment.
 */
export const getBackPlacement = (sizeId, alignmentId) => {
  const size = findById(BACK_SIZES, sizeId, 1);
  const alignment = findById(BACK_ALIGNMENTS, alignmentId, 1);
  const top = alignment.id === 'top' ? size.topWhenAlignedTop : alignment.top;

  return {
    top,
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: size.scale,
    height: size.scale,
  };
};

/**
 * Builds the short human-readable summary shown on the product page and in the
 * cart, e.g. "Legacy Badge — front (Center) + back".
 * @param {Object} [customization] - The applied customization, if any.
 * @returns {string} A summary string, or an empty string when nothing is applied.
 */
export const describeCustomization = (customization) => {
  if (!customization?.emblem) return '';

  const parts = [];
  if (customization.includeFrontEmblem) {
    parts.push(`front (${findById(POSITIONS, customization.position, 1).label})`);
  }
  if (customization.includeBackEmblem) {
    parts.push(`back (${findById(BACK_SIZES, customization.backEmblemSize, 1).label})`);
  }

  if (parts.length === 0) return `${customization.emblem.name} — no placement`;
  return `${customization.emblem.name} — ${parts.join(' + ')}`;
};
