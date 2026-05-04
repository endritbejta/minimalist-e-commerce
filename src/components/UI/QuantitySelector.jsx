import { BsPlus, BsDash } from "react-icons/bs";

function QuantitySelector({ quantity, onIncrease, onDecrease, className = "" }) {
  return (
    <div className={`flex items-center border border-gray-200 rounded-md bg-white overflow-hidden ${className}`}>
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
