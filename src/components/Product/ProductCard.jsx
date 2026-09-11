import { memo } from 'react';
import { Link } from 'react-router-dom';
import { IoEyeOutline } from 'react-icons/io5';
import { useModal } from '../../context/ModalContext';
import { getPrimaryImage } from '../../lib/catalog';
import BuyButton from '../UI/BuyButton';
import ProductInfo from './ProductInfo';
import ProductMedia from './ProductMedia';
import ProductPrice from './ProductPrice';
import QuickViewModal from './QuickViewModal';

// Cap the stagger so the last card in a long grid is not left waiting.
const STAGGER_STEP = 0.04;
const MAX_STAGGER = 0.4;

/**
 * ProductCard Component
 * Displays a summary of a product with an image, title, price, and quick actions.
 * Memoized because collection grids render many of these at once.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.product - The product object to display.
 * @param {number} [props.delay=0] - Position in the grid, used for staggered entrance.
 * @param {boolean} [props.priority=false] - Whether the image should have high fetch priority.
 */
const ProductCard = memo(({ product, delay = 0, priority = false }) => {
  const { openModal } = useModal();

  if (!product) return null;

  const handleQuickView = (event) => {
    event.preventDefault();
    event.stopPropagation();
    openModal(QuickViewModal, { product });
  };

  const productUrl = `/products/${product.handle}`;

  return (
    <div
      className="product-card group relative animate-fadeIn"
      style={{ animationDelay: `${Math.min(delay * STAGGER_STEP, MAX_STAGGER)}s` }}
    >
      <div className="relative block">
        {/* Hidden from assistive tech: the title link below points to the same
            place, so exposing both would announce every product twice. */}
        <Link to={productUrl} className="cursor-pointer block" tabIndex={-1} aria-hidden="true">
          <ProductMedia image={getPrimaryImage(product)} title={product.title} priority={priority} />
        </Link>

        {/*
          The padding is the touch target and the inner circle is the visible
          control. At p-1 around a 16px icon this was a 24px target — half the
          44px a finger needs — so a near miss hit the card link underneath and
          navigated to the product page instead of opening the quick view.
        */}
        <button
          type="button"
          onClick={handleQuickView}
          className="group absolute top-0 right-0 p-2.5 z-10 text-white transition-transform duration-300 hover:scale-105 mix-blend-difference focus-visible:outline-none"
          aria-label={`Quick view: ${product.title}`}
        >
          {/* Rounding lives on the circle, not the button: a rounded-full
              button is hit-tested as a circle, so taps near the corners of its
              box fell through to the card link. */}
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/10 shadow-sm group-focus-visible:ring-2 group-focus-visible:ring-black">
            <IoEyeOutline size={20} />
          </span>
        </button>
      </div>

      <Link to={productUrl} className="cursor-pointer block mt-3">
        <div className="flex flex-col justify-between items-start w-full">
          <ProductInfo title={product.title} />
          <ProductPrice price={product.price} />
        </div>
      </Link>

      <div className="mt-2 transition-opacity duration-300">
        <BuyButton
          product={product}
          variant="primary"
          className="py-1 lg:py-4 lg:px-2 text-[10px] uppercase tracking-tighter rounded-[4px] w-full"
          aria-label={`Add ${product.title} to cart`}
        >
          ADD TO CART
        </BuyButton>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
