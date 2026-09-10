import { useId, useRef } from "react";
import { createPortal } from "react-dom";
import { useCart } from "../context/CartContext";
import useDialog from "../hooks/useDialog";
import useScrollLock from "../hooks/useScrollLock";
import CartDrawerFooter from "../components/Cart/CartDrawerFooter";
import CartDrawerHeader from "../components/Cart/CartDrawerHeader";
import CartEmptyState from "../components/Cart/CartEmptyState";
import CartItemsList from "../components/Cart/CartItemsList";

/**
 * CartDrawer Component
 * A slide-out panel that manages the visibility and content of the shopping cart.
 * Stays mounted so it can animate in and out; `inert` keeps it out of the tab
 * order and the accessibility tree while it is off-screen.
 */
function CartDrawer() {
    const { isOpen, closeCart, items, cartTotal, removeFromCart } = useCart();
    const drawerRef = useRef(null);
    const titleId = useId();

    useScrollLock(isOpen);
    useDialog({ isOpen, onClose: closeCart, containerRef: drawerRef });

    // Render in a portal so the drawer can sit above any open modal.
    return createPortal(
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-cart-backdrop transition-opacity duration-300 ${
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={closeCart}
                aria-hidden="true"
            />

            {/* Drawer */}
            <div
                ref={drawerRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                inert={!isOpen}
                className={`fixed right-0 top-0 w-full max-w-md h-full bg-white z-cart shadow-2xl transition-transform duration-500 ease-in-out transform ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="flex flex-col h-full">
                    <CartDrawerHeader onClose={closeCart} titleId={titleId} />

                    <div className="flex-1 overflow-y-auto p-6">
                        {items.length === 0 ? (
                            <CartEmptyState onClose={closeCart} />
                        ) : (
                            <CartItemsList items={items} onRemoveItem={removeFromCart} />
                        )}
                    </div>

                    {items.length > 0 && <CartDrawerFooter cartTotal={cartTotal} />}
                </div>
            </div>
        </>,
        document.body
    );
}

export default CartDrawer;
