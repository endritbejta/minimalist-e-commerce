import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedHeading from '../UI/AnimatedHeading';
import Button from '../UI/Button';

const SWIPE_THRESHOLD = 50;

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

function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const dragStartXRef = useRef(0);
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const hasCapturedRef = useRef(false);

  const goToSlide = useCallback((index) => {
    const safeIndex = Math.max(0, Math.min(index, SLIDES.length - 1));
    setCurrent(safeIndex);
    setTrackIndex(safeIndex);
  }, []);

  const goToNextSlide = useCallback(() => {
    setCurrent((prev) => {
      const next = Math.min(prev + 1, SLIDES.length - 1);
      setTrackIndex(next);
      return next;
    });
  }, []);

  const goToPreviousSlide = useCallback(() => {
    setCurrent((prev) => {
      const next = Math.max(prev - 1, 0);
      setTrackIndex(next);
      return next;
    });
  }, []);


  const handlePointerDown = (event) => {
    isDraggingRef.current = true;
    setIsDragging(true);
    dragStartXRef.current = event.clientX;
    setIsPaused(true);
    setDragOffset(0);
    hasCapturedRef.current = false;
    hasDraggedRef.current = false;
  };

  const handlePointerMove = (event) => {
    if (!isDraggingRef.current) return;

    const distance = event.clientX - dragStartXRef.current;

    if (!hasDraggedRef.current && Math.abs(distance) > 6) {
      hasDraggedRef.current = true;
      if (!hasCapturedRef.current) {
        event.currentTarget.setPointerCapture(event.pointerId);
        hasCapturedRef.current = true;
      }
    }

    if (hasDraggedRef.current) {
      setDragOffset(distance);
    }
  };

  const handlePointerUp = (event) => {
    if (!isDraggingRef.current) return;

    if (hasCapturedRef.current) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const distance = event.clientX - dragStartXRef.current;

    isDraggingRef.current = false;
    hasCapturedRef.current = false;
    setIsDragging(false);
    setDragOffset(0);

    if (hasDraggedRef.current && Math.abs(distance) >= SWIPE_THRESHOLD) {
      distance < 0 ? goToNextSlide() : goToPreviousSlide();
    }

    hasDraggedRef.current = false;

    if (event.pointerType !== 'mouse') {
      window.setTimeout(() => setIsPaused(false), 800);
    }
  };

  const handlePointerCancel = (event) => {
    if (hasCapturedRef.current) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    isDraggingRef.current = false;
    hasDraggedRef.current = false;
    hasCapturedRef.current = false;
    setIsDragging(false);
    setDragOffset(0);
  };

  const trackStyle = {
    transform: `translateX(calc(-${trackIndex * 100}% + ${dragOffset}px))`,
    transition: isDragging
      ? 'none'
      : 'transform 700ms cubic-bezier(0.22, 1, 0.36, 1)',
  };

  const sliderClassName = `flex h-full cursor-grab select-none ${
    isDragging ? 'cursor-grabbing' : ''
  }`;

  const handleMouseEnter = () => setIsPaused(true);

  const handleMouseLeave = () => {
    if (!isDraggingRef.current) {
      setIsPaused(false);
    }
  };

  const handleIndicatorClick = (index) => {
    goToSlide(index);
    setIsPaused(true);
    window.setTimeout(() => setIsPaused(false), 800);
  };

  const handleSlideLinkClick = (event) => {
    if (hasDraggedRef.current) {
      event.preventDefault();
      hasDraggedRef.current = false;
    }
  };

  useEffect(() => {
    return () => {
      isDraggingRef.current = false;
    };
  }, []);

  return (
    <section className="relative h-[78svh] min-h-[560px] w-full overflow-hidden bg-gray-100 md:h-[68vh] md:min-h-[520px] xl:h-[62vh] 2xl:h-[56vh]">
      <div
        className={sliderClassName}
        style={trackStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onDragStart={(e) => e.preventDefault()}
      >
        {SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`relative h-full w-full flex-none overflow-hidden ${slide.bg}`}
            style={{ touchAction: 'pan-y' }}
          >
            <picture className="absolute inset-0 block h-full w-full pointer-events-none">
              <source media="(min-width: 768px)" srcSet={slide.backgroundImageDesktop} />
              <img
                src={slide.backgroundImageMobile}
                alt=""
                className="h-full w-full object-cover"
                draggable="false"
                loading={slide.id === 1 ? "eager" : "lazy"}
                {...(slide.id === 1 ? { fetchPriority: "high" } : {})}
              />
            </picture>

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/10 md:bg-gradient-to-r md:from-black/70 md:via-black/25 md:to-transparent" />

            <Link
              to={slide.link}
              className="absolute inset-0 z-10"
              aria-label={`${slide.cta}: ${slide.title}`}
              tabIndex={index === current ? 0 : -1}
              onClick={handleSlideLinkClick}
              onDragStart={(e) => e.preventDefault()}
            />

            <div className="relative z-20 flex h-full items-end pointer-events-none md:items-center">
              <div className="container mx-auto px-6 pb-24 md:px-24 md:pb-0">
                <div className="max-w-xl space-y-4 text-white md:space-y-6">
                  <span className="block text-[11px] font-bold uppercase tracking-[0.28em] text-white/80 md:text-xs">
                    {slide.subtitle}
                  </span>
                  <AnimatedHeading
                    as="h1"
                    className="text-4xl font-bold tracking-tight text-white py-2 sm:text-5xl md:text-7xl"
                    isVisible={current === index}
                    triggerOnce={true}
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
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleIndicatorClick(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            aria-current={current === idx ? 'true' : undefined}
            className={`h-3 rounded-full transition-all origin-right ${
              current === idx ? 'bg-white w-10' : 'bg-white/40 w-3'
            }`}
          />
        ))}
      </div>
    </section>
  );
}

export default HeroBanner;