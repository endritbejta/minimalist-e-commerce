import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useFlyToCart } from "../../context/FlyToCartContext";
import { getPrimaryImage } from "../../lib/catalog";

const BASE_STYLES =
  "transition-all transform active:scale-95 font-bold rounded-lg text-[10px] sm:text-s focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2";

const VARIANTS = {
  primary: "bg-black text-white hover:bg-gray-800 py-2 sm:py-4 shadow-lg",
  secondary: "bg-white text-black border border-black hover:bg-gray-50 px-6 py-3",
  outline:
    "bg-transparent text-gray-500 hover:text-black border border-gray-200 hover:border-black px-4 py-2 text-xs",
  ghost: "bg-transparent text-gray-500 hover:text-black p-2",
};

/**
 * BuyButton Component
 * Adds a product to the cart, sending a small image of it arcing to the cart
 * icon on the way. The item is added when the disc lands, so the count changes
 * at the moment the shopper sees it arrive. The drawer is left alone — the
 * flight and the count are the confirmation.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.product - Product object to add to cart.
 * @param {number} [props.quantity=1] - Quantity to add.
 * @param {string} [props.className] - Extra CSS classes.
 * @param {import('react').ReactNode} props.children - Button label/content.
 * @param {"primary"|"secondary"|"outline"|"ghost"} [props.variant="primary"] - Button style variant.
 * @param {Function} [props.onClick] - Optional extra click handler, run on click.
 * @param {boolean} [props.showPending=false] - Show a spinner while the flight is in the air.
 *   Off by default: on a product card the disc leaving the button is feedback
 *   enough, but somewhere the button is the only thing being looked at, the
 *   wait wants marking.
 */
function BuyButton({
  product,
  quantity = 1,
  className = "",
  children,
  variant = "primary",
  onClick,
  showPending = false,
  ...props
}) {
  const { addToCart } = useCart();
  const { flyToCart } = useFlyToCart();
  const [isPending, setIsPending] = useState(false);

  const handleClick = async (event) => {
    // Cards wrap their content in links; adding to the cart must not navigate.
    event.preventDefault();
    event.stopPropagation();

    onClick?.(event);
    if (!product) return;

    // Measured now: `currentTarget` is cleared once the handler yields, and the
    // button may well be gone by the time the flight ends.
    const originRect = event.currentTarget.getBoundingClientRect();

    if (showPending) setIsPending(true);
    await flyToCart({ image: getPrimaryImage(product), originRect });
    addToCart(product, quantity);
    // The button is often gone by now — adding can remove it from a list of
    // suggestions — and setting state on an unmounted component is a no-op.
    if (showPending) setIsPending(false);
  };

  return (
    <button
      type="button"
      {...props}
      onClick={handleClick}
      disabled={isPending}
      aria-busy={isPending || undefined}
      className={`${BASE_STYLES} ${VARIANTS[variant] ?? VARIANTS.primary} ${className}`}
    >
      {isPending ? (
        <span className="flex items-center justify-center">
          <span
            className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent opacity-60"
            aria-hidden="true"
          />
          <span className="sr-only">Adding</span>
        </span>
      ) : (
        children || "Add to Cart"
      )}
    </button>
  );
}

export default BuyButton;
