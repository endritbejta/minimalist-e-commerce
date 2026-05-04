import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { products } from '../data/products';
import Breadcrumbs from '../components/UI/Breadcrumbs';
import ProductPageMedia from '../components/Product/ProductPageMedia';
import ProductPageInformation from '../components/Product/ProductPageInformation';
import { CustomizationProvider } from '../context/CustomizationContext';
import SEO from '../components/UI/SEO';

function ProductPage() {
  const { productHandle } = useParams();
  
  // Find the product by handle
  const product = products.find((p) => p.handle === productHandle);

  if (!product) {
    return (
      <div className="container mx-auto p-20 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
      </div>
    );
  }

  return (
    <CustomizationProvider>
      <ProductPageContent key={product.id} product={product} />
    </CustomizationProvider>
  );
}

function ProductPageContent({ product }) {
  const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0] || null);

  // Note: key={product.id} on this component handles state reset when product changes

  return (
    <div className="container mx-auto p-6">
      <SEO 
        title={product.title}
        description={product.description || `Buy ${product.title} at Minimalist Essentials. High-quality minimalist design.`}
        image={product.image}
        type="product"
      />
      <Breadcrumbs />
      
      <div className="flex flex-col md:flex-row gap-12 mt-8">
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
    </div>
  );
}

export default ProductPage;