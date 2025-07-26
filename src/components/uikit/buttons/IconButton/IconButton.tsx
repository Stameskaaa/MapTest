import type { HTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';
import styles from './IconButtons.module.css';

export interface IconButtonProps extends HTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
}

export const IconButton: React.FC<IconButtonProps> = ({ icon: Icon, ...props }) => {
  return (
    <button className={styles.iconButton} {...props}>
      {<Icon size={16} />}
    </button>
  );
};
