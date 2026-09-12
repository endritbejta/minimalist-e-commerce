import { Link, useLocation } from "react-router-dom";
import AnimatedPrice from "../UI/AnimatedPrice";
import TotalsRow from "../UI/TotalsRow";
import { formatPrice } from "../../lib/format";
import CartCouponField from "./CartCouponField";

/**
 * CartDrawerFooter Component
 * Displays the cart subtotal and the primary checkout action.
 *
 * Delivery and tax are deliberately not shown here. Both depend on an address
 * nobody has given yet, and a guess that changes on the next screen is worse
 * than a subtotal that never claimed to be the final figure.
 *
 * @param {Object} props - Component props.
 * @param {number} props.cartTotal - Value of the items, before any discount.
 * @param {number} [props.discount=0] - Amount the applied coupon takes off.
 * @param {number} [props.orderTotal] - Goods total after the discount.
 * @param {Function} [props.onCheckout] - Run when checkout is followed, so the
 *   drawer is not left open over the page it navigated to.
 */
function CartDrawerFooter({ cartTotal, discount = 0, orderTotal = cartTotal, onCheckout }) {
    // The checkout has no cart icon; the drawer is reached from the order
    // summary's "Edit". Offering "Checkout" as the way out of it would be
    // pointing at the page the shopper is already on.
    const isOnCheckout = useLocation().pathname === '/checkout';

    return (
        <div className="px-4 py-4 border-t bg-gray-50">
            <CartCouponField />

            {/* The subtotal is only worth spelling out separately once a
                discount has moved it. */}
            {discount > 0 && (
                <>
                    <TotalsRow label="Subtotal">{formatPrice(cartTotal)}</TotalsRow>
                    <TotalsRow label="Discount">
                        &minus;{formatPrice(discount)}
                    </TotalsRow>
                </>
            )}

            <TotalsRow label={discount > 0 ? 'Total' : 'Subtotal'} emphasis>
                <AnimatedPrice value={orderTotal} />
            </TotalsRow>

            {/* The footer only renders with something in the cart, so neither
                branch needs a disabled state. */}
            {isOnCheckout ? (
                <button
                    type="button"
                    onClick={onCheckout}
                    className="block w-full text-center bg-black text-white py-3 rounded-full font-bold transition-all hover:bg-gray-800 shadow-lg mb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                >
                    Back to checkout
                </button>
            ) : (
                <Link
                    to="/checkout"
                    onClick={onCheckout}
                    className="block w-full text-center bg-black text-white py-3 rounded-full font-bold transition-all hover:bg-gray-800 shadow-lg mb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                >
                    Checkout
                </Link>
            )}

            {!isOnCheckout && (
                <p className="text-center text-[10px] text-gray-500 uppercase tracking-widest">
                    Delivery and tax calculated at checkout
                </p>
            )}
        </div>
    );
}

export default CartDrawerFooter;
