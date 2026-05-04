import { BsCartCheck } from "react-icons/bs";

/**
 * Empty cart message shown when there are no cart items.
 *
 * @param {Object} props
 * @param {() => void} props.onClose - Closes the cart drawer and returns the shopper to the page.
 * @returns {import('react').JSX.Element}
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
