import { useState } from 'react';
import ProductCard from '../Product/ProductCard';
import { BsGrid, BsGrid3X3Gap } from 'react-icons/bs';
import Breadcrumbs from '../UI/Breadcrumbs';
import SortDropdown from './SortDropdown';
import { useSortedProducts } from '../../hooks/useSortedProducts';
import AnimatedHeading from '../UI/AnimatedHeading';

/**
 * CollectionGrid Component
 * Displays a sortable and toggleable grid of products within a collection.
 * @param {Object} props - Component props.
 * @param {Object[]} props.products - The list of products to display.
 * @param {string} props.collection - The handle of the current collection.
 */
function CollectionGrid({ products, collection }) {
  const [viewCols, setViewCols] = useState(2);
  const [sortBy, setSortBy] = useState('featured');

  const sortedProducts = useSortedProducts(products, sortBy);

  if (!products || products.length === 0) {
    return (
      <div className="py-20 text-center text-gray-500">
        No products found in this collection.
      </div>
    );
  }

  // Define grid classes based on selection
  const getGridClasses = () => {
    switch (viewCols) {
      case 2:
        return 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      case 3:
        return 'grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6';
      default:
        return 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    }
  };



  return (
    <div className="pt-6">
      <AnimatedHeading 
        className="text-4xl md:text-5xl font-bold uppercase tracking-tighter mb-4 lg:mb-8 text-gray-900 py-2"
        as="h1"
        toggleOnce={false}
        type="reveal"
      >
        {collection.replace('-', ' ')}
      </AnimatedHeading>
      {/* View Switcher Controls */}
      <div className="flex justify-stretch md:justify-between gap-2 items-center mb-6 space-x-4 border-b pb-4 flex-wrap">
        <Breadcrumbs />
        <div className='flex items-center gap-3 w-full justify-between ml-[0px!important]'>
          <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />

          <div className="flex bg-gray-100 p-1 rounded-md">
            <button
              onClick={() => setViewCols(2)}
              className={`p-2 rounded-md transition-all ${
                viewCols === 2 ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-600'
              }`}
              aria-label="2 columns view"
            >
              <BsGrid size={18} />
            </button>
            <button
              onClick={() => setViewCols(3)}
              className={`p-2 rounded-md transition-all ${
                viewCols === 3 ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-600'
              }`}
              aria-label="3 columns view"
            >
              <BsGrid3X3Gap size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* The Product Grid */}
      <div 
        key={viewCols}
        className={`grid ${getGridClasses()} gap-x-4 gap-y-10`}
      >
        {sortedProducts.map((product, index) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            delay={index / 2} 
            priority={index < 4}
          />
        ))}
      </div>
    </div>
  );
}

export default CollectionGrid;
