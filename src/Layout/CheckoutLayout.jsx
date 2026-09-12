import { Suspense } from "react";
import { Link, Outlet } from "react-router-dom";
import ErrorBoundary from "../components/UI/ErrorBoundary";
import PageLoader from "../components/UI/PageLoader";
import { SITE } from "../lib/site";
import CartDrawer from "./CartDrawer";

const POLICY_LINKS = [
  { to: '/shipping-policy', label: 'Shipping' },
  { to: '/returns-exchanges', label: 'Returns' },
  { to: '/privacy-policy', label: 'Privacy' },
  { to: '/terms-of-service', label: 'Terms' },
];

/**
 * CheckoutLayout Component
 * The shell for the checkout itself: a wordmark, the form, and the policies.
 *
 * The site header does not belong here. Its collection links, search and cart
 * icon are all invitations to leave a purchase half-finished — and the cart
 * icon in particular opened the drawer over the checkout, where its own
 * "Checkout" button pointed at the page the shopper was already on. The footer
 * went with it for the same reason: a newsletter signup and every collection in
 * the catalog, directly beneath the button that places the order.
 *
 * The drawer itself stays mounted, without the icon that opened it, so the
 * summary's "Edit" can still bring it up on purpose.
 */
function CheckoutLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <header className="border-b sticky top-0 bg-white z-header">
                <div className="container mx-auto px-6 py-4 flex justify-center">
                    <Link
                        to="/"
                        aria-label={`${SITE.name} — back to the shop`}
                        className="font-bold tracking-tight rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                    >
                        <span className="text-lg sm:hidden">{SITE.shortName.toUpperCase()}</span>
                        <span className="hidden text-xl sm:inline">{SITE.name.toUpperCase()}</span>
                    </Link>
                </div>
            </header>

            <CartDrawer />

            <main className="flex-1">
                <ErrorBoundary>
                    <Suspense fallback={<PageLoader />}>
                        <Outlet />
                    </Suspense>
                </ErrorBoundary>
            </main>

            <footer className="border-t mt-16">
                <div className="container mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] uppercase tracking-widest text-gray-500">
                    <p>© {new Date().getFullYear()} {SITE.legalName}</p>
                    <nav aria-label="Policies" className="flex flex-wrap justify-center gap-x-5 gap-y-2">
                        {POLICY_LINKS.map(({ to, label }) => (
                            <Link key={to} to={to} className="hover:text-black transition-colors">
                                {label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </footer>
        </div>
    );
}

export default CheckoutLayout;
