import { Link } from 'react-router-dom';
import { BsInstagram, BsTwitter, BsFacebook } from 'react-icons/bs';

/**
 * Footer Component
 * Site footer containing branding, navigation links, policy links, and newsletter signup.
 */
function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t mt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <h2 className="font-bold text-xl tracking-tight">E-COMMERCE</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Curating the finest minimalist essentials for your modern lifestyle. Quality over quantity, always.
            </p>
            <div className="flex space-x-4 text-gray-500">
              <a href="#" aria-label="Instagram" className="hover:text-black transition-colors p-2 -ml-2"><BsInstagram size={20} /></a>
              <a href="#" aria-label="Twitter" className="hover:text-black transition-colors p-2"><BsTwitter size={20} /></a>
              <a href="#" aria-label="Facebook" className="hover:text-black transition-colors p-2"><BsFacebook size={20} /></a>
            </div>
          </div>

          {/* Shop Section */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest text-gray-900 mb-6">Shop</h3>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link to="/collections/all" className="hover:text-black transition-colors">All Products</Link></li>
              <li><Link to="/collections/accessories" className="hover:text-black transition-colors">Accessories</Link></li>
              <li><Link to="/collections/electronics" className="hover:text-black transition-colors">Electronics</Link></li>
              <li><Link to="/collections/lifestyle" className="hover:text-black transition-colors">Lifestyle</Link></li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest text-gray-900 mb-6">Support</h3>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link to="/shipping-policy" className="hover:text-black transition-colors">Shipping Policy</Link></li>
              <li><Link to="/returns-exchanges" className="hover:text-black transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/faq" className="hover:text-black transition-colors">FAQs</Link></li>
              <li><Link to="/contact-us" className="hover:text-black transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest text-gray-900 mb-6">Newsletter</h3>
            <p className="text-gray-500 text-sm mb-4">Join our list for exclusive offers and news.</p>
            <form className="flex flex-col space-y-2">
              <input 
                type="email" 
                placeholder="email@example.com" 
                className="bg-white border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-black transition-colors rounded-md"
              />
              <button className="bg-black text-white px-4 py-2 text-sm font-bold rounded-md hover:bg-gray-800 transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-500 uppercase tracking-widest">
          <p>© {currentYear} E-Commerce Inc. All Rights Reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="hover:text-black">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-black">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
