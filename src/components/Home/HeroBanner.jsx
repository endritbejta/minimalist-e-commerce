import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedHeading from '../UI/AnimatedHeading';
import Button from '../UI/Button';

const SWIPE_THRESHOLD = 50;
const DRAG_INTENT_THRESHOLD = 6;
const SLIDE_DURATION_MS = 700;
const SLIDE_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';

// Widths the browser can choose between. The hero box is at most ~1600 CSS px
// wide; serving the 2000w variant covers high-DPR displays without asking the
// GPU to hold a 2900px-wide texture for a 1280px box.
const DESKTOP_WIDTHS = [1024, 1280, 1600, 2000];
const MOBILE_WIDTHS = [480, 640, 828, 1080];

/**
 * Rebuilds an Unsplash URL at a given width.
 * @param {string} url - The original image URL, which carries a `w=` parameter.
 * @param {number} width - The width to request.
 * @returns {string} The URL at that width.
 */
const atWidth = (url, width) => url.replace(/([?&])w=\d+/, `$1w=${width}`);

/**
 * Builds a srcset so the browser downloads the size it will actually paint.
 * @param {string} url - The original image URL.
 * @param {number[]} widths - Candidate widths.
 * @returns {string} A srcset attribute value.
 */
const buildSrcSet = (url, widths) =>
  widths.map((width) => `${atWidth(url, width)} ${width}w`).join(', ');

const SLIDES = [
  {
    id: 1,
    title: "Minimalist Living",
    subtitle: "New Collection 2026",
    description: "Discover our latest essentials designed for the modern home.",
    cta: "Shop Now",
    link: "/collections/all",
    bg: "bg-[#f3f3f3]",
    backgroundImageDesktop: "https://images.unsplash.com/photo-1623150502742-6a849aa94be4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    backgroundImageMobile: "https://plus.unsplash.com/premium_photo-1669068927842-1fa33acbe63e?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: 2,
    title: "Premium Tech",
    subtitle: "High Performance",
    description: "Immersive sound and tactile feedback for your daily workflow.",
    cta: "View Electronics",
    link: "/collections/electronics",
    bg: "bg-[#e5e7eb]",
    backgroundImageDesktop: "https://images.unsplash.com/photo-1654367339087-2f384d47a6e4?q=80&w=2928&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    backgroundImageMobile: "https://plus.unsplash.com/premium_photo-1664439520356-6b3c7d54ae42?q=80&w=927&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: 3,
    title: "Timeless Style",
    subtitle: "Essential Accessories",
    description: "Handcrafted leather goods that age beautifully with time.",
    cta: "Browse Accessories",
    link: "/collections/accessories",
    bg: "bg-[#d1d5db]",
    backgroundImageDesktop: "https://plus.unsplash.com/premium_photo-1723481535651-5ef6897653f7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    backgroundImageMobile: "https://images.unsplash.com/photo-1720609602393-207f35b618c1?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZXNzZW50aWFsJTIwYWNjZXNvcmllc3xlbnwwfDF8NHx8fDA%3D"
  }
];

/**
 * HeroBanner Component
 * A swipeable, keyboard-navigable hero carousel.
 *
 * The track transform is written straight to the DOM during a drag rather than
 * held in state: a pointermove fires at the display's refresh rate, and putting
 * a React render between the finger and the pixels is what makes a carousel
 * feel heavy.
 *
 * Off-screen slides are marked `inert`, which removes their link and CTA from
 * the tab order and the accessibility tree in one step.
 */
function HeroBanner() {
  const [current, setCurrent] = useState(0);

  const trackRef = useRef(null);
  const currentRef = useRef(0);
  const hasMountedRef = useRef(false);
  const releaseLayerRef = useRef(null);
  const dragStartXRef = useRef(0);
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const hasCapturedRef = useRef(false);

  const releaseLayer = useCallback(() => {
    window.clearTimeout(releaseLayerRef.current);
    if (trackRef.current && !isDraggingRef.current) {
      trackRef.current.style.willChange = 'auto';
    }
  }, []);

  /**
   * Writes the track position directly to the element.
   * @param {number} offsetPx - Extra pixel offset from the resting position.
   * @param {boolean} animate - Whether to ease into the new position.
   */
  const moveTrack = useCallback((offsetPx, animate) => {
    const track = trackRef.current;
    if (!track) return;

    // Promote only when something is actually about to move — a keyboard
    // arrow and a swipe animate the same 700ms transform, and both deserve the
    // layer. Positioning the track on mount does not, or will-change would
    // stay on forever and hold the layer's memory while the hero just sits.
    if (animate || isDraggingRef.current) {
      window.clearTimeout(releaseLayerRef.current);
      track.style.willChange = 'transform';
    }

    track.style.transition = animate
      ? `transform ${SLIDE_DURATION_MS}ms ${SLIDE_EASING}`
      : 'none';
    // translate3d keeps the track on its own compositor layer.
    track.style.transform =
      `translate3d(calc(-${currentRef.current * 100}% + ${offsetPx}px), 0, 0)`;

    if (animate) {
      // transitionend is the normal path; this is the safety net for when it
      // never arrives (a backgrounded tab, an interrupted transition).
      releaseLayerRef.current = window.setTimeout(releaseLayer, SLIDE_DURATION_MS + 100);
    }
  }, [releaseLayer]);

  // Settle onto the active slide whenever it changes. The first run positions
  // the track without animating it in from nowhere.
  useEffect(() => {
    currentRef.current = current;
    moveTrack(0, hasMountedRef.current);
    hasMountedRef.current = true;
  }, [current, moveTrack]);

  useEffect(() => () => window.clearTimeout(releaseLayerRef.current), []);

  const goToSlide = useCallback((index) => {
    setCurrent(Math.max(0, Math.min(index, SLIDES.length - 1)));
  }, []);

  const goToNextSlide = useCallback(() => {
    setCurrent((previous) => Math.min(previous + 1, SLIDES.length - 1));
  }, []);

  const goToPreviousSlide = useCallback(() => {
    setCurrent((previous) => Math.max(previous - 1, 0));
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goToNextSlide();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goToPreviousSlide();
    }
  };

  const handlePointerDown = (event) => {
    isDraggingRef.current = true;
    hasCapturedRef.current = false;
    hasDraggedRef.current = false;
    dragStartXRef.current = event.clientX;

    const track = trackRef.current;
    if (track) {
      window.clearTimeout(releaseLayerRef.current);
      track.style.willChange = 'transform';
      track.style.cursor = 'grabbing';
    }
  };

  const handlePointerMove = (event) => {
    if (!isDraggingRef.current) return;

    const distance = event.clientX - dragStartXRef.current;

    if (!hasDraggedRef.current && Math.abs(distance) > DRAG_INTENT_THRESHOLD) {
      hasDraggedRef.current = true;
      if (!hasCapturedRef.current) {
        event.currentTarget.setPointerCapture(event.pointerId);
        hasCapturedRef.current = true;
      }
    }

    if (hasDraggedRef.current) {
      moveTrack(distance, false);
    }
  };

  const endDrag = (event, { commit }) => {
    if (!isDraggingRef.current) return;

    if (hasCapturedRef.current) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const distance = event.clientX - dragStartXRef.current;
    const dragged = hasDraggedRef.current;

    isDraggingRef.current = false;
    hasCapturedRef.current = false;

    const track = trackRef.current;
    if (track) {
      track.style.cursor = '';
    }

    const shouldAdvance = commit && dragged && Math.abs(distance) >= SWIPE_THRESHOLD;
    const nextIndex = shouldAdvance
      ? Math.max(0, Math.min(current + (distance < 0 ? 1 : -1), SLIDES.length - 1))
      : current;

    if (nextIndex === current) {
      // Same slide: ease back from wherever the finger left it.
      moveTrack(0, true);
    } else {
      setCurrent(nextIndex);
    }
  };

  const handleTransitionEnd = (event) => {
    if (event.target !== trackRef.current || event.propertyName !== 'transform') return;

    releaseLayer();
  };

  // A drag that ends on the slide would otherwise fire the link's click.
  const handleSlideLinkClick = (event) => {
    if (hasDraggedRef.current) {
      event.preventDefault();
      hasDraggedRef.current = false;
    }
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured collections"
      className="relative h-[78svh] min-h-[560px] w-full overflow-hidden bg-gray-100 md:h-[68vh] md:min-h-[520px] xl:h-[62vh] 2xl:h-[56vh]"
    >
      <div
        ref={trackRef}
        role="group"
        tabIndex={0}
        aria-label={`Slide ${current + 1} of ${SLIDES.length}. Use the arrow keys to browse.`}
        onKeyDown={handleKeyDown}
        className="flex h-full cursor-grab select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
        style={{ transform: 'translate3d(0, 0, 0)' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={(event) => endDrag(event, { commit: true })}
        onPointerCancel={(event) => endDrag(event, { commit: false })}
        onTransitionEnd={handleTransitionEnd}
        onDragStart={(event) => event.preventDefault()}
      >
        {SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            inert={index !== current}
            aria-hidden={index !== current}
            className={`relative h-full w-full flex-none overflow-hidden ${slide.bg}`}
            style={{ touchAction: 'pan-y' }}
          >
            <picture className="absolute inset-0 block h-full w-full pointer-events-none">
              <source
                media="(min-width: 768px)"
                sizes="100vw"
                srcSet={buildSrcSet(slide.backgroundImageDesktop, DESKTOP_WIDTHS)}
              />
              <img
                src={atWidth(slide.backgroundImageMobile, MOBILE_WIDTHS[1])}
                srcSet={buildSrcSet(slide.backgroundImageMobile, MOBILE_WIDTHS)}
                sizes="100vw"
                alt=""
                className="h-full w-full object-cover"
                draggable="false"
                // Every slide loads up front. Lazy-loading an off-screen slide
                // meant the first swipe to it paid for a fetch and a decode
                // mid-animation; only the first competes for priority.
                loading="eager"
                fetchPriority={index === 0 ? 'high' : 'low'}
                decoding={index === 0 ? 'sync' : 'async'}
              />
            </picture>

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/10 md:bg-gradient-to-r md:from-black/70 md:via-black/25 md:to-transparent" />

            <Link
              to={slide.link}
              className="absolute inset-0 z-10"
              aria-label={`${slide.cta}: ${slide.title}`}
              onClick={handleSlideLinkClick}
              onDragStart={(event) => event.preventDefault()}
            />

            <div className="relative z-20 flex h-full items-end pointer-events-none md:items-center">
              <div className="container mx-auto px-6 pb-24 md:px-24 md:pb-0">
                <div className="max-w-xl space-y-4 text-white md:space-y-6">
                  <span className="block text-[11px] font-bold uppercase tracking-[0.28em] text-white/80 md:text-xs">
                    {slide.subtitle}
                  </span>
                  {/* h2: the page's single h1 lives in the home page itself. */}
                  <AnimatedHeading
                    as="h2"
                    className="text-4xl font-bold tracking-tight text-white py-2 sm:text-5xl md:text-7xl"
                    isVisible={current === index}
                  >
                    {slide.title}
                  </AnimatedHeading>
                  <p className="max-w-md text-sm leading-relaxed text-white/85 md:text-lg">
                    {slide.description}
                  </p>
                  <Button
                    to={slide.link}
                    variant="secondary"
                    className="pointer-events-auto"
                    onClick={handleSlideLinkClick}
                  >
                    {slide.cta}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 space-x-3 md:bottom-8">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => goToSlide(index)}
            aria-label={`Show slide ${index + 1}: ${slide.title}`}
            aria-current={current === index}
            className={`h-3 rounded-full transition-all origin-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 ${
              current === index ? 'bg-white w-10' : 'bg-white/40 w-3'
            }`}
          />
        ))}
      </div>
    </section>
  );
}

export default HeroBanner;
