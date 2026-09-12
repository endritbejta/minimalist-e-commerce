import { useId } from 'react';
import {
  SHIPPING_METHODS,
  amountToFreeShipping,
  getShippingCost,
} from '../../lib/checkout';
import { formatPrice } from '../../lib/format';

/**
 * DeliveryFields Component
 * The delivery method choice, priced for this particular order.
 *
 * Each option shows what it would actually cost — the free-delivery threshold
 * and a shipping coupon are applied to the price on the option itself, so the
 * figure the shopper is choosing between is the figure they will be charged,
 * not a list price that changes once selected.
 *
 * @param {Object} props - Component props.
 * @param {string} props.shippingMethodId - The currently selected method.
 * @param {number} props.goodsTotal - Value of the goods after any discount.
 * @param {Object} [props.coupon] - The applied coupon, when any.
 * @param {Function} props.onSelect - Called with the chosen method id.
 */
function DeliveryFields({ shippingMethodId, goodsTotal, coupon, onSelect }) {
  const groupName = useId();
  const shortfall = amountToFreeShipping(goodsTotal);

  return (
    <fieldset>
      <legend className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-4">
        Delivery method
      </legend>

      <div className="space-y-3">
        {SHIPPING_METHODS.map((method) => {
          const price = getShippingCost(method.id, goodsTotal, coupon);
          const isFree = price === 0;
          const isSelected = method.id === shippingMethodId;
          const optionId = `${groupName}-${method.id}`;

          return (
            <label
              key={method.id}
              htmlFor={optionId}
              className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-black has-[:focus-visible]:ring-offset-2 ${
                isSelected
                  ? 'border-gray-900 bg-gray-50 shadow-sm'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <input
                id={optionId}
                type="radio"
                name={groupName}
                value={method.id}
                checked={isSelected}
                onChange={() => onSelect(method.id)}
                className="h-4 w-4 accent-black focus:outline-none"
              />

              <span className="flex-1 min-w-0">
                <span className="block text-sm font-bold uppercase tracking-tight text-gray-900">
                  {method.label}
                </span>
                <span className="block text-[11px] text-gray-500">
                  {method.description}
                </span>
              </span>

              <span className="text-sm font-bold tabular-nums text-gray-900">
                {isFree ? (
                  <>
                    <span className="mr-2 text-xs font-medium text-gray-400 line-through">
                      {formatPrice(method.price)}
                    </span>
                    Free
                  </>
                ) : (
                  formatPrice(price)
                )}
              </span>
            </label>
          );
        })}
      </div>

      {/* Only worth saying while it is still achievable — and only about
          standard delivery, which is the method the threshold applies to. */}
      {shortfall > 0 && !coupon?.freeShipping && (
        <p className="mt-4 text-[11px] text-gray-500">
          Add {formatPrice(shortfall)} more to qualify for free standard delivery.
        </p>
      )}

      {coupon?.freeShipping && (
        <p className="mt-4 text-[11px] font-medium text-gray-900">
          {coupon.code} covers delivery on this order.
        </p>
      )}
    </fieldset>
  );
}

export default DeliveryFields;
