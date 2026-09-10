import { useId, useState } from 'react';
import { products } from '../../data/products';
import Button from '../UI/Button';
import ProductCard from '../Product/ProductCard';

// Two non-overlapping slices of the catalog stand in for real merchandising.
const TABS = [
  { id: 'favourite', label: 'Our Favourite', products: products.slice(0, 4) },
  { id: 'best-sellers', label: 'Best Sellers', products: products.slice(4, 8) },
];

/**
 * FeaturedTabs Component
 * A tabbed showcase of two curated product sets.
 */
function FeaturedTabs() {
  const [activeTabId, setActiveTabId] = useState(TABS[0].id);
  const baseId = useId();

  const activeTab = TABS.find((tab) => tab.id === activeTabId) ?? TABS[0];

  // Roving tabindex plus arrow keys, per the ARIA tabs pattern.
  const handleKeyDown = (event) => {
    const currentIndex = TABS.findIndex((tab) => tab.id === activeTabId);
    let nextIndex = null;

    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % TABS.length;
    if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + TABS.length) % TABS.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = TABS.length - 1;

    if (nextIndex === null) return;

    event.preventDefault();
    const nextTab = TABS[nextIndex];
    setActiveTabId(nextTab.id);
    document.getElementById(`${baseId}-tab-${nextTab.id}`)?.focus();
  };

  return (
    <section className="py-20 container mx-auto px-6">
      <h2 className="sr-only">Featured products</h2>

      <div className="flex flex-col items-center mb-12">
        <div
          role="tablist"
          aria-label="Featured product sets"
          onKeyDown={handleKeyDown}
          className="flex space-x-8 mb-4 border-b w-full justify-center"
        >
          {TABS.map((tab) => {
            const isActive = tab.id === activeTabId;

            return (
              <button
                key={tab.id}
                id={`${baseId}-tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`${baseId}-panel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveTabId(tab.id)}
                className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${
                  isActive ? 'text-black' : 'text-gray-500'
                }`}
              >
                {tab.label}
                {isActive && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />}
              </button>
            );
          })}
        </div>
      </div>

      <div
        id={`${baseId}-panel-${activeTab.id}`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${activeTab.id}`}
        tabIndex={0}
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        {activeTab.products.map((product, index) => (
          <ProductCard key={product.id} product={product} delay={index} />
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button
          to="/collections/all"
          variant="link"
          className="text-lg uppercase tracking-widest px-2 py-2 underline-offset-8"
        >
          View All Products
        </Button>
      </div>
    </section>
  );
}

export default FeaturedTabs;
