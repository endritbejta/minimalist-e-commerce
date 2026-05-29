import { useEffect, useRef } from "react";
import { BsTrash } from "react-icons/bs";
import { useCart } from "../../context/CartContext.jsx";
import QuantitySelector from "../UI/QuantitySelector";

/**
 * CartItem Component
 * Renders a single product row in the cart with quantity controls and remove animation.
 * @param {Object} props - Component props.
 * @param {Object} props.item - The cart item data.
 * @param {boolean} [props.isRemoving=false] - Whether the item is currently being removed.
 * @param {string} [props.removeDirection='right'] - Direction of the slide-out animation ('left' or 'right').
 * @param {Function} props.onRemoveRequest - Callback to initiate removal.
 * @param {Function} props.onRemoveAnimationEnd - Callback after removal animation finishes.
 */
function CartItem({
    item,
    isRemoving = false,
    removeDirection = 'right',
    onRemoveRequest,
    onRemoveAnimationEnd,
}) {
    const { updateQuantity } = useCart();
    const rowRef = useRef(null);

    useEffect(() => {
        if (!isRemoving || !rowRef.current) {
            return;
        }

        rowRef.current.style.setProperty('--cart-item-height', `${rowRef.current.scrollHeight}px`);
    }, [isRemoving]);

    const handleRemoveClick = () => {
        onRemoveRequest(item.id);
    };

    const handleAnimationEnd = (event) => {
        if (!isRemoving || event.animationName !== 'cartItemCollapseOut') {
            return;
        }

        onRemoveAnimationEnd(item.id);
    };

    return (
        <div
            ref={rowRef}
            className={`cart-item-row border-b last:border-b-0 ${
                isRemoving
                    ? `cart-item-removing cart-item-removing-${removeDirection}`
                    : 'animate-fadeIn cart-item-entered'
            }`}
            onAnimationEnd={handleAnimationEnd}
        >
            <div className="cart-item-content flex gap-4 group py-4">
                {/* Item Image */}
                <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden relative">
                    {(item.images?.[0] || item.image) ? (
                        <img
                            src={item.images?.[0] || item.image}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-500 uppercase tracking-widest">
                            No Image
                        </div>
                    )}
                </div>

                {/* Item Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-0.5">
                            <h3 className="font-bold text-sm truncate pr-4 text-gray-900 uppercase tracking-tight">
                                {item.title}
                            </h3>
                            <button
                                onClick={handleRemoveClick}
                                disabled={isRemoving}
                                className="text-gray-300 hover:text-red-500 transition-colors p-2 -mr-1 -mt-1"
                                aria-label="Remove item"
                            >
                                <BsTrash size={16} />
                            </button>
                        </div>
                        <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                            {item.collection}
                        </p>
                    </div>

                    <div className="flex justify-between items-end">
                        {/* Quantity Controls */}
                        <QuantitySelector
                            quantity={item.quantity}
                            onIncrease={() => !isRemoving && updateQuantity(item.id, 1)}
                            onDecrease={() => !isRemoving && updateQuantity(item.id, -1)}
                        />

                        {/* Item Total Price */}
                        <p className="font-bold text-sm text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartItem;
