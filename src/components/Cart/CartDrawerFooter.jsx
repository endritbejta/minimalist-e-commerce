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
/**
 * TotalsRow Component
 * One line of the totals.
 *
 * Every row is built here so the column cannot drift: labels are grey on the
 * left, figures are black on the right, and a row earns prominence through
 * size and weight rather than through a colour of its own. Four different
 * treatments down one narrow column read as noise, not as hierarchy.
 *
 * @param {Object} props - Component props.
 * @param {string} props.label - The left-hand label.
 * @param {import('react').ReactNode} props.children - The right-hand figure.
 * @param {boolean} [props.emphasis=false] - Whether this is the payable total.
 */
function TotalsRow({ label, children, emphasis = false }) {
    return (
        <div className={`flex items-center justify-between gap-4 ${emphasis ? 'mb-3' : 'mb-1'}`}>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                {label}
            </span>
            <span
                className={`tabular-nums text-gray-900 ${
                    emphasis ? 'text-xl font-bold' : 'text-xs font-bold'
                }`}
            >
                {children}
            </span>
        </div>
    );
}

function CartDrawerFooter({ cartTotal, discount = 0, orderTotal = cartTotal }) {
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
