/**
 * Application entry point.
 * Mounts React and wires up the global providers around the route table.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'

import AppRoutes from './routes.jsx'
import ErrorBoundary from './components/UI/ErrorBoundary.jsx'
import ScrollToTop from './components/UI/ScrollToTop.jsx'
import { CartProvider } from './context/CartProvider.jsx'
import { ModalProvider } from './context/ModalProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <CartProvider>
        <ModalProvider>
          <BrowserRouter>
            <ScrollToTop />
            <AppRoutes />
          </BrowserRouter>
        </ModalProvider>
      </CartProvider>
    </ErrorBoundary>
  </StrictMode>,
)
