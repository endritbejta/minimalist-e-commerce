/**
 * SmartImage Component
 * An intelligent image component that handles loading states and LCP prioritization.
 * @param {string} src - The image source URL.
 * @param {string} alt - Alternative text for accessibility.
 * @param {string} className - CSS classes for the outer wrapper div.
 * @param {string} imgClassName - CSS classes for the img element itself.
 * @param {boolean} priority - If true, sets loading="eager" and high fetch priority for LCP.
 * @param {Object} props - Additional props spread onto the wrapper div.
 */
const SmartImage = ({ 
  src, 
  alt, 
  className = "", 
  imgClassName = "",
  priority = false,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const prevSrc = React.useRef(src);

  // If the src changes, reset loading state immediately during render
  // to avoid useEffect race conditions with cached images
  if (prevSrc.current !== src) {
    prevSrc.current = src;
    setIsLoading(true);
  }

  return (
    <div className={`relative overflow-hidden ${className}`} {...props}>
      {isLoading && (
        <div className="absolute inset-0 z-10">
          <ImageLoader />
        </div>
      )}
      <img
        key={src}
        src={src}
        alt={alt}
        onLoad={() => setIsLoading(false)}
        loading={priority ? "eager" : "lazy"}
        {...(priority ? { fetchpriority: "high" } : {})}
        className={`
          transition-opacity duration-500
          ${isLoading ? 'opacity-0' : 'opacity-100'}
          ${imgClassName}
        `}
      />
    </div>
  );
};

export default SmartImage;
