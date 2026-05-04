import { useCallback, useEffect, useState } from 'react';

const DEFAULT_OPTIONS = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1,
  triggerOnce: true,
  initialIsIntersecting: false,
  unsupportedFallback: true,
};

/**
 * useIntersectionObserver Hook
 * Observes a DOM element and reports its visibility within the viewport.
 * @param {Object} [options] - Observer configuration.
 * @param {Element|null} [options.root=null] - Viewport element.
 * @param {string} [options.rootMargin='0px'] - Margin around the root.
 * @param {number|number[]} [options.threshold=0.1] - Visibility threshold(s).
 * @param {boolean} [options.triggerOnce=true] - Whether to stop observing after first visibility.
 * @returns {[Function, boolean]} A ref setter and the intersection state.
 */
export const useIntersectionObserver = (options = {}) => {
  const {
    root,
    rootMargin,
    threshold,
    triggerOnce,
    initialIsIntersecting,
    unsupportedFallback,
  } = { ...DEFAULT_OPTIONS, ...options };

  const [target, setTarget] = useState(null);
  const [isIntersecting, setIsIntersecting] = useState(() => {
    return typeof IntersectionObserver === 'undefined'
      ? unsupportedFallback
      : initialIsIntersecting;
  });

  const targetRef = useCallback((node) => {
    setTarget(node);
  }, []);

  const thresholdKey = JSON.stringify(threshold);

  useEffect(() => {
    if (!target) {
      return undefined;
    }

    if (typeof IntersectionObserver === 'undefined') {
      return undefined;
    }

    const observer = new IntersectionObserver(([entry], currentObserver) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        if (triggerOnce) {
          currentObserver.unobserve(entry.target);
        }
      } else if (!triggerOnce) {
        setIsIntersecting(false);
      }
    }, {
      root,
      rootMargin,
      threshold: JSON.parse(thresholdKey),
    });

    observer.observe(target);
    return () => {
      observer.disconnect();
    };
  }, [
    root,
    rootMargin,
    thresholdKey,
    target,
    triggerOnce,
  ]);

  return [targetRef, isIntersecting];
};
