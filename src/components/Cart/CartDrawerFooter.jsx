import AnimatedPrice from "../UI/AnimatedPrice";

/**
 * CartDrawerFooter Component
 * Displays the cart subtotal and the primary checkout action.
 * @param {Object} props - Component props.
 * @param {number} props.cartTotal - The total value of items in the cart.
 */
function CartDrawerFooter({ cartTotal }) {
    return (
        <div className="px-4 py-4 border-t bg-gray-50">
            <div className="flex justify-between items-center mb-3">
                <span className="text-gray-500 uppercase tracking-widest text-xs font-bold">
                    Subtotal
                </span>
                <span className="text-xl font-bold">
                    <AnimatedPrice value={cartTotal} />
                </span>
            </div>
            {/* This demo has no payment backend, so checkout is intentionally inert. */}
            <button
                type="button"
                disabled
                title="Checkout is not available in this demo"
                className="w-full bg-black text-white py-3 rounded-full font-bold transition-all shadow-lg mb-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
                Checkout
            </button>
            <p className="text-center text-[10px] text-gray-500 uppercase tracking-widest">
                Demo store &mdash; checkout is disabled
            </p>
        </div>
    );
}

export default CartDrawerFooter;
