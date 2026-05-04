/**
 * Main Entry Point
 * Initializes the React application, sets up providers (SEO, Cart, Modal), 
 * and defines the primary routing structure.
 */
/* eslint-disable react-refresh/only-export-components */
import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Lazy-loaded components for code splitting
const App = lazy(() => import('./App.jsx'))
const CollectionPage = lazy(() => import('./pages/CollectionPage.jsx'))
const ProductPage = lazy(() => import('./pages/ProductPage.jsx'))
const ShippingPolicy = lazy(() => import('./pages/ShippingPolicy.jsx'))
const ReturnsPolicy = lazy(() => import('./pages/ReturnsPolicy.jsx'))
const FAQ = lazy(() => import('./pages/FAQ.jsx'))
const ContactUs = lazy(() => import('./pages/ContactUs.jsx'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy.jsx'))
const TermsOfService = lazy(() => import('./pages/TermsOfService.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

// Layouts and Contexts
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import MainLayout from './Layout/MainLayout.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { ModalProvider } from './context/ModalContext.jsx'
import ScrollToTop from './components/UI/ScrollToTop.jsx'
import PageLoader from './components/UI/PageLoader.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <Suspense fallback={<PageLoader />}>
        <CartProvider>
          <ModalProvider>
            <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<App />} />
                <Route path="/collections" element={<Navigate to="/collections/all" replace />} />
                <Route path="/collections/:handle" element={<CollectionPage />} />
                <Route path="/products" element={<Navigate to="/collections/all" replace />} />
                <Route path="/products/:productHandle" element={<ProductPage />} />
                <Route path="/shipping-policy" element={<ShippingPolicy />} />
                <Route path="/returns-exchanges" element={<ReturnsPolicy />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact-us" element={<ContactUs />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
            </BrowserRouter>
          </ModalProvider>
        </CartProvider>
      </Suspense>
    </HelmetProvider>
  </StrictMode>,
)
