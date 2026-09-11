import { useEffect, useRef } from "react";
import { BsTrash } from "react-icons/bs";
import { useCart } from "../../context/CartContext";
import { describeCustomization } from "../../lib/emblem";
import { formatPrice } from "../../lib/format";
import QuantitySelector from "../UI/QuantitySelector";
import SmartImage from "../UI/SmartImage";

/**
 * CartItem Component
 * Renders a single line in the cart with quantity controls and remove animation.
 * @param {Object} props - Component props.
 * @param {Object} props.item - The cart line data.
 * @param {boolean} [props.isRemoving=false] - Whether the line is currently being removed.
 * @param {'left'|'right'} [props.removeDirection='right'] - Direction of the slide-out animation.
 * @param {Function} props.onRemoveRequest - Callback to initiate removal.
 * @param {Function} props.onRemoveAnimationEnd - Callback after the removal animation finishes.
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
    const customizationSummary = describeCustomization(item.customization);

    // Capture the row's natural height so it can collapse to zero smoothly.
    useEffect(() => {
        if (!isRemoving || !rowRef.current) return;

        rowRef.current.style.setProperty(
            '--cart-item-height',
            `${rowRef.current.scrollHeight}px`
        );
    }, [isRemoving]);

    const handleAnimationEnd = (event) => {
        if (!isRemoving || event.animationName !== 'cartItemCollapseOut') return;

        onRemoveAnimationEnd(item.lineId);
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
            <div className="cart-item-content flex gap-3 group py-3">
                {/* Item Image */}
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden relative">
                    {item.image ? (
                        <SmartImage
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full"
                            imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                                type="button"
                                onClick={() => onRemoveRequest(item.lineId)}
                                disabled={isRemoving}
                                className="text-gray-300 hover:text-red-500 transition-colors p-2 -mr-1 -mt-1"
                                aria-label={`Remove ${item.title} from cart`}
                            >
                                <BsTrash size={16} />
                            </button>
                        </div>
                        <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">
                            {item.collection}
                        </p>
                        {customizationSummary && (
                            <p className="text-[10px] text-gray-500 mb-1 flex items-start gap-1.5">
                                <span aria-hidden="true">✦</span>
                                <span className="min-w-0">{customizationSummary}</span>
                            </p>
                        )}
                    </div>

                    <div className="flex justify-between items-end">
                        <QuantitySelector
                            quantity={item.quantity}
                            label={item.title}
                            disabled={isRemoving}
                            onIncrease={() => updateQuantity(item.lineId, 1)}
                            onDecrease={() => updateQuantity(item.lineId, -1)}
                        />

                        <p className="font-bold text-sm text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartItem;
