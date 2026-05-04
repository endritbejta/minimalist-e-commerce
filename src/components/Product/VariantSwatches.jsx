import React from 'react';

/**
 * A reusable component for rendering product variant swatches.
 * @param {Array} variants - The list of variants to display.
 * @param {Object} selectedVariant - The currently selected variant.
 * @param {Function} onSelect - Callback when a variant is selected.
 */
function VariantSwatches({ variants, selectedVariant, onSelect }) {
  if (!variants || variants.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-4">
        Color: <span className="text-gray-500 ml-1 font-normal">{selectedVariant?.title}</span>
      </h3>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => {
          const isSelected = selectedVariant?.id === variant.id;
          const hasColor = !!variant.color;
          
          return (
            <button
              key={variant.id}
              onClick={() => onSelect(variant)}
              className={`
                relative transition-all duration-300 transform shadow-sm
                ${hasColor 
                  ? `h-6 w-8 rounded-full border ${isSelected ? 'border-black scale-[1.03]' : 'border-transparent'} shadow-swatch` 
                  : `px-4 py-2 rounded-md border text-xs font-medium ${isSelected ? 'border-black bg-black text-white shadow-md' : 'border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900'}`
                }
              `}
              style={hasColor ? { backgroundColor: variant.color } : {}}
              aria-label={`Select ${variant.title}`}
              aria-pressed={isSelected}
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
