import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  FLY_DURATION_MS,
  FLY_EASING,
  buildCartBumpKeyframes,
  buildFlightKeyframes,
  getFlightStyle,
} from '../lib/flyToCart';
import { prefersReducedMotion } from '../lib/motion';
import { FlyToCartContext } from './FlyToCartContext';

/**
 * FlyingItem Component
 * One disc in flight. The animation runs through the Web Animations API rather
 * than React state, so the whole journey costs two renders — one to mount it,
 * one to clear it — instead of one per frame.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.flight - The flight description (image and rectangles).
 * @param {Function} props.onLanded - Stable callback, given the flight id once the disc reaches the cart.
 */
function FlyingItem({ flight, onLanded }) {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return undefined;

    const animation = element.animate(
      buildFlightKeyframes(flight.originRect, flight.targetRect),
      { duration: FLY_DURATION_MS, easing: FLY_EASING, fill: 'forwards' }
    );

    let landed = false;
    animation.finished
      .then(() => {
        landed = true;
        onLanded(flight.id);
      })
      // `finished` rejects when the animation is cancelled on unmount.
      .catch(() => {});

    return () => {
      if (!landed) animation.cancel();
    };
  }, [flight, onLanded]);

  return (
    <div
      ref={elementRef}
      aria-hidden="true"
      className="pointer-events-none z-flyer overflow-hidden rounded-full bg-white shadow-2xl ring-1 ring-black/10"
      style={getFlightStyle(flight.originRect)}
    >
      <img src={flight.image} alt="" className="h-full w-full object-cover" />
    </div>
  );
}

/**
 * FlyToCartProvider Component
 * Sends a small circular image of a product arcing from the button that was
 * clicked to the cart in the header, and resolves once it lands so the caller
 * can add the item and open the drawer at the right moment.
 *
 * @param {Object} props - Component props.
 * @param {import('react').ReactNode} props.children - Subtree that can start flights.
 */
export const FlyToCartProvider = ({ children }) => {
  const [flights, setFlights] = useState([]);
  const cartTargetRef = useRef(null);
  const resolversRef = useRef(new Map());
  const fallbackTimersRef = useRef(new Map());
  const nextIdRef = useRef(0);

  const registerCartTarget = useCallback((element) => {
    cartTargetRef.current = element;
  }, []);

  const handleLanded = useCallback((id) => {
    const resolve = resolversRef.current.get(id);
    // Already landed — the animation and the safety net both reported in.
    if (!resolve) return;

    resolversRef.current.delete(id);
    window.clearTimeout(fallbackTimersRef.current.get(id));
    fallbackTimersRef.current.delete(id);

    cartTargetRef.current?.animate(buildCartBumpKeyframes(), {
      duration: 320,
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    });

    setFlights((current) => current.filter((flight) => flight.id !== id));
    resolve();
  }, []);

  const flyToCart = useCallback(({ image, originRect }) => {
    const target = cartTargetRef.current;

    // No image, no destination, or the visitor asked for less motion: the
    // caller carries on immediately and the item is simply added.
    if (!image || !target || !originRect || prefersReducedMotion()) {
      return Promise.resolve();
    }

    const targetRect = target.getBoundingClientRect();
    const id = (nextIdRef.current += 1);

    return new Promise((resolve) => {
      resolversRef.current.set(id, resolve);

      // The animation finishing is the normal signal. It does not arrive if the
      // tab is backgrounded mid-flight — and the caller is waiting on this
      // promise to actually add the item, so a lost signal would mean a lost
      // add. Land the flight regardless once its time is up.
      fallbackTimersRef.current.set(
        id,
        window.setTimeout(() => handleLanded(id), FLY_DURATION_MS + 250)
      );

      setFlights((current) => [...current, { id, image, originRect, targetRect }]);
    });
  }, [handleLanded]);

  // Never leave a caller awaiting a flight that can no longer finish.
  useEffect(() => {
    const resolvers = resolversRef.current;
    const timers = fallbackTimersRef.current;

    return () => {
      timers.forEach((timerId) => window.clearTimeout(timerId));
      timers.clear();
      resolvers.forEach((resolve) => resolve());
      resolvers.clear();
    };
  }, []);

  const value = useMemo(
    () => ({ registerCartTarget, flyToCart }),
    [registerCartTarget, flyToCart]
  );

  return (
    <FlyToCartContext value={value}>
      {children}
      {flights.length > 0 &&
        createPortal(
          flights.map((flight) => (
            <FlyingItem key={flight.id} flight={flight} onLanded={handleLanded} />
          )),
          document.body
        )}
    </FlyToCartContext>
  );
};
