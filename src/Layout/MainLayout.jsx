import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import ErrorBoundary from "../components/UI/ErrorBoundary";
import PageLoader from "../components/UI/PageLoader";
import CartDrawer from "./CartDrawer";
import Footer from "./Footer";
import Header from "./Header";

/**
 * MainLayout Component
 * The shared shell: header, cart drawer, routed content and footer.
 *
 * Suspense sits around the Outlet rather than around the whole app, so a
 * code-split route loads inside the page instead of replacing the header,
 * footer and cart with a full-screen loader.
 */
function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CartDrawer />
      <main className="flex-1">
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
