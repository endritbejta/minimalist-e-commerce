/**
 * QuantitySelector Component
 * A numeric input control for adjusting product quantities.
 * @param {number} quantity - The current quantity value.
 * @param {Function} onIncrease - Callback to increment the quantity.
 * @param {Function} onDecrease - Callback to decrement the quantity.
 * @param {string} className - Additional CSS classes for the wrapper element.
 * @param {Object} props - Additional props spread onto the wrapper div.
 */
function QuantitySelector({ quantity, onIncrease, onDecrease, className = "", ...props }) {
  return (
    <div className={`flex items-center border border-gray-200 rounded-md bg-white overflow-hidden ${className}`} {...props}>
      <button 
        onClick={onDecrease}
        className="px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-gray-500 transition-colors flex items-center justify-center border-r border-gray-100 active:bg-gray-100 "
        aria-label="Decrease quantity"
        disabled={quantity <= 1}
      >
        <BsDash size={16} />
      </button>
      
      <span className="w-10 text-center text-xs font-bold tabular-nums">
        {quantity}
      </span>
      
      <button 
        onClick={onIncrease}
        className="px-3 py-2 hover:bg-gray-50 text-gray-500 transition-colors flex items-center justify-center border-l border-gray-100 active:bg-gray-100"
        aria-label="Increase quantity"
      >
        <BsPlus size={16} />
      </button>
    </div>
  );
}

export default QuantitySelector;
