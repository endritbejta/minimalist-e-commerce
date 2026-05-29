import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useCart } from "../context/CartContext.jsx";
import CartDrawerFooter from "../components/Cart/CartDrawerFooter";
import CartDrawerHeader from "../components/Cart/CartDrawerHeader";
import CartEmptyState from "../components/Cart/CartEmptyState";
import CartItemsList from "../components/Cart/CartItemsList";

/**
 * CartDrawer Component
 * A slide-out panel that manages the visibility and content of the shopping cart.
 */
function CartDrawer() {
    const { isOpen, closeCart, items, cartTotal, removeFromCart } = useCart();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Render Cart Drawer in a portal so it can sit above the PopUpModal
    return createPortal(
        <>
            {/* Backdrop */}
            <div 
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[10000] transition-opacity duration-300 ${
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={closeCart}
            />

            {/* Drawer */}
            <div className={`fixed right-0 top-0 w-full max-w-md h-full bg-white z-[10010] shadow-2xl transition-transform duration-500 ease-in-out transform ${
                isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}>
                <div className="flex flex-col h-full">
                    <CartDrawerHeader onClose={closeCart} />

                    <div className="flex-1 overflow-y-auto p-6">
                        {items.length === 0 ? (
                            <CartEmptyState onClose={closeCart} />
                        ) : (
                            <CartItemsList items={items} onRemoveItem={removeFromCart} />
                        )}
                    </div>

                    {items.length > 0 && (
                        <CartDrawerFooter cartTotal={cartTotal} />
                    )}
                </div>
            </div>
        </>,
        document.body
    );
}

export default CartDrawer;
