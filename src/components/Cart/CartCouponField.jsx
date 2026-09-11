import { useEffect, useId, useRef, useState } from "react";
import { useCart } from "../../context/CartContext";
import AnimatedPrice from "../UI/AnimatedPrice";

// Long enough to read as the code being checked, short enough not to be a wait.
const CHECK_DURATION_MS = 550;

/**
 * CartCouponField Component
 * The promo code field above the totals.
 *
 * Applying runs through a brief checking state before the result lands. There
 * is nothing to check against — the codes are local — but a code that resolved
 * instantly would read as though nothing had happened, and the pause gives the
 * saving somewhere to arrive from.
 */
function CartCouponField() {
    const { coupon, discount, applyCoupon, removeCoupon } = useCart();
    const inputId = useId();

    const [code, setCode] = useState('');
    const [status, setStatus] = useState('idle');
    const [savingShown, setSavingShown] = useState(0);
    const checkTimerRef = useRef(null);

    useEffect(() => () => window.clearTimeout(checkTimerRef.current), []);

    // Count the saving up from zero once it has been revealed, rather than
    // having the figure simply appear at its final value.
    useEffect(() => {
        if (status !== 'applied' || discount <= 0) return undefined;

        const frame = requestAnimationFrame(() => setSavingShown(discount));
        return () => cancelAnimationFrame(frame);
    }, [status, discount]);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!code.trim() || status === 'checking') return;

        setStatus('checking');
        checkTimerRef.current = window.setTimeout(() => {
            if (applyCoupon(code)) {
                setCode('');
                setStatus('applied');
            } else {
                setStatus('rejected');
            }
        }, CHECK_DURATION_MS);
    };

    const handleRemove = () => {
        removeCoupon();
        setSavingShown(0);
        setStatus('idle');
    };

    const isChecking = status === 'checking';
    const isRejected = status === 'rejected';

    if (coupon) {
        return (
            <div className="mb-3">
                <p className="mb-2 text-xs font-bold text-gray-900">Promo Code</p>

                <div className="flex items-center justify-between gap-2 rounded-full border border-gray-900 py-2.5 pl-5 pr-2">
                    <span className="min-w-0 truncate text-sm font-bold uppercase tracking-widest text-gray-900">
                        {coupon.code}
                    </span>
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="flex-shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest text-gray-400 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                    >
                        Remove
                    </button>
                </div>

                {discount > 0 && (
                    <p
                        role="status"
                        className="mt-2 flex items-center gap-1.5 text-xs font-bold text-gray-900 animate-fadeIn"
                    >
                        <span aria-hidden="true">✦</span>
                        <span>
                            You saved <AnimatedPrice value={savingShown} />
                        </span>
                        <span className="font-medium text-gray-400">({coupon.label})</span>
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className="mb-3">
            <label htmlFor={inputId} className="mb-2 block text-xs font-bold text-gray-900">
                Promo Code
            </label>

            <form onSubmit={handleSubmit} className="relative">
                <input
                    id={inputId}
                    name="coupon"
                    type="text"
                    value={code}
                    onChange={(event) => {
                        setCode(event.target.value);
                        if (isRejected) setStatus('idle');
                    }}
                    disabled={isChecking}
                    placeholder="Enter promo code here"
                    autoComplete="off"
                    autoCapitalize="characters"
                    spellCheck="false"
                    aria-invalid={isRejected}
                    aria-describedby={isRejected ? `${inputId}-error` : undefined}
                    className={`w-full rounded-full border bg-white py-3 pl-5 pr-24 text-sm uppercase tracking-widest text-gray-900 transition-colors focus:outline-none disabled:opacity-60 placeholder:normal-case placeholder:tracking-normal placeholder:text-gray-300 placeholder:transition-opacity placeholder:duration-200 focus:placeholder:opacity-0 ${
                        isRejected ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-gray-900'
                    }`}
                />

                <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center">
                    {isChecking ? (
                        <span className="flex h-9 w-16 items-center justify-center">
                            <span
                                className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-gray-900"
                                aria-hidden="true"
                            />
                        </span>
                    ) : (
                        <button
                            type="submit"
                            disabled={!code.trim()}
                            className="rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-400 transition-colors hover:text-gray-900 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                        >
                            Apply
                        </button>
                    )}
                </div>
            </form>

            {/* One region for both outcomes, so a screen reader hears the result
                of applying without the field having to move focus. */}
            <p role="status" aria-live="polite" className="sr-only">
                {isChecking ? 'Checking code' : ''}
                {isRejected ? 'That code is not recognised' : ''}
            </p>

            {isRejected && (
                <p id={`${inputId}-error`} className="mt-1.5 text-[10px] text-red-500 animate-fadeIn">
                    That code isn&rsquo;t recognised.
                </p>
            )}

        </div>
    );
}

export default CartCouponField;
