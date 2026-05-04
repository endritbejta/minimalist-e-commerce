import Breadcrumbs from '../components/UI/Breadcrumbs';

function ReturnsPolicy() {
  return (
    <div className="container mx-auto px-6 py-12 max-w-3xl">
      <Breadcrumbs />
      <h1 className="text-4xl font-bold mb-8">Returns & Exchanges</h1>
      <div className="prose prose-gray max-w-none space-y-6 text-gray-600">
        <section>
          <h2 className="text-xl font-bold text-black mb-3">30-Day Returns</h2>
          <p>We want you to love your purchase. If you're not entirely satisfied, you can return your items within 30 days of delivery for a full refund or exchange.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-black mb-3">Condition of Items</h2>
          <p>Items must be returned in their original condition, unworn, unwashed, and with all tags attached.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-black mb-3">How to Start a Return</h2>
          <p>To initiate a return, please contact our support team at returns@example.com with your order number and reason for return.</p>
        </section>
      </div>
    </div>
  );
}

export default ReturnsPolicy;
