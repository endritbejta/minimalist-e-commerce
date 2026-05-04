import React, { useState } from 'react';
import ImageLoader from './ImageLoader';

const SmartImage = ({ src, alt, className = "", imgClassName = "" }) => {
  const [isLoading, setIsLoading] = useState(true);
  const prevSrc = React.useRef(src);

  // If the src changes, reset loading state immediately during render
  // to avoid useEffect race conditions with cached images
  if (prevSrc.current !== src) {
    prevSrc.current = src;
    setIsLoading(true);
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
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
