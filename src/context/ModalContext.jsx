import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import ModalContext from './modalContextValue.jsx';

const MODAL_EXIT_DURATION = 200;

const INITIAL_MODAL_STATE = {
  isOpen: false,
  view: null,
  props: {},
};

/**
 * @typedef {Object} ModalState
 * @property {boolean} isOpen - Whether the active modal should be visible.
 * @property {import('react').ComponentType<any> | null} view - Component rendered as the active modal.
 * @property {Object} props - Props passed to the active modal view.
 */

/**
 * @typedef {ModalState & Object} ModalContextValue
 * @property {(view: import('react').ComponentType<any>, props?: Object) => void} openModal - Opens a modal component with optional props.
 * @property {() => void} closeModal - Starts the modal close animation and clears it afterward.
 */

/**
 * ModalProvider Component
 * Orchestrates a global modal system, allowing any component to trigger overlays.
 * @param {Object} props - Component props.
 * @param {ReactNode} props.children - Subtree with access to modal state.
 */
export const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState(INITIAL_MODAL_STATE);
  const cleanupTimerRef = useRef(null);

  const clearCleanupTimer = useCallback(() => {
    if (!cleanupTimerRef.current) {
      return;
    }

    window.clearTimeout(cleanupTimerRef.current);
    cleanupTimerRef.current = null;
  }, []);

  const openModal = useCallback((view, props = {}) => {
    clearCleanupTimer();
    setModal({
      isOpen: true,
      view,
      props,
    });
  }, [clearCleanupTimer]);

  const closeModal = useCallback(() => {
    setModal((currentModal) => {
      if (!currentModal.view || !currentModal.isOpen) {
        return currentModal;
      }

      return {
        ...currentModal,
        isOpen: false,
      };
    });
  }, []);

  useEffect(() => {
    if (modal.isOpen || !modal.view) {
      return undefined;
    }

    cleanupTimerRef.current = window.setTimeout(() => {
      setModal(INITIAL_MODAL_STATE);
      cleanupTimerRef.current = null;
    }, MODAL_EXIT_DURATION);

    return clearCleanupTimer;
  }, [clearCleanupTimer, modal.isOpen, modal.view]);

  useEffect(() => {
    return clearCleanupTimer;
  }, [clearCleanupTimer]);

  useEffect(() => {
    if (!modal.isOpen) {
      return undefined;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [modal.isOpen]);

  useEffect(() => {
    if (!modal.isOpen) {
      return undefined;
    }

    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [closeModal, modal.isOpen]);

  const value = useMemo(() => ({
    ...modal,
    openModal,
    closeModal,
  }), [modal, openModal, closeModal]);

  return (
    <ModalContext.Provider value={value}>
      {children}
      <ModalContainer />
    </ModalContext.Provider>
  );
};

function ModalContainer() {
  const { isOpen, view: ModalView, props, closeModal } = useContext(ModalContext);

  if (!ModalView) {
    return null;
  }

  return (
    <ModalView
      {...props}
      isOpen={isOpen}
      onClose={closeModal}
    />
  );
}
