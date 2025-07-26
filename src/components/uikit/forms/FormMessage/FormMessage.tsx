import React from 'react';
import styles from './FormMessage.module.css';

interface FormMessageProps {
  status: 'success' | 'error' | 'default';
  children?: string;
}

export const FormMessage: React.FC<FormMessageProps> = ({ status, children }) => {
  return <span className={`${styles[status]} ${styles.text}`}>{children}</span>;
};
