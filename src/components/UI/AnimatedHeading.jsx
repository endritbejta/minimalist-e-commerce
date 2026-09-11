import { useEffect, useState } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { hasRevealed, markRevealed } from '../../lib/revealOnce';

/**
 * Splits text into words and characters, precomputing each character's
 * position in the whole string so the stagger runs continuously across words.
 * Kept at module scope so nothing is mutated during a component render.
 * @param {string} text - The heading text.
 * @returns {{word: string, chars: {char: string, index: number}[]}[]} Word groups.
 */
const buildWords = (text) => {
  let offset = 0;

  return text.split(' ').map((word) => {
    const chars = [...word].map((char, charIndex) => ({
      char,
      index: offset + charIndex,
    }));

    // +1 accounts for the space that follows the word.
    offset += word.length + 1;

    return { word, chars };
  });
};

const getAnimationClass = (type, index) => {
  if (type === 'mixed') {
    return index % 2 === 0 ? 'animate-revealUp' : 'animate-revealDown';
  }

  return type === 'bounce' ? 'animate-bounceUp' : 'animate-revealUp';
};

/**
 * AnimatedHeading Component
 * Animates a heading in character by character, the first time it is seen.
 *
 * A heading that has already revealed itself renders as plain text from then
 * on — the flourish is for arriving somewhere new, and replaying it on every
 * visit to a page turns it into a tic. That also means the markup collapses
 * back to a single text node once the effect has been spent.
 *
 * While it does animate, the split spans are hidden from assistive technology
 * and the real text is exposed once via `aria-label`, so screen readers
 * announce the heading as a phrase rather than spelling it out letter by
 * letter.
 *
 * @param {Object} props - Component props.
 * @param {string} props.children - The text content to animate.
 * @param {string} [props.as='h1'] - The HTML tag to render.
 * @param {string} [props.className] - Additional CSS classes.
 * @param {number} [props.stagger=0.03] - Delay between each letter, in seconds.
 * @param {boolean} [props.triggerOnce=true] - Whether scrolling away and back replays it within one visit.
 * @param {boolean} [props.remember=true] - Whether to record this text as seen, so it renders
 *   plain next time. Page headings should; a one-off message that is meant to
 *   land every time it appears should not.
 * @param {boolean} [props.isVisible] - Drives the animation manually instead of on scroll.
 * @param {'reveal'|'bounce'|'mixed'} [props.type='reveal'] - Animation style.
 */
const AnimatedHeading = ({
  children,
  as: Tag = 'h1',
  className = '',
  stagger = 0.03,
  triggerOnce = true,
  remember = true,
  isVisible,
  type = 'reveal',
  ...props
}) => {
  const [ref, observerIntersecting] = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce,
  });

  const isActuallyVisible = isVisible ?? observerIntersecting;
  const text = typeof children === 'string' ? children : String(children ?? '');

  // Decided once per text rather than read during every render, so a heading
  // does not stop mid-animation the moment it records itself as seen.
  const [shouldAnimate, setShouldAnimate] = useState(() => !remember || !hasRevealed(text));
  const [renderedText, setRenderedText] = useState(text);

  if (renderedText !== text) {
    setRenderedText(text);
    setShouldAnimate(!remember || !hasRevealed(text));
  }

  useEffect(() => {
    if (remember && isActuallyVisible) markRevealed(text);
  }, [isActuallyVisible, remember, text]);

  if (!shouldAnimate) {
    return (
      <Tag className={`${className} overflow-hidden py-1`} {...props}>
        {text}
      </Tag>
    );
  }

  const words = buildWords(text);

  return (
    <Tag
      key={text}
      ref={ref}
      aria-label={text}
      className={`${className} overflow-hidden py-1`}
      {...props}
    >
      {words.map(({ word, chars }, wordIndex) => (
        <span
          key={`${word}-${wordIndex}`}
          aria-hidden="true"
          className="inline-block whitespace-nowrap"
        >
          {chars.map(({ char, index }) => (
            <span
              key={index}
              className={
                isActuallyVisible
                  ? `inline-block ${getAnimationClass(type, index)}`
                  : 'inline-block opacity-0'
              }
              style={isActuallyVisible ? { animationDelay: `${index * stagger}s` } : undefined}
            >
              {char}
            </span>
          ))}
          {wordIndex < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </Tag>
  );
};

export default AnimatedHeading;
