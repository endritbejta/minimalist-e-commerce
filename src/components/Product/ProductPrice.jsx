import { formatPrice } from '../../lib/format';

/**
 * ProductPrice Component
 * Displays the formatted price for a product card.
 * @param {Object} props - Component props.
 * @param {number} props.price - The price value to display.
 */
function ProductPrice({ price }) {
  return (
    <div className="product-card-price font-semibold text-gray-900">
      {formatPrice(price)}
    </div>
  );
}

export default ProductPrice;
