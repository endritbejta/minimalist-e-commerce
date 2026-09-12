import { useEffect, useId, useRef, useState } from "react";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../lib/format";
import AnimatedHeading from "../UI/AnimatedHeading";

// Long enough to read as the code being checked, short enough not to be a wait.
const CHECK_DURATION_MS = 550;
// The field clearing out before the saving takes its place.
const FADE_DURATION_MS = 260;

/**
 * CartCouponField Component
 * The promo code field above the totals.
 *
 * Applying runs through three beats: the code is checked, the field fades out,
 * and the saving reveals in the space the field occupied — the same
 * character-by-character reveal the hero and collection titles use. There is
 * nothing to check against, since the codes are local, but a result that
 * landed instantly would read as though nothing had happened.
 */
function CartCouponField() {
    const { coupon, discount, applyCoupon, removeCoupon } = useCart();
    const inputId = useId();

    const [code, setCode] = useState('');
    const [status, setStatus] = useState('idle');
    // Only an application made here earns the reveal; a coupon restored from a
    // previous visit is simply already applied.
    const [justApplied, setJustApplied] = useState(false);
    const timersRef = useRef([]);

    useEffect(() => {
        const timers = timersRef.current;
        return () => timers.forEach(window.clearTimeout);
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!code.trim() || status !== 'idle') return;

        setStatus('checking');
        timersRef.current.push(
            window.setTimeout(() => {
                if (!applyCoupon(code)) {
                    setStatus('rejected');
                    return;
                }

                // The coupon is on, but the field stays mounted a moment longer
                // so it can fade rather than vanish.
                setCode('');
                setStatus('fading');
                timersRef.current.push(
                    window.setTimeout(() => {
                        setJustApplied(true);
                        setStatus('idle');
                    }, FADE_DURATION_MS)
                );
            }, CHECK_DURATION_MS)
        );
    };

    const handleRemove = () => {
        removeCoupon();
        setJustApplied(false);
        setStatus('idle');
    };

    const isChecking = status === 'checking';
    const isRejected = status === 'rejected';
    const isFading = status === 'fading';

    if (coupon && !isFading) {
        // A free-shipping code takes nothing off the goods, and what it will
        // take off delivery is not known until a method is chosen — so it
        // announces what it is rather than claiming a saving of $0.00.
        const savedText = discount > 0 ? `You saved ${formatPrice(discount)}` : coupon.label;
        const captionText = discount > 0 ? coupon.label : 'Applied at checkout';

        return (
            <div className="mb-4">
                <p className="mb-0.5 text-xs font-bold text-gray-900">Promo Code</p>

                {/* No min-height here: matching the input's height only bought
                    11px of dead space above and below the figure, which made
                    the label and caption drift as far from it as the totals
                    below. AnimatedHeading brings its own py-1 for the clip. */}
                <div className="flex items-center justify-between gap-3">
                    {justApplied ? (
                        <AnimatedHeading
                            as="p"
                            remember={false}
                            stagger={0.025}
                            className="text-base font-bold text-gray-900"
                        >
                            {savedText}
                        </AnimatedHeading>
                    ) : (
                        // py-1 matches what AnimatedHeading adds for its clip,
                        // so a restored coupon sits exactly where a freshly
                        // applied one does.
                        <p className="py-1 text-base font-bold text-gray-900">{savedText}</p>
                    )}

                    <button
                        type="button"
                        onClick={handleRemove}
                        className="flex-shrink-0 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-900 underline decoration-gray-300 underline-offset-4 transition-colors hover:decoration-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                    >
                        Remove
                    </button>
                </div>

                <p className="-mt-0.5 text-[10px] uppercase tracking-widest text-gray-400">
                    {coupon.code} &middot; {captionText}
                </p>
            </div>
        );
    }

    return (
        <div className="mb-4">
            <label htmlFor={inputId} className="mb-2 block text-xs font-bold text-gray-900">
                Promo Code
            </label>

            <form
                onSubmit={handleSubmit}
                className={`relative transition-opacity duration-200 ${isFading ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
            >
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

            {/* The reveal is decorative; this is what actually gets announced. */}
            <p role="status" aria-live="polite" className="sr-only">
                {isChecking ? 'Checking code' : ''}
                {isRejected ? 'That code is not recognised' : ''}
                {isFading
                    ? `Coupon applied. ${
                          discount > 0 ? `You saved ${formatPrice(discount)}` : coupon?.label ?? ''
                      }`
                    : ''}
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
