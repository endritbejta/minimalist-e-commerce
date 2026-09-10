import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * Collects the currently focusable descendants of a container.
 * Queried on demand rather than cached, so controls revealed while the dialog
 * is open (a toggle expanding a section, for example) stay inside the trap.
 * @param {HTMLElement|null} container - The dialog element.
 * @returns {HTMLElement[]} Visible, focusable descendants in DOM order.
 */
const getFocusable = (container) => {
  if (!container) return [];

  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
    (element) =>
      element.getClientRects().length > 0 &&
      getComputedStyle(element).visibility !== 'hidden'
  );
};

/**
 * useDialog Hook
 * Gives an overlay the behaviour keyboard and screen reader users expect:
 * close on Escape, focus moved inside on open, focus cycled within the dialog,
 * and focus returned to the trigger on close.
 *
 * @param {Object} options - Hook options.
 * @param {boolean} options.isOpen - Whether the dialog is currently open.
 * @param {Function} options.onClose - Called when the user presses Escape.
 * @param {import('react').RefObject<HTMLElement>} options.containerRef - The dialog element.
 * @param {boolean} [options.autoFocus=true] - Whether to move focus inside on open.
 */
export default function useDialog({ isOpen, onClose, containerRef, autoFocus = true }) {
  const restoreFocusRef = useRef(null);
  const onCloseRef = useRef(onClose);

  // Keep the latest handler without re-running the key listener effect.
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Remember the trigger, move focus in, and hand focus back on close.
  useEffect(() => {
    if (!isOpen) return undefined;

    restoreFocusRef.current = document.activeElement;

    if (autoFocus) {
      const [firstFocusable] = getFocusable(containerRef.current);
      (firstFocusable ?? containerRef.current)?.focus({ preventScroll: true });
    }

    return () => {
      const trigger = restoreFocusRef.current;
      restoreFocusRef.current = null;

      if (trigger instanceof HTMLElement && trigger.isConnected) {
        trigger.focus({ preventScroll: true });
      }
    };
  }, [autoFocus, containerRef, isOpen]);

  // Escape to close, Tab cycled within the dialog.
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onCloseRef.current?.();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = getFocusable(containerRef.current);
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !containerRef.current?.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [containerRef, isOpen]);
}
