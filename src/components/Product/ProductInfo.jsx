/**
 * ProductInfo Component
 * Renders the title and collection name for a product card.
 * @param {Object} props - Component props.
 * @param {string} props.title - The product title.
 * @param {string} props.collection - The collection name the product belongs to.
 */
function ProductInfo({ title, collection }) {
  return (
    <div className="product-card-info w-full min-w-0">
      <h2 className="text-sm font-medium text-gray-800 truncate w-full" title={title}>
        {title}
      </h2>
    </div>
  );
}

export default ProductInfo;
