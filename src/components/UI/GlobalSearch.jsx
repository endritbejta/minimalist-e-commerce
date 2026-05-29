import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { IoSearchOutline, IoCloseOutline } from 'react-icons/io5';
import { products } from '../../data/products';
import { Link } from 'react-router-dom';
import useDebouncer from '../../hooks/useDebouncer';
import SmartImage from './SmartImage';

const MIN_QUERY_LENGTH = 2;
const MAX_RESULTS = 6;
const SEARCH_DEBOUNCE_MS = 250;

const formatPrice = (price) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);

const normalizeSearchTerm = (value = '') =>
  value.toString().trim().toLowerCase().replace(/\s+/g, ' ');

const buildSearchIndex = (product) =>
  normalizeSearchTerm([
    product.title,
    product.collection,
    product.description,
    product.handle,
  ].filter(Boolean).join(' '));

const GlobalSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncer(query, SEARCH_DEBOUNCE_MS);
  const inputId = useId();
  const inputRef = useRef(null);
  const triggerRef = useRef(null);
  const searchPanelRef = useRef(null);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    triggerRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    inputRef.current?.focus({ preventScroll: true });

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose, isOpen]);

  const searchableProducts = useMemo(
    () => products.map((product) => ({
      ...product,
      searchIndex: buildSearchIndex(product),
    })),
    []
  );

  const normalizedQuery = useMemo(
    () => normalizeSearchTerm(debouncedQuery),
    [debouncedQuery]
  );

  const results = useMemo(() => {
    if (normalizedQuery.length < MIN_QUERY_LENGTH) return [];

    const terms = normalizedQuery.split(' ');

    return searchableProducts
      .filter((product) => terms.every((term) => product.searchIndex.includes(term)))
      .slice(0, MAX_RESULTS);
  }, [normalizedQuery, searchableProducts]);

  const hasSearchTerm = normalizedQuery.length >= MIN_QUERY_LENGTH;

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handlePanelTransitionEnd = () => {
    if (isOpen) {
      inputRef.current?.focus({ preventScroll: true });
    }
  };

  const searchOverlay = createPortal(
    <>
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[10000] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />

      <div
        className={`fixed inset-x-0 top-0 z-[10010] flex flex-col transition-transform duration-500 ease-in-out transform ${
          isOpen ? 'translate-y-0' : '-translate-y-full pointer-events-none'
        }`}
        onTransitionEnd={handlePanelTransitionEnd}
      >
        <section
          ref={searchPanelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${inputId}-label`}
          className="relative bg-white w-full border-b shadow-2xl flex flex-col overflow-hidden pointer-events-auto"
        >
          <div className="w-full max-w-5xl mx-auto flex items-center px-4 md:px-8 h-16 md:h-20">
            <label id={`${inputId}-label`} htmlFor={inputId} className="sr-only">
              Search products and collections
            </label>
            <IoSearchOutline size={22} className="text-gray-500 hidden md:block" aria-hidden="true" />
            <input
              id={inputId}
              ref={inputRef}
              type="search"
              placeholder="Search for products, collections..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 min-w-0 bg-transparent border-none focus:ring-0 text-lg md:text-xl font-bold px-2 md:px-6 outline-none text-gray-900 placeholder-gray-300"
              autoComplete="off"
              spellCheck="false"
            />
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close search"
              className="p-2 bg-gray-100 hover:bg-black hover:text-white rounded-full transition-colors ml-4 text-gray-900 flex-shrink-0"
            >
              <IoCloseOutline size={22} />
            </button>
          </div>

          {hasSearchTerm && (
            <div className="w-full max-w-5xl mx-auto bg-white max-h-[65vh] overflow-y-auto px-4 md:px-8 pb-8">
              <div className="pt-4 pb-6 border-t border-gray-100">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 truncate">
                    Results for "{normalizedQuery}"
                  </h3>
                  <span className="text-xs font-semibold text-gray-400 flex-shrink-0">
                    {results.length} {results.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                {results.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {results.map((product) => {
                      const productImage = product.images?.[0] || product.image;

                      return (
                        <Link
                          key={product.id}
                          to={`/products/${product.handle}`}
                          onClick={handleClose}
                          className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors group border border-transparent hover:border-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                        >
                          <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                            <SmartImage
                              src={productImage}
                              alt={product.title}
                              className="w-full h-full"
                              imgClassName="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate group-hover:text-black">
                              {product.title}
                            </p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 truncate">
                              {product.collection}
                            </p>
                            <p className="text-sm font-bold text-gray-900 mt-2">
                              {formatPrice(product.price)}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-sm text-gray-500">We couldn't find any products matching your search.</p>
                    <button
                      type="button"
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
                    to="/collections/all"
                    onClick={handleClose}
                    className="inline-flex items-center justify-center px-8 py-3 text-xs font-bold uppercase tracking-widest bg-black text-white hover:bg-gray-800 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                  >
                    View All Products
                  </Link>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </>,
    document.body
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
        aria-label="Open search"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <IoSearchOutline size={24} />
      </button>
      {searchOverlay}
    </>
  );
};

export default GlobalSearch;
