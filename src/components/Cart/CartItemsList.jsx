import { useCallback, useState } from "react";
import CartItem from "./CartItem";

/**
 * CartItemsList Component
 * Orchestrates the list of cart items and manages removal animations to prevent layout jumps.
 * @param {Object} props - Component props.
 * @param {Object[]} props.items - Array of items in the cart.
 * @param {Function} props.onRemoveItem - Function to remove an item from state after animation.
 */
function CartItemsList({ items, onRemoveItem }) {
    const [removingItemIds, setRemovingItemIds] = useState(() => new Set());

    const requestRemoveItem = useCallback((id) => {
        setRemovingItemIds((currentIds) => {
            if (currentIds.has(id)) {
                return currentIds;
            }

            return new Set(currentIds).add(id);
        });
    }, []);

    const handleRemoveAnimationEnd = useCallback((id) => {
        onRemoveItem(id);
        setRemovingItemIds((currentIds) => {
            const nextIds = new Set(currentIds);
            nextIds.delete(id);
            return nextIds;
        });
    }, [onRemoveItem]);

    return (
        <div className="divide-y divide-gray-100">
            {items.map((item, index) => (
                <CartItem
                    key={item.id}
                    item={item}
                    isRemoving={removingItemIds.has(item.id)}
                    removeDirection={index % 2 === 0 ? 'right' : 'left'}
                    onRemoveRequest={requestRemoveItem}
                    onRemoveAnimationEnd={handleRemoveAnimationEnd}
                />
            ))}
        </div>
    );
}

export default CartItemsList;
