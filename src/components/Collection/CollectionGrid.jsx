import { useState } from 'react';
import { BsGrid, BsGrid3X3Gap } from 'react-icons/bs';
import { useSortedProducts } from '../../hooks/useSortedProducts';
import AnimatedHeading from '../UI/AnimatedHeading';
import Breadcrumbs from '../UI/Breadcrumbs';
import ProductCard from '../Product/ProductCard';
import SortDropdown from './SortDropdown';

const GRID_VIEWS = {
  2: {
    label: 'Comfortable, 2 columns',
    Icon: BsGrid,
    classes: 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  },
  3: {
    label: 'Compact, 3 columns',
    Icon: BsGrid3X3Gap,
    classes: 'grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
  },
};

const PRIORITY_IMAGE_COUNT = 4;

/**
 * CollectionGrid Component
 * A sortable, density-switchable grid of products.
 * @param {Object} props - Component props.
 * @param {Object[]} props.products - The products to display.
 * @param {string} props.title - Display name of the collection.
 */
function CollectionGrid({ products, title }) {
  const [viewCols, setViewCols] = useState(2);
  const [sortBy, setSortBy] = useState('featured');

  const sortedProducts = useSortedProducts(products, sortBy);
  const view = GRID_VIEWS[viewCols] ?? GRID_VIEWS[2];

  return (
    <div className="pt-6">
      <AnimatedHeading
        as="h1"
        type="reveal"
        toggleOnce={false}
        className="text-4xl md:text-5xl font-bold uppercase tracking-tighter mb-4 lg:mb-8 text-gray-900 py-2"
      >
        {title}
      </AnimatedHeading>

      <div className="flex justify-stretch md:justify-between gap-2 items-center mb-6 space-x-4 border-b pb-4 flex-wrap">
        <Breadcrumbs />
        <div className="flex items-center gap-3 w-full justify-between">
          <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />

          <div className="flex bg-gray-100 p-1 rounded-md" role="group" aria-label="Grid density">
            {Object.entries(GRID_VIEWS).map(([cols, { label, Icon }]) => {
              const value = Number(cols);
              const isActive = viewCols === value;

              return (
                <button
                  key={cols}
                  type="button"
                  onClick={() => setViewCols(value)}
                  aria-pressed={isActive}
                  aria-label={label}
                  className={`p-2 rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${
                    isActive ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-600'
                  }`}
                >
                  <Icon size={18} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {sortedProducts.length === 0 ? (
        <p className="py-20 text-center text-gray-500">
          No products found in this collection.
        </p>
      ) : (
        // Density is a class change, not a remount: re-keying the grid threw
        // away every card and replayed the entrance animation on each toggle.
        <div className={`grid ${view.classes} gap-x-4 gap-y-10`}>
          {sortedProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              delay={index}
              priority={index < PRIORITY_IMAGE_COUNT}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CollectionGrid;
