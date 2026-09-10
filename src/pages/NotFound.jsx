import { Link } from 'react-router-dom';
import SEO from '../components/UI/SEO';

const SUGGESTIONS = [
  {
    heading: 'Shop All',
    body: 'Browse our entire collection of premium goods.',
    to: '/collections/all',
    cta: 'View Collection',
  },
  {
    heading: 'Need Help?',
    body: 'Check our FAQs or contact our support team.',
    to: '/faq',
    cta: 'Support Center',
  },
  {
    heading: 'Contact Us',
    body: 'Get in touch with us for any inquiries.',
    to: '/contact-us',
    cta: 'Get in touch',
  },
];

/**
 * NotFound Component
 * Shown for unmatched routes, and reused for unknown products and collections
 * so every dead end looks the same and carries `noindex`.
 * @param {Object} props - Component props.
 * @param {string} [props.title='Page not found'] - Headline describing what was missing.
 */
function NotFound({ title = 'Page not found' }) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <SEO title={title} description="The page you were looking for could not be found." noindex />

      <p aria-hidden="true" className="text-[12rem] md:text-[16rem] font-black text-gray-100 leading-none select-none">
        404
      </p>

      <div className="relative -mt-16 md:-mt-24">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
          {title}
        </h1>
        <p className="text-gray-500 max-w-md mx-auto mb-10 text-lg">
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>

        <Link
          to="/"
          className="inline-flex items-center justify-center bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-95"
        >
          Back to Homepage
        </Link>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full text-left">
        {SUGGESTIONS.map(({ heading, body, to, cta }) => (
          <div key={to} className="p-6 border rounded-2xl hover:border-black transition-colors">
            <h2 className="font-bold text-gray-900 mb-2 uppercase tracking-widest text-xs">{heading}</h2>
            <p className="text-sm text-gray-500 mb-4">{body}</p>
            <Link to={to} className="text-sm font-bold border-b-2 border-black">{cta}</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotFound;
