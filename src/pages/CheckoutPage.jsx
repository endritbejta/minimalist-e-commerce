import { useEffect, useId, useReducer, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getOrderTotals } from '../lib/checkout';
import { validateDetails } from '../lib/checkoutForm';
import { checkoutReducer, firstInvalidField, initialCheckoutState } from '../lib/checkoutReducer';
import { createOrder, saveOrder } from '../lib/orders';
import { SITE } from '../lib/site';
import CheckoutSummaryPanel from '../components/Checkout/CheckoutSummaryPanel';
import DeliveryFields from '../components/Checkout/DeliveryFields';
import DemoPaymentNotice from '../components/Checkout/DemoPaymentNotice';
import DetailsFields from '../components/Checkout/DetailsFields';
import SEO from '../components/UI/SEO';

/**
 * Stands in for the round-trip a real checkout makes when it submits an order.
 * Without it the pending state would never be seen, and the button would be
 * wired for a wait that the demo does not have.
 */
const PLACE_ORDER_DELAY = 700;

/**
 * CheckoutEmptyState Component
 * Shown when there is nothing to check out — reached by opening /checkout
 * directly, or by emptying the cart in another tab.
 */
function CheckoutEmptyState() {
  return (
    <div className="py-24 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-3">
        Your cart is empty
      </h1>
      <p className="text-gray-500 mb-8">
        There is nothing to check out yet.
      </p>
      <Link
        to="/collections/all"
        className="inline-block bg-black text-white px-10 py-4 rounded-full font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
      >
        Continue shopping
      </Link>
    </div>
  );
}

/**
 * CheckoutPage Component
 * The whole checkout, on one page.
 *
 * It was three steps, which is the shape a checkout takes when it has to carve
 * out payment. This one takes no payment, which left a step for three radio
 * buttons and a step for reviewing ten fields that were still on screen — so
 * the stepper cost more attention than the form did. Everything is asked for
 * once, in one form, with the totals alongside the whole time.
 *
 * The form is held in memory only. A delivery address is the most personal
 * thing this site ever handles, and persisting a half-finished one to survive a
 * reload is not worth leaving it sitting in storage — only the placed order is
 * written down, because the confirmation page has to be able to find it.
 */
function CheckoutPage() {
  const { items, cartTotal, discount, coupon, clearCart } = useCart();
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(checkoutReducer, initialCheckoutState);
  const [storageWarning, setStorageWarning] = useState(false);
  // The placed order, once there is one. Emptying the cart re-renders this page
  // with nothing in it, and the router keeps it on screen while the
  // confirmation's code-split chunk loads — long enough, on a slow connection,
  // to watch the order total drop to $0.00 at the moment of purchase. From here
  // on the summary reads from the order, which cannot change.
  const [placedOrder, setPlacedOrder] = useState(null);

  const formPrefix = useId();
  const placeTimerRef = useRef(undefined);

  const fieldId = (name) => `${formPrefix}-${name}`;

  const totals = getOrderTotals({
    subtotal: cartTotal,
    discount,
    shippingMethodId: state.shippingMethodId,
    coupon,
  });

  const placeOrder = () => {
    dispatch({ type: 'PLACE_ORDER' });

    placeTimerRef.current = window.setTimeout(() => {
      const order = createOrder({
        items,
        totals,
        details: state.details,
        shippingMethodId: state.shippingMethodId,
        coupon,
      });

      // A blocked or full localStorage must not lose the order: the
      // confirmation is handed the record through router state either way, and
      // only the ability to return to the URL later is lost.
      const stored = saveOrder(order);
      if (!stored) setStorageWarning(true);

      setPlacedOrder(order);
      clearCart();
      navigate(`/orders/${order.orderNumber}`, { replace: true, state: { order } });
    }, PLACE_ORDER_DELAY);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (state.isPlacing) return;

    const errors = validateDetails(state.details);
    // The reducer records what the form has to say about itself; whether that
    // is good enough to place an order is decided here. Both go through
    // `validateDetails`, so they cannot disagree.
    dispatch({ type: 'SUBMIT' });

    const invalid = firstInvalidField(errors);
    if (invalid) {
      // On a form this long the first bad field is usually well above the
      // button, and refusing to submit without moving looks like nothing
      // happened at all. The inputs are already in the DOM, so this lands
      // before the errors themselves render.
      document.getElementById(fieldId(invalid))?.focus();
      return;
    }

    placeOrder();
  };

  // Leaving mid-placement cancels it, rather than yanking the shopper onto a
  // confirmation for an order they walked away from.
  useEffect(() => () => window.clearTimeout(placeTimerRef.current), []);

  if (items.length === 0 && !state.isPlacing) {
    return (
      <div className="container mx-auto px-6">
        <SEO title="Checkout" noindex />
        <CheckoutEmptyState />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-10 max-w-6xl">
      {/* Never indexable: it is a private, cart-dependent page that says
          nothing useful to a crawler arriving with an empty cart. */}
      <SEO title="Checkout" description={`Complete your ${SITE.name} order.`} noindex />

      <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-tighter text-gray-900 mb-8">
        Checkout
      </h1>

      {storageWarning && (
        <p role="alert" className="mb-6 text-[11px] text-gray-500">
          This browser is not storing site data, so the confirmation will not be
          reachable again after you leave it.
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_400px] xl:grid-cols-[minmax(0,1fr)_460px] gap-10 lg:gap-12 items-start">
        {/* `noValidate` hands validation to `lib/checkoutForm` rather than the
            browser's bubbles, so every message is worded and placed by this
            app. It stays a real <form>, so Enter submits and the browser can
            still offer a saved address to the `autoComplete` fields. */}
        <form onSubmit={handleSubmit} noValidate className="space-y-8">
          <DetailsFields
            values={state.details}
            errors={state.errors}
            fieldId={fieldId}
            onChange={(name, value) =>
              dispatch({ type: 'SET_FIELD', payload: { name, value } })
            }
            onBlur={(name) => dispatch({ type: 'BLUR_FIELD', payload: name })}
          />

          <DeliveryFields
            shippingMethodId={state.shippingMethodId}
            goodsTotal={totals.subtotal - totals.discount}
            coupon={coupon}
            onSelect={(methodId) =>
              dispatch({ type: 'SET_SHIPPING_METHOD', payload: methodId })
            }
          />

          <DemoPaymentNotice />

          <button
            type="submit"
            disabled={state.isPlacing}
            aria-busy={state.isPlacing || undefined}
            className="w-full sm:w-auto bg-black text-white px-10 py-4 rounded-full font-bold transition-all hover:bg-gray-800 active:scale-95 shadow-lg disabled:opacity-60 disabled:cursor-wait focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            {state.isPlacing ? (
              <span className="flex items-center justify-center gap-2">
                <span
                  className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent opacity-60"
                  aria-hidden="true"
                />
                Placing order
              </span>
            ) : (
              'Place order'
            )}
          </button>
        </form>

        <CheckoutSummaryPanel
          items={placedOrder?.items ?? items}
          totals={placedOrder?.totals ?? totals}
          shippingMethodId={state.shippingMethodId}
          coupon={coupon}
        />
      </div>
    </div>
  );
}

export default CheckoutPage;
