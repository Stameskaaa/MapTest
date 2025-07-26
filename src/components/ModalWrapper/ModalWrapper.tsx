import { useEffect, type ReactNode } from 'react';
import styles from './ModalWrapper.module.css';

export interface ModalWrapperProps {
  children: ReactNode;
  hasOverlay?: boolean;
  isOpen?: boolean;
  zIndex?: number;
  close?: () => void;
  position?: 'left' | 'right';
}

export const ModalWrapper: React.FC<ModalWrapperProps> = ({
  children,
  hasOverlay = true,
  isOpen = true,
  zIndex = 1000,
  close,
  position = 'left',
}) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          close?.();
        }
      }}
      style={{ zIndex }}
      className={`${styles.modalWrapper} ${!hasOverlay ? styles.noOverlay : null} ${
        isOpen ? styles.open : styles.closed
      } ${position === 'right' ? styles.right : ''}`}>
      {children}
    </div>
  );
};
