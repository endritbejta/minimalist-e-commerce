import { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { CustomizationProvider } from '../../context/CustomizationProvider';
import PopUpModal from '../UI/PopUpModal';
import ProductPageInformation from './ProductPageInformation';
import ProductPageMedia from './ProductPageMedia';

/**
 * QuickViewModal Component
 * Views and configures a product without leaving the current page.
 *
 * @param {Object} props - Component props.
 * @param {boolean} props.isOpen - Whether the modal is visible.
 * @param {Function} props.onClose - Function to close the modal.
 * @param {Object} props.product - The product object to display.
 */
function QuickViewModal({ isOpen, onClose, product }) {
  // Derived on mount rather than synced with an effect; ModalProvider keys the
  // view by product id, so a different product remounts with fresh state.
  const [selectedVariant, setSelectedVariant] = useState(
    () => product?.variants?.[0] ?? null
  );

  if (!product) return null;

  const images = selectedVariant?.image ? [selectedVariant.image] : product.images ?? [];
  const mediaTitle = selectedVariant
    ? `${product.title} - ${selectedVariant.title}`
    : product.title;

  return (
    <PopUpModal
      isOpen={isOpen}
      onClose={onClose}
      className="w-full max-w-5xl !bg-white p-0"
      aria-label={`Quick view: ${product.title}`}
    >
      <div className="relative flex flex-col flex-1 min-h-0">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-3 bg-white shadow-sm rounded-full hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          aria-label="Close quick view"
        >
          <IoClose size={24} />
        </button>

        <div className="overflow-y-auto flex-1 p-6 md:p-10">
          <CustomizationProvider>
            <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
              <ProductPageMedia images={images} title={mediaTitle} />
              {/* h2 inside the modal: the page behind it already owns the h1. */}
              <ProductPageInformation
                product={product}
                selectedVariant={selectedVariant}
                setSelectedVariant={setSelectedVariant}
                headingLevel="h2"
              />
            </div>
          </CustomizationProvider>
        </div>
      </div>
    </PopUpModal>
  );
}

export default QuickViewModal;
