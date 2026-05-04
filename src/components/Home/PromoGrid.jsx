import { Link } from 'react-router-dom';
import Button from '../UI/Button';

/**
 * PromoGrid Component
 * Renders a grid of promotional banners with links to specific collections.
 */
function PromoGrid() {
  return (
    <section className="bg-gray-50 py-20 px-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Promo Item 1 */}
        <div className="h-[400px] bg-[#e5e7eb] bg-[url('https://images.unsplash.com/photo-1743062356649-eb59ce7b8140?q=80&w=1432&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover rounded-2xl flex items-center justify-center relative overflow-hidden group">
          <div className="z-10 text-center">
            <h2 className="text-3xl font-bold mb-4">Summer Essentials</h2>
            <Button 
              to="/collections/accessories" 
              variant="secondary"
            >
              Explore Collection
            </Button>
          </div>
          {/* Subtle scale effect on hover */}
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors duration-500" />
        </div>

        {/* Promo Item 2 */}
        <div className="h-[400px] bg-[#d1d5db] bg-[url('https://images.unsplash.com/photo-1765551097131-03fb35a0d6c3?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover rounded-2xl flex items-center justify-center relative overflow-hidden group">
           <div className="z-10 text-center">
            <h2 className="text-3xl mix-blend-difference text-white
             font-bold mb-4">Tech Setup</h2>
            <Button 
              to="/collections/electronics" 
              variant="secondary"
            >
              View Gadgets
            </Button>
          </div>
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors duration-500" />
        </div>
      </div>
    </section>
  );
}

export default PromoGrid;
