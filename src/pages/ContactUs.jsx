import Breadcrumbs from '../components/UI/Breadcrumbs';
import SEO from '../components/UI/SEO';

function ContactUs() {
  return (
    <div className="container mx-auto px-6 py-12 max-w-3xl">
      <SEO 
        title="Contact Us" 
        description="Get in touch with Minimalist Essentials for support or inquiries."
      />
      <Breadcrumbs />
      <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Have a question about an order or just want to say hi? Fill out the form or reach us via email.
          </p>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-bold">Email</p>
              <p className="text-gray-500">support@example.com</p>
            </div>
            <div>
              <p className="font-bold">Address</p>
              <p className="text-gray-500">123 Minimalist Way, Suite 100<br />San Francisco, CA 94103</p>
            </div>
          </div>
        </div>
        
        <form className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase mb-2">Name</label>
            <input type="text" className="w-full border border-gray-200 p-3 rounded-md focus:outline-none focus:border-black transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase mb-2">Email</label>
            <input type="email" className="w-full border border-gray-200 p-3 rounded-md focus:outline-none focus:border-black transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase mb-2">Message</label>
            <textarea rows="4" className="w-full border border-gray-200 p-3 rounded-md focus:outline-none focus:border-black transition-colors"></textarea>
          </div>
          <button className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

export default ContactUs;
