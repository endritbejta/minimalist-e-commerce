import AnimatedPrice from "../UI/AnimatedPrice";

/**
 * CartDrawerFooter Component
 * Displays the cart subtotal and the primary checkout action.
 * @param {Object} props - Component props.
 * @param {number} props.cartTotal - The total value of items in the cart.
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
