import AnimatedPrice from "../UI/AnimatedPrice";
import { formatPrice } from "../../lib/format";
import CartCouponField from "./CartCouponField";

/**
 * CartDrawerFooter Component
 * Displays the cart subtotal and the primary checkout action.
 * @param {Object} props - Component props.
 * @param {number} props.cartTotal - Value of the items, before any discount.
 * @param {number} [props.discount=0] - Amount the applied coupon takes off.
 * @param {number} [props.orderTotal] - What is payable; defaults to the cart total.
 */
function CartDrawerFooter({ cartTotal, discount = 0, orderTotal = cartTotal }) {
    return (
        <div className="px-4 py-4 border-t bg-gray-50">
            <CartCouponField />

            {/* The subtotal is only worth spelling out separately once a
                discount has moved it. */}
            {discount > 0 && (
                <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
                    <span className="uppercase tracking-widest">Subtotal</span>
                    <span className="tabular-nums">{formatPrice(cartTotal)}</span>
                </div>
            )}
            {discount > 0 && (
                <div className="mb-2 flex items-center justify-between text-xs font-bold text-gray-900">
                    <span className="uppercase tracking-widest">Discount</span>
                    <span className="tabular-nums">&minus;{formatPrice(discount)}</span>
                </div>
            )}

            <div className="flex justify-between items-center mb-3">
                <span className="text-gray-500 uppercase tracking-widest text-xs font-bold">
                    {discount > 0 ? 'Total' : 'Subtotal'}
                </span>
                <span className="text-xl font-bold">
                    <AnimatedPrice value={orderTotal} />
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
