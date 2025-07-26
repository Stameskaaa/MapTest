import type { LucideIcon } from 'lucide-react';
import React, { type HTMLAttributes, type ReactNode } from 'react';
import styles from './LargeButton.module.css';

interface LargeButtonProps extends HTMLAttributes<HTMLButtonElement> {
  icon?: LucideIcon;
  children?: ReactNode;
}

export const LargeButton: React.FC<LargeButtonProps> = ({ icon: Icon, children, ...props }) => {
  return (
    <button className={styles.largeButton} {...props}>
      {Icon && <Icon size={24} color="rgba(0, 0, 0, 1)" />}
      {children}
    </button>
  );
};
