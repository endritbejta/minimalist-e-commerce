/**
 * VariantSwatches Component
 * Renders product variant selectors as a radio group.
 * @param {Object} props - Component props.
 * @param {Object[]} props.variants - List of variants to display.
 * @param {Object} props.selectedVariant - The currently active variant.
 * @param {Function} props.onSelect - Callback triggered when a variant is chosen.
 */
function VariantSwatches({ variants, selectedVariant, onSelect }) {
  if (!variants || variants.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-4">
        Color: <span className="text-gray-500 ml-1 font-normal">{selectedVariant?.title}</span>
      </h2>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Colour">
        {variants.map((variant) => {
          const isSelected = selectedVariant?.id === variant.id;
          const hasColor = Boolean(variant.color);

          return (
            <button
              key={variant.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(variant)}
              className={`relative transition-all duration-300 transform shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${
                hasColor
                  // A ring rather than a transparent border, so a white swatch
                  // stays visible against the white page.
                  ? `h-6 w-8 rounded-full ring-1 shadow-swatch ${
                      isSelected ? 'ring-black ring-2 scale-[1.03]' : 'ring-gray-200'
                    }`
                  : `px-4 py-2 rounded-md border text-xs font-medium ${
                      isSelected
                        ? 'border-black bg-black text-white shadow-md'
                        : 'border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900'
                    }`
              }`}
              style={hasColor ? { backgroundColor: variant.color } : undefined}
              aria-label={hasColor ? variant.title : undefined}
            >
              {!hasColor && variant.title}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default VariantSwatches;
