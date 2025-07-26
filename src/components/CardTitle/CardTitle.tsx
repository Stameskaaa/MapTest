import { LucideX } from 'lucide-react';
import styles from './CardTitle.module.css';
import { IconButton, type IconButtonProps } from '../uikit/buttons/IconButton/IconButton';

interface CardTitleProps {
  title: string | number | (number | string)[];
  iconButtProps?: Omit<IconButtonProps, 'icon'>;
}

export const CardTitle: React.FC<CardTitleProps> = ({ title, iconButtProps }) => {
  return (
    <div className={styles.titleContainer}>
      <h4 className={styles.title}>{title}</h4> <IconButton {...iconButtProps} icon={LucideX} />
    </div>
  );
};
