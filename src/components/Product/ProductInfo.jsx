/**
 * ProductInfo Component
 * Renders the title for a product card.
 * @param {Object} props - Component props.
 * @param {string} props.title - The product title.
 */
function ProductInfo({ title }) {
  return (
    <div className="product-card-info w-full min-w-0">
      <h3 className="text-sm font-medium text-gray-800 truncate w-full" title={title}>
        {title}
      </h3>
    </div>
  );
}

export default ProductInfo;
