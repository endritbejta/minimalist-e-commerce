import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import CheckoutLayout from './Layout/CheckoutLayout.jsx';
import MainLayout from './Layout/MainLayout.jsx';

// Route components are code-split. MainLayout's Suspense boundary renders the
// fallback inside the page shell, so the header, footer and cart stay put.
const Home = lazy(() => import('./App.jsx'));
const CollectionPage = lazy(() => import('./pages/CollectionPage.jsx'));
const ProductPage = lazy(() => import('./pages/ProductPage.jsx'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage.jsx'));
const OrderConfirmationPage = lazy(() => import('./pages/OrderConfirmationPage.jsx'));
const ShippingPolicy = lazy(() => import('./pages/ShippingPolicy.jsx'));
const ReturnsPolicy = lazy(() => import('./pages/ReturnsPolicy.jsx'));
const FAQ = lazy(() => import('./pages/FAQ.jsx'));
const ContactUs = lazy(() => import('./pages/ContactUs.jsx'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy.jsx'));
const TermsOfService = lazy(() => import('./pages/TermsOfService.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

/**
 * AppRoutes Component
 * The application's route table.
 */
export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/collections" element={<Navigate to="/collections/all" replace />} />
        <Route path="/collections/:handle" element={<CollectionPage />} />
        <Route path="/products" element={<Navigate to="/collections/all" replace />} />
        <Route path="/products/:productHandle" element={<ProductPage />} />
        <Route path="/orders/:orderNumber" element={<OrderConfirmationPage />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/returns-exchanges" element={<ReturnsPolicy />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Its own shell: no nav, no search, no cart icon. Everything in the site
          header is an invitation to leave a purchase half-finished. */}
      <Route element={<CheckoutLayout />}>
        <Route path="/checkout" element={<CheckoutPage />} />
      </Route>
    </Routes>
  );
}
