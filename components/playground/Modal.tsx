'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';

export default function Modal() {
  const [isOpen, setIsOpen] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // 1. Save the element that was focused right before opening
    triggerRef.current = document.activeElement as HTMLElement;

    // 2. Move focus INTO the modal (focus the dialog container or first element)
    // Small timeout ensures the DOM node is rendered and interactive
    const timer = setTimeout(() => {
      const focusable = getFocusableElements();
      if (focusable.length > 0) {
        focusable[0].focus();
      } else {
        modalRef.current?.focus();
      }
    }, 0);

    // 3. Close on Escape key press
    const handleGlobalKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [isOpen]);

  const closeModal = () => {
    setIsOpen(false);
    // 4. Return focus back to the trigger button that opened the modal
    triggerRef.current?.focus();
  };

  // Helper to retrieve all standard interactive/focusable elements in the modal
  const getFocusableElements = (): HTMLElement[] => {
    if (!modalRef.current) return [];
    const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    return Array.from(modalRef.current.querySelectorAll<HTMLElement>(selector));
  };

  // 5. Focus Trap implementation
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab') return;

    const focusable = getFocusableElements();
    if (focusable.length === 0) return;

    const firstElement = focusable[0];
    const lastElement = focusable[focusable.length - 1];

    if (e.shiftKey) {
      // Shift + Tab: If on the FIRST focusable element, wrap around to the LAST
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab: If on the LAST focusable element, wrap around to the FIRST
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <button 
        onClick={() => setIsOpen(true)}
        style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
      >
        Open Modal
      </button>

      {isOpen && (
        // Backdrop
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          {/* Dialog Container */}
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onKeyDown={handleKeyDown}
            tabIndex={-1}
            style={{
              backgroundColor: '#fff',
              padding: '1.5rem',
              borderRadius: '8px',
              maxWidth: '400px',
              width: '100%',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}
          >
            <h2 id="modal-title" style={{ marginTop: 0 }}>
              Accessible Dialog
            </h2>
            <p>
              Focus is currently trapped inside this dialog. Try pressing Tab or Shift+Tab to verify it cycles only within this panel.
            </p>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
              <button onClick={() => alert('Confirmed!')} style={{ padding: '0.4rem 0.8rem' }}>
                Confirm
              </button>
              <button onClick={closeModal} style={{ padding: '0.4rem 0.8rem' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}