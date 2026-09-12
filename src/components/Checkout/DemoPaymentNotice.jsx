import { BsInfoCircle } from 'react-icons/bs';

/**
 * DemoPaymentNotice Component
 * Says plainly that nothing is charged, immediately above the button that
 * places the order.
 *
 * There is no payment form anywhere in this checkout, and not a disabled one
 * either. This store takes no money, so it asks for no card: a realistic
 * payment form on a demo is a phishing layout with a friendly name, and nothing
 * worth demonstrating is lost by leaving it out.
 */
function DemoPaymentNotice() {
  return (
    <div className="flex gap-3 rounded-xl border border-gray-900 bg-gray-900 p-4 text-white">
      <BsInfoCircle size={18} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
      <div>
        <p className="text-sm font-bold uppercase tracking-widest mb-1">
          No payment is taken
        </p>
        <p className="text-[12px] leading-relaxed text-gray-300">
          This is a portfolio demo with no payment processing, so it never asks
          for card details. Placing the order writes a confirmation to this
          browser and empties the cart — nothing is charged, and nothing is
          shipped.
        </p>
      </div>
    </div>
  );
}

export default DemoPaymentNotice;
