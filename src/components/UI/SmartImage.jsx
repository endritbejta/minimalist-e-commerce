import { useState } from "react";
import ImageLoader from "./ImageLoader";

/**
 * SmartImage Component
 * An image with a skeleton while it loads, a visible fallback when it fails,
 * and opt-in LCP prioritisation.
 *
 * Every catalog image is remote, so a failed request has to be handled — the
 * previous version only listened for `onLoad` and left a broken image showing
 * the loading bar forever.
 *
 * @param {Object} props - Component props.
 * @param {string} props.src - The image source URL.
 * @param {string} props.alt - Alternative text for accessibility.
 * @param {string} [props.className] - CSS classes for the outer wrapper div.
 * @param {string} [props.imgClassName] - CSS classes for the img element itself.
 * @param {boolean} [props.priority=false] - Sets eager loading and high fetch priority for LCP.
 */
const SmartImage = ({
  src,
  alt,
  className = "",
  imgClassName = "",
  priority = false,
  ...props
}) => {
  const [status, setStatus] = useState('loading');
  const [renderedSrc, setRenderedSrc] = useState(src);

  // Reset while rendering when the source changes, rather than in an effect:
  // an effect would let a cached image resolve before the reset lands.
  if (renderedSrc !== src) {
    setRenderedSrc(src);
    setStatus('loading');
  }

  const isLoading = status === 'loading';
  const hasFailed = status === 'error';

  return (
    <div className={`relative overflow-hidden ${className}`} {...props}>
      {isLoading && (
        <div className="absolute inset-0 z-10">
          <ImageLoader />
        </div>
      )}

      {hasFailed ? (
        <div
          role="img"
          aria-label={alt}
          className="w-full h-full flex items-center justify-center bg-gray-100 text-[10px] uppercase tracking-widest text-gray-400"
        >
          Image unavailable
        </div>
      ) : (
        <img
          key={src}
          src={src}
          alt={alt}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          {...(priority ? { fetchPriority: "high" } : {})}
          className={`transition-opacity duration-500 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          } ${imgClassName}`}
        />
      )}
    </div>
  );
};

export default SmartImage;
