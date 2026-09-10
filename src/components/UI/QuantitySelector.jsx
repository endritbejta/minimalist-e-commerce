import { BsDash, BsPlus } from "react-icons/bs";

/**
 * QuantitySelector Component
 * A numeric stepper for adjusting product quantities.
 * @param {Object} props - Component props.
 * @param {number} props.quantity - The current quantity value.
 * @param {Function} props.onIncrease - Callback to increment the quantity.
 * @param {Function} props.onDecrease - Callback to decrement the quantity.
 * @param {string} [props.label] - Name of the thing being counted, used in button labels.
 * @param {boolean} [props.disabled=false] - Disables both steppers.
 * @param {string} [props.className] - Additional CSS classes for the wrapper element.
 */
function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
  label,
  disabled = false,
  className = "",
  ...props
}) {
  const suffix = label ? ` for ${label}` : '';

  return (
    <div
      className={`flex items-center border border-gray-200 rounded-md bg-white overflow-hidden ${className}`}
      {...props}
    >
      <button
        type="button"
        onClick={onDecrease}
        className="px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-gray-500 transition-colors flex items-center justify-center border-r border-gray-100 active:bg-gray-100"
        aria-label={`Decrease quantity${suffix}`}
        disabled={disabled || quantity <= 1}
      >
        <BsDash size={16} />
      </button>

      {/* Announced on change so screen reader users hear the new quantity. */}
      <span
        aria-live="polite"
        aria-atomic="true"
        className="w-10 text-center text-xs font-bold tabular-nums"
      >
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrease}
        className="px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-gray-500 transition-colors flex items-center justify-center border-l border-gray-100 active:bg-gray-100"
        aria-label={`Increase quantity${suffix}`}
        disabled={disabled}
      >
        <BsPlus size={16} />
      </button>
    </div>
  );
}

export default QuantitySelector;
