import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import PopUpModal from '../UI/PopUpModal';
import ProductPageMedia from './ProductPageMedia';
import ProductPageInformation from './ProductPageInformation';
import { CustomizationProvider } from '../../context/CustomizationContext';

function QuickViewModal({ isOpen, onClose, product }) {
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    if (product?.variants?.length > 0) {
      setSelectedVariant(product.variants[0]);
    } else {
      setSelectedVariant(null);
    }
  }, [product]);

  if (!product) return null;

  return (
    <PopUpModal isOpen={isOpen} onClose={onClose} className="w-full max-w-5xl !bg-white p-0">
      <div className="relative flex flex-col flex-1 min-h-0">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-3 bg-white shadow-sm rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close modal"
        >
          <IoClose size={24} />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6 md:p-10">
          <CustomizationProvider>
            <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
              <ProductPageMedia 
                images={selectedVariant ? [selectedVariant.image] : (product.images || [product.image])} 
                title={selectedVariant ? `${product.title} - ${selectedVariant.title}` : product.title} 
              />
              <ProductPageInformation 
                product={product} 
                selectedVariant={selectedVariant}
                setSelectedVariant={setSelectedVariant}
              />
            </div>
          </CustomizationProvider>
        </div>
      </div>
    </PopUpModal>
  );
}

export default QuickViewModal;
