import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { BsX, BsInstagram, BsTwitter, BsFacebook } from "react-icons/bs";

/**
 * MobileMenu Component
 * A full-screen overlay menu for mobile navigation.
 * @param {Object} props - Component props.
 * @param {boolean} props.isOpen - Whether the menu is visible.
 * @param {Function} props.onClose - Function to close the menu.
 */
function MobileMenu({ isOpen, onClose }) {
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
  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed left-0 top-0 w-[80%] max-w-sm h-full bg-white z-[70] shadow-2xl transition-transform duration-500 ease-in-out transform md:hidden ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="font-bold text-xl tracking-tight">MENU</h2>
            <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-full transition-colors" aria-label="Close Menu">
              <BsX size={28} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-6 py-8 flex flex-col space-y-6">
            <NavLink 
              to="/" 
              onClick={onClose}
              className={({isActive}) => `text-lg font-medium tracking-wide ${isActive ? 'text-black' : 'text-gray-500'}`}
            >
              Home
            </NavLink>
            <NavLink 
              to="/collections/all" 
              onClick={onClose}
              className={({isActive}) => `text-lg font-medium tracking-wide ${isActive ? 'text-black' : 'text-gray-500'}`}
            >
              Shop All
            </NavLink>
            <NavLink 
              to="/collections/accessories" 
              onClick={onClose}
              className={({isActive}) => `text-lg font-medium tracking-wide ${isActive ? 'text-black' : 'text-gray-500'}`}
            >
              Accessories
            </NavLink>
            <NavLink 
              to="/collections/electronics" 
              onClick={onClose}
              className={({isActive}) => `text-lg font-medium tracking-wide ${isActive ? 'text-black' : 'text-gray-500'}`}
            >
              Electronics
            </NavLink>
            <NavLink 
              to="/collections/lifestyle" 
              onClick={onClose}
              className={({isActive}) => `text-lg font-medium tracking-wide ${isActive ? 'text-black' : 'text-gray-500'}`}
            >
              Lifestyle
            </NavLink>
          </nav>

          {/* Footer of Menu */}
          <div className="p-6 border-t bg-gray-50">
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">Follow Us</p>
            <div className="flex space-x-6 text-gray-600">
              <BsInstagram size={20} />
              <BsTwitter size={20} />
              <BsFacebook size={20} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MobileMenu;
