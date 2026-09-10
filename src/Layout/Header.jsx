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
        <header className="flex items-center gap-2 px-3 py-2 lg:px-5 lg:py-4 border-b sticky top-0 bg-white z-header">
            {/*
              The menu button and the actions are different widths, so
              justify-between could never centre the wordmark between them.
              Giving both sides flex-1 makes them share the leftover space
              equally, which puts the wordmark on the real centre line.
            */}
            <div className="flex flex-1 items-center lg:hidden">
                <button
                    type="button"
                    onClick={() => setIsMenuOpen(true)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                    aria-label="Open menu"
                    aria-expanded={isMenuOpen}
                    aria-haspopup="dialog"
                >
                    <BsList size={24} />
                </button>
            </div>

            <div className="logo-holder flex-none font-bold">
                {/* The full name needs 242px at text-xl but only 207px is free
                    on a 375px screen, so it wrapped to two lines and made the
                    sticky header 81px tall. Short form on phones, full name
                    from md up; the link keeps the full name either way. */}
                <NavLink to="/" aria-label={SITE.name}>
                    <span className="text-lg tracking-tight sm:hidden">
                        {SITE.shortName.toUpperCase()}
                    </span>
                    <span className="hidden text-xl sm:inline">
                        {SITE.name.toUpperCase()}
                    </span>
                </NavLink>
            </div>

            {/* Desktop Navigation */}
            <nav
                aria-label="Main"
                className="hidden lg:flex lg:flex-1 lg:justify-center gap-4 xl:gap-6 text-sm uppercase tracking-wide xl:tracking-widest font-medium"
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

            <div className="header-right relative flex flex-1 items-center justify-end gap-1 lg:flex-none lg:gap-2">
                <GlobalSearch />

                <button
                    // Destination for the add-to-cart flight.
                    ref={registerCartTarget}
                    type="button"
                    onClick={toggleCart}
                    className="p-2 lg:p-3 hover:bg-gray-100 rounded-full transition-colors relative"
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
