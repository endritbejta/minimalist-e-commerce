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
