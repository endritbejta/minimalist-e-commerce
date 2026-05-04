import { BsX } from "react-icons/bs";

/**
 * Header for the cart drawer.
 *
 * @param {Object} props
 * @param {() => void} props.onClose - Closes the cart drawer.
 * @returns {import('react').JSX.Element}
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
