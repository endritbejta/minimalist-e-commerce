import { useState } from "react";
import BuyButton from "../UI/BuyButton";
import QuantitySelector from "../UI/QuantitySelector";
import VariantSwatches from "./VariantSwatches";
import ProductCustomizer from "./ProductCustomizer";
import { IoColorWandOutline } from "react-icons/io5";
import { useModal } from "../../context/useModal.jsx";
import { useCustomization } from "../../context/CustomizationContext";
import AnimatedPrice from "../UI/AnimatedPrice";
import AnimatedHeading from "../UI/AnimatedHeading";

function ProductPageInformation({ product, selectedVariant, setSelectedVariant }) {
  const [quantity, setQuantity] = useState(1);
  const { openModal } = useModal();
  const { customization, setCustomization } = useCustomization();

  if (!product) return null;

  const handleIncrease = () => setQuantity(prev => prev + 1);
  const handleDecrease = () => {
    if(quantity <= 1) return;
    setQuantity(prev => prev - 1);
  }

  // Display price of selected variant or base product
  const displayPrice = selectedVariant?.price || product.price;
  const isCustomizable = product.handle === 'customizable-t-shirt';

  return (
    <div className="w-full md:w-1/2 flex flex-col justify-center">

      <span className="text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">
        {product.collection}
      </span>

      <AnimatedHeading  as="h1" isVisible={true} triggerOnce={true} stagger={0.02} className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
        {product.title}
      </AnimatedHeading>
      
      <p className="text-2xl font-medium text-gray-800 mb-6">
        ${displayPrice.toFixed(2)}
      </p>
      
      <div className="prose prose-sm text-gray-600 mb-8 leading-relaxed max-w-none">
        {product.description}
      </div>

      {/* Variant Swatches */}
      {product.variants && (
        <VariantSwatches 
          variants={product.variants}
          selectedVariant={selectedVariant}
          onSelect={setSelectedVariant}
        />
      )}

      {/* Customization Section */}
      {isCustomizable && (
        <div className="mb-8">
          <button
            onClick={() => openModal(ProductCustomizer, { 
              onApply: setCustomization, 
              currentCustomization: customization 
            })}
            className="flex items-center gap-3 w-full p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-black hover:bg-gray-50 transition-all group"
          >
            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-black group-hover:text-white transition-colors">
              <IoColorWandOutline size={20} />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-gray-900">
                {customization ? 'Customization Added' : 'Customize This Shirt'}
              </p>
              <p className="text-xs text-gray-500">
                {customization 
                  ? `${customization.emblem.name} at ${customization.position}` 
                  : 'Add an emblem and choose placement'}
              </p>
            </div>
          </button>
        </div>
      )}

      <div className="flex sm:flex-row gap-2">
        <QuantitySelector 
          quantity={quantity}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
          className="sm:w-25 py-1"
        />
        <BuyButton 
          product={{
            ...product,
            title: selectedVariant ? `${product.title} - ${selectedVariant.title}` : product.title,
            price: displayPrice,
            image: selectedVariant?.image || product.image,
            variantId: selectedVariant?.id,
            customization: customization // Pass customization info to cart
          }} 
          quantity={quantity}
          className="flex-1 py-4 uppercase tracking-widest text-xs" 
        >
          Add to Cart
        </BuyButton>
      </div>

      {/* Feature Grid */}
      <div className="mt-12 border-t pt-8 grid grid-cols-2 gap-8 text-xs text-gray-500">
        <div className="space-y-1">
          <p className="font-bold text-gray-900 uppercase tracking-wider">Free Shipping</p>
          <p>On all orders over $100</p>
        </div>
        <div className="space-y-1">
          <p className="font-bold text-gray-900 uppercase tracking-wider">Returns</p>
          <p>30-day money back guarantee</p>
        </div>
        <div className="space-y-1">
          <p className="font-bold text-gray-900 uppercase tracking-wider">Secure Payment</p>
          <p>SSL encrypted checkout</p>
        </div>
        <div className="space-y-1">
          <p className="font-bold text-gray-900 uppercase tracking-wider">Support</p>
          <p>24/7 dedicated assistance</p>
        </div>
      </div>
    </div>
  );
}

export default ProductPageInformation;
