import { useParams } from 'react-router-dom';
import { products } from '../data/products';
import CollectionGrid from '../components/Collection/CollectionGrid';

import SEO from '../components/UI/SEO';

function CollectionPage() {
  const { handle } = useParams();

  // Filter products based on the handle
  const filteredProducts = handle === 'all' 
    ? products 
    : products.filter(p => p.collection.toLowerCase() === handle.toLowerCase());

  const collectionTitle = handle.charAt(0).toUpperCase() + handle.slice(1);

  return (
    <div className="container mx-auto px-6">
      <SEO 
        title={`${collectionTitle} Collection`}
        description={`Explore our ${handle} collection at Minimalist Essentials. Curated minimalist products.`}
      />
      <CollectionGrid products={filteredProducts} collection={handle} />
    </div>
  );
}

export default CollectionPage;