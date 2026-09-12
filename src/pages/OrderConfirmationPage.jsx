import { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { getShippingMethod } from '../lib/checkout';
import { formatAddressLines } from '../lib/checkoutForm';
import { findOrder } from '../lib/orders';
import { SITE } from '../lib/site';
import OrderSummary from '../components/Checkout/OrderSummary';
import SEO from '../components/UI/SEO';
import NotFound from './NotFound';

const DATE_FORMAT = {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
};

/**
 * Formats an order's timestamp for display.
 * @param {string} isoDate - The stored ISO timestamp.
 * @returns {string} A readable date, or an empty string if it cannot be parsed.
 */
const formatPlacedAt = (isoDate) => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('en-US', DATE_FORMAT).format(date);
};

/**
 * DetailBlock Component
 * One labelled block of the order's details.
 * @param {Object} props - Component props.
 * @param {string} props.title - The label.
 * @param {import('react').ReactNode} props.children - The block's content.
 */
function DetailBlock({ title, children }) {
  return (
    <div>
      <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}

/**
 * OrderConfirmationPage Component
 * What was ordered, under a URL that can be returned to.
 *
 * The order arrives two ways. Placing one hands it over in router state, which
 * works even when the browser refused to store it; arriving at the URL later
 * reads it back from this device. Either way it is looked up once — reading
 * storage on every render would let a cleared browser blank the page mid-visit.
 */
function OrderConfirmationPage() {
  const { orderNumber } = useParams();
  const location = useLocation();

  const [order] = useState(() => location.state?.order ?? findOrder(orderNumber));

  if (!order) {
    // Orders live on the device that placed them, so a real order number opened
    // on another browser is genuinely not found here — and saying so is more
    // honest than an error implying the order does not exist.
    return <NotFound title="Order not found" />;
  }

  const method = getShippingMethod(order.shippingMethodId);
  const addressLines = formatAddressLines(order.details);
  const placedAt = formatPlacedAt(order.placedAt);

  return (
    <div className="container mx-auto px-6 py-12 max-w-5xl">
      <SEO
        title={`Order ${order.orderNumber}`}
        description={`Your ${SITE.name} order confirmation.`}
        noindex
      />

      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
          Order confirmed
        </p>
        <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter text-gray-900 mb-4">
          Thank you{order.details?.firstName ? `, ${order.details.firstName}` : ''}.
        </h1>
        <p className="text-gray-500 max-w-xl leading-relaxed">
          Order{' '}
          <span className="font-bold text-gray-900 tabular-nums">
            {order.orderNumber}
          </span>{' '}
          was placed{placedAt && ` on ${placedAt}`}.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_400px] xl:grid-cols-[minmax(0,1fr)_460px] gap-10 lg:gap-12 items-start">
        <div className="space-y-8">
          <div className="rounded-2xl border border-gray-900 bg-gray-900 p-5 text-white">
            <p className="text-sm font-bold uppercase tracking-widest mb-1">
              This was a demo order
            </p>
            <p className="text-[12px] leading-relaxed text-gray-300">
              No payment was taken, no confirmation email was sent, and nothing
              will be shipped. The order is stored in this browser only, so it is
              reachable at this URL on this device until you clear site data.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <DetailBlock title="Contact">
              <p className="text-sm text-gray-900 break-words">{order.details?.email}</p>
              {order.details?.phone && (
                <p className="text-sm text-gray-500">{order.details.phone}</p>
              )}
            </DetailBlock>

            <DetailBlock title="Delivery method">
              <p className="text-sm font-bold text-gray-900">{method.label}</p>
              <p className="text-sm text-gray-500">{method.description}</p>
            </DetailBlock>

            <DetailBlock title="Delivering to">
              <address className="not-italic text-sm text-gray-900 leading-relaxed">
                {addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </DetailBlock>

            {order.coupon && (
              <DetailBlock title="Discount applied">
                <p className="text-sm font-bold text-gray-900">{order.coupon.code}</p>
                <p className="text-sm text-gray-500">{order.coupon.label}</p>
              </DetailBlock>
            )}
          </div>

          <Link
            to="/collections/all"
            className="inline-block bg-black text-white px-10 py-4 rounded-full font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            Continue shopping
          </Link>
        </div>

        <OrderSummary
          items={order.items}
          totals={order.totals}
          shippingMethodId={order.shippingMethodId}
          coupon={order.coupon}
          title="What you ordered"
        />
      </div>
    </div>
  );
}

export default OrderConfirmationPage;
