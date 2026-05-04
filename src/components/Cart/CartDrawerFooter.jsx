import AnimatedPrice from "../UI/AnimatedPrice";

/**
 * Footer for checkout actions and the current cart subtotal.
 *
 * @param {Object} props
 * @param {number} props.cartTotal - Current subtotal before shipping and tax.
 * @returns {import('react').JSX.Element}
 */
function CartDrawerFooter({ cartTotal }) {
    return (
        <div className="p-6 border-t bg-gray-50">
            <div className="flex justify-between items-center mb-6">
                <span className="text-gray-500 uppercase tracking-widest text-xs font-bold">Subtotal</span>
                <span className="text-xl font-bold">
                    <AnimatedPrice value={cartTotal} />
                </span>
            </div>
            <button className="w-full bg-black text-white py-4 rounded-full font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-95 mb-3">
                Checkout
            </button>
            <p className="text-center text-[10px] text-gray-500 uppercase tracking-widest">
                Shipping & taxes calculated at checkout
            </p>
        </div>
    );
}

export default CartDrawerFooter;
