import { BsX } from "react-icons/bs";

/**
 * CartDrawerHeader Component
 * The top bar of the cart drawer, containing the title and close action.
 * @param {Object} props - Component props.
 * @param {Function} props.onClose - Function to close the cart drawer.
 * @param {string} props.titleId - Id linking the heading to the dialog's aria-labelledby.
 */
function CartDrawerHeader({ onClose, titleId }) {
    return (
        <div className="flex justify-between items-center px-4 py-3 border-b">
            <h2 id={titleId} className="text-xl font-bold uppercase tracking-tight">
                Shopping Bag
            </h2>
            <button
                type="button"
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close cart"
            >
                <BsX size={24} />
            </button>
        </div>
    );
}

export default CartDrawerHeader;
