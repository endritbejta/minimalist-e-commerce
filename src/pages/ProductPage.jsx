import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { CustomizationProvider } from '../context/CustomizationProvider';
import { getProductByHandle } from '../lib/catalog';
import Breadcrumbs from '../components/UI/Breadcrumbs';
import ProductPageInformation from '../components/Product/ProductPageInformation';
import ProductPageMedia from '../components/Product/ProductPageMedia';
import SEO from '../components/UI/SEO';
import NotFound from './NotFound';

/**
 * ProductPage Component
 * Resolves a product from the route and renders its detail view.
 */
function ProductPage() {
  const { productHandle } = useParams();
  const product = getProductByHandle(productHandle);

  // Reuse the real 404 page (which also sends `noindex`) rather than showing a
  // bare "not found" line that search engines would happily index.
  if (!product) {
    return <NotFound title="Product not found" />;
  }

  return (
    <CustomizationProvider>
      {/* key resets variant and customization state when the product changes */}
      <ProductPageContent key={product.id} product={product} />
    </CustomizationProvider>
  );
}

function ProductPageContent({ product }) {
  const [selectedVariant, setSelectedVariant] = useState(
    () => product.variants?.[0] ?? null
  );

  const images = selectedVariant?.image ? [selectedVariant.image] : product.images ?? [];
  const mediaTitle = selectedVariant
    ? `${product.title} - ${selectedVariant.title}`
    : product.title;

  return (
    <div className="container mx-auto p-6">
      <SEO
        title={product.title}
        description={product.description}
        image={images[0]}
        type="product"
      />
      <Breadcrumbs currentLabel={product.title} />

      <div className="flex flex-col md:flex-row gap-12 mt-8">
        <ProductPageMedia images={images} title={mediaTitle} />
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
