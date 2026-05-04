import Breadcrumbs from '../components/UI/Breadcrumbs';

/**
 * ShippingPolicy Component
 * Outlines order processing times and shipping rates.
 */
function ShippingPolicy() {
  return (
    <div className="container mx-auto px-6 py-12 max-w-3xl">
      <Breadcrumbs />
      <h1 className="text-4xl font-bold mb-8">Shipping Policy</h1>
      <div className="prose prose-gray max-w-none space-y-6 text-gray-600">
        <section>
          <h2 className="text-xl font-bold text-black mb-3">Order Processing</h2>
          <p>All orders are processed within 1–2 business days. Orders are not shipped or delivered on weekends or holidays.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-black mb-3">Shipping Rates & Estimates</h2>
          <p>Shipping charges for your order will be calculated and displayed at checkout. We offer free standard shipping on all orders over $100.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-black mb-3">International Shipping</h2>
          <p>We currently ship to over 50 countries. International shipping rates vary by location and will be calculated at checkout.</p>
        </section>
      </div>
    </div>
  );
}

export default ShippingPolicy;
