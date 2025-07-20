import React from 'react';
import type { ReactNode } from 'react';

import './../assets/modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  widthValue?: string; // Nota: esta prop no se usa en el componente original
  titulo: string;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  titulo,
  className = ''
}) => {
  if (!isOpen) return null;

  return (
    <section className="modal_content_dashboard" onClick={onClose}>
      <aside
        className={`modal_content_items ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal_header">
          <h3>{titulo}</h3>
          <button className="modal__close_dashboard" onClick={onClose}>
            ×
          </button>
        </header>
        {children}
      </aside>
    </section>
  );
};

export default Modal;
