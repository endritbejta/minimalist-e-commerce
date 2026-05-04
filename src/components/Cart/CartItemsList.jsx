import { useCallback, useState } from "react";
import CartItem from "./CartItem";

/**
 * Renders cart items and delays state removal until each item's exit animation finishes.
 *
 * @param {Object} props
 * @param {Array<Object>} props.items - Items currently in the cart.
 * @param {(id: string | number) => void} props.onRemoveItem - Removes an item from cart state.
 * @returns {import('react').JSX.Element}
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
