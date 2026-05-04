import React, { useEffect, useState, useRef } from 'react';

/**
 * AnimatedPrice Component
 * Smoothly animates a numeric value from its previous state to a new one.
 * 
 * @param {Object} props
 * @param {number} props.value - The target numeric value to animate to.
 * @param {number} [props.duration=600] - Duration of the animation in milliseconds.
 */
function AnimatedPrice({ value, duration = 600 }) {
  // Ensure we are working with numbers to prevent errors with toFixed or arithmetic
  const targetValue = Number(value) || 0;
  const animDuration = Number(duration) || 600;

  const [displayValue, setDisplayValue] = useState(targetValue);
  const [isAnimating, setIsAnimating] = useState(false);
  const currentValueRef = useRef(targetValue);

  useEffect(() => {
    let startTimestamp = null;
    const startValue = currentValueRef.current;
    const endValue = targetValue;
    

    if (startValue === endValue) {
      setIsAnimating(false);
      return;
    }

    setIsAnimating(true);
    let frameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / animDuration, 1);
      
      // Easing function: easeOutExpo for a snappy start that smoothly slows down
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const currentVal = startValue + (endValue - startValue) * easeProgress;
      setDisplayValue(currentVal);
      currentValueRef.current = currentVal;

      if (progress < 1) {
        frameId = window.requestAnimationFrame(step);
      } else {
        setDisplayValue(endValue);
        currentValueRef.current = endValue;
        setIsAnimating(false);
      }
    };

    frameId = window.requestAnimationFrame(step);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [targetValue, animDuration]);

  // Return the formatted price with a dollar sign and a sweep effect during animation
  return (
    <span className="relative inline-block tabular-nums overflow-hidden">
      <span className={`block transition-all duration-300 ${isAnimating ? 'is-animating-price' : 'text-inherit scale-100'}`}>
        ${displayValue.toFixed(2)}
      </span>
      {/* Sweeping Shine Overlay */}
      {isAnimating && (
        <span 
          className="absolute inset-y-0 -inset-x-full w-[300%] bg-gradient-to-r from-transparent via-white to-transparent opacity-60 pointer-events-none animate-sweep-left mix-blend-overlay"
        />
      )}
    </span>
  );
}

export default AnimatedPrice;
