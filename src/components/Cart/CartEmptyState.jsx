import { BsCartCheck } from "react-icons/bs";

/**
 * CartEmptyState Component
 * Displayed within the cart drawer when there are no items.
 * @param {Object} props - Component props.
 * @param {Function} props.onClose - Function to close the drawer.
 */
function CartEmptyState({ onClose }) {
    return (
        <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
            <BsCartCheck size={48} className="opacity-20" />
            <p className="font-medium">Your bag is empty</p>
            <button
                onClick={onClose}
                className="text-black font-bold underline underline-offset-4 hover:text-gray-600 transition-colors"
            >
                Start Shopping
            </button>
        </div>
    );
}

export default CartEmptyState;
