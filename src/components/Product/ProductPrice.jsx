function ProductPrice({ price }) {
  return (
    <div className="product-card-price font-semibold text-gray-900">
      ${price.toFixed(2)}
    </div>
  );
}

export default ProductPrice;
