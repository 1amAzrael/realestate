// Modal.jsx
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const Modal = ({ isOpen, onClose, children }) => {
  const [animation, setAnimation] = useState(isOpen ? "open" : "closed");

  useEffect(() => {
    if (isOpen) {
      setAnimation("opening");
      const timer = setTimeout(() => setAnimation("open"), 10);
      return () => clearTimeout(timer);
    } else {
      setAnimation("closing");
      const timer = setTimeout(() => setAnimation("closed"), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Handle clicks outside the modal to close it
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (animation === "closed") return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-300 ${
        animation === "opening" || animation === "closing"
          ? "bg-opacity-0"
          : "bg-opacity-50"
      }`}
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6 transform transition-all duration-300 ${
          animation === "opening"
            ? "opacity-0 translate-y-4"
            : animation === "closing"
              ? "opacity-0 translate-y-4"
              : "opacity-100 translate-y-0"
        }`}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;