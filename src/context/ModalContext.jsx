import { useCallback, useEffect, useMemo, useRef, useState, createContext, use } from 'react';

const ModalContext = createContext(undefined);

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
 * @property {(view: import('react').ComponentType<any>, props?: Object) => Promise<any>} openModal - Opens a modal component with optional props and returns a Promise resolving to modal output.
 * @property {(result?: any) => void} closeModal - Starts the modal close animation and resolves the active promise.
 */

/**
 * ModalProvider Component
 * Orchestrates a global modal system, allowing any component to trigger overlays.
 * Uses modern React 19 context value syntax and Promise-based dynamic resolution.
 * @param {Object} props - Component props.
 * @param {ReactNode} props.children - Subtree with access to modal state.
 */
export const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState(INITIAL_MODAL_STATE);
  const cleanupTimerRef = useRef(null);
  const resolveRef = useRef(null);

  const clearCleanupTimer = useCallback(() => {
    if (!cleanupTimerRef.current) {
      return;
    }

    window.clearTimeout(cleanupTimerRef.current);
    cleanupTimerRef.current = null;
  }, []);

  const openModal = useCallback((view, props = {}) => {
    clearCleanupTimer();

    // Resolve any previously opened modal with null (closed without specific action)
    if (resolveRef.current) {
      resolveRef.current(null);
    }

    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setModal({
        isOpen: true,
        view,
        props,
      });
    });
  }, [clearCleanupTimer]);

  const closeModal = useCallback((result = null) => {
    setModal((currentModal) => {
      if (!currentModal.view || !currentModal.isOpen) {
        return currentModal;
      }

      return {
        ...currentModal,
        isOpen: false,
      };
    });

    if (resolveRef.current) {
      resolveRef.current(result);
      resolveRef.current = null;
    }
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
    return () => {
      clearCleanupTimer();
      if (resolveRef.current) {
        resolveRef.current(null);
        resolveRef.current = null;
      }
    };
  }, [clearCleanupTimer]);

  // Handle body scroll locking with clean restoration
  useEffect(() => {
    if (!modal.isOpen) {
      return undefined;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.setProperty('overflow', 'hidden');

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [modal.isOpen]);

  const value = useMemo(() => ({
    ...modal,
    openModal,
    closeModal,
  }), [modal, openModal, closeModal]);

  return (
    <ModalContext value={value}>
      {children}
      <ModalContainer />
    </ModalContext>
  );
};

function ModalContainer() {
  const { isOpen, view: ModalView, props, closeModal } = use(ModalContext);

  if (!ModalView) {
    return null;
  }

  const viewKey = props?.product?.id || props?.id || 'modal-view';

  return (
    <ModalView
      {...props}
      key={viewKey}
      isOpen={isOpen}
      onClose={closeModal}
    />
  );
}

/**
 * useModal Hook
 * Provides access to the global modal context.
 */
export const useModal = () => {
  const context = use(ModalContext);

  if (context === undefined) {
    throw new Error('useModal must be used within ModalProvider');
  }

  return context;
};
