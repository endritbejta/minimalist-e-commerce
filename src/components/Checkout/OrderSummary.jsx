import { formatPrice } from '../../lib/format';
import { getShippingMethod } from '../../lib/checkout';
import { describeCustomization } from '../../lib/emblem';
import SmartImage from '../UI/SmartImage';
import TotalsRow from '../UI/TotalsRow';

/**
 * SummaryLine Component
 * One ordered item, with its quantity carried on the thumbnail the way a
 * receipt carries it — the row is a record, not a control, so there is nothing
 * here to adjust.
 * @param {Object} props - Component props.
 * @param {Object} props.item - The cart line.
 */
function SummaryLine({ item }) {
  const customization = describeCustomization(item.customization);

  return (
    <li className="flex gap-4 py-4">
      <div className="relative w-16 h-16 flex-shrink-0 rounded-lg bg-gray-100 overflow-hidden">
        {item.image ? (
          <SmartImage
            src={item.image}
            alt={item.title}
            className="w-full h-full"
            imgClassName="w-full h-full object-cover"
          />
        ) : (
          <span className="flex h-full items-center justify-center text-[9px] uppercase tracking-widest text-gray-500">
            No image
          </span>
        )}
        <span
          className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full bg-gray-900 text-white text-[10px] font-bold tabular-nums"
          aria-hidden="true"
        >
          {item.quantity}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        {/* Two lines rather than one truncated: there is room for a full
            product name here, and a cut-off title on a receipt is the one
            place it is worth the extra line. */}
        <p className="text-sm font-bold uppercase tracking-tight text-gray-900 line-clamp-2">
          {item.title}
        </p>
        {/* The badge is decorative, so the quantity is spelled out here for
            anyone listening rather than looking. */}
        <p className="text-[10px] uppercase tracking-widest text-gray-500">
          Qty {item.quantity}
        </p>
        {customization && (
          <p className="mt-0.5 text-[10px] text-gray-500 flex items-start gap-1.5">
            <span aria-hidden="true">✦</span>
            <span className="min-w-0">{customization}</span>
          </p>
        )}
      </div>

      <p className="text-sm font-bold tabular-nums text-gray-900 whitespace-nowrap">
        {formatPrice(item.price * item.quantity)}
      </p>
    </li>
  );
}

/**
 * OrderSummary Component
 * The items and the figures, shown beside the checkout and again on the
 * confirmation. One component for both so what was agreed to and what was
 * charged are rendered by the same code.
 *
 * @param {Object} props - Component props.
 * @param {Object[]} props.items - The lines being ordered.
 * @param {Object} props.totals - The figures from `getOrderTotals`.
 * @param {string} [props.shippingMethodId] - The chosen delivery method.
 * @param {Object} [props.coupon] - The applied coupon, when any.
 * @param {string} [props.title='Order summary'] - Heading for the panel.
 * @param {Function} [props.onEdit] - Opens the cart to change the order. The
 *   checkout has no cart icon, so without this there is no way back to the
 *   lines; a placed order has nothing left to change, so it passes nothing.
 */
function OrderSummary({
  items = [],
  totals,
  shippingMethodId,
  coupon,
  title = 'Order summary',
  onEdit,
}) {
  const method = getShippingMethod(shippingMethodId);

  return (
    <section
      aria-label={title}
      className="rounded-2xl border border-gray-200 bg-gray-50 p-6"
    >
      <div className="flex items-baseline justify-between gap-4 mb-1">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">
          {title}
        </h2>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="text-[11px] font-bold uppercase tracking-widest text-gray-900 underline underline-offset-4 hover:text-gray-500 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            Edit
          </button>
        )}
      </div>

      <ul className="divide-y divide-gray-200 mb-4">
        {items.map((item) => (
          <SummaryLine key={item.lineId} item={item} />
        ))}
      </ul>

      <div className="border-t border-gray-200 pt-4">
        <TotalsRow label="Subtotal">{formatPrice(totals.subtotal)}</TotalsRow>

        {totals.discount > 0 && (
          <TotalsRow label="Discount" note={coupon?.code}>
            &minus;{formatPrice(totals.discount)}
          </TotalsRow>
        )}

        <TotalsRow label="Delivery" note={method.label}>
          {totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}
        </TotalsRow>

        <TotalsRow label="Tax" note="Estimated">
          {formatPrice(totals.tax)}
        </TotalsRow>

        <div className="mt-3 pt-3 border-t border-gray-200">
          <TotalsRow label="Total" emphasis>
            {formatPrice(totals.total)}
          </TotalsRow>
        </div>
      </div>
    </section>
  );
}

export default OrderSummary;
