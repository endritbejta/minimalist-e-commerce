/**
 * ImageLoader Component
 * A skeleton-style loader used for individual images during their loading state.
 * @param {string} className - Additional CSS classes for the loader wrapper.
 */
const ImageLoader = ({ className = "" }) => {
  return (
    <div className={`w-full h-full flex flex-col items-center justify-center bg-gray-50/50 ${className}`}>
      <div className="w-1/2 max-w-[120px] h-[1px] bg-gray-200 relative overflow-hidden">
        {/* The Filling Line */}
        <div className="absolute inset-0 bg-black animate-loading-bar origin-left"></div>
      </div>
    </div>
  );
};

export default ImageLoader;
