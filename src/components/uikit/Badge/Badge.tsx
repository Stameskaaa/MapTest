import type { HTMLAttributes } from 'react';
import { LucideCircleX } from 'lucide-react';
import styles from './Badge.module.css';
import { StatusDot, type DotStatus } from '../StatusDot/StatusDot';

export type BadgeStatus = DotStatus | 'disabled';

interface BadgeProps extends HTMLAttributes<HTMLButtonElement> {
  status: BadgeStatus;
  children: string | number | (string | number)[];
}

export const Badge = ({ status, children, ...props }: BadgeProps) => {
  return (
    <button {...props} className={`${styles.container} ${styles[status]}`}>
      {status === 'disabled' ? (
        <LucideCircleX size={16} color="rgba(109, 111, 120, 1)" />
      ) : (
        <StatusDot status={status} />
      )}
      {children}
    </button>
  );
};
