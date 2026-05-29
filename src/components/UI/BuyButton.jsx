import { useCart } from "../../context/CartContext.jsx";

/**
 * BuyButton Component
 * Adds a product to the cart with style variants.
 *
 * @param {Object} props
 * @param {Object} props.product - Product object to add to cart.
 * @param {number} [props.quantity=1] - Quantity to add.
 * @param {string} [props.className=""] - Extra CSS classes.
 * @param {React.ReactNode} props.children - Button label/content.
 * @param {"primary"|"secondary"|"outline"|"ghost"} [props.variant="primary"] - Button style variant.
 * @param {Function} [props.onClick] - Optional extra click handler.
 */
function BuyButton({
  product,
  quantity = 1,
  className = "",
  children,
  variant = "primary",
  onClick,
  ...props
}) {
  const { addToCart } = useCart();

  const baseStyles =
    "transition-all transform active:scale-95 font-bold rounded-lg text-[10px] sm:text-s";

  const variants = {
    primary: "bg-black text-white hover:bg-gray-800 py-2 sm:py-4 shadow-lg",
    secondary: "bg-white text-black border border-black hover:bg-gray-50 px-6 py-3",
    outline:
      "bg-transparent text-gray-500 hover:text-black border border-gray-200 hover:border-black px-4 py-2 text-xs",
    ghost: "bg-transparent text-gray-500 hover:text-black p-2",
  };

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (product) {
      addToCart(product, quantity);
    }

    if (typeof onClick === "function") {
      onClick(e);
    }
  };

  const variantClass = variants[variant] || variants.primary;

  return (
    <button
      {...props}
      onClick={handleClick}
      className={`${baseStyles} ${variantClass} ${className}`}
    >
      {children || "Add to Cart"}
    </button>
  );
}

export default BuyButton;