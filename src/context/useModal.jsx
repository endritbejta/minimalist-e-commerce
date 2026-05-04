import { useContext } from 'react';
import ModalContext from './modalContextValue.jsx';

/**
 * useModal Hook
 * Provides access to the global modal controller.
 * @returns {Object} Modal state and trigger functions (openModal, closeModal).
 */
export const useModal = () => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }

  return context;
};
