import { useState, useRef, useEffect } from 'react';
import { 
  BsSortAlphaDown, 
  BsSortAlphaUp, 
  BsSortNumericDown, 
  BsSortNumericUp,
  BsFunnel
} from 'react-icons/bs';

/**
 * SortDropdown Component
 * A custom dropdown menu for selecting product sorting options.
 * @param {Object} props - Component props.
 * @param {string} props.sortBy - The currently selected sort option ID.
 * @param {Function} props.setSortBy - Callback to update the sort option.
 */
const SortDropdown = ({ sortBy, setSortBy }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSort = (option) => {
    setSortBy(option);
    setIsOpen(false);
  };

  const sortOptions = [
    { id: 'az', label: 'A - Z', icon: <BsSortAlphaDown size={16} /> },
    { id: 'za', label: 'Z - A', icon: <BsSortAlphaUp size={16} /> },
    { id: 'price-low', label: 'Price: Low', icon: <BsSortNumericDown size={16} /> },
    { id: 'price-high', label: 'Price: High', icon: <BsSortNumericUp size={16} /> },
    { id: 'featured', label: 'Clear Filters', icon: <BsFunnel size={16} /> },
  ];

  const currentOption = sortOptions.find(opt => opt.id === sortBy) || sortOptions[sortOptions.length - 1];
  const isDefault = sortBy === 'featured';

  return (
    <div className="relative h-full" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-gray-100 p-2.5 rounded-md hover:bg-gray-200 transition-all text-gray-700 h-full px-4"
      >
        {isDefault ? <BsFunnel size={16} /> : currentOption.icon}
        <span className="text-[10px] font-bold uppercase tracking-widest">
          {isDefault ? 'Sort' : currentOption.label}
        </span>
      </button>
      
      {/* Dropdown Menu */}
      <div className={`absolute left-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl transition-all z-20 overflow-hidden transform origin-top-left ${
        isOpen ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'
      }`}>
        <div className="p-2 space-y-1">
          {sortOptions.map((option) => (
            <button 
              key={option.id}
              onClick={() => handleSort(option.id)}
              className={`flex items-center gap-3 w-full p-3 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors ${
                sortBy === option.id ? 'bg-black text-white' : 'hover:bg-gray-50 text-gray-600'
              }`}
            >
              {option.icon} {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SortDropdown;
