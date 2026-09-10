import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { COLLECTIONS } from '../lib/catalog';
import { SITE, SOCIAL_LINKS } from '../lib/site';

const SUPPORT_LINKS = [
  { to: '/shipping-policy', label: 'Shipping Policy' },
  { to: '/returns-exchanges', label: 'Returns & Exchanges' },
  { to: '/faq', label: 'FAQs' },
  { to: '/contact-us', label: 'Contact Us' },
];

/**
 * Footer Component
 * Site footer containing branding, navigation links, policy links, and newsletter signup.
 */
function Footer() {
  const currentYear = new Date().getFullYear();
  const emailId = useId();
  const [hasSubscribed, setHasSubscribed] = useState(false);

  // This demo has no backend; handling submit keeps the form from reloading
  // the page and gives the shopper the confirmation they expect.
  const handleSubscribe = (event) => {
    event.preventDefault();
    setHasSubscribed(true);
  };

  return (
    <footer className="bg-gray-50 border-t mt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <h2 className="font-bold text-xl tracking-tight">{SITE.name.toUpperCase()}</h2>
            <p className="text-gray-500 text-sm leading-relaxed">{SITE.description}</p>
            <div className="flex space-x-2 text-gray-500">
              {SOCIAL_LINKS.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  aria-label={name}
                  className="hover:text-black transition-colors p-2"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Section */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest text-gray-900 mb-6">Shop</h3>
            <ul className="space-y-4 text-sm text-gray-500">
              {COLLECTIONS.map((collection) => (
                <li key={collection.handle}>
                  <Link
                    to={`/collections/${collection.handle}`}
                    className="hover:text-black transition-colors"
                  >
                    {collection.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest text-gray-900 mb-6">Support</h3>
            <ul className="space-y-4 text-sm text-gray-500">
              {SUPPORT_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="hover:text-black transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Section */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest text-gray-900 mb-6">Newsletter</h3>
            <p className="text-gray-500 text-sm mb-4">Join our list for exclusive offers and news.</p>
            {hasSubscribed ? (
              <p role="status" className="text-sm font-bold text-gray-900">
                Thanks — you&rsquo;re on the list.
              </p>
            ) : (
              <form className="flex flex-col space-y-2" onSubmit={handleSubscribe}>
                <label htmlFor={emailId} className="sr-only">Email address</label>
                <input
                  id={emailId}
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="email@example.com"
                  className="bg-white border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-black transition-colors rounded-md"
                />
                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 text-sm font-bold rounded-md hover:bg-gray-800 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-500 uppercase tracking-widest">
          <p>© {currentYear} {SITE.legalName} All Rights Reserved.</p>
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
