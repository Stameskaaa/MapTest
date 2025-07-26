import styles from './Button.module.css';
import React, { type HTMLAttributes, type ReactNode } from 'react';

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  type?: 'primary' | 'secondary';
  children?: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ type = 'secondary', children, ...props }) => {
  return (
    <button className={`${styles.button} ${styles[type]}`} {...props}>
      <span>{children}</span>
    </button>
  );
};
