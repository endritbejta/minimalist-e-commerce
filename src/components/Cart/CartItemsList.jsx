import { useCallback, useEffect, useRef, useState } from "react";
import CartItem from "./CartItem";

// Generous upper bound on the removal animation. If the animationend event
// never arrives — a backgrounded tab, a dropped frame — the line is still
// removed rather than being stuck in a disabled state.
const REMOVE_FALLBACK_MS = 1000;

/**
 * CartItemsList Component
 * Orchestrates the list of cart lines and manages removal animations so the
 * list does not jump as rows disappear.
 * @param {Object} props - Component props.
 * @param {Object[]} props.items - Lines in the cart.
 * @param {Function} props.onRemoveItem - Removes a line from state once its animation completes.
 */
function CartItemsList({ items, onRemoveItem }) {
    const [removingLineIds, setRemovingLineIds] = useState(() => new Set());
    const fallbackTimersRef = useRef(new Map());

    const finalizeRemoval = useCallback((lineId) => {
        const timers = fallbackTimersRef.current;
        if (timers.has(lineId)) {
            window.clearTimeout(timers.get(lineId));
            timers.delete(lineId);
        }

        onRemoveItem(lineId);
        setRemovingLineIds((current) => {
            if (!current.has(lineId)) return current;

            const next = new Set(current);
            next.delete(lineId);
            return next;
        });
    }, [onRemoveItem]);

    const requestRemoveItem = useCallback((lineId) => {
        setRemovingLineIds((current) => {
            if (current.has(lineId)) return current;

            return new Set(current).add(lineId);
        });

        const timers = fallbackTimersRef.current;
        if (!timers.has(lineId)) {
            timers.set(
                lineId,
                window.setTimeout(() => finalizeRemoval(lineId), REMOVE_FALLBACK_MS)
            );
        }
    }, [finalizeRemoval]);

    useEffect(() => {
        const timers = fallbackTimersRef.current;
        return () => {
            timers.forEach((timerId) => window.clearTimeout(timerId));
            timers.clear();
        };
    }, []);

    return (
        <ul className="divide-y divide-gray-100 list-none p-0 m-0">
            {items.map((item, index) => (
                <li key={item.lineId}>
                    <CartItem
                        item={item}
                        isRemoving={removingLineIds.has(item.lineId)}
                        removeDirection={index % 2 === 0 ? 'right' : 'left'}
                        onRemoveRequest={requestRemoveItem}
                        onRemoveAnimationEnd={finalizeRemoval}
                    />
                </li>
            ))}
        </ul>
    );
}

export default CartItemsList;
