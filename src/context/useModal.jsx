import { useContext } from 'react';
import ModalContext from './modalContextValue.jsx';

/**
 * Reads the global modal controller.
 *
 * @returns {Object} Current modal state plus `openModal(view, props)` and `closeModal()` helpers.
 * @throws {Error} When called outside of ModalProvider.
 */
export const useModal = () => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }

  return context;
};
