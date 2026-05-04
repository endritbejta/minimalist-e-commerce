import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const PopUpModal = ({ isOpen, onClose, children, className = "p-6 min-w-[300px] max-w-[90%]" }) => {
  const modalRef = useRef(null);
  const [isVisible, setIsVisible] = useState(isOpen);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Handle focus trapping
  useEffect(() => {
    if (!isOpen) return;

    const focusableElements = modalRef.current?.querySelectorAll(
      'a, button, textarea, input, select'
    );

    const firstElement = focusableElements?.[0];
    const lastElement = focusableElements?.[focusableElements.length - 1];

    const handleTab = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTab);
    firstElement?.focus();

    return () => document.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  // Handle exit animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timeout = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-md w-full p-2 sm:p-6 transition-opacity duration-200 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        className={`bg-white rounded-2xl shadow-2xl transform transition-all duration-200 overflow-hidden flex flex-col max-h-[90vh] ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        } ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default PopUpModal;
