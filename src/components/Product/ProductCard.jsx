import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { IoEyeOutline } from 'react-icons/io5';
import ProductMedia from './ProductMedia';
import ProductInfo from './ProductInfo';
import ProductPrice from './ProductPrice';
import BuyButton from '../UI/BuyButton';
import { useModal } from '../../context/useModal.jsx';
import QuickViewModal from './QuickViewModal';

/**
 * ProductCard Component
 * Displays a summary of a product with an image, title, price, and quick actions.
 * Optimized with React.memo for high performance in long lists.
 * 
 * @param {Object} props - Component props.
 * @param {Object} props.product - The product object to display.
 * @param {number} [props.delay=0] - Animation delay offset for staggered entrance.
 * @param {boolean} [props.priority=false] - Whether the image should have high fetch priority.
 */
const ProductCard = memo(({ product, delay = 0, priority = false }) => {
  const { openModal } = useModal();

  if (!product) return null;

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openModal(QuickViewModal, { product });
  };

  return (
    <div 
      className="product-card group relative animate-fadeIn"
      style={{ animationDelay: `${delay*0.08}s` }}
    >
      <div className="relative block">
        <Link to={`/products/${product.handle}`} className="cursor-pointer block" tabIndex="-1" aria-hidden="true">
          <ProductMedia image={product.images?.[0]} title={product.title} priority={priority} />
        </Link>
        
        {/* Quick View Button */}
        <button 
          onClick={handleQuickView}
          className="absolute top-1 right-1 md:top-2 md:right-2 p-1 md:p-2 bg-black/10 rounded-full text-white opacity-100 transition-all duration-300 shadow-sm z-10 scale-95 hover:scale-105 mix-blend-difference"
          aria-label="Quick view"
        >
          <IoEyeOutline size={16} className="md:w-[20px] md:h-[20px]" />
        </button>
      </div>

      <Link to={`/products/${product.handle}`} className="cursor-pointer block mt-3">
        <div className="flex flex-col justify-between items-start w-full">
          <ProductInfo title={product.title} collection={product.collection} />
          <ProductPrice price={product.price} />
        </div>
      </Link>
      
      {/* Quick Add Button - Appears on hover */}
      <div className="mt-2 group-hover:opacity-100 transition-opacity duration-300">
        <BuyButton 
          product={product} 
          variant="primary" 
          className="py-1 lg:py-4 lg:px-2 text-[10px] uppercase tracking-tighter rounded-[4px] w-full"
        >
          ADD TO CART
        </BuyButton>
      </div>
    </div>
  );
});

export default ProductCard;
