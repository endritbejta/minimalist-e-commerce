import { useId, useState } from 'react';
import Breadcrumbs from '../components/UI/Breadcrumbs';
import SEO from '../components/UI/SEO';
import { SITE } from '../lib/site';

/**
 * ContactUs Component
 * Contact details and an enquiry form.
 */
function ContactUs() {
  const fieldId = useId();
  const [hasSent, setHasSent] = useState(false);

  // No backend in this demo; handling submit stops the page reloading and
  // confirms the action instead of appearing to do nothing.
  const handleSubmit = (event) => {
    event.preventDefault();
    setHasSent(true);
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-3xl">
      <SEO title="Contact Us" description={`Get in touch with ${SITE.name} for support or enquiries.`} />
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
              <p className="text-gray-500">{SITE.email}</p>
            </div>
            <div>
              <p className="font-bold">Address</p>
              <p className="text-gray-500">
                123 Minimalist Way, Suite 100<br />San Francisco, CA 94103
              </p>
            </div>
          </div>
        </div>

        {hasSent ? (
          <p role="status" className="text-gray-900 font-bold self-start">
            Thanks — we&rsquo;ll be in touch shortly.
          </p>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor={`${fieldId}-name`} className="block text-xs font-bold uppercase mb-2">
                Name
              </label>
              <input
                id={`${fieldId}-name`}
                name="name"
                type="text"
                required
                autoComplete="name"
                className="w-full border border-gray-200 p-3 rounded-md focus:outline-none focus:border-black transition-colors"
              />
            </div>
            <div>
              <label htmlFor={`${fieldId}-email`} className="block text-xs font-bold uppercase mb-2">
                Email
              </label>
              <input
                id={`${fieldId}-email`}
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full border border-gray-200 p-3 rounded-md focus:outline-none focus:border-black transition-colors"
              />
            </div>
            <div>
              <label htmlFor={`${fieldId}-message`} className="block text-xs font-bold uppercase mb-2">
                Message
              </label>
              <textarea
                id={`${fieldId}-message`}
                name="message"
                rows="4"
                required
                className="w-full border border-gray-200 p-3 rounded-md focus:outline-none focus:border-black transition-colors"
              />
            </div>
            <button
              type="submit"
              className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
            >
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ContactUs;
