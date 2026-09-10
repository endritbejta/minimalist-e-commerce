import { createContext, use } from 'react';

/**
 * @typedef {Object} ModalContextValue
 * @property {boolean} isOpen - Whether the active modal should be visible.
 * @property {import('react').ComponentType<any> | null} view - Component rendered as the active modal.
 * @property {Object} props - Props passed to the active modal view.
 * @property {(view: import('react').ComponentType<any>, props?: Object) => Promise<any>} openModal - Opens a modal and resolves with its result.
 * @property {(result?: any) => void} closeModal - Starts the close animation and resolves the active promise.
 */

export const ModalContext = createContext(undefined);

/**
 * useModal Hook
 * Provides access to the global modal context.
 * @returns {ModalContextValue} Modal state and controls.
 */
export const useModal = () => {
  const context = use(ModalContext);

  if (context === undefined) {
    throw new Error('useModal must be used within ModalProvider');
  }

  return context;
};
