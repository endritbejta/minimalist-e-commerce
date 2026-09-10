import { useParams } from 'react-router-dom';
import { getCollection, getProductsByCollection } from '../lib/catalog';
import CollectionGrid from '../components/Collection/CollectionGrid';
import SEO from '../components/UI/SEO';
import NotFound from './NotFound';

/**
 * CollectionPage Component
 * Lists the products in a collection.
 */
function CollectionPage() {
  const { handle } = useParams();
  const collection = getCollection(handle);

  // An unrecognised handle used to render an empty, indexable page titled after
  // whatever the URL happened to contain.
  if (!collection) {
    return <NotFound title="Collection not found" />;
  }

  const products = getProductsByCollection(collection.handle);

  return (
    <div className="container mx-auto px-6">
      <SEO
        title={`${collection.title} Collection`}
        description={`Explore our ${collection.title.toLowerCase()} collection. Curated minimalist products.`}
      />
      <CollectionGrid products={products} title={collection.title} />
    </div>
  );
}

export default CollectionPage;
