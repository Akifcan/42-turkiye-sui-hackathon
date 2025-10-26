import React, { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '600px',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle click outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 'var(--spacing-s)',
        overflow: 'auto',
      }}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        style={{
          backgroundColor: 'rgba(20, 20, 30, 0.98)',
          borderRadius: 'var(--radius-m)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          maxWidth: maxWidth,
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
        }}
      >
        {/* Header */}
        {title && (
          <div
            style={{
              padding: 'var(--spacing-s) var(--spacing-m)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'sticky',
              top: 0,
              backgroundColor: 'rgba(20, 20, 30, 0.98)',
              zIndex: 1,
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: 'var(--font-size-subheading)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text-primary)',
              }}
            >
              {title}
            </h3>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-secondary)',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '0',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 'var(--radius-s)',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* Content */}
        <div
          style={{
            padding: 'var(--spacing-s) var(--spacing-m)',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;

