import { BsX } from "react-icons/bs";

/**
 * CartDrawerHeader Component
 * The top bar of the cart drawer, containing the title and close action.
 * @param {Object} props - Component props.
 * @param {Function} props.onClose - Function to close the cart drawer.
 */
function CartDrawerHeader({ onClose }) {
    return (
        <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-bold uppercase tracking-tight">Shopping Bag</h2>
            <button
                onClick={onClose}
                className="p-3 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close Cart"
            >
                <BsX size={28} />
            </button>
        </div>
    );
}

export default CartDrawerHeader;
