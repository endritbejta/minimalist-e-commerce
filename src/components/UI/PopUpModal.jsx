import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import useDialog from "../../hooks/useDialog";

/**
 * PopUpModal Component
 * A reusable modal with focus trapping, Escape support, and entry/exit animations.
 *
 * Unmounting is owned by ModalProvider, which keeps the view alive for the
 * length of the exit animation; this component only drives the transition.
 *
 * @param {Object} props - Component props.
 * @param {boolean} props.isOpen - Whether the modal is currently visible.
 * @param {Function} props.onClose - Callback to close the modal.
 * @param {import('react').ReactNode} props.children - The content to display inside the modal.
 * @param {string} [props.className] - Additional CSS classes for the inner modal container.
 */
const PopUpModal = ({
  isOpen,
  onClose,
  children,
  className = "p-6 min-w-[300px] max-w-[90%]",
  ...props
}) => {
  const modalRef = useRef(null);
  const backdropPressRef = useRef(false);
  const [hasEntered, setHasEntered] = useState(false);

  useDialog({ isOpen, onClose, containerRef: modalRef });

  // Paint one frame in the "from" state so the enter transition actually runs.
  useEffect(() => {
    const frameId = requestAnimationFrame(() => setHasEntered(true));
    return () => cancelAnimationFrame(frameId);
  }, []);

  const isActive = isOpen && hasEntered;

  // Only close when the press *started* on the backdrop, so a text selection
  // that drags out of the dialog does not dismiss it.
  const handleBackdropMouseDown = (event) => {
    backdropPressRef.current = event.target === event.currentTarget;
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget && backdropPressRef.current) {
      onClose();
    }
    backdropPressRef.current = false;
  };

  return createPortal(
    <div
      className={`fixed inset-0 z-modal flex items-center justify-center bg-black/40 backdrop-blur-md w-full p-2 sm:p-6 transition-opacity duration-200 ${
        isActive ? 'opacity-100' : 'opacity-0'
      }`}
      onMouseDown={handleBackdropMouseDown}
      onClick={handleBackdropClick}
    >
      <div
        {...props}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className={`bg-white rounded-2xl shadow-2xl transform transition-all duration-200 overflow-hidden flex flex-col max-h-[90vh] ${
          isActive ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        } ${className}`}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default PopUpModal;
