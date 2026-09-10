import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useScrollLock from '../hooks/useScrollLock';
import { ModalContext, useModal } from './ModalContext';

const MODAL_EXIT_DURATION = 200;

const INITIAL_MODAL_STATE = {
  isOpen: false,
  view: null,
  props: {},
};

/**
 * ModalProvider Component
 * Orchestrates a global modal system, allowing any component to trigger overlays.
 * Opening a modal returns a Promise that resolves with whatever the modal
 * passes to `closeModal`, so callers can await a result.
 * @param {Object} props - Component props.
 * @param {import('react').ReactNode} props.children - Subtree with access to modal state.
 */
export const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState(INITIAL_MODAL_STATE);
  const cleanupTimerRef = useRef(null);
  const resolveRef = useRef(null);

  useScrollLock(modal.isOpen);

  const clearCleanupTimer = useCallback(() => {
    if (!cleanupTimerRef.current) return;

    window.clearTimeout(cleanupTimerRef.current);
    cleanupTimerRef.current = null;
  }, []);

  const openModal = useCallback((view, props = {}) => {
    clearCleanupTimer();

    // Resolve any previously opened modal with null (closed without a result).
    if (resolveRef.current) {
      resolveRef.current(null);
    }

    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setModal({ isOpen: true, view, props });
    });
  }, [clearCleanupTimer]);

  const closeModal = useCallback((result = null) => {
    setModal((currentModal) =>
      currentModal.view && currentModal.isOpen
        ? { ...currentModal, isOpen: false }
        : currentModal
    );

    if (resolveRef.current) {
      resolveRef.current(result);
      resolveRef.current = null;
    }
  }, []);

  // Unmount the view once its exit animation has finished.
  useEffect(() => {
    if (modal.isOpen || !modal.view) return undefined;

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

  const value = useMemo(
    () => ({ ...modal, openModal, closeModal }),
    [modal, openModal, closeModal]
  );

  return (
    <ModalContext value={value}>
      {children}
      <ModalContainer />
    </ModalContext>
  );
};

function ModalContainer() {
  const { isOpen, view: ModalView, props, closeModal } = useModal();

  if (!ModalView) return null;

  const viewKey = props?.product?.id ?? props?.id ?? 'modal-view';

  return <ModalView {...props} key={viewKey} isOpen={isOpen} onClose={closeModal} />;
}
