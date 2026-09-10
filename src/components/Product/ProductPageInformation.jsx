import { useState } from "react";
import { IoColorWandOutline } from "react-icons/io5";
import { useCustomization } from "../../context/CustomizationContext";
import { useModal } from "../../context/ModalContext";
import { getDisplayPrice, getPrimaryImage } from "../../lib/catalog";
import { describeCustomization } from "../../lib/emblem";
import { formatPrice } from "../../lib/format";
import AnimatedHeading from "../UI/AnimatedHeading";
import BuyButton from "../UI/BuyButton";
import QuantitySelector from "../UI/QuantitySelector";
import ProductCustomizer from "./ProductCustomizer";
import VariantSwatches from "./VariantSwatches";

const GUARANTEES = [
  { title: 'Free Shipping', detail: 'On all orders over $100' },
  { title: 'Returns', detail: '30-day money back guarantee' },
  { title: 'Secure Payment', detail: 'SSL encrypted checkout' },
  { title: 'Support', detail: '24/7 dedicated assistance' },
];

/**
 * ProductPageInformation Component
 * The detail column of a product page: title, price, variants, customization
 * and the add-to-cart action.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.product - The full product object.
 * @param {Object} props.selectedVariant - The currently selected product variant.
 * @param {Function} props.setSelectedVariant - Updates the selected variant.
 * @param {'h1'|'h2'} [props.headingLevel='h1'] - Heading tag, lowered inside the quick-view modal.
 */
function ProductPageInformation({
  product,
  selectedVariant,
  setSelectedVariant,
  headingLevel = 'h1',
}) {
  const [quantity, setQuantity] = useState(1);
  const { openModal } = useModal();
  const { customization, setCustomization } = useCustomization();

  if (!product) return null;

  const displayPrice = getDisplayPrice(product, selectedVariant);
  const customizationSummary = describeCustomization(customization);

  const openCustomizer = () =>
    openModal(ProductCustomizer, {
      onApply: setCustomization,
      currentCustomization: customization,
    });

  return (
    <div className="w-full md:w-1/2 flex flex-col justify-center">
      <span className="text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">
        {product.collection}
      </span>

      <AnimatedHeading
        as={headingLevel}
        isVisible
        stagger={0.02}
        className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight"
      >
        {product.title}
      </AnimatedHeading>

      <p className="text-2xl font-medium text-gray-800 mb-6">{formatPrice(displayPrice)}</p>

      <div className="text-gray-600 mb-8 leading-relaxed">{product.description}</div>

      {product.variants && (
        <VariantSwatches
          variants={product.variants}
          selectedVariant={selectedVariant}
          onSelect={setSelectedVariant}
        />
      )}

      {/* Driven by a data flag rather than a hardcoded product handle. */}
      {product.customizable && (
        <div className="mb-8">
          <button
            type="button"
            onClick={openCustomizer}
            className="flex items-center gap-3 w-full p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-black hover:bg-gray-50 transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-black group-hover:text-white transition-colors">
              <IoColorWandOutline size={20} />
            </div>
            <div className="text-left min-w-0">
              <p className="text-sm font-bold text-gray-900">
                {customization ? 'Customization added' : 'Customize this shirt'}
              </p>
              <p className="text-xs text-gray-500">
                {customizationSummary || 'Add an emblem and choose placement'}
              </p>
            </div>
          </button>
        </div>
      )}

      <div className="flex sm:flex-row gap-2">
        <QuantitySelector
          quantity={quantity}
          label={product.title}
          onIncrease={() => setQuantity((current) => current + 1)}
          onDecrease={() => setQuantity((current) => Math.max(1, current - 1))}
          className="sm:w-25 py-1"
        />
        <BuyButton
          product={{
            ...product,
            title: selectedVariant ? `${product.title} - ${selectedVariant.title}` : product.title,
            price: displayPrice,
            image: selectedVariant?.image || getPrimaryImage(product),
            variantId: selectedVariant?.id,
            customization,
          }}
          quantity={quantity}
          className="flex-1 py-4 uppercase tracking-widest text-xs"
        >
          Add to Cart
        </BuyButton>
      </div>

      <div className="mt-12 border-t pt-8 grid grid-cols-2 gap-8 text-xs text-gray-500">
        {GUARANTEES.map(({ title, detail }) => (
          <div key={title} className="space-y-1">
            <p className="font-bold text-gray-900 uppercase tracking-wider">{title}</p>
            <p>{detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductPageInformation;
