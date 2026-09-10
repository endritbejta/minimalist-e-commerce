import { useId, useRef } from "react";
import { NavLink } from "react-router-dom";
import { BsX } from "react-icons/bs";
import { COLLECTIONS } from "../lib/catalog";
import useDialog from "../hooks/useDialog";
import useScrollLock from "../hooks/useScrollLock";
import { SOCIAL_LINKS } from "../lib/site";

const linkClasses = ({ isActive }) =>
  `text-lg font-medium tracking-wide ${isActive ? 'text-black' : 'text-gray-500'}`;

/**
 * MobileMenu Component
 * A full-screen overlay menu for mobile navigation.
 * @param {Object} props - Component props.
 * @param {boolean} props.isOpen - Whether the menu is visible.
 * @param {Function} props.onClose - Function to close the menu.
 */
function MobileMenu({ isOpen, onClose }) {
  const menuRef = useRef(null);
  const titleId = useId();

  useScrollLock(isOpen);
  useDialog({ isOpen, onClose, containerRef: menuRef });

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-menu-backdrop transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        inert={!isOpen}
        className={`fixed left-0 top-0 w-[80%] max-w-sm h-full bg-white z-menu shadow-2xl transition-transform duration-500 ease-in-out transform md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <h2 id={titleId} className="font-bold text-xl tracking-tight">MENU</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-3 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close menu"
            >
              <BsX size={28} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-6 py-8 flex flex-col space-y-6">
            <NavLink to="/" onClick={onClose} className={linkClasses}>
              Home
            </NavLink>
            {COLLECTIONS.map((collection) => (
              <NavLink
                key={collection.handle}
                to={`/collections/${collection.handle}`}
                onClick={onClose}
                className={linkClasses}
              >
                {collection.title}
              </NavLink>
            ))}
          </nav>

          {/* Footer of Menu */}
          <div className="p-6 border-t bg-gray-50">
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">Follow Us</p>
            <div className="flex space-x-2 text-gray-600">
              {SOCIAL_LINKS.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  aria-label={name}
                  className="p-2 hover:text-black transition-colors"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MobileMenu;
