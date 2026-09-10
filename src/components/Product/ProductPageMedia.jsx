import { useState } from "react";
import { useCustomization } from "../../context/CustomizationContext";
import { getBackPlacement, getFrontPlacement } from "../../lib/emblem";
import SmartImage from "../UI/SmartImage";

/**
 * ProductPageMedia Component
 * Main image and thumbnail gallery for a product, with a live preview of any
 * applied emblem customization.
 *
 * @param {Object} props - Component props.
 * @param {string[]} [props.images=[]] - Image URLs for the product.
 * @param {string} props.title - The product title, used for alt text.
 * @param {'front'|'back'} [props.side='front'] - Which side of the garment is shown.
 */
function ProductPageMedia({ images = [], title, side = 'front' }) {
  const { customization } = useCustomization();
  const [activeIndex, setActiveIndex] = useState(0);

  // Clamp rather than resetting from an effect. The images prop is a fresh
  // array on every parent render, so an effect keyed on it fired constantly
  // and snapped the gallery back to the first thumbnail.
  const safeIndex = activeIndex < images.length ? activeIndex : 0;
  const activeImage = images[safeIndex];

  const showFrontEmblem =
    side === 'front' && customization?.emblem && customization.includeFrontEmblem;
  const showBackEmblem =
    side === 'back' && customization?.emblem && customization.includeBackEmblem;

  const emblemStyle = showBackEmblem
    ? getBackPlacement(customization.backEmblemSize, customization.backEmblemAlignment)
    : getFrontPlacement(customization?.position);

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
            priority
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center space-y-2 text-gray-500">
            <span className="text-sm uppercase tracking-widest font-bold">No Image</span>
            <span className="text-xs opacity-50">{title}</span>
          </div>
        )}

        {(showFrontEmblem || showBackEmblem) && (
          <div
            className="absolute z-10 flex items-center justify-center pointer-events-none transition-all duration-500 ease-in-out"
            style={emblemStyle}
          >
            <img
              src={customization.emblem.path}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] animate-fadeIn"
            />
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div
          role="group"
          aria-label={`${title} images`}
          className="flex gap-3 justify-center overflow-x-auto p-2 snap-x hide-scrollbar -mx-3"
        >
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              aria-label={`View image ${index + 1} of ${images.length}`}
              aria-current={safeIndex === index}
              onClick={() => setActiveIndex(index)}
              className={`relative flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden bg-gray-100 snap-start transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${
                safeIndex === index
                  ? 'ring-2 ring-black ring-offset-1 opacity-100 scale-105'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <SmartImage
                src={image}
                alt=""
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
