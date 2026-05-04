import Breadcrumbs from '../components/UI/Breadcrumbs';
import SEO from '../components/UI/SEO';

function FAQ() {
  const faqs = [
    {
      q: "When will my order arrive?",
      a: "Standard shipping typically takes 3-5 business days. International orders can take 7-14 days depending on the destination."
    },
    {
      q: "Can I change my order after it's placed?",
      a: "We process orders quickly, but if you contact us within 1 hour of placing your order, we can usually make changes."
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept all major credit cards, PayPal, and Apple Pay."
    }
  ];

  return (
    <div className="container mx-auto px-6 py-12 max-w-3xl">
      <SEO 
        title="FAQ" 
        description="Frequently asked questions about shipping, returns, and payments at Minimalist Essentials."
      />
      <Breadcrumbs />
      <h1 className="text-4xl font-bold mb-8">Frequently Asked Questions</h1>
      <div className="space-y-8">
        {faqs.map((faq, i) => (
          <div key={i} className="border-b pb-6">
            <h2 className="text-lg font-bold mb-2">{faq.q}</h2>
            <p className="text-gray-600 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQ;
