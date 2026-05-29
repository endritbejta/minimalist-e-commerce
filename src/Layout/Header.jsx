import { useState } from "react";
import { NavLink } from "react-router-dom"
import { BsCartCheck, BsList } from "react-icons/bs";
import { useCart } from "../context/CartContext.jsx";
import MobileMenu from "./MobileMenu";
import GlobalSearch from "../components/UI/GlobalSearch";

/**
 * Header Component
 * The primary navigation bar, featuring the logo, desktop menu, search trigger, and cart toggle.
 */
function Header() {
    const { toggleCart, cartCount } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    return (
        <header className="flex justify-between items-center p-3 md:p-5 border-b sticky top-0 bg-white z-[50]">
            {/* Mobile Menu Button */}
            <button 
                onClick={() => setIsMenuOpen(true)}
                className="p-3 hover:bg-gray-100 rounded-full md:hidden"
                aria-label="Open Menu"
            >
                <BsList size={24} />
            </button>

            <div className='logo-holder font-bold text-xl'>
                <NavLink to="/">PREMIUM SHOP</NavLink>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-6 text-sm uppercase tracking-widest font-medium">
                <NavLink to="/" className={({isActive}) => isActive ? "text-black" : "text-gray-500 hover:text-black transition-colors"}>Home</NavLink>
                <NavLink to="/collections/all" className={({isActive}) => isActive ? "text-black" : "text-gray-500 hover:text-black transition-colors"}>Shop All</NavLink>
                <NavLink to="/collections/accessories" className={({isActive}) => isActive ? "text-black" : "text-gray-500 hover:text-black transition-colors"}>Accessories</NavLink>
                <NavLink to="/collections/electronics" className={({isActive}) => isActive ? "text-black" : "text-gray-500 hover:text-black transition-colors"}>Electronics</NavLink>
            </nav>

            <div className='header-right relative flex items-center gap-2'>
                <GlobalSearch />
                
                <button 
                    onClick={toggleCart}
                    className="p-3 hover:bg-gray-100 rounded-full transition-colors relative"
                    aria-label="Toggle Cart"
                >
                    <BsCartCheck size={24} />
                    {cartCount > 0 && (
                        <span className="absolute top-0 right-0 bg-black text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                            {cartCount}
                        </span>
                    )}
                </button>
            </div>

            <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </header>
    )
}

export default Header
