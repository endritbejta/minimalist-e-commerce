import React, { useState, useMemo, useEffect, useRef } from 'react';
import { IoSearchOutline, IoCloseOutline } from 'react-icons/io5';
import { products } from '../../data/products';
import { Link } from 'react-router-dom';
import SmartImage from './SmartImage';

/**
 * GlobalSearch Component
 * Provides a full-screen search overlay with real-time product filtering.
 */
const GlobalSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Auto-focus input when opened
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setQuery('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const results = useMemo(() => {
    if (query.length < 2) return [];
    const lowerQuery = query.toLowerCase();
    return products.filter(p => 
      p.title.toLowerCase().includes(lowerQuery) || 
      p.collection.toLowerCase().includes(lowerQuery)
    ).slice(0, 6); // Limit to 6 results for the grid/list
  }, [query]);

  const handleClose = () => {
    setIsOpen(false);
    setQuery('');
  };

  return (
    <>
      {/* Trigger Button in Header */}
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
        aria-label="Open search"
      >
        <IoSearchOutline size={24} />
      </button>

      {/* Backdrop (Exactly like CartDrawer) */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleClose}
      />

      {/* Search Overlay Container */}
      <div className={`fixed inset-x-0 top-0 z-[100] flex flex-col transition-transform duration-500 ease-in-out transform ${
        isOpen ? 'translate-y-0' : '-translate-y-full shadow-none pointer-events-none'
      }`}>
        {/* Search Header Area */}
        <div className="relative bg-white w-full border-b shadow-xl flex flex-col overflow-hidden pointer-events-auto">
          <div className="w-full max-w-5xl mx-auto flex items-center px-4 md:px-8 h-16 md:h-20">
            <IoSearchOutline size={22} className="text-gray-500 hidden md:block" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for products, collections..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent border-none focus:ring-0 text-lg md:text-xl font-bold px-2 md:px-6 outline-none text-gray-900 placeholder-gray-300"
            />
            <button 
              onClick={handleClose}
              aria-label="Close search"
              className="p-2 bg-gray-100 hover:bg-black hover:text-white rounded-full transition-colors ml-4 text-gray-900 flex-shrink-0"
            >
              <IoCloseOutline size={22} />
            </button>
          </div>
          
          {/* Results Area */}
          {query.length >= 2 && (
            <div className="w-full max-w-5xl mx-auto bg-white max-h-[65vh] overflow-y-auto px-6 md:px-8 pb-8">
              <div className="pt-4 pb-6 border-t border-gray-100">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">
                  Results for "{query}"
                </h3>
                
                {results.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.map(product => (
                      <Link
                        key={product.id}
                        to={`/products/${product.handle}`}
                        onClick={handleClose}
                        className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors group border border-transparent hover:border-gray-100"
                      >
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          <SmartImage 
                            src={product.images?.[0] || product.image} 
                            alt={product.title} 
                            className="w-full h-full"
                            imgClassName="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate group-hover:text-black">{product.title}</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">{product.collection}</p>
                          <p className="text-sm font-bold text-gray-900 mt-2">${product.price}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-sm text-gray-500">We couldn't find any products matching your search.</p>
                    <button 
                      onClick={() => setQuery('')}
                      className="mt-4 text-xs font-bold border-b border-black pb-1"
                    >
                      Clear search
                    </button>
                  </div>
                )}
              </div>

              {results.length > 0 && (
                <div className="flex justify-center mt-6">
                  <Link
                    to={`/collections/all`}
                    onClick={handleClose}
                    className="inline-flex items-center justify-center px-8 py-3 text-xs font-bold uppercase tracking-widest bg-black text-white hover:bg-gray-800 rounded-full transition-colors"
                  >
                    View All Products
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default GlobalSearch;
