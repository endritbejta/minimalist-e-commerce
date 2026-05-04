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
 * Observes a single DOM element and reports when it enters or leaves the viewport.
 *
 * @param {Object} [options]
 * @param {Element | Document | null} [options.root=null] - Scroll container used as the viewport.
 * @param {string} [options.rootMargin='0px'] - Margin around the root, e.g. '0px 0px -20% 0px'.
 * @param {number | number[]} [options.threshold=0.1] - Percentage(s) of the target that must be visible.
 * @param {boolean} [options.triggerOnce=true] - Stop observing after the first visible intersection.
 * @param {boolean} [options.initialIsIntersecting=false] - Initial state before the observer runs.
 * @param {boolean} [options.unsupportedFallback=true] - State to use when IntersectionObserver is unavailable.
 * @returns {[import('react').CallbackRef<Element>, boolean]} Ref callback for the target element and its visibility state.
 *
 * @example
 * const [sectionRef, isVisible] = useIntersectionObserver({
 *   threshold: 0.25,
 *   rootMargin: '0px 0px -10% 0px',
 * });
 *
 * return <section ref={sectionRef} className={isVisible ? 'animate-fadeIn' : 'opacity-0'} />;
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
