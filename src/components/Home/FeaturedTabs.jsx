import { useState } from 'react';
import { products } from '../../data/products';
import ProductCard from '../Product/ProductCard';
import Button from '../UI/Button';

function FeaturedTabs() {
  const [activeTab, setActiveTab] = useState('favourite');

  // For demo, we just slice different parts of the products array
  const favouriteProducts = products.slice(0, 4);
  const bestSellers = products.slice(5, 9);

  const displayedProducts = activeTab === 'favourite' ? favouriteProducts : bestSellers;

  return (
    <section className="py-20 container mx-auto px-6">
      <div className="flex flex-col items-center mb-12">
        <div className="flex space-x-8 mb-4 border-b w-full justify-center">
          <button
            onClick={() => setActiveTab('favourite')}
            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
              activeTab === 'favourite' ? 'text-black' : 'text-gray-500'
            }`}
          >
            Our Favourite
            {activeTab === 'favourite' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />}
          </button>
          <button
            onClick={() => setActiveTab('best-sellers')}
            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
              activeTab === 'best-sellers' ? 'text-black' : 'text-gray-500'
            }`}
          >
            Best Sellers
            {activeTab === 'best-sellers' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {displayedProducts.map((product,i) => (
          <ProductCard key={product.id} product={product} delay={i} />
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
