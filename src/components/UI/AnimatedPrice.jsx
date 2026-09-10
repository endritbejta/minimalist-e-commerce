import { useEffect, useRef, useState } from 'react';
import { formatPrice } from '../../lib/format';
import { prefersReducedMotion } from '../../lib/motion';

/**
 * AnimatedPrice Component
 * Counts a price up or down to its new value using requestAnimationFrame.
 * Honours the OS reduce-motion preference by jumping straight to the total.
 *
 * @param {Object} props - Component props.
 * @param {number} props.value - The target numeric value to animate to.
 * @param {number} [props.duration=600] - Duration of the animation in milliseconds.
 */
function AnimatedPrice({ value, duration = 600 }) {
  const targetValue = Number(value) || 0;
  const animDuration = Number(duration) || 600;

  const [displayValue, setDisplayValue] = useState(targetValue);
  const currentValueRef = useRef(targetValue);

  // Derived rather than stored: the shine is on precisely while the displayed
  // figure has not caught up with the target.
  const isAnimating = displayValue !== targetValue;

  useEffect(() => {
    const startValue = currentValueRef.current;

    if (startValue === targetValue) return undefined;

    let startTimestamp = null;
    let frameId = null;

    const step = (timestamp) => {
      // Settle immediately when the visitor has asked for reduced motion. Done
      // on the first frame rather than in the effect body, which would trigger
      // a cascading render.
      if (prefersReducedMotion()) {
        currentValueRef.current = targetValue;
        setDisplayValue(targetValue);
        return;
      }

      startTimestamp ??= timestamp;
      const progress = Math.min((timestamp - startTimestamp) / animDuration, 1);

      // easeOutExpo: quick off the mark, gentle at the end.
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentValue = startValue + (targetValue - startValue) * eased;

      currentValueRef.current = currentValue;
      setDisplayValue(currentValue);

      if (progress < 1) {
        frameId = window.requestAnimationFrame(step);
      } else {
        currentValueRef.current = targetValue;
        setDisplayValue(targetValue);
      }
    };

    frameId = window.requestAnimationFrame(step);

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [targetValue, animDuration]);

  return (
    <span className="relative inline-block tabular-nums overflow-hidden">
      {/* The animated figure is decorative mid-count; the settled total below
          is what assistive technology announces. */}
      <span
        aria-hidden="true"
        className={`block transition-all duration-300 ${
          isAnimating ? 'is-animating-price' : 'text-inherit scale-100'
        }`}
      >
        {formatPrice(displayValue)}
      </span>
      <span className="sr-only">{formatPrice(targetValue)}</span>
    </span>
  );
}

export default AnimatedPrice;
