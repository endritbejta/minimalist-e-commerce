import React from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

/**
 * AnimatedHeading Component
 * Splits text into individual letters and animates them coming from below.
 * @param {string} children - The text content to animate.
 * @param {string} as - The HTML tag to render (h1, h2, etc.), defaults to h1.
 * @param {string} className - Additional CSS classes.
 * @param {number} stagger - Delay between each letter animation in seconds.
 * @param {boolean} triggerOnce - Whether the animation should only play once.
 * @param {boolean} isVisible - Optional prop to manually trigger the animation.
 * @param {string} type - Animation type: 'reveal', 'bounce', or 'mixed'.
 */
const AnimatedHeading = ({ 
  children, 
  as: Tag = 'h1', 
  className = '', 
  stagger = 0.03, 
  triggerOnce = true, 
  toggleOnce, // alias for triggerOnce
  isVisible,
  type = 'reveal',
  ...props 
}) => {
  const finalTriggerOnce = toggleOnce !== undefined ? toggleOnce : triggerOnce;
  const [ref, observerIntersecting] = useIntersectionObserver({ threshold: 0.1, triggerOnce: finalTriggerOnce });
  
  // Use the provided isVisible prop if it exists, otherwise fall back to the intersection observer
  const isActuallyVisible = isVisible !== undefined ? isVisible : observerIntersecting;

  // Determine which animation class to use
  const animationClass = type === 'bounce' ? 'animate-bounceUp' : 'animate-revealUp';
  
  // Ensure children is a string
  const text = typeof children === 'string' ? children : children?.toString() || '';
  const words = text.split(' ');
  
  // Track cumulative letter count for correct staggering across words
  let letterCount = 0;

  return (
    <Tag key={text} ref={ref} className={`${className} overflow-hidden py-1`} {...props}>
      {words.map((word, wordIndex) => {
        const wordElement = (
          <span key={`word-${wordIndex}`} className="inline-block whitespace-nowrap">
            {word.split('').map((char, charIndex) => {
              const delay = (letterCount + charIndex) * stagger;
              
              // Logic for alternating direction in 'mixed' mode
              let finalAnimationClass = animationClass;
              if (type === 'mixed') {
                finalAnimationClass = (letterCount + charIndex) % 2 === 0 ? 'animate-revealUp' : 'animate-revealDown';
              }

              return (
                <span
                  key={`char-${charIndex}`}
                  className={isActuallyVisible ? finalAnimationClass : "opacity-0 inline-block"}
                  style={{ animationDelay: isActuallyVisible ? `${delay}s` : '0s' }}
                >
                  {char}
                </span>
              );
            })}
            {/* Add a space after the word if it's not the last one */}
            {wordIndex < words.length - 1 && (
              <span className="inline-block">&nbsp;</span>
            )}
          </span>
        );
        
        // Update letter count for the next word (including the space)
        letterCount += word.length + 1;
        
        return wordElement;
      })}
    </Tag>
  );
};

export default AnimatedHeading;
