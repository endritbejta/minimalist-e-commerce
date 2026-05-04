import React, { useState, useEffect } from "react";
import SmartImage from "../UI/SmartImage";
import { useCustomization } from "../../context/CustomizationContext";

/**
 * ProductPageMedia Component
 * Handles the main image display and thumbnail gallery on the product page.
 * Includes support for customization overlays (emblems).
 * @param {Object} props - Component props.
 * @param {string[]} [props.images=[]] - Array of image URLs for the product.
 * @param {string} props.title - The product title for alt tags.
 */
function ProductPageMedia({ images = [], title }) {
  const { customization } = useCustomization();
  const [activeIndex, setActiveIndex] = useState(0);

  // Reset active index if images change (e.g. changing variants)
  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  const activeImage = images[activeIndex] || images[0];

  const getPositionStyles = (pos) => {
    switch (pos) {
      case 'front-left': return { top: '35%', left: '65%', transform: 'translate(-50%, -50%)' };
      case 'front-center': return { top: '35%', left: '50%', transform: 'translate(-50%, -50%)' };
      case 'front-right': return { top: '35%', left: '35%', transform: 'translate(-50%, -50%)' };
      default: return { top: '35%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
  };

  return (
    <div className="w-full md:w-1/2 flex flex-col gap-3">
      {/* Main Image Area */}
      <div className="relative w-full bg-gray-100 aspect-square rounded-2xl overflow-hidden shadow-xl border border-gray-100">
        {activeImage ? (
          <SmartImage 
            src={activeImage} 
            alt={title} 
            className="w-full h-full"
            imgClassName="w-full h-full object-cover transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center space-y-2 text-gray-500">
            <span className="text-sm uppercase tracking-widest font-bold">No Image</span>
            <span className="text-xs opacity-50">{title}</span>
          </div>
        )}

        {/* Emblem Overlay */}
        {customization?.emblem && (
          <div 
            className="absolute z-10 w-12 h-12 flex items-center justify-center pointer-events-none transition-all duration-500 ease-in-out"
            style={getPositionStyles(customization.position)}
          >
            <img 
              src={customization.emblem.path} 
              alt="Emblem Preview"
              className="w-full h-full object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] animate-fadeIn"
            />
            {customization.position === 'back' && (
              <div className="absolute inset-0 bg-white/10 mix-blend-overlay rounded-full" />
            )}
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="flex gap-3 justify-center overflow-x-auto p-2 snap-x hide-scrollbar -mx-3">
          {images.map((img, idx) => (
            <button
              key={idx}
              aria-label={`View image ${idx + 1}`}
              onClick={() => setActiveIndex(idx)}
              className={`relative flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden bg-gray-100 snap-start transition-all duration-300 ${
                activeIndex === idx ? 'ring-2 ring-black ring-offset-1 opacity-100 scale-105' : 'opacity-60 hover:opacity-100'
              }`}
            >
              <SmartImage 
                src={img} 
                alt={`${title} thumbnail ${idx + 1}`} 
                className="w-full h-full"
                imgClassName="w-full h-full object-cover" 
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductPageMedia;
