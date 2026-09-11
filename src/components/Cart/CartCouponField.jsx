import { useId, useState } from "react";
import { BsX } from "react-icons/bs";
import { useCart } from "../../context/CartContext";

/**
 * CartCouponField Component
 * The discount code input above the totals.
 *
 * The prompt is the input's own placeholder, faded out on focus so the field
 * is visibly ready to type into before anything has been typed.
 */
function CartCouponField() {
    const { coupon, applyCoupon, removeCoupon } = useCart();
    const inputId = useId();
    const [code, setCode] = useState('');
    const [rejected, setRejected] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!code.trim()) return;

        if (applyCoupon(code)) {
            setCode('');
            setRejected(false);
        } else {
            setRejected(true);
        }
    };

    if (coupon) {
        return (
            <div className="mb-3 flex items-center justify-between gap-2 rounded-md border border-gray-900 px-3 py-2">
                <span className="min-w-0 truncate text-xs font-bold uppercase tracking-widest text-gray-900">
                    {coupon.code}
                    <span className="ml-2 font-medium normal-case tracking-normal text-gray-500">
                        {coupon.label}
                    </span>
                </span>
                <button
                    type="button"
                    onClick={removeCoupon}
                    aria-label={`Remove coupon ${coupon.code}`}
                    className="-mr-1 flex-shrink-0 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                >
                    <BsX size={20} />
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="mb-3">
            <label htmlFor={inputId} className="sr-only">Coupon code</label>
            <div className="flex gap-2">
                <input
                    id={inputId}
                    name="coupon"
                    type="text"
                    value={code}
                    onChange={(event) => {
                        setCode(event.target.value);
                        setRejected(false);
                    }}
                    placeholder="Add a coupon"
                    autoComplete="off"
                    autoCapitalize="characters"
                    spellCheck="false"
                    aria-invalid={rejected}
                    aria-describedby={rejected ? `${inputId}-error` : undefined}
                    className={`min-w-0 flex-1 rounded-md border bg-white px-3 py-2 text-xs uppercase tracking-widest text-gray-900 transition-colors focus:outline-none placeholder:normal-case placeholder:tracking-normal placeholder:text-gray-400 placeholder:transition-opacity placeholder:duration-200 focus:placeholder:opacity-0 ${
                        rejected ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-black'
                    }`}
                />
                {/* Only offered once there is something to apply. */}
                {code.trim() && (
                    <button
                        type="submit"
                        className="flex-shrink-0 rounded-md bg-black px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                    >
                        Apply
                    </button>
                )}
            </div>
            {rejected && (
                <p id={`${inputId}-error`} role="status" className="mt-1.5 text-[10px] text-red-500">
                    That code isn&rsquo;t recognised.
                </p>
            )}
        </form>
    );
}

export default CartCouponField;
