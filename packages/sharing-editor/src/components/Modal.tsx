import React from "react";
import ReactDOM from "react-dom";
import { RiCloseLine } from "react-icons/ri";
import styles from "./Modal.module.scss";

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className={styles.modalBackdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={styles.modalWindow}
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        <header className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <button
            className={styles.modalClose}
            onClick={onClose}
            aria-label="Close modal"
          >
            <RiCloseLine />
          </button>
        </header>
        <main className={styles.modalBody}>{children}</main>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
