import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-[12rem] md:text-[16rem] font-black text-gray-100 leading-none select-none">
        404
      </h1>
      
      <div className="relative -mt-16 md:-mt-24">
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
          Page not found
        </h2>
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
        <div className="p-6 border rounded-2xl hover:border-black transition-colors group">
          <h3 className="font-bold text-gray-900 mb-2 uppercase tracking-widest text-xs">Shop All</h3>
          <p className="text-sm text-gray-500 mb-4">Browse our entire collection of premium goods.</p>
          <Link to="/collections/all" className="text-sm font-bold border-b-2 border-black">View Collection</Link>
        </div>
        <div className="p-6 border rounded-2xl hover:border-black transition-colors group">
          <h3 className="font-bold text-gray-900 mb-2 uppercase tracking-widest text-xs">Need Help?</h3>
          <p className="text-sm text-gray-500 mb-4">Check our FAQs or contact our support team.</p>
          <Link to="/faq" className="text-sm font-bold border-b-2 border-black">Support Center</Link>
        </div>
        <div className="p-6 border rounded-2xl hover:border-black transition-colors group">
          <h3 className="font-bold text-gray-900 mb-2 uppercase tracking-widest text-xs">Contact Us</h3>
          <p className="text-sm text-gray-500 mb-4">Get in touch with us for any inquiries.</p>
          <Link to="/contact-us" className="text-sm font-bold border-b-2 border-black">Get in touch</Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
