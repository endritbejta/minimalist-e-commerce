/**
 * PrivacyPolicy Component
 * Displays the site's privacy policy and data collection practices.
 */
function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 tracking-tight">Privacy Policy</h1>
      
      <div className="prose prose-lg text-gray-600 space-y-8 max-w-none">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
          <p>
            At our E-commerce store, we take your privacy seriously. This policy describes how we collect, 
            use, and protect your personal information when you visit our site or make a purchase.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
          <p>
            When you visit the Site, we automatically collect certain information about your device, 
            including information about your web browser, IP address, time zone, and some of the cookies 
            that are installed on your device.
          </p>
          <p className="mt-4">
            Additionally, when you make a purchase or attempt to make a purchase through the Site, 
            we collect certain information from you, including your name, billing address, shipping 
            address, payment information, email address, and phone number.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
          <p>
            We use the Order Information that we collect generally to fulfill any orders placed through 
            the Site (including processing your payment information, arranging for shipping, and 
            providing you with invoices and/or order confirmations).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
          <p>
            When you place an order through the Site, we will maintain your Order Information for our 
            records unless and until you ask us to delete this information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes</h2>
          <p>
            We may update this privacy policy from time to time in order to reflect, for example, 
            changes to our practices or for other operational, legal or regulatory reasons.
          </p>
        </section>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
