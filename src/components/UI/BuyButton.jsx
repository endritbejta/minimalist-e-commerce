/**
 * BuyButton Component
 * A specialized button for adding products to the cart.
 * @param {Object} product - The product object to add to cart.
 * @param {number} quantity - Number of items to add, defaults to 1.
 * @param {string} className - Additional CSS classes.
 * @param {React.ReactNode} children - Button text or elements.
 * @param {string} variant - Visual style: 'primary', 'secondary', 'outline', or 'ghost'.
 * @param {Object} props - Additional props spread onto the button element.
 */
function BuyButton({ product, quantity = 1, className = "", children, variant = "primary", ...props }) {
  const { addToCart } = useCart();

  const baseStyles = "transition-all transform active:scale-95 font-bold rounded-lg text-[10px] sm:text-s";
  
  const variants = {
    primary: "bg-black text-white hover:bg-gray-800 py-2 sm:py-4 shadow-lg",
    secondary: "bg-white text-black border border-black hover:bg-gray-50 px-6 py-3",
    outline: "bg-transparent text-gray-500 hover:text-black border border-gray-200 hover:border-black px-4 py-2 text-xs",
    ghost: "bg-transparent text-gray-500 hover:text-black p-2"
  };

  const handleClick = (e) => {
    // Prevent navigation if the button is inside a Link (like in ProductCard)
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, quantity);
    
    // Call custom onClick if provided
    if (props.onClick) props.onClick(e);
  };

  return (
    <button
      {...props}
      onClick={handleClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children || "Add to Cart"}
    </button>
  );
}

export default BuyButton;
