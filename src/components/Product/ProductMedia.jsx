import SmartImage from '../UI/SmartImage';

/**
 * ProductMedia Component
 * Handles the display of product images in cards, including fallback states.
 * @param {Object} props - Component props.
 * @param {string} props.image - The URL of the product image.
 * @param {string} props.title - The product title (used for alt text).
 * @param {boolean} [props.priority=false] - Whether to prioritize the image loading.
 */
function ProductMedia({ image, title, priority = false }) {
  return (
    <div className="product-card-media relative overflow-hidden bg-gray-100 aspect-square rounded-lg group">
      {image ? (
        <SmartImage 
          src={image} 
          alt={title} 
          className="w-full h-full"
          imgClassName="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          priority={priority}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-500">
          No Image
        </div>
      )}
    </div>
  );
}

export default ProductMedia;
