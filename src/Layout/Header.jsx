import { useState } from "react";
import { NavLink } from "react-router-dom";
import { BsCartCheck, BsList } from "react-icons/bs";
import { useCart } from "../context/CartContext";
import { useFlyToCart } from "../context/FlyToCartContext";
import { COLLECTIONS } from "../lib/catalog";
import { SITE } from "../lib/site";
import MobileMenu from "./MobileMenu";
import GlobalSearch from "../components/UI/GlobalSearch";

const navLinkClasses = ({ isActive }) =>
    isActive ? "text-black" : "text-gray-500 hover:text-black transition-colors";

/**
 * Header Component
 * The primary navigation bar, featuring the logo, desktop menu, search trigger, and cart toggle.
 */
function Header() {
    const { toggleCart, cartCount } = useCart();
    const { registerCartTarget } = useFlyToCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="flex justify-between items-center p-3 md:p-5 border-b sticky top-0 bg-white z-header">
            {/* Mobile Menu Button */}
            <button
                type="button"
                onClick={() => setIsMenuOpen(true)}
                className="p-3 hover:bg-gray-100 rounded-full md:hidden"
                aria-label="Open menu"
                aria-expanded={isMenuOpen}
                aria-haspopup="dialog"
            >
                <BsList size={24} />
            </button>

            <div className="logo-holder font-bold text-xl">
                <NavLink to="/">{SITE.name.toUpperCase()}</NavLink>
            </div>

            {/* Desktop Navigation */}
            <nav
                aria-label="Main"
                className="hidden md:flex gap-6 text-sm uppercase tracking-widest font-medium"
            >
                <NavLink to="/" className={navLinkClasses}>Home</NavLink>
                {COLLECTIONS.map((collection) => (
                    <NavLink
                        key={collection.handle}
                        to={`/collections/${collection.handle}`}
                        className={navLinkClasses}
                    >
                        {collection.title}
                    </NavLink>
                ))}
            </nav>

            <div className="header-right relative flex items-center gap-2">
                <GlobalSearch />

                <button
                    // Destination for the add-to-cart flight.
                    ref={registerCartTarget}
                    type="button"
                    onClick={toggleCart}
                    className="p-3 hover:bg-gray-100 rounded-full transition-colors relative"
                    aria-label={
                        cartCount > 0
                            ? `Open cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`
                            : 'Open cart'
                    }
                    aria-haspopup="dialog"
                >
                    <BsCartCheck size={24} />
                    {cartCount > 0 && (
                        <span
                            aria-hidden="true"
                            className="absolute top-0 right-0 bg-black text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white"
                        >
                            {cartCount}
                        </span>
                    )}
                </button>
            </div>

            <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </header>
    );
}

export default Header;
