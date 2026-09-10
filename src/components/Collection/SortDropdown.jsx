import { useEffect, useRef, useState } from 'react';
import {
  BsSortAlphaDown,
  BsSortAlphaUp,
  BsSortNumericDown,
  BsSortNumericUp,
  BsFunnel,
} from 'react-icons/bs';

const SORT_OPTIONS = [
  { id: 'featured', label: 'Featured', Icon: BsFunnel },
  { id: 'az', label: 'A - Z', Icon: BsSortAlphaDown },
  { id: 'za', label: 'Z - A', Icon: BsSortAlphaUp },
  { id: 'price-low', label: 'Price: Low', Icon: BsSortNumericDown },
  { id: 'price-high', label: 'Price: High', Icon: BsSortNumericUp },
];

/**
 * SortDropdown Component
 * A menu for choosing how products are ordered.
 * @param {Object} props - Component props.
 * @param {string} props.sortBy - The currently selected sort option id.
 * @param {Function} props.setSortBy - Callback to update the sort option.
 */
const SortDropdown = ({ sortBy, setSortBy }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);

  const currentOption = SORT_OPTIONS.find((option) => option.id === sortBy) ?? SORT_OPTIONS[0];
  const isDefault = currentOption.id === 'featured';

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key !== 'Escape') return;

      setIsOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSort = (optionId) => {
    setSortBy(optionId);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const { Icon: CurrentIcon } = currentOption;

  return (
    <div className="relative h-full" ref={containerRef}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="flex items-center gap-2 bg-gray-100 p-2.5 rounded-md hover:bg-gray-200 transition-all text-gray-700 h-full px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
      >
        <CurrentIcon size={16} aria-hidden="true" />
        <span className="text-[10px] font-bold uppercase tracking-widest">
          {isDefault ? 'Sort' : currentOption.label}
        </span>
      </button>

      {/* `invisible` (not just opacity) keeps the closed menu out of the tab order. */}
      <div
        role="menu"
        aria-label="Sort products"
        className={`absolute left-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl transition-all z-menu overflow-hidden transform origin-top-left ${
          isOpen ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'
        }`}
      >
        <div className="p-2 space-y-1">
          {SORT_OPTIONS.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              role="menuitemradio"
              aria-checked={sortBy === id}
              onClick={() => handleSort(id)}
              className={`flex items-center gap-3 w-full p-3 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${
                sortBy === id ? 'bg-black text-white' : 'hover:bg-gray-50 text-gray-600'
              }`}
            >
              <Icon size={16} aria-hidden="true" /> {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SortDropdown;
