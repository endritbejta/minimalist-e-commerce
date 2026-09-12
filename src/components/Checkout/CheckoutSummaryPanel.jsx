import { useId, useState } from 'react';
import { BsChevronDown } from 'react-icons/bs';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../lib/format';
import OrderSummary from './OrderSummary';

/**
 * CheckoutSummaryPanel Component
 * The order summary as the checkout column shows it.
 *
 * Beside the form there is room to leave it open. Below it — where a phone puts
 * it, under ten fields and a button — an always-open panel means completing a
 * step without once seeing what it costs, so the total comes up to the top as a
 * header the shopper can expand. The same panel either way; only the way in
 * differs.
 *
 * @param {Object} props - Component props.
 * @param {Object[]} props.items - The lines being ordered.
 * @param {Object} props.totals - The figures from `getOrderTotals`.
 * @param {string} [props.shippingMethodId] - The chosen delivery method.
 * @param {Object} [props.coupon] - The applied coupon, when any.
 */
function CheckoutSummaryPanel({ items, totals, shippingMethodId, coupon }) {
  const { openCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  return (
    // First on a phone, second beside the form: the total belongs above the
    // thing being filled in, not after it.
    <div className="order-first lg:order-none lg:sticky lg:top-24">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="lg:hidden w-full flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 mb-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
      >
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
          {isOpen ? 'Hide' : 'Show'} order summary
          <BsChevronDown
            size={12}
            aria-hidden="true"
            className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        </span>
        <span className="text-base font-bold tabular-nums text-gray-900">
          {formatPrice(totals.total)}
        </span>
      </button>

      {/* Always rendered, so the figures are in the page for assistive
          technology and for anyone on a wide screen; `hidden` is dropped at lg,
          where there is room to leave it open. */}
      <div id={panelId} className={`${isOpen ? '' : 'hidden'} lg:block`}>
        <OrderSummary
          items={items}
          totals={totals}
          shippingMethodId={shippingMethodId}
          coupon={coupon}
          onEdit={openCart}
        />
      </div>
    </div>
  );
}

export default CheckoutSummaryPanel;
